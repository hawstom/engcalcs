<?php
/**
 * html_balance_check.php -- renders every calculator page and checks that its block tags balance.
 *
 * WHY THIS EXISTS (2026-08-04). While moving the units row into a popover for ROADMAP Task 211 I left
 * out one </div>. The result was not a cosmetic glitch: the popover carries `display:none`, so the
 * unclosed div swallowed the menu bar, the toolbar, the tab strip and the map. The page rendered
 * blank, PHP reported no error, `php -l` was clean, the JS harnesses all passed, and every language
 * key resolved. Nothing we had could see it -- the only thing that could was opening the page, and
 * Tom did that for me.
 *
 * A missing close tag is invisible to every other check in this repo and catastrophic when the
 * container it escapes from is hidden. That combination is worth one file.
 *
 * Usage:
 *   php dev/scripts/html_balance_check.php            # every page
 *   php dev/scripts/html_balance_check.php Looped-Network.php
 *
 * Exit code 0 when every page balances, 1 otherwise, so it can gate a commit.
 */

$root = dirname(__DIR__, 2);

// Tags worth checking: containers whose imbalance silently eats page content. Void and
// self-closing elements are deliberately absent -- they never nest.
$TAGS = array('div', 'form', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'p', 'span');
// <p>, <li>, <dt>, <dd> and table cells have optional end tags in HTML5, so an "imbalance" in them is
// legal and common. Reported only at -v, never as a failure.
$SOFT = array('p', 'li', 'dt', 'dd', 'td', 'th', 'tr');

$argvFiles = array_values(array_filter(array_slice($argv, 1), function ($a) { return substr($a, 0, 1) !== '-'; }));
$verbose = in_array('-v', $argv, true) || in_array('--verbose', $argv, true);

if ($argvFiles) {
    $pages = array_map(function ($f) use ($root) { return $root . '/' . basename($f); }, $argvFiles);
} else {
    $pages = array_filter(glob($root . '/*.php'), function ($p) {
        // Endpoints and includes render no page of their own.
        $skip = array('lpn-lock.php', 'log-calc-event.php', 'formmail.php');
        return !in_array(basename($p), $skip, true);
    });
}

/**
 * Renders a page and returns its HTML, or null if it could not be rendered.
 *
 * ONE SUBPROCESS PER PAGE, via dev/scripts/render_page.php (2026-08-13, ROADMAP Task 292).
 * This function used to `include` the page HERE, from inside a function -- which runs the page's
 * top-level code in this function's scope, so `$ec_lang`, `$ec_units` and the rest of the
 * bootstrap landed as locals while every library function looking for them as globals found
 * nothing. The page still rendered and still looked like a page. It was simply missing its menus,
 * its footer and 16 of its 17 unit selects: 22 KB of a 45 KB page. Every "ok" this file printed
 * before today was about that stub, so the results table -- the part most likely to lose a tag --
 * was never actually checked. Found while building the Task 292 calculator harness, which needs
 * those selects and got an empty list.
 */
function render_page($path)
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($path)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

/** Depth-tracks one tag through one document. Returns [finalDepth, lowestDepth, offsetOfLowest]. */
function tag_balance($html, $tag)
{
    $depth = 0; $low = 0; $lowAt = 0; $offset = 0;
    // `<tag` followed by a non-name character, so <p> does not match <pre> and <td> does not match
    // <table>. Self-closing (`/>`) forms are counted as balanced pairs and therefore skipped.
    $re = '/<(\/)?' . $tag . '(\s[^>]*?)?(\/)?>/i';
    while (preg_match($re, $html, $m, PREG_OFFSET_CAPTURE, $offset)) {
        $offset = $m[0][1] + strlen($m[0][0]);
        $isClose = ($m[1][0] === '/');
        $selfClose = isset($m[3]) && $m[3][0] === '/';
        if ($selfClose) { continue; }
        $depth += $isClose ? -1 : 1;
        if ($depth < $low) { $low = $depth; $lowAt = $m[0][1]; }
    }
    return array($depth, $low, $lowAt);
}

