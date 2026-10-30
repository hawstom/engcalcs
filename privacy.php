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
 * THE TONE (Tom, 2026-10-18): plain, and true to how little there is. We cannot tell who anyone
 * is, so the list of what is counted names what happened on a page, never who did it. The rules
 * underneath are unchanged: consent before the random code is stored (that rule is about storing
 * on the device, not about identifying anyone), and the GDPR framing stays because an online
 * identifier can count as personal data.
 *
 * Every factual claim below is checkable against dev/cookie-storage-inventory.md. If you change
 * what the code stores, this page is part of the change.
 */
require_once('lib/base.inc.php');
$html_title = $ec_lang['privacy_link'];
echoHeader("EngCalcs", $html_title, "", false);
?>
<div class="ec-legal">

<p><em>Last updated: 18 October 2026. This notice covers hawsedc.com, including the EngCalcs
engineering calculators at hawsedc.com/engcalcs.</em></p>

<p><strong>We cannot tell who anyone is, and we hold nothing worth sharing.</strong> We count how
the pages are used, so that we know which calculators to improve and which languages to translate
into. If you allow it, your browser keeps a random code so we don&rsquo;t count you
again. That code is used for nothing but counting. It is never sold, never shared, never joined to
anything else, and never used to follow anyone. The rest of this page lists exactly what is counted
and what else reaches us, and it gives the legal details the law requires.</p>

<h2>The short version</h2>

<ul>
	<li>We do not sell anything, advertise, or build profiles of anyone. There is no analytics
		vendor, no tag manager, no advertising network, and no social media pixel.</li>
	<li><strong>The calculators run in your browser. The numbers you type are never sent to us.</strong></li>
	<li>Our usage counts hold no IP address. If you say yes to the counting question, they carry
		the random code; if you say no, they carry no identifier of any kind.</li>
	<li>The web server keeps an ordinary access log, and that log does record IP addresses. The
		access log and the usage counts are kept apart, and we never join them.</li>
	<li>Four optional features on one page can fetch something from OpenStreetMap or Mapbox. The
		street map shows on the first, empty project that page opens, and you can hide it. The other
		three ask first.</li>
</ul>

<h2>Who we are</h2>

<p>Thomas Gail Haws publishes hawsedc.com and is the data controller under the GDPR.
<a href="mailto:support@hawsedc.com">support@hawsedc.com</a>, or 859 N Lafayette, Mesa AZ 85201,
USA.</p>

<h2>What we collect, why, and on what legal basis</h2>

<table class="ec-legal-table">
	<tr><th>What</th><th>Why</th><th>Legal basis</th></tr>
	<tr>
		<td><strong>Usage counts.</strong> The page name, the language of the page, the language the
			browser asks for, the time, whether the page was used with a finger or with a mouse,
			and sometimes one short fact about what happened on the page: that a calculation was
			run, that a printable title or subtitle was typed (never its words), which reference
			link was followed, that an input was changed, which units were chosen, that this
			browser had used this calculator before, that the page link was copied, that a
			pipe-network project was saved or renamed, or which menu command, toolbar button or
			drawing tool was chosen, and which error message appeared, on the pipe-network map. On
			that map we also count which of its first steps was taken first (opening the example,
			drawing, adding a background picture, or importing a file), and that <em>Something wrong
			here?</em> was pressed. <strong>Never anything typed into a page.</strong> No IP
			address, no account, and no description of the browser or device beyond that one
			finger-or-mouse fact. With a yes to the counting question, the random code described
			below</td>
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
		<td><strong>Messages you send us.</strong> From the contact form: your name, email address,
			subject and message, and the page you came from when it is known. From the <em>Something
			wrong here?</em> box on the pipe-network map: what you pick or type, with the page, your
			language, the site version, and the code of any message on the map. There the email
			address is optional, and used only to reply</td>
		<td>To answer you and refer back to the conversation</td>
		<td>Necessary to answer you</td>
	</tr>
	<tr>
		<td><strong>Project lock records.</strong> The initials you type when you ask a colleague
			for a shared file, kept with that file&rsquo;s lock record and its identifier and
			timestamps, and shown to whoever has the file open</td>
		<td>So colleagues do not overwrite each other&rsquo;s work</td>
		<td>Necessary to provide the feature you asked for</td>
	</tr>
	<tr>
		<td><strong>The web server&rsquo;s access log.</strong> The IP address of each request, the
			time, the page, the response, and the browser&rsquo;s description of itself. The server
			writes it before this site&rsquo;s code runs, so it is written whatever the answer to
			the counting question</td>
		<td>Keeping the site up and defending it: finding what broke and recognizing abuse. We do
			not use it to learn anything about anyone, and we never join it to the usage counts</td>
		<td>Our legitimate interest</td>
	</tr>
