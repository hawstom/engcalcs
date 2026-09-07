<?php
/**
 * Privacy notice for hawsedc.com (ROADMAP Task 286).
 *
 * Copyright 2009 Thomas Gail Haws
 * LICENSE: GNU GPL v3 or later
 *
 * WHY THE BODY OF THIS PAGE IS HARD-CODED ENGLISH, against the rule that governs every other page
 * in this suite: it is legal prose, not UI. Machine-translating a liability position or a statement
 * about what we do with somebody's data risks saying something we did not mean in 26 languages at
 * once, and unlike a mislabelled input nobody would notice. The BANNER's strings are translated --
 * consent that the visitor cannot read is not consent -- and so are the links that lead here. This
 * text is English-authoritative, with a human translation later if it is ever worth buying.
 *
 * The scope is hawsedc.com, not /engcalcs: the cookies are set with path=/ and therefore cover the
 * whole site, and the parent site had no notice at all. Tom decided this on 2026-08-11.
 *
 * Every factual claim below is checkable against dev/cookie-storage-inventory.md. If you change
 * what the code stores, this page is part of the change.
 */
require_once('lib/base.inc.php');
$html_title = $ec_lang['privacy_link'];
echoHeader("EngCalcs", $html_title, "", false);
?>
<div class="ec-legal">

<p><em>Last updated: 7 September 2026. This notice covers hawsedc.com, including the EngCalcs
engineering calculators at hawsedc.com/engcalcs.</em></p>

<h2>The short version</h2>

<ul>
	<li>We do not sell anything, advertise, or profile you. No analytics vendor, no tag manager, no
		advertising network, no social media pixel.</li>
	<li><strong>The calculators run in your browser. The numbers you type are never sent to us.</strong></li>
	<li>Our usage counts hold no IP address and no identifier of any kind.</li>
	<li>The web server keeps an ordinary access log, and that log does record IP addresses. The two
		are separate and we never join them.</li>
	<li>Four optional features on one page can fetch something from OpenStreetMap or Mapbox. Each
		asks you first.</li>
</ul>

<h2>Who we are</h2>

<p>Thomas Gail Haws publishes hawsedc.com and is the data controller under the GDPR.
<a href="mailto:support@hawsedc.com">support@hawsedc.com</a>, or 859 N Lafayette, Mesa AZ 85201,
USA.</p>

<h2>What we collect, why, and on what legal basis</h2>

<table class="ec-legal-table">
	<tr><th>What</th><th>Why</th><th>Legal basis</th></tr>
	<tr>
		<td><strong>Usage counts.</strong> The page name, the language, the time, and sometimes one
			short fact about what happened on the page: which reference link you followed, that you
			changed some input, which units you chose, that this browser had used this calculator
			before, that you copied the page link, or which drawing tool and which error message you
			met on the pipe-network map. <strong>Never anything you type.</strong> No IP address, no
			account, no identifier</td>
		<td>To decide which calculators to improve and which languages to translate into</td>
		<td>Your consent</td>
	</tr>
	<tr>
		<td><strong>Your settings and your work.</strong> The numbers and units you enter, your
			language choice, and the networks you draw. These stay in your own browser and are never
			sent to us</td>
		<td>To give your own work back to you when you return</td>
		<td>Necessary to provide what you asked for</td>
	</tr>
	<tr>
		<td><strong>Messages you send us.</strong> Your name, email address and message</td>
		<td>To answer you and refer back to the conversation</td>
		<td>Necessary to answer you</td>
	</tr>
	<tr>
		<td><strong>Project lock records.</strong> The name or initials you type for shared-file
			locking, with the project identifier and a timestamp, shown to anyone else who opens
			that file</td>
		<td>So colleagues do not overwrite each other&rsquo;s work</td>
		<td>Necessary to provide the feature you asked for</td>
	</tr>
	<tr>
		<td><strong>The web server&rsquo;s access log.</strong> The IP address of each request, the
			time, the page, the response, and the browser&rsquo;s description of itself. Written by
			the server before this site&rsquo;s code runs, so it happens whatever you answer to the
			counting question</td>
		<td>Keeping the site up and defending it: finding what broke, recognising abuse. We do not
			use it to learn anything about you, and we never join it to the usage counts</td>
		<td>Our legitimate interest</td>
	</tr>
</table>

<h3>The counting question</h3>

<p>To count you once rather than once per page, we keep one digit per page in your browser, which is
why we ask first. You can answer in three ways: <em>Refuse all</em> and we store nothing and never
ask again; <em>Allow this</em> covers what is described here, and we ask again only if we ever want
to do something different; <em>Allow all</em> covers that too.</p>

<p>If you say no we keep nothing in your browser, and we still count the page load itself, in a more
limited way than a typical web server records that a page was served: the page name, the language
your browser asked for, and the time. Those rows carry no identifier, so we cannot tell your second
visit from somebody else&rsquo;s first, and we count them separately from the visits of people who
did agree, because they are a different kind of number.</p>

<h2>What is stored on your device</h2>

