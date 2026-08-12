<?php
/**
 * The consent banner, and the footer links that reopen it (ROADMAP Task 286).
 *
 * Copyright 2009 Thomas Gail Haws
 * LICENSE: GNU GPL v3 or later
 *
 * The constraints this has to meet are recorded in dev/privacy-and-terms-draft.md §4 and are
 * repeated here because they are the whole design and each of them is a thing regulators have
 * actually fined sites for getting wrong:
 *
 *   - Opt-IN, before the storage. Handled outside this file: lib/config.inc.php starts no session
 *     and lib/Language.lib.php writes no ec_blang until the answer is yes. The banner is the ASK;
 *     the gating is in the code paths that would otherwise store.
 *   - Refusing exactly as easy as accepting. Two sibling buttons, same size, same weight, same
 *     colour, same place, one click each. Do not restyle one of them to stand out -- the "Accept"
 *     button in colour next to a grey "Reject" is precisely the pattern being fined.
 *   - No pre-ticked boxes and no cookie wall. There is nothing to tick, and the page behind the
 *     banner is fully usable while it is showing.
 *   - Withdrawal as easy as consent. The footer link reopens this same banner on any page.
 *   - A stored consent record, which is itself exempt. See EC_CONSENT_COOKIE in config.
 *
 * Works with JavaScript off: the buttons submit a real form to consent.php, which sets the cookie
 * and redirects back. With JavaScript on, the submit is intercepted and nothing navigates. A
 * banner that needs JS to answer would leave a no-JS visitor permanently un-consented and
 * permanently nagged, which fails the "as easy to refuse" test by making refusal impossible.
 */

/**
 * Emits the banner. Rendered on every page in every state, and hidden unless it is needed, so the
 * footer's "Cookie settings" link has something to reopen without a round trip.
 */