/** A short, readable excerpt around an offset, for pointing at the offending place. */
function excerpt($html, $at)
{
    $s = substr($html, max(0, $at - 100), 200);
    return trim(preg_replace('/\s+/', ' ', $s));
}

// ONE PAGE PER PROCESS. A page is included, not parsed, so anything it does -- exit(), a redirect,
// a fatal -- happens to us. Install.php ends the run outright if it shares a process with the rest.
// The parent shells out; the child does one page and reports.
$single = null;
foreach ($argv as $i => $a) {
    if ($a === '--one' && isset($argv[$i + 1])) { $single = $argv[$i + 1]; }
}
if ($single === null) {
    $failures = 0; $checked = 0; $skippedPages = array();
    foreach ($pages as $page) {
        $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__FILE__) . ' --one ' . escapeshellarg($page)
             . ($verbose ? ' -v' : '') . ' 2>/dev/null';
        $out = array(); $rc = 0;
        exec($cmd, $out, $rc);
        $text = implode("\n", $out);
        // A child that died mid-render (fatal, exit()) prints nothing usable. Not a balance failure --
        // say so plainly rather than reporting a page we never actually measured.
        if ($text === '' || strpos($text, 'ok ') === false && strpos($text, 'FAIL') === false && strpos($text, 'SKIP') === false) {
            echo "SKIP     " . basename($page) . " (could not be rendered in isolation)\n";
            $skippedPages[] = basename($page);
            continue;
        }
        echo $text . "\n";
        // A page the child skipped was not measured, so it must not be counted as measured --
        // otherwise the closing tally quietly overstates the coverage of this check.
        if (strpos($text, 'SKIP') === false) { $checked++; } else { $skippedPages[] = basename($page); }
        if ($rc !== 0) { $failures++; }
    }
    // **THE DENOMINATOR IS WHAT WAS ASKED FOR** (Task 322). "$checked page(s) checked" is a
    // fraction of what was REACHED, so it reads identically whether every page was measured or a
    // third of them died on a fatal and were skipped. The four skips today are endpoints that
    // redirect or log and emit no page; a fifth appearing is worth noticing.
    $askedFor = count($pages);
    echo "\n$checked of $askedFor page(s) checked, $failures failing";
    echo $skippedPages ? ', ' . count($skippedPages) . " skipped: " . implode(', ', array_unique($skippedPages)) . ".\n" : ".\n";
    exit($failures ? 1 : 0);
}
$pages = array($single);

$failures = 0;
$checked = 0;
foreach ($pages as $page) {
    if (!is_file($page)) {
        echo "MISSING  " . basename($page) . "\n";
        $failures++;
        continue;
    }
    $html = render_page($page);
    if ($html === null || $html === '') {
        echo "SKIP     " . basename($page) . " (rendered nothing)\n";
        continue;
    }
    $checked++;
    $bad = array();
    $soft = array();
    foreach ($TAGS as $tag) {
        list($depth, $low, $lowAt) = tag_balance($html, $tag);
        if ($depth === 0 && $low >= 0) { continue; }
        $what = $depth > 0
            ? "$depth unclosed <$tag>"
            : ($depth < 0 ? abs($depth) . " extra </$tag>" : "</$tag> before its <$tag>");
        if (in_array($tag, $SOFT, true)) { $soft[] = $what; continue; }
        $bad[] = array($what, $low < 0 ? $lowAt : null);
    }
    if ($bad) {
        $failures++;
        echo "FAIL     " . basename($page) . "\n";
        foreach ($bad as $b) {
            echo "           " . $b[0] . "\n";
            if ($b[1] !== null) { echo "           near: " . excerpt($html, $b[1]) . "\n"; }
        }
        // An unclosed container inside something hidden is the case that costs a whole page, so say
        // so rather than leaving the reader to work out why it matters.
        echo "           An unclosed container swallows everything after it. If that container is\n";
        echo "           hidden (display:none, a popover), the rest of the page disappears.\n";
    } else {
        echo "ok       " . basename($page) . "\n";
    }
    if ($verbose && $soft) {
        echo "           (optional-end-tag elements, not a failure: " . implode(', ', $soft) . ")\n";
    }
}
// The child reports its one page and nothing else; the parent above owns the summary.
exit($failures ? 1 : 0);
