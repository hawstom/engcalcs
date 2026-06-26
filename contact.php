<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['contact_main_menu'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="open source hydraulic calculators humanitarian mission contribute GPL" />
';
echoHeader("Normal", $html_title, $html_head, false);
?>
<p>Tom Haws, Professional Engineer (Civil)<br />
859 N Lafayette<br />
Mesa, AZ  85201<br />
Phone: 480-389-4583 (Google voice)<br />
<br />

<br />

<h3><?php echo $ec_lang['contactSendMessage'];?></h3>

<p>I created this form around 2013. As of 2025, I am still replying promptly. :-)</p>

<div>
<form class="blue"
  action="formmail.php"
  method="POST">
  <p><?php echo $ec_lang['contactYourName'];?><br>
    <input
      type="text"
      size="35"
      name="name"
    />
  </p>
  <p><?php echo $ec_lang['contactYourEmail'];?><br>
    <input
      type="text"
      size="35"
      name="email"
    />
  </p>
  <p><?php echo $ec_lang['contactSubject'];?><br>
    <input
      type="text"
      size="35"
      name="subject"
    >
  </p>
  <p><?php echo $ec_lang['contact_message'];?><br>
     <textarea name="message" rows="12" cols="50"></textarea>
  </p>
  <p><?php echo $ec_lang['contactSpamPrefix'];?> <input type="text" size="4" name="test" /> <?php echo $ec_lang['contactSpamPostfix'];?>
  </p>
  <p>
    <input
      type="submit"
      value="<?php echo $ec_lang['contactSubmitButton'];?>"
    >
    <input
      type="hidden"
      name="success"
      value="formmailsuccess.php"
    >
    <input
      type="hidden"
      name="more_message"
      value="\n---\nIf this message is in Turkish, forward it to Mustafa Özbay <m.ozbay21@gmail.com>"
    >
  </p>
</form>

</div>

<?php
echoFooter("main");
?>