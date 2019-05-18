<?php
if(isset($_POST['email'])) {

    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "jiri.musil06@seznam.cz";
    $email_subject = "Zpráva z blockchainové stránky";

    function died($error) {
        // your error code can go here
        echo "Omlouváme se, ale ve formuláři se vyskytuje chyba. ";
        echo "Níže najdete to, co se je neplatné.<br /><br />";
        echo $error."<br /><br />";
        echo "Prosím vraťte se a chybu napravte.<br /><br />";
        die();
    }

    // validation expected data exists
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['message'])) {
        died('Omlouváme se, ale objevil se problém se zpracováním formuláře.');
    }

    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required
    $message = $_POST['message']; // required

    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'Vámi zadaná emailová adresa není platná.<br />';
  }

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$name)) {
    $error_message .= 'Jméno, které jste zadali, není platné.<br />';
  }

  if(strlen($message) < 2) {
    $error_message .= 'Zpráva, kterou jste zadani, není platná.<br />';
  }

  if(strlen($error_message) > 0) {
    died($error_message);
  }

    $email_message = "Detaily formuláře níže.\n\n";

    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }

    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "message: ".clean_string($message)."\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);
?>

<!-- include your own success html here -->
Děkujeme za kontaktování. Ozveme se Vám co nejdříve.

<?php

}
?>
