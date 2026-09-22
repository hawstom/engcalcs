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
 *   request  — leave a note for the holder that somebody else would like the file ("Ask"). It is a
 *              BACK CHANNEL and not a lock operation: it never touches the holder, and it never
 *              refreshes lastActivity, because the asker's keystroke is not evidence the holder is
 *              at their desk.
 *   acquire  — take the lock if it is free or already ours (also the heartbeat: re-acquiring a lock
 *              we already hold just refreshes lastActivity, which is what the pre-save re-check does)
 *   steal    — take it regardless, recording us as the new holder ("take over from X")
 *   release  — give it up, if it is ours
 *
 * Conflict resolution is an in-office honor system: a lock NEVER expires on its own, and a colleague
 * has to explicitly take over. See lib/config.inc.php for the record format and why this is flat
 * files rather than a database.
 *
 * Identity is a random client token — no login, no user table, and since Task 667(b) no name is
 * asked of the person taking the lock. A `name` still travels, but only on a `request`: it is the
 * initials the ASKER types at the moment they ask, so that the holder is told who wants the file.
 * Nothing here ever stores a name for the holder unless an older page sent one.
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
if (!in_array($action, array('check', 'acquire', 'steal', 'release', 'request'), true)) {
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
// Same reasoning for 'request': there is nobody to ask, so there is nothing to write down.
if ($action === 'request' && $isNewRecord) {
    lpn_send(array('ok' => true, 'requested' => false));
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
// Reported by the holder, not measured here. `lastActivity` is only "we heard from them", which a
// throttled background tab makes meaningless; these two are what a colleague actually needs to judge
// a stale claim -- how long since they touched it, and how much of that is unsaved (Tom, 2026-08-05:
// "the last edit was X ago, Y after the last save").
$editedAt = isset($_POST['editedAt']) ? (int)$_POST['editedAt'] : 0;
$savedAt  = isset($_POST['savedAt'])  ? (int)$_POST['savedAt']  : 0;
$heldBySomeoneElse = ($currentHolder !== '' && $currentHolder !== $holder);
// HOW LONG THE FILE HAS BEEN IN USE -- the one of Tom's three ages the broker can measure itself,
// and the one it did not keep until Task 667(b). editedAt and savedAt are the holder's clock and
// arrive with every heartbeat; this is OUR clock, stamped once when the lock changes hands and
// carried unchanged through every heartbeat after it. A record written before this shipped has no
// acquiredAt, and the page then says nothing about that age rather than guessing one.
$acquiredAt  = isset($record['acquiredAt'])  ? (int)$record['acquiredAt']  : 0;
// The back channel. One pending ask per record: a second asker replaces the first rather than
// queueing, because what the holder has to do about it is the same either way.
$requestedBy = isset($record['requestedBy']) ? (string)$record['requestedBy'] : '';
$requestedAt = isset($record['requestedAt']) ? (int)$record['requestedAt'] : 0;
// **WHO THE ASK IS ADDRESSED TO, and it is the whole reason a reload no longer eats it.** The note
// used to be kept for whoever the record said was holding at the moment it was read, and that broke
// on the commonest thing a holder does: RELOADING releases the lock and takes it again a second
// later, so the note was read against a record holding nobody, the re-acquire counted as a new
// holder, and the note was thrown away unseen -- while the colleague who asked had been told they
// would be heard. Measured in a real browser on 2026-09-18. Addressing the note to a holder TOKEN
// carries it across that gap and still clears itself the moment somebody else genuinely takes over.
$requestedOf = isset($record['requestedOf']) ? (string)$record['requestedOf'] : '';
// The holder saying "I have shown that to my user". Matched on the timestamp so that acknowledging
// one ask cannot swallow a newer one that arrived in between.
$ack = isset($_POST['ack']) ? (int)$_POST['ack'] : 0;

$write = null;
$expire = false;   // back-date this record on the way out, so the next sweep collects it
$response = array('ok' => true);

if ($action === 'check') {
    $response['locked'] = ($currentHolder !== '');
    $response['mine'] = ($currentHolder !== '' && !$heldBySomeoneElse);
    $response['lockedBy'] = isset($record['lockedBy']) ? $record['lockedBy'] : '';
    $response['lastActivity'] = isset($record['lastActivity']) ? (int)$record['lastActivity'] : 0;
    $response['editedAt'] = isset($record['editedAt']) ? (int)$record['editedAt'] : 0;
    $response['savedAt'] = isset($record['savedAt']) ? (int)$record['savedAt'] : 0;
    $response['acquiredAt'] = $acquiredAt;
} elseif ($action === 'release') {
    // Releasing a lock someone else holds is a no-op, not an error: the usual way to reach it is
    // closing a tab that was taken over while you were away, and that is not a failure worth saying
    // anything about.
    if (!$heldBySomeoneElse) {
        // **THE PENDING ASK SURVIVES A RELEASE, and everything else about the holder goes.** A
        // release is nearly always a page unloading, and a page unloading is nearly always a
        // RELOAD -- so wiping the note here is wiping it in the one-second gap before the same
        // browser takes the lock straight back.
        $write = array('projectId' => $id, 'holder' => '', 'lockedBy' => '', 'lastActivity' => time(),
                       'editedAt' => 0, 'savedAt' => 0, 'acquiredAt' => 0,
                       'requestedBy' => $requestedBy, 'requestedAt' => $requestedAt,
                       'requestedOf' => $requestedOf);
        // AND mark it for the next sweep. A released record carries no information -- a 'check'
        // against a missing record and against an empty one give byte-identical answers -- but it
        // used to sit here for 30 days with its mtime REFRESHED by the release itself, so the
        // directory only ever grew. Every Save as, every copy and every read-only fork mints a new
        // docId and therefore a new record, so a few afternoons of ordinary work can approach
        // LPN_LOCK_MAX_RECORDS, at which point new locks are refused for everybody.
        //
        // Back-dating rather than unlinking on purpose: another request may already be blocked on
        // flock() for this inode, and deleting it underneath them would strand their acquire on an
        // orphaned file. Back-dating is race-free and the next sweep collects it.
        //
        // **UNLESS A COLLEAGUE IS WAITING.** Expiring here deletes the file, and with it the note --
        // which is the same defect as wiping the fields above, reached by the other door. A record
        // kept for a pending ask is one record per ask, it is collected by the ordinary 30-day
        // sweep, and it costs nothing the moment anybody takes the lock again.
        $expire = ($requestedAt === 0);
    }
    $response['released'] = !$heldBySomeoneElse;
} elseif ($action === 'acquire' && $heldBySomeoneElse) {
    // Refused. Report WHO and SINCE WHEN, which is everything the client needs to decide between
    // "please wait" and offering a takeover — that judgment is the client's, not ours.
    $response['held'] = false;
    $response['lockedBy'] = isset($record['lockedBy']) ? $record['lockedBy'] : '';
    $response['lastActivity'] = isset($record['lastActivity']) ? (int)$record['lastActivity'] : 0;
    $response['editedAt'] = isset($record['editedAt']) ? (int)$record['editedAt'] : 0;
    $response['savedAt'] = isset($record['savedAt']) ? (int)$record['savedAt'] : 0;
    $response['acquiredAt'] = $acquiredAt;
} elseif ($action === 'request') {
    // "Ask" (Task 667(b)). Writes ONLY the note and rewrites every other field with what it found,
    // so a colleague pressing Ask can neither take the lock nor make the holder look more recently
    // active than they are. Asking for a file nobody holds is not an error -- it is simply nothing
    // to do, and the page will have offered Open instead.
    if ($heldBySomeoneElse) {
        $write = array('projectId' => $id, 'holder' => $currentHolder,
                       'lockedBy' => isset($record['lockedBy']) ? $record['lockedBy'] : '',
                       'lastActivity' => isset($record['lastActivity']) ? (int)$record['lastActivity'] : 0,
                       'editedAt' => isset($record['editedAt']) ? (int)$record['editedAt'] : 0,
                       'savedAt' => isset($record['savedAt']) ? (int)$record['savedAt'] : 0,
                       'acquiredAt' => $acquiredAt,
                       'requestedBy' => $name, 'requestedAt' => time(),
                       'requestedOf' => $currentHolder);
    }
    $response['requested'] = $heldBySomeoneElse;
} else {
    // acquire on a free-or-ours lock (which doubles as the heartbeat), or steal on any lock.
    // The lock changing hands is what starts the in-use clock; a heartbeat from the holder we
    // already have carries the old stamp through untouched, which is what makes "in use for 3 hours"
    // mean three hours rather than one minute since the last poll.
    $sameHolder = ($currentHolder === $holder);
    $heldSince = ($sameHolder && $acquiredAt) ? $acquiredAt : time();
    // A pending ask belongs to the holder it was ADDRESSED to, never to whoever happens to be
    // holding when it is read -- see $requestedOf above. Somebody else taking the file answers the
    // ask by existing; the addressee answers it by acknowledging that they have seen it. A record
    // written before requestedOf shipped has none, and falls back to the old same-holder test.
    $keepReqBy = $requestedBy;
    $keepReqAt = $requestedAt;
    $forUs = $requestedOf !== '' ? ($requestedOf === $holder) : $sameHolder;
    if (!$forUs || ($ack && $ack === $requestedAt)) { $keepReqBy = ''; $keepReqAt = 0; $requestedOf = ''; }
    $write = array('projectId' => $id, 'holder' => $holder, 'lockedBy' => $name, 'lastActivity' => time(),
                   'editedAt' => $editedAt, 'savedAt' => $savedAt, 'acquiredAt' => $heldSince,
                   'requestedBy' => $keepReqBy, 'requestedAt' => $keepReqAt,
                   'requestedOf' => $requestedOf);
    $response['held'] = true;
    $response['acquiredAt'] = $heldSince;
    // Reported AFTER the acknowledgement has been applied, so a holder who has just said "seen it"
    // is not handed the same note back on the same breath.
    $response['requestedBy'] = $keepReqBy;
    $response['requestedAt'] = $keepReqAt;
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
if ($expire) {
    // Back-date, then collect it NOW rather than waiting for a later request to run the sweep.
    // A tombstone left lying about is dated 30 days in the past and reads, to anyone looking in the
    // directory, as corrupted data -- Tom spotted one on 2026-08-05 and called it "impossible",
    // which is a fair reaction to a file from last month appearing while you watch. We just created
    // exactly one piece of garbage; take it out.
    @touch($path, time() - (LPN_LOCK_TTL_DAYS * 86400) - 60);
    lpn_sweep();
}

lpn_send($response);
