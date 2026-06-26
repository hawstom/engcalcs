<?php
//
// Copyright 2006 by Thomas Gail Haws
// Licensed to the public under the terms of version 2 of
// the GNU General Public License
// This is Free Libre Open Source Software.
// You can't modify then distribute without source. 
// You have to keep it open source.
// Version 1.01 Moved error messages above post variables
// Version 1.02 Added anti-spammer field validation
//
// Call this file with an html form that provides with a POST method
// the following variables:
// test=a spam test string
// name=the user's name
// email=the user's email address
// subject
// message
// success=success file URL
//
// Modify the spam test string, to address, and success file name below.
$testanswer='six';
$to = 'tom.haws@gmail.com';

// We define the error messages below.
$errnoto = 'No To: address provided!  Can\'t send mail to nobody.';
$errsendfailed = 'The PHP mail() function failed for an unknown reason.';
$errspam='Sorry, you need to enter '.$testanswer.' in the last box.';

// We read the POST variables below.

// Get the spam test or abort.
$test = $_POST['test'];
if (strtoupper($test) !== strtoupper($testanswer)) die($errspam);

// Get the commentor's name
if (preg_match("/(\r|\n)/", $_POST['name']) or preg_match("/@/",$_POST['name'])) {
  die("Are you trying to spam this form?  Please don't do that.");
} else {
  $name = $_POST['name'];
}

// Get the commentor's e-mail address
if (preg_match("/(\r|\n)/", $_POST['email']) or !preg_match("/^[a-z0-9]+([_\\.-][a-z0-9]+)*" ."@"."([a-z0-9]+([\.-][a-z0-9]+)*)+"."\\.[a-z]{2,}"."$/",$_POST['email'])) {
  die("Invalid e-mail address.");
} else {
  $email = $_POST['email'];
}

// Get the Subject: header.
if (preg_match("/(\r|\n)/", $_POST['subject']) or preg_match("/@/",$_POST['subject'])) {
  die("Get out, spammer.");
} else {
  $subject = $_POST['subject'];
}


// Get the message
$message = $_POST['message'].$_POST['more_message'];

// Get the success file name
$successfile=$_POST['success'];

// Put commentor's e-mail address in Reply-to: or else omit the Reply-to:
if  ($email !== "") {
 $replyto = 'Reply-to: '.$name.' <'.$email.'>';
} else {
$replyto = '';
}

// Make the From: header
// Use the commentor's e-mail.
$from = 'From: HawsEDC Support <support@hawsedc.com>';

// Assemble the From and Reply-to into additional headers for the
// PHP mail() function.
$moreheaders = $from."\r\n".$replyto;

// Send the message. If send was successful, show the success page.
if (mail($to, $subject, $message, $moreheaders)) {
  // Get the success file or provide a default message
  if (file_exists($successfile)){
    // Redirect to it.
    ?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
    <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Sending mail</title>
    <meta http-equiv="REFRESH" content="0;url=<?=$successfile?>"></HEAD>
    <BODY>
    </BODY>
    </HTML>
    <?
  } else {
    // Show this default success message.
    echo "<p>Thank you for your message</p>\n<p>Name: $name</p>\n<p>Email: $email</p>\n<p>Subject: $subject</p>\n<p>Message: $message</p>";
  }

// Otherwise show a send failure message.
} else {
  echo $errsendfailed;
}
?>