function echoConsentBanner() {
    global $ec_lang;
    $state = ecConsentState();
    // 'unknown' covers both a first visit AND somebody who chose "Accept this" before the ask
    // materially changed -- they asked to be asked again, so they see the banner again. Anyone who
    // chose "Accept all" or "Refuse" never does.
    $answered = ($state !== 'unknown');
    $current = '';
    if ($state === 'granted' || $state === 'granted_all') $current = $ec_lang['consent_current_granted'];
    if ($state === 'denied')  $current = $ec_lang['consent_current_denied'];
    // Where consent.php sends the visitor back to when JavaScript is off. SCRIPT_NAME, not
    // REQUEST_URI: the same reasoning as ec_canonical_url()'s, one step stronger here because
    // this value is going into a Location header.
    $return = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/engcalcs/index.php';
?>
<div id="ec-consent" class="ec-consent d-print-none" role="region" aria-label="<?=htmlspecialchars($ec_lang['consent_region_label'], ENT_QUOTES, 'UTF-8')?>"<?=$answered ? ' hidden' : ''?>>
	<div class="ec-consent-inner">
		<?php // NO VISIBLE HEADING (Tom, 2026-08-12, asking "Is this necessary?" -- it was not). The
		      // body is a single question and the buttons answer it; a heading above one sentence
		      // restates it or, as "Browsers and visits" did, names two nouns without saying what
		      // about them. Screen readers still get a name for this region from the aria-label on
		      // the wrapper, so dropping it costs nothing in accessibility and saves 26
		      // translations of a string that was doing no work. ?>
		<p class="ec-consent-body"><?=$ec_lang['consent_body']?></p>
		<p class="ec-consent-current" id="ec-consent-current"><?=htmlspecialchars($current, ENT_QUOTES, 'UTF-8')?></p>
		<form class="ec-consent-actions" method="post" action="/engcalcs/consent.php">
			<input type="hidden" name="return" value="<?=htmlspecialchars($return, ENT_QUOTES, 'UTF-8')?>" />
			<?php // REFUSE FIRST, and all three share one class (ROADMAP Task 288). Two accepts against
			      // one refusal errs safe rather than dark-patterned, but only while every button is
			      // the same size, weight and colour -- so never give one of them its own rule, and
			      // never put the refusal last where it reads as the afterthought.
			      //
			      // "Accept this" is SCOPE-LIMITED consent, pinned to EC_CONSENT_VERSION: yes to this,
			      // ask me again if the ask itself materially changes. It does NOT mean "ask me again
			      // next visit" -- nagging somebody who already said yes is the one direction that
			      // makes a consent flow worse rather than safer. ?>
			<button type="submit" name="ec_consent" value="0" class="ec-consent-btn"><?=$ec_lang['consent_decline']?></button>
			<button type="submit" name="ec_consent" value="1" class="ec-consent-btn"><?=$ec_lang['consent_accept']?></button>
			<button type="submit" name="ec_consent" value="2" class="ec-consent-btn"><?=$ec_lang['consent_accept_all']?></button>
		</form>
		<p class="ec-consent-links">
			<a href="/engcalcs/privacy.php"><?=$ec_lang['privacy_link']?></a>
			<a href="/engcalcs/terms.php"><?=$ec_lang['terms_link']?></a>
		</p>
	</div>
</div>
<script>
(function () {
	'use strict';
	var banner = document.getElementById('ec-consent');
	if (!banner) return;
	var form = banner.querySelector('form');
	var current = document.getElementById('ec-consent-current');
	var texts = {
		'2': <?=json_encode($ec_lang['consent_current_granted'])?>,
		'1': <?=json_encode($ec_lang['consent_current_granted'])?>,
		'0': <?=json_encode($ec_lang['consent_current_denied'])?><?="\n"?>	};

	function record(answer) {
		// Mirrors ecConsentSet() in lib/config.inc.php: "<state>.<unix-ts>.<policy-version>".
		// Written here rather than server-side so answering costs no page load; the server reads
		// the very same cookie on the next request and starts (or does not start) a session.
		var value = answer + '.' + Math.floor(Date.now() / 1000) + '.' + <?=json_encode(EC_CONSENT_VERSION)?>;
		var expires = new Date(Date.now() + <?=EC_CONSENT_DAYS?> * 86400000).toUTCString();
		var secure = (location.protocol === 'https:') ? '; Secure' : '';
		document.cookie = 'ec_consent=' + value + '; expires=' + expires + '; path=/; SameSite=Lax' + secure;
		if (answer === '0') forget();
		if (current) current.textContent = texts[answer] || '';
	}

	// Withdrawing has to remove what consent was covering, or the promise in the privacy notice is
	// not true. The session cookie and ec_blang are HttpOnly, so JS cannot delete them -- the
	// server does that on the next request (ecForgetAnalyticsStorage). What JS owns is the
	// offline beacon queue.
	function forget() {
		if (window.EngCalcs && typeof EngCalcs.flushQueue === 'function') EngCalcs.flushQueue();
	}

	if (form) {
		form.addEventListener('submit', function (event) {
			// event.submitter names the button that was pressed; activeElement is the fallback
			// for browsers that predate it. Which button matters: the two answers are opposite.
			var btn = event.submitter || document.activeElement;
			var answer = btn ? btn.value : '';
			if (answer !== '0' && answer !== '1' && answer !== '2') return; // no-JS path handles anything odd
			event.preventDefault();
			record(answer);
			banner.hidden = true;
		});
	}

	// The permanent "Cookie settings" link in the footer. Reopening is the withdrawal mechanism,
	// so it must work from every page and in both directions.
	document.addEventListener('click', function (event) {
		var link = event.target.closest ? event.target.closest('.ec-consent-reopen') : null;
		if (!link) return;
		event.preventDefault();
		banner.hidden = false;
		banner.scrollIntoView({ block: 'center' });
	});
}());
</script>
<?php
}

/**
 * The footer row: privacy, terms, and the permanent control that reopens the banner.
 *
 * "Always available at the foot of every page" is not decoration -- withdrawing consent has to be
 * as easy as giving it, and a control the visitor cannot find is not one.
 */
function echoConsentFooterLinks() {
    global $ec_lang;
?>
<p class="ec-legal-links d-print-none">
	<a href="/engcalcs/privacy.php"><?=$ec_lang['privacy_link']?></a>
	<a href="/engcalcs/terms.php"><?=$ec_lang['terms_link']?></a>
	<a href="#ec-consent" class="ec-consent-reopen"><?=$ec_lang['consent_settings_link']?></a>
</p>
<?php
}
