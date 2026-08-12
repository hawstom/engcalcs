<?php
/**
 * Terms of use for hawsedc.com (ROADMAP Task 286).
 *
 * Copyright 2009 Thomas Gail Haws
 * LICENSE: GNU GPL v3 or later
 *
 * English-authoritative and hard-coded, for the reason spelled out at the top of privacy.php.
 *
 * Section 3 is the one that matters if a design ever goes wrong. Everything else here is
 * disclosure; that one is risk allocation, and it was written by somebody who is not a lawyer.
 */
require_once('lib/base.inc.php');
$html_title = $ec_lang['terms_link'];
echoHeader("EngCalcs", $html_title, "", false);
?>
<div class="ec-legal">

<p><em>Last updated: 12 August 2026. These terms cover hawsedc.com, including the EngCalcs
engineering calculators at hawsedc.com/engcalcs.</em></p>

<h2>1. What this is</h2>

<p>EngCalcs is a set of free engineering calculators published by Thomas Gail Haws. Using them
means accepting these terms.</p>

<h2>2. The software is free, in both senses</h2>

<p>The calculators are licensed under the <strong>GNU General Public License, version 3 or
later</strong>. You may run, study, share and modify them. The source is published at
<a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a>.</p>

<h2>3. Professional responsibility &mdash; read this one</h2>

<p><strong>These calculators are tools, not engineers.</strong> They implement published methods
(Manning, Hazen-Williams, Darcy-Weisbach, EPANET&rsquo;s own hydraulic engine, and others), and they
implement them carefully &mdash; but a result is only as good as what you typed, and only as good as
the method&rsquo;s fit to your problem.</p>

<p><strong>You are responsible for every number you take from this site.</strong> Check it.
Understand the method. Know its assumptions and its limits. Anything used in a real design must be
reviewed by a qualified engineer who takes responsibility for it &mdash; in most places, one
licensed to do so. Nothing here is a professional service, and using it creates no
engineer&ndash;client relationship of any kind.</p>

<h2>4. No warranty, and what we are not liable for</h2>

<p>This site is provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied,
including any warranty of accuracy, fitness for a particular purpose, or uninterrupted
availability.</p>

<p>To the fullest extent the law allows, Thomas Gail Haws is not liable for any loss, damage, cost
or claim arising from your use of this site or of any result it produces &mdash; including design
errors, construction cost, delay, or professional liability. Where liability cannot lawfully be
excluded, it is limited to the greater of the fees you have paid for use of this site (which is
nothing) or USD 100.</p>

<p>Nothing in these terms excludes liability for death or personal injury caused by negligence, for
fraud, or for anything else that cannot lawfully be excluded. If you are a consumer in the European
Economic Area or the United Kingdom, your own country&rsquo;s consumer law may limit how far the
paragraph above can apply to you, and where it does, your law wins.</p>

<h2>5. Your work stays yours</h2>

<p>Networks you draw and numbers you enter are yours. They are stored in your browser and we
neither receive nor claim any right in them.</p>

<h2>6. Fair use of the site</h2>

<p>Use it for engineering work, study, or teaching. Do not attempt to break it, overload it, or use
it to harm others. We may withdraw access from anyone who does.</p>

<h2>7. Changes, and the governing law</h2>

<p>We may update these terms; the date at the top of this page says when we last did. These terms
are governed by the law of the State of Arizona, United States. If you are a consumer in the
European Economic Area or the United Kingdom, this does not deprive you of the protection of your
own country&rsquo;s mandatory consumer law.</p>

<p><em>These terms are written in English, and the English version is the one that governs.</em></p>

</div>
<?php
echoFooter("EngCalcs");