</table>

<h3>The counting question</h3>

<p>To count each page once per visit rather than on every load, we keep one digit per page in the
browser until it is closed. That is storage on your device, which is why we ask first. There are
three answers. <em>Refuse all</em>: we store only that answer, so that we do not ask again.
<em>Allow this</em>: it covers what is described here, and we ask again only if we ever want to do
something different. <em>Allow all</em>: it covers that too, and we do not ask again.</p>

<p>With a yes, the browser also makes up a random code of 16 characters and keeps it in a cookie
named <code>ec_code</code>. <strong>The code exists so we don&rsquo;t count you
again.</strong> It is made from nothing about you, your device, or your visit, and it records
nothing you enter. Every count the browser sends after that carries the code. That lets us count
how many different browsers use each calculator, and not only how many times it was used. The code
lasts 400 days from the most recent visit, the longest a browser keeps any cookie. <em>Refuse
all</em>, or changing the answer to no, deletes it, and so does <em>Start fresh</em> on the
pipe-network map. We never join the code to the web server&rsquo;s access log, so it does not tell
us who anyone is or where anyone is.</p>

<p>With a no, we keep nothing in the browser but the answer. We still count the page load itself,
in a more limited way than a typical web server records that a page was served: the page name, the
language, the language the browser asks for, the time, and whether the page was used with a finger
or with a mouse. Those counts carry no identifier, so we cannot tell one visit from another. We keep
them separate from the counts from browsers that said yes, because they are a different kind of
number.</p>

<h2>What is stored on your device</h2>

<table class="ec-legal-table">
	<tr><th>Name</th><th>What it is for</th><th>How long</th><th>Needs permission?</th></tr>
	<tr><td>A cookie named after the calculator page</td><td>The numbers and units you entered there</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_language</code></td><td>The language you chose</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_consent</code></td><td>Your answer to the counting question, and when you gave it</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_geosearch</code></td><td>Your yes to place-name search. Only a yes is stored</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_terrain</code></td><td>Your yes to elevation lookup. Only a yes is stored</td><td>1 year</td><td>No</td></tr>
	<tr><td><code>ec_blang</code></td><td>One digit: we have already counted which language this browser asks for</td><td>1 year</td><td><strong>Yes</strong></td></tr>
	<tr><td><code>ec_seen</code></td><td>One digit per page: which counts we have already made. No identifier</td><td>Until the browser is closed</td><td><strong>Yes</strong></td></tr>
	<tr><td><code>ec_code</code></td><td>A random code, so we don&rsquo;t count you again</td><td>400 days from the most recent visit</td><td><strong>Yes</strong></td></tr>
	<tr><td>Saved networks (browser storage)</td><td>The pipe networks you draw</td><td>Until you delete them</td><td>No</td></tr>
	<tr><td>Lock token and page layout (browser storage)</td><td>A random code that tells the lock server which locks are yours, and how you left the panels</td><td>Until you delete them</td><td>No</td></tr>
	<tr><td>Offline copy of the suite (browser cache)</td><td>This site&rsquo;s own pages, scripts, styles, and icons, kept so the calculators open without a connection. It holds no identifier and nothing you entered, and it is sent nowhere. On the Looped Pipe Network page it also keeps our own EPANET engine, fetched quietly in advance so that solver starts at once. To remove it, clear this site&rsquo;s data in your browser; the next visit rebuilds it</td><td>Until you clear it. Files are replaced when we publish a new version</td><td>No</td></tr>
	<tr><td>Queue of unsent counts (browser storage)</td><td>Lets a count recorded offline reach us later</td><td>Until it is sent</td><td><strong>Yes</strong></td></tr>
</table>

<p>The items marked <strong>Yes</strong> are not written without a yes, and are deleted if the
answer changes to no. Use the <strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link at the foot of every page.</p>

<h2>Who else sees it</h2>

<p><strong>Nobody.</strong> We do not share, sell, or transfer any of it. There is no processor, no
analytics service, and no advertising partner. Every stylesheet, script, and font comes from this
site.</p>

