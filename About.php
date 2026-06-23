<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['about_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="open source hydraulic calculators humanitarian mission contribute GPL" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['about_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<h3>Mission</h3>
<p>HawsEDC Engineering Calculators exist to serve engineers and field workers around the world —
   especially those working in water-scarce, low-resource, or underserved regions.
   These tools are part of a broader humanitarian mission: to tell every human being in the most
   practical and effective way possible that they are loved and cherished forever, that they have
   nothing to fear, and that they are not going to ruin everything.</p>
<p>The calculators are the vehicle. The destination is a world free of suffering.</p>

<h3>Open Source License</h3>
<p>All code is released under the
   <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a>
   — free as in freedom. You may use, study, modify, and redistribute the code under the same terms.</p>
<p>Copyright &copy; 2009&ndash;2026 Thomas Gail Haws.</p>

<h3>Source Code</h3>
<p>The full source code is publicly available on Bitbucket:</p>
<p><a target="_blank" href="https://bitbucket.org/hawstom/engcalcs">bitbucket.org/hawstom/engcalcs</a></p>
<p>You can browse the code, file issues, or fork the repository there.</p>

<h3>Contributing</h3>
<p>Pull requests are welcome. Ways to contribute:</p>
<ul>
    <li><strong>Translations</strong> — improve or add a language. Open a pull request with changes to
        the relevant <code>lib/lang.ec.??.php</code> file.</li>
    <li><strong>Bug reports</strong> — use the feedback form on any calculator page, or file an issue on Bitbucket.</li>
    <li><strong>New calculators</strong> — ideas for hydraulic engineering tools that serve field workers and irrigation
        practitioners are especially welcome. See the <code>CLAUDE.md</code> developer guide in the repository.</li>
    <li><strong>Hosting</strong> — if you can mirror these calculators for a region with limited connectivity,
        please get in touch.</li>
</ul>

<h3>Offline Downloads</h3>
<p>You can save any calculator to your local device using your browser's "Save as&hellip;" menu.</p>
<p>An offline ZIP download is not yet available, but is planned — intended for engineers and field workers
   in areas with limited or expensive internet access. The goal is a self-contained bundle that runs
   from a local drive or USB stick with no server required.</p>
<p>If you have ideas or can help implement this, please contribute via the repository or the feedback form.</p>

<h3>Progressive Web App (PWA)</h3>
<p>These calculators are not yet a Progressive Web App, but PWA support is on the roadmap.
   The goal is to allow engineers to install the calculators on a phone or tablet and use them
   offline in the field — particularly valuable in low-connectivity regions.</p>

<h3>Contact</h3>
<p>Tom Haws — hydraulic engineer and author of these calculators.<br />
   Use the feedback form on any calculator page, or reach the source code at
   <a target="_blank" href="https://bitbucket.org/hawstom/engcalcs">Bitbucket</a>.</p>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
