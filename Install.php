<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['install_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="install PWA offline app home screen engcalcs hydraulic calculators" />
';
echoHeader("EngCalcs", $html_title, $html_head, false);
?>
<h2><?=$ec_lang['install_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<p>EngCalcs works as a <strong>Progressive Web App (PWA)</strong>. Once installed, all calculators run fully offline — no internet connection needed.</p>

<h3>Android (Chrome)</h3>
<ol>
  <li>Open any calculator page in Chrome.</li>
  <li>Tap the <strong>⬇ Install</strong> button in the top navigation bar, <em>or</em> tap the browser menu (⋮) and choose <strong>Add to Home screen</strong>.</li>
  <li>Tap <strong>Install</strong> in the prompt that appears.</li>
  <li>EngCalcs appears on your home screen and works offline.</li>
</ol>
<p>
  <button class="btn btn-primary" onclick="EngCalcs.installPWA()" id="install-page-btn">⬇ Install Now</button>
  <span id="install-page-unavailable" style="display:none" class="text-muted small ms-2">Install prompt not available — use your browser menu instead.</span>
</p>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('install-page-btn');
  var msg = document.getElementById('install-page-unavailable');
  function checkPrompt() {
    if (!EngCalcs._deferredInstallPrompt) {
      btn.style.display = 'none';
      msg.style.display = '';
    }
  }
  // Give the beforeinstallprompt event a moment to fire before hiding
  setTimeout(checkPrompt, 500);
});
</script>

<h3>iOS (Safari)</h3>
<ol>
  <li>Open any calculator page in Safari.</li>
  <li>Tap the <strong>Share</strong> button (box with arrow pointing up).</li>
  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
  <li>Tap <strong>Add</strong>. EngCalcs appears on your home screen.</li>
</ol>
<p class="text-muted small">Note: On iOS, the PWA runs in Safari's engine. The install prompt does not appear automatically — use the Share menu as described above.</p>

<h3>Desktop (Chrome / Edge)</h3>
<ol>
  <li>Open any calculator page.</li>
  <li>Click the <strong>install icon</strong> (⊕ or computer icon) in the browser's address bar, or open the browser menu and choose <strong>Install EngCalcs…</strong></li>
  <li>Click <strong>Install</strong>. EngCalcs opens as a standalone app window.</li>
</ol>

<h3>Firefox / Other Browsers</h3>
<p>Firefox does not support PWA installation on desktop. Use the browser normally — all calculators still work fully in-browser, and the service worker caches pages for offline use after your first visit.</p>

<h3>What Gets Cached</h3>
<p>On first install, all 16 calculator pages and their assets (JavaScript, CSS, Bootstrap) are cached automatically. After that, everything works without a network connection. Language choice is preserved from your last online visit.</p>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