<table class="ec-legal-table">
	<tr><th>Name</th><th>What it is for</th><th>How long</th><th>Needs permission?</th></tr>
	<tr><td>A cookie named after the calculator page</td><td>The numbers and units you entered there</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_language</code></td><td>The language you chose</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_consent</code></td><td>Your answer to the counting question, and when you gave it</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_geosearch</code></td><td>Your yes to place-name search. Only a yes is stored</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_terrain</code></td><td>Your yes to elevation lookup. Only a yes is stored</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_blang</code></td><td>One digit: we have already recorded which language your browser asks for</td><td>1 year</td><td><strong>Yes</strong></td></tr>
	<tr><td><code>ec_seen</code></td><td>One digit per page: which counts we have already made. No identifier</td><td>Until you close your browser</td><td><strong>Yes</strong></td></tr>
	<tr><td>Saved networks (browser storage)</td><td>The pipe networks you draw</td><td>Until you delete them</td><td>No</td></tr>
	<tr><td>Initials and page layout (browser storage)</td><td>Your initials for shared-file locking, and how you left the panels</td><td>Until you delete them</td><td>No</td></tr>
	<tr><td>Queue of unsent counts (browser storage)</td><td>Lets a count recorded offline reach us later</td><td>Until it is sent</td><td><strong>Yes</strong></td></tr>
</table>

<p>The items marked <strong>Yes</strong> are not written unless you say yes, and are deleted if you
change your mind. Use the <strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link at the foot of every page.</p>

<h2>Who else sees it</h2>

<p><strong>Nobody.</strong> We do not share, sell or transfer any of it. No processor, no analytics
service, no advertising partner. Every stylesheet, script and font comes from this site.</p>

<p>Four features on the Looped Pipe Network map reach outside this site. Each asks you first and
separately, because they do not tell the same thing about you. No other page in the suite makes any
of them.</p>

<table class="ec-legal-table">
	<tr><th>Feature</th><th>What is sent</th><th>To</th></tr>
	<tr><td>Street map behind your network</td><td>Which tiles you are looking at, and your IP address</td><td><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></td></tr>
	<tr><td>Satellite imagery</td><td>Which tiles you are looking at, and your IP address</td><td><a href="https://www.mapbox.com/" target="_blank" rel="noopener">Mapbox</a>, for the satellite images</td></tr>
	<tr><td>Search for a place by name</td><td>The words you type, and your IP address</td><td>OpenStreetMap&rsquo;s <a href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noopener">Nominatim</a></td></tr>
	<tr><td>Ground elevations</td><td>The latitude and longitude of your nodes, and your IP address</td><td>Mapbox</td></tr>
</table>

<p>A map tile says where you are <em>looking</em>; a search says what you <em>typed</em>; node
coordinates are <em>your network itself</em>. That is why the last two ask separately. We send
nothing else: not your project&rsquo;s name, not its shape, not one number in it. We keep no record
of your searches or lookups. Say no and everything else on that page keeps working, including
typing a latitude, longitude or elevation yourself.</p>

<p>What each company does with the request is governed by its own privacy policy:
<a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">OpenStreetMap&rsquo;s</a>
and <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener">Mapbox&rsquo;s</a>.
A fifth such feature would ask you in the same way.</p>

<h2>Where it goes</h2>

<p>Our server is in the United States, so what little we collect is transferred outside the European
Economic Area. For the usage counts we rely on your explicit consent (GDPR Article 49(1)(a)); for
the contact form, on the transfer being necessary to do what you asked (Article 49(1)(b)).</p>

<h2>How long we keep it</h2>

<table class="ec-legal-table">
	<tr><th>What</th><th>How long</th></tr>
	<tr><td>Usage counts</td><td>At most 26 months, and often sooner</td></tr>
	<tr><td>Messages you send us</td><td>As long as the conversation may matter, and deleted on request</td></tr>
	<tr><td>Project lock records</td><td>30 days after the last activity</td></tr>
	<tr><td>The web server&rsquo;s access log</td><td><strong>No promise: it may stay on the server indefinitely</strong></td></tr>
	<tr><td>Anything in your own browser</td><td>Until you clear it, or until it expires</td></tr>
</table>

<h2>Your rights</h2>

<p>If you are in the EEA or the UK you can ask us to show you the data we hold about you, correct it,
delete it, restrict or object to our using it, or send it to you in a portable form. In practice we
hold almost nothing that is about you: the usage counts contain no identifier, so there is nothing in
them to find or delete on your behalf.</p>

<p>Where we rely on your consent you can <strong>withdraw it at any time</strong>, as easily as you
gave it, using the <strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link at the foot of every page. You can also complain
to your national data protection authority without speaking to us first.</p>

<h2>Automated decision-making</h2>

<p>There is none. Nothing on this site profiles you or makes decisions about you.</p>

<h2>Changes</h2>

<p>If we change this notice we will change the date at the top. This notice is written in English,
and the English version is the one that governs.</p>

</div>
<?php
echoFooter("EngCalcs");
