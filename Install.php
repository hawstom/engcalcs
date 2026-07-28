<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['install_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
';
echoHeader("EngCalcs", $html_title, $html_head, false);
?>
<h2><?=$ec_lang['install_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<p><?=$ec_lang['install_intro']?></p>

<h3><?=$ec_lang['install_android_heading']?></h3>
<ol>
<?=$ec_lang['install_android_steps_html']?>
</ol>
<p>
  <button class="btn btn-primary" onclick="EngCalcs.installPWA()" id="install-page-btn"><?=$ec_lang['install_now_btn']?></button>
  <span id="install-page-unavailable" style="display:none" class="text-muted small ms-2"><?=$ec_lang['install_prompt_unavailable']?></span>
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

<h3><?=$ec_lang['install_ios_heading']?></h3>
<ol>
<?=$ec_lang['install_ios_steps_html']?>
</ol>
<p class="text-muted small"><?=$ec_lang['install_ios_note']?></p>

<h3><?=$ec_lang['install_desktop_heading']?></h3>
<ol>
<?=$ec_lang['install_desktop_steps_html']?>
</ol>

<h3><?=$ec_lang['install_firefox_heading']?></h3>
<p><?=$ec_lang['install_firefox_body']?></p>

<h3><?=$ec_lang['install_cached_heading']?></h3>
<p><?=$ec_lang['install_cached_body']?></p>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
