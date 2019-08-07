<?php
  header('Access-Control-Allow-Origin: *');

  require_once 'login.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if($conn->connect_error) {
    exit('Error connecting to database'); 
  }
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
  $conn->set_charset("utf8mb4");
  $arr=[];
  $result = $conn->query("SELECT memberID, fname, lname FROM members WHERE librarian = 0");
  if(!$result) {
    exit ("Unable to get member info. Query failed");
  }
  while($row = $result->fetch_object()) {
    $arr[] = $row;
  }
  if(!$arr) exit('No rows');
  
  echo json_encode($arr);
  $result->close();
  $conn->close();
?>