<p>Five features on the Looped Pipe Network map make third-party requests. The street map shows on
the first, empty project the page opens, and Map, World map, Detach hides it. The other four wait
for you. Three of them ask first and separately, because each sends something different; a
background layer starts only when you add one or agree to draw one. No other page in the suite uses any of them.</p>

<table class="ec-legal-table">
	<tr><th>Feature</th><th>What is sent</th><th>To</th></tr>
	<tr><td>Street map behind the network</td><td>Which tiles are in view, and the IP address</td><td><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></td></tr>
	<tr><td>Satellite and topo map imagery</td><td>Which tiles are in view, and the IP address</td><td><a href="https://www.mapbox.com/" target="_blank" rel="noopener">Mapbox</a>, for the satellite and topo map images</td></tr>
	<tr><td>Search for a place by name</td><td>The words typed into the search, and the IP address</td><td>OpenStreetMap&rsquo;s <a href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noopener">Nominatim</a></td></tr>
	<tr><td>Ground elevations</td><td>The latitude and longitude of the network&rsquo;s nodes, and the IP address</td><td>Mapbox</td></tr>
	<tr><td>Background layer from a GIS server</td><td>Which map tiles are in view, and the IP address</td><td>The server whose address you typed</td></tr>
</table>

<p>A map tile says where the map is <em>looking</em>; a search says what was <em>typed</em>; node
coordinates are <em>the network itself</em>. That is why the last two ask separately. Nothing else
is sent: not the project&rsquo;s name, not its shape, not one number in it. We keep no record of
searches or lookups. Say no and everything else on that page keeps working, including typing a
latitude, longitude, or elevation by hand.</p>

<p>What each company does with the request is governed by its own privacy policy:
<a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">OpenStreetMap&rsquo;s</a>
and <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener">Mapbox&rsquo;s</a>.</p>

<p>A background layer works differently from the other four, because we do not choose the server.
When you add a layer, the page sends tile requests to the server whose address you typed, for the area
on screen, and again as you pan and zoom. That server sees your IP address, the area you are
looking at, and that the request came from this site. Nothing is sent to it until you add a layer,
or agree to draw the layers of a project you open, and removing the layer ends the requests. A layer
is saved in your project file, so when you open that project later the page asks you before it
makes requests to the server again. What the server does with the request is governed by its own
privacy policy.</p>

<h2>Where it goes</h2>

<p>Our server is in the United States, so what little we collect is transferred outside the European
Economic Area. For the usage counts we rely on your explicit consent (GDPR Article 49(1)(a)); for
messages you send us, on the transfer being necessary to do what you asked (Article 49(1)(b)).</p>

<h2>How long we keep it</h2>

<table class="ec-legal-table">
	<tr><th>What</th><th>How long</th></tr>
	<tr><td>Usage counts</td><td>No fixed limit. We delete old counts from time to time, once they no longer help decide anything</td></tr>
	<tr><td>Messages you send us</td><td>As long as the conversation may matter, and deleted on request</td></tr>
	<tr><td>Project lock records</td><td>30 days after the last activity</td></tr>
	<tr><td>The web server&rsquo;s access log</td><td><strong>No promise: it may stay on the server indefinitely</strong></td></tr>
	<tr><td>Anything in your own browser</td><td>Until you clear it, or until it expires</td></tr>
</table>

<h2>Your rights</h2>

<p>If you are in the EEA or the UK, you can ask us to show you the data we hold about you, correct
it, delete it, restrict or object to our using it, or send it to you in a portable form. In
practice we hold almost nothing about anyone. The usage counts from a browser that said no contain
no identifier, so there is nothing in them to find. Those from a browser that said yes carry its
random code, which we cannot connect to a person by ourselves. Even so, the law can treat such a
code as personal data, so we treat it that way. If you send us the code (your browser lists it
among this site&rsquo;s cookies as <code>ec_code</code>), we will find or delete the counts that
carry it.</p>

<p>Where we rely on your consent you can <strong>withdraw it at any time</strong>, as easily as you
gave it, using the <strong><?=htmlspecialchars($ec_lang['consent_settings_link'], ENT_QUOTES, 'UTF-8')?></strong> link at the foot of every page. You can also complain
to your national data protection authority without speaking to us first.</p>

<h2>Automated decision-making</h2>

<p>There is none. Nothing on this site profiles anyone or makes decisions about anyone.</p>

<h2>Changes</h2>

<p>If we change this notice, we will change the date at the top. This notice is written in English,
and the English version is the one that governs.</p>

</div>
<?php
echoFooter("EngCalcs");
