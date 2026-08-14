<?php
/**
 * render_page.php -- renders ONE page of the suite to stdout, exactly as a web request would.
 *
 * WHY IT IS ITS OWN FILE, AND WHY IT IS ONE PAGE PER PROCESS (2026-08-13, ROADMAP Task 292).
 * Two things make in-process rendering trickier than it looks, and both failed silently:
 *
 *   1. **GLOBAL SCOPE IS NOT OPTIONAL.** `include`ing a page from inside a FUNCTION runs that
 *      page's top-level code in the function's local scope, so `$ec_lang`, `$ec_units` and every
 *      other bootstrap global land as function locals -- while the library functions the page
 *      calls declare `global $ec_lang` and see nothing. The page still renders, still exits 0,
 *      and still looks like a page: it is simply missing its menus, its unit selects and most of
 *      its labels. html_balance_check.php rendered pages that way from the day it was written,
 *      so every "ok" it printed was about a 22 KB stub of a 45 KB page, with 1 of the 17 unit
 *      selects present. Found while building the Task 292 calculator harness, which needs those
 *      selects and got an empty list.
 *   2. **ONE PAGE PER PROCESS.** `lib/base.inc.php` is `require_once`d, so the second page
 *      rendered in the same process gets none of the bootstrap and renders as a fragment. A
 *      caller that wants several pages must run this script once per page.
 *
 * Warnings and notices go to STDERR, so stdout is the page and nothing but the page.
 *
 * Usage:
 *   php dev/scripts/render_page.php Manning-Pipe-Flow.php > /tmp/page.html
 *   php dev/scripts/render_page.php Manning-Pipe-Flow.php --lang=es
 *
 * `--lang` seeds the ec_language COOKIE, which is how a returning visitor's language actually
 * arrives. It matters for more than translated labels: EC_DEFAULT_UNIT_SET is derived from the
 * language, so `en` renders the US defaults and every other language renders the SI ones. That is
 * the only way to see a page's SI defaults at all -- switching the unit selects afterwards
 * reinterprets the typed numbers rather than converting them, by long-standing design.
 * (`?lang=` is deliberately not used: it calls setcookie() and logs a language selection.)
 *
 * Exit 0 on success; 1 if the page does not exist or threw.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

ini_set('display_errors', 'stderr');

$__rp_root = dirname(__DIR__, 2);
$__rp_page = '';
$__rp_lang = '';
foreach (array_slice($argv, 1) as $__rp_arg) {
    if (preg_match('/^--lang=([a-z]{2})$/i', $__rp_arg, $__rp_m)) { $__rp_lang = strtolower($__rp_m[1]); }
    elseif (substr($__rp_arg, 0, 1) !== '-' && $__rp_page === '') { $__rp_page = basename($__rp_arg); }
}
$__rp_path = $__rp_root . '/' . $__rp_page;
if ($__rp_page === '' || !is_file($__rp_path)) {
    fwrite(STDERR, "render_page.php: usage: php dev/scripts/render_page.php <Page.php> [--lang=xx]\n");
    exit(1);
}
if ($__rp_lang !== '') { $_COOKIE['ec_language'] = $__rp_lang; }

// The suite reads these; a CLI SAPI supplies none of them.
$_SERVER['REQUEST_URI']    = '/engcalcs/' . $__rp_page;
$_SERVER['SCRIPT_NAME']    = '/engcalcs/' . $__rp_page;
$_SERVER['SERVER_NAME']    = 'hawsedc.com';
$_SERVER['HTTP_HOST']      = 'hawsedc.com';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['HTTPS']          = 'on';

chdir($__rp_root);

// Global scope on purpose -- see note 1 above. The page's own variables land here beside ours,
// which is why every local in this file carries a __rp_ prefix.
include $__rp_path;
