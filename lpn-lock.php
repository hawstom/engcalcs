<?php
/**
 * Project lock broker for the Looped Pipe Network calculator (ROADMAP Task 195 Phase 2).
 *
 * Coordinates "who is editing this project file right now" for a team sharing project files off a
 * network share. It holds ONLY lock metadata: it never sees, stores, or touches the project file
 * itself, which stays entirely on the users' own machines.
 *
 * Four actions, all POST, all same-origin, matching the ROADMAP's named endpoints:
 *   check    — who holds this project, if anyone
 *   acquire  — take the lock if it is free or already ours (also the heartbeat: re-acquiring a lock
 *              we already hold just refreshes lastActivity, which is what the pre-save re-check does)
 *   steal    — take it regardless, recording us as the new holder ("take over from X")
 *   release  — give it up, if it is ours
 *
 * Conflict resolution is an in-office honor system: a lock NEVER expires on its own, and a colleague
 * has to explicitly take over. See lib/config.inc.php for the record format and why this is flat
 * files rather than a database.
 *
 * Identity is a random client token plus a free-text friendly name — no login, no user table. The
 * token is what "mine" means; the name is only ever shown to a human, and two people may share one.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';

header('Content-Type: application/json');
// No CORS header, deliberately: this is for our own page on our own origin and nothing else.

function lpn_send($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    lpn_send(array('ok' => false, 'error' => 'method'), 405);
}

// The project DOCUMENT id, baked into the file itself so that two people opening the same file off
// a share compute the same lock key. Format-validated rather than sanitized: it becomes a filename,
// and a whitelist of [A-Za-z0-9] with a fixed prefix cannot express "..", a slash, or a NUL, so
// there is no traversal to defend against further down.
$id = isset($_POST['id']) ? (string)$_POST['id'] : '';
if (!preg_match('/^d[A-Za-z0-9]{8,48}$/', $id)) {
    lpn_send(array('ok' => false, 'error' => 'id'), 400);
}
// Opaque per-browser token. This — not the name — is what decides whether a lock is ours.
$holder = isset($_POST['holder']) ? (string)$_POST['holder'] : '';
if (!preg_match('/^[A-Za-z0-9]{8,48}$/', $holder)) {
    lpn_send(array('ok' => false, 'error' => 'holder'), 400);
}
// Shown to humans and nothing else. Control characters stripped so a record can never carry a
// terminal escape or a line break into someone's screen; length capped so it cannot be used as
// storage. mb_substr because a name may be in any script.
$name = isset($_POST['name']) ? (string)$_POST['name'] : '';
$name = preg_replace('/[\x00-\x1f\x7f]/u', '', $name);
$name = function_exists('mb_substr') ? mb_substr($name, 0, 60, 'UTF-8') : substr($name, 0, 60);
$name = trim($name);

$action = isset($_POST['action']) ? (string)$_POST['action'] : '';
if (!in_array($action, array('check', 'acquire', 'steal', 'release'), true)) {
    lpn_send(array('ok' => false, 'error' => 'action'), 400);
}

if (!is_dir(LPN_LOCK_DIR)) {
    @mkdir(LPN_LOCK_DIR, 0750, true);
}
if (!is_dir(LPN_LOCK_DIR)) {
    lpn_send(array('ok' => false, 'error' => 'storage'), 500);
}

/**
 * Deletes records untouched for LPN_LOCK_TTL_DAYS. Run probabilistically rather than on a cron so
 * the feature carries its own housekeeping and cannot be deployed without it. Returns the number of
 * records left behind, or null when it did not run.
 */
function lpn_sweep() {
    $cutoff = time() - (LPN_LOCK_TTL_DAYS * 86400);
    $names = @scandir(LPN_LOCK_DIR);
    if ($names === false) {
        return null;
    }
    $kept = 0;
    foreach ($names as $entry) {
        if (substr($entry, -5) !== '.json') {
            continue;
        }
        $path = LPN_LOCK_DIR . '/' . $entry;
        $mtime = @filemtime($path);
        if ($mtime !== false && $mtime < $cutoff) {
            @unlink($path);
        } else {
            $kept++;
        }
    }
    return $kept;
}

