<?php
require_once('lib/base.inc.php');
require_once(__DIR__ . '/lib/ContactMail.lib.php');
$html_title = $ec_lang['contact_main_menu'];
echoHeader("EngCalcs", $html_title, "", false);
// Task 206: this page has no calculator form, so nothing else names it for the human-view beacon.
echoPageNameScript();
?>
<?php // THE INVITATION ITSELF, now that the page it used to sit on no longer carries it (Tom,
      // 2026-08-14: "I can put the Help Wanted string on the Contact Page?"). Looped-Network.php is
      // the one calculator that does not call echoFeedback() -- vertical room is the product on a
      // full-window map editor -- and its Help > Fix something row brings people here instead.
      //
      // Reuses template_feedback rather than a new key: it is already written, already translated
      // into 26 languages, and already says exactly this. What changes is only WHO reads it. On a
      // calculator page it was an invitation to somebody who had not decided to write; here it is
      // the first thing read by somebody who already has, so it works as an opening line telling
      // them what is worth sending -- including the "better wording" ask, which is the one report
      // only a non-English reader can file.
      //
      // NOT a link, unlike every other place this string appears: linking to contact.php from
      // contact.php is a link to here. ?>
<p><?=$ec_lang['template_feedback']?></p>

<p>Tom Haws, Professional Engineer (Civil)<br />
859 N Lafayette<br />
Mesa, AZ  85201<br />
<br />
</p>

<br />

<h3><?php echo $ec_lang['contactSendMessage'];?></h3>

<p>I created this form around 2013. Many years later, I still reply to it myself, usually
within a few days.</p>

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
  <p><?php echo $ec_lang['contactYourEmailOptional'];?><br>
    <input
      type="text"
      size="35"
      name="email"
    />
  </p>
<?php // WHAT IS THIS ABOUT (Ida, 2026-10-05). Values are fixed slugs; ?cat= preselects one (the
      // error link on the map sends cat=wrong), anything else leaves "Other". ?>
<?php $ecCat = ecContactCategory(isset($_GET['cat']) ? $_GET['cat'] : '');
      if ($ecCat === '') { $ecCat = 'other'; }
      $ecCatKeys = array('wrong' => 'contactCategoryWrong', 'wording' => 'contactCategoryWording',
                         'idea' => 'contactCategoryIdea', 'other' => 'contactCategoryOther'); ?>
  <p><label for="ec_contact_category"><?php echo $ec_lang['contactCategory'];?></label><br>
    <select id="ec_contact_category" name="category">
<?php foreach ($ecCatKeys as $v => $k) : ?>
      <option value="<?=$v?>"<?=$v === $ecCat ? ' selected' : ''?>><?=htmlspecialchars($ec_lang[$k])?></option>
<?php endforeach; ?>
    </select>
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
  <!-- <p><?php echo $ec_lang['contactSpamPrefix'];?> <input type="text" size="4" name="test" /> <?php echo $ec_lang['contactSpamPostfix'];?>
  </p>  -->
  <p>
    <input
      type="submit"
      value="<?php echo htmlspecialchars($ec_lang['contactSubmitButton']);?>"
    >
    <input
      type="hidden"
      name="more_message"
      value="\n---\nIf this message needs translation, use AI."
    >
<?php // Carries the calculator the invitation was clicked on into the e-mail formmail.php sends.
      // Emitted only when ?from= is present and looks like a page basename; a sender who arrived
      // by the menu or by typing the URL posts nothing and the e-mail says "not recorded", which
      // is the honest answer. formmail.php checks the value against the real page list again --
      // this is a convenience for the reader, never a trusted input. ?>
<?php $ecFrom = isset($_GET['from']) && is_string($_GET['from']) ? $_GET['from'] : '';
      if ($ecFrom !== '' && preg_match('/^[A-Za-z0-9._-]{1,64}$/', $ecFrom)) : ?>
    <input type="hidden" name="origin" value="<?=htmlspecialchars($ecFrom, ENT_QUOTES, 'UTF-8')?>">
<?php endif;
      // The context the "Tell us more" link on the map carries: the language and an error code, both
      // slugs. Shown to the sender in words so nothing is attached silently. Never anything from a drawing.
      $ecCode = ecContactSlug(isset($_GET['code']) ? $_GET['code'] : '');
      $ecLang = preg_replace('/[^A-Za-z-]/', '', substr(isset($_GET['lang']) && is_string($_GET['lang']) ? $_GET['lang'] : '', 0, 12));
      if ($ecCode !== '') : ?>
    <input type="hidden" name="code" value="<?=htmlspecialchars($ecCode, ENT_QUOTES, 'UTF-8')?>">
<?php endif;
      if ($ecLang !== '') : ?>
    <input type="hidden" name="ctxlang" value="<?=htmlspecialchars($ecLang, ENT_QUOTES, 'UTF-8')?>">
<?php endif; ?>
  </p>
<?php if ($ecFrom !== '' || $ecCode !== '' || $ecLang !== '') : ?>
  <p class="ec-note"><?=htmlspecialchars($ec_lang['contactContextNote'])?></p>
<?php endif; ?>
</form>

</div>

<?php
echoFooter("main");
?>