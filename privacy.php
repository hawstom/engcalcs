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

<p><em>Last updated: 12 August 2026. This notice covers hawsedc.com, including the EngCalcs
engineering calculators at hawsedc.com/engcalcs.</em></p>

<h2>The short version</h2>

<p>We do not sell anything, we do not advertise, and we do not profile you. There is no analytics
vendor, no tag manager, no advertising network, and no social media pixel on this site.
<strong>We never record your IP address in our usage logs</strong>, and those logs contain no
identifier that could be traced back to you.</p>

<p>The calculators run entirely in your browser. <strong>The numbers you type are never sent to
us.</strong></p>

<h2>Who we are</h2>

<p>Thomas Gail Haws publishes hawsedc.com. We decide what data this site collects and why, which
makes us the &ldquo;data controller&rdquo; under the GDPR.</p>

<p>Write to us about anything on this page at
<a href="mailto:support@hawsedc.com">support@hawsedc.com</a>, or at 859 N Lafayette, Mesa AZ 85201,
USA.</p>

<h2>What we collect, why, and on what legal basis</h2>

<h3>1. Anonymous usage counts &mdash; <em>your consent</em></h3>

<p>We count how many people open each calculator, in which language, and how many go on to use it.
Each record is the page name, the language, and the time. It contains no IP address, no account,
and no identifier of any kind. We use it to decide which calculators to improve and which languages
to translate into.</p>

<p>To count you once rather than once per page you open, we need to keep a small amount of
information in your browser, which is why we ask permission first. It is a single digit for each
page, recording only which counts we have already made. <strong>There is no identifier of any kind
&mdash; nothing stored on your device could be used to recognise you, here or anywhere else.</strong></p>

<p>You can answer in three ways. <em>Refuse all</em> and we store nothing and never ask again.
<em>Allow this</em> covers exactly what is described above, and we will ask again only if we ever
want to do something different. <em>Allow all</em> covers that too, so we never ask again.</p>

<p><strong>If you say no, we keep nothing in your browser, and nothing we record can be connected
to you or to your other visits.</strong> We still count the page load itself, in the same way any
web server records that a page was served: the page name, the language your browser asked for, and
the time. Those rows carry no identifier, so we cannot tell your second visit from somebody
else&rsquo;s first, and we count them separately from the visits of people who did agree,
precisely because they are a different kind of number.</p>

<h3>2. Your settings and your work &mdash; <em>necessary to provide the calculator you asked
for</em></h3>

<ul>
	<li>The numbers you type into a calculator, and the units you choose, are stored
	<strong>in your own browser</strong> so the page still has them when you come back. They are
	never sent to us.</li>
	<li>The language you pick from the language menu is remembered the same way.</li>
	<li>The Looped Pipe Network calculator saves the networks you draw <strong>in your own
	browser</strong>. Your drawings never reach our server. If you connect a project to a file on
	your computer, that file is written directly by your browser; we never see it.</li>
</ul>

<h3>3. Messages you send us &mdash; <em>necessary to answer you</em></h3>

<p>If you use the contact form, we receive your name, your email address, and your message, and we
keep them so we can reply and refer back to the conversation.</p>

<h3>4. Shared-file coordination in the Looped Pipe Network calculator &mdash; <em>necessary to
provide the feature you asked for</em></h3>

<p>If you use the project-locking feature so colleagues do not overwrite each other&rsquo;s work,
the name or initials you type are stored on our server alongside the project identifier and a
timestamp, and are shown to anyone else who opens that file. The record is deleted 30 days after
its last activity.</p>

<h2>What we store on your device</h2>

<table class="ec-legal-table">
	<tr><th>Name</th><th>What it is for</th><th>How long</th><th>Needs your permission?</th></tr>
	<tr>
		<td>A cookie named after the calculator page</td>
		<td>The numbers you typed and the units you chose on that page</td>
		<td>1 year</td>
		<td>No &mdash; it is how the page gives your own work back to you</td>
	</tr>
	<tr>
		<td><code>ec_language</code></td>
		<td>The language you chose from the language menu</td>
		<td>1 year</td>
		<td>No &mdash; you set it deliberately</td>
	</tr>
	<tr>
		<td><code>ec_consent</code></td>
		<td>Your answer to the counting question, and when you gave it</td>
		<td>1 year</td>
		<td>No &mdash; its only job is to honour your answer, including a no</td>
	</tr>
	<tr>
		<td><code>ec_blang</code></td>
		<td>The single digit <code>1</code>, meaning we have already recorded which language your browser asks for, so we do not record it again</td>
		<td>1 year</td>
		<td><strong>Yes</strong></td>
	</tr>
	<tr>
		<td><code>ec_seen</code></td>
		<td>One digit for each page you open, recording which counts we have already made for it, so opening the same page again is not counted again. It holds no identifier and nothing that could single you out</td>
		<td>Until you close your browser</td>
		<td><strong>Yes</strong></td>
	</tr>
	<tr>
		<td>Saved networks (browser storage, not a cookie)</td>
		<td>The pipe networks you draw in the Looped Pipe Network calculator</td>
		<td>Until you delete them</td>
		<td>No &mdash; it is your document, kept so we can give it back</td>
	</tr>
	<tr>
		<td>A queue of unsent counts (browser storage, not a cookie)</td>
		<td>Lets a count recorded while you were offline reach us later</td>
		<td>Until it is sent</td>
		<td><strong>Yes</strong> &mdash; and it is emptied if you withdraw</td>
	</tr>
</table>

<p>The two items that need your permission are not written unless you say yes, and if you change
your mind they are deleted. You can change your answer at any time using the
<strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link
at the foot of every page.</p>

<h2>Who else sees it</h2>

<p><strong>Nobody.</strong> We do not share, sell, or transfer any of it to third parties. We use
no processor, no analytics service, and no advertising partner.</p>

<p><strong>Nothing on this site is loaded from anybody else&rsquo;s server.</strong> Every
stylesheet, script, font and image comes from this site, so no third party ever learns that you
visited, not even by serving you a file. There is no content delivery network, no hosted font, and
no embedded map or video.</p>

<h2>Where it goes</h2>

<p>Our server is in the United States. If you are in the European Economic Area, that means the
little we collect is transferred outside it. For the usage counts we rely on your explicit consent
(GDPR Article 49(1)(a)); for anything you send us through the contact form we rely on the transfer
being necessary to do what you asked (Article 49(1)(b)).</p>

<h2>How long we keep it</h2>

<table class="ec-legal-table">
	<tr><th>What</th><th>How long</th></tr>
	<tr><td>Usage counts</td><td>At most 26 months, and often deleted sooner</td></tr>
	<tr><td>Messages you send us</td><td>As long as the conversation may still matter, and deleted on request</td></tr>
	<tr><td>Project lock records</td><td>30 days after the last activity</td></tr>
	<tr><td>Anything in your own browser</td><td>Until you clear it, or until it expires</td></tr>
</table>

<h2>Your rights</h2>

<p>If you are in the EEA or the UK you can ask us to show you the data we hold about you, correct
it, delete it, restrict how we use it, object to our using it, or send it to you in a portable
form. In practice we hold almost nothing that is about you at all: the usage counts contain no
identifier, so there is nothing in them we could find, correct or delete on your behalf.</p>

<p>Where we rely on your consent you can <strong>withdraw it at any time</strong>, and it is as easy
to withdraw as it was to give &mdash; use the
<strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link
at the foot of every page.</p>

<p>You can also complain to your national data protection authority. You do not have to speak to us
first.</p>

<h2>Automated decision-making</h2>

<p>There is none. Nothing on this site profiles you or makes decisions about you.</p>

<h2>Changes</h2>

<p>If we change this notice we will change the date at the top of this page.</p>

<p><em>This notice is written in English, and the English version is the one that governs.</em></p>

</div>
<?php
echoFooter("EngCalcs");