$path = LPN_LOCK_DIR . '/' . $id . '.json';
$isNewRecord = !file_exists($path);

// 1-in-50 requests pay for housekeeping. Also forced whenever we are about to create a record and
// the directory has grown past the cap, so the cap is checked against a swept count rather than a
// stale one.
$kept = null;
if (mt_rand(1, 50) === 1 || $isNewRecord) {
    $kept = lpn_sweep();
}
if ($isNewRecord && $kept !== null && $kept >= LPN_LOCK_MAX_RECORDS) {
    // Existing projects keep working; only new records are refused. Nothing a user of ours can do
    // about it, so it is reported as a server condition rather than as a lock outcome.
    lpn_send(array('ok' => false, 'error' => 'full'), 503);
}

// A 'check' on a project nobody has ever locked must not create a file — otherwise merely opening a
// project would allocate disk, and the cap above would be reachable by reading alone.
if ($action === 'check' && $isNewRecord) {
    lpn_send(array('ok' => true, 'locked' => false, 'mine' => false));
}

// One flock() held across the whole read-decide-write. Read-modify-write is the only thing that
// matters here: two colleagues pressing "take over" in the same second must not both come away
// believing they hold the lock.
$fh = @fopen($path, 'c+');
if ($fh === false) {
    lpn_send(array('ok' => false, 'error' => 'storage'), 500);
}
if (!flock($fh, LOCK_EX)) {
    fclose($fh);
    lpn_send(array('ok' => false, 'error' => 'busy'), 503);
}

$raw = stream_get_contents($fh);
$record = json_decode($raw, true);
if (!is_array($record)) {
    $record = array();
}
$currentHolder = isset($record['holder']) ? (string)$record['holder'] : '';
$heldBySomeoneElse = ($currentHolder !== '' && $currentHolder !== $holder);

$write = null;
$response = array('ok' => true);

if ($action === 'check') {
    $response['locked'] = ($currentHolder !== '');
    $response['mine'] = ($currentHolder !== '' && !$heldBySomeoneElse);
    $response['lockedBy'] = isset($record['lockedBy']) ? $record['lockedBy'] : '';
    $response['lastActivity'] = isset($record['lastActivity']) ? (int)$record['lastActivity'] : 0;
} elseif ($action === 'release') {
    // Releasing a lock someone else holds is a no-op, not an error: the usual way to reach it is
    // closing a tab that was taken over while you were away, and that is not a failure worth saying
    // anything about.
    if (!$heldBySomeoneElse) {
        $write = array('projectId' => $id, 'holder' => '', 'lockedBy' => '', 'lastActivity' => time());
    }
    $response['released'] = !$heldBySomeoneElse;
} elseif ($action === 'acquire' && $heldBySomeoneElse) {
    // Refused. Report WHO and SINCE WHEN, which is everything the client needs to decide between
    // "please wait" and offering a takeover — that judgment is the client's, not ours.
    $response['held'] = false;
    $response['lockedBy'] = isset($record['lockedBy']) ? $record['lockedBy'] : '';
    $response['lastActivity'] = isset($record['lastActivity']) ? (int)$record['lastActivity'] : 0;
} else {
    // acquire on a free-or-ours lock (which doubles as the heartbeat), or steal on any lock.
    $write = array('projectId' => $id, 'holder' => $holder, 'lockedBy' => $name, 'lastActivity' => time());
    $response['held'] = true;
    if ($action === 'steal') {
        $response['stolenFrom'] = isset($record['lockedBy']) ? $record['lockedBy'] : '';
    }
}

if ($write !== null) {
    ftruncate($fh, 0);
    rewind($fh);
    // JSON_UNESCAPED_UNICODE so a name in a non-Latin script stays readable to whoever opens one
    // of these records to see what is going on. Both forms parse identically; only legibility differs.
    fwrite($fh, json_encode($write, JSON_UNESCAPED_UNICODE));
    fflush($fh);
}
flock($fh, LOCK_UN);
fclose($fh);

lpn_send($response);
