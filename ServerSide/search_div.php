<?php
  require_once 'login.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if($conn->connect_error) {
    exit('Error connecting to database'); 
  }
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
  $conn->set_charset("utf8mb4");

  $arr[] =[];
  if (isset($_GET['searchType'])   && !(empty($_GET['searchType'])) &&
    isset($_GET['searchWord']))
  {
    $query = "SELECT bookISBN, bookName, author, pages, edition, status, category, holds FROM books WHERE "; //start of all query
    if(strcmp($_GET['searchType'],'keyword')==0){ 
      //separate keyword because it uses multiple parameter
      $query .= "bookISBN like CONCAT('%',?,'%') OR ";
      $query .= "bookName like CONCAT('%',?,'%') OR ";
      $query .= "author like CONCAT('%',?,'%') OR ";
      $query .= "pages like CONCAT('%',?,'%') OR ";
      $query .= "edition like CONCAT('%',?,'%') OR ";
      $query .= "category like CONCAT('%',?,'%')";
      $stmt= $conn->prepare($query);
      $term = $_GET['searchWord'];
      $stmt->bind_param("ssssss",$term,$term,$term,$term,$term,$term);
    }
    else{ //block handles all query with one parameter 
      if(strcmp($_GET['searchType'],'title')==0){ //if searching with tile
        $query .= "bookName like CONCAT('%',?,'%')";
      }
      elseif(strcmp($_GET['searchType'],'author')==0){
        $query .= "author like CONCAT('%',?,'%')";
      }
      elseif(strcmp($_GET['searchType'],'ISBN')==0){
        $query .= "bookISBN like CONCAT('%',?,'%')";
      }  
      else{
        exit('Invalid search method');
      }
      $stmt= $conn->prepare($query);
      $stmt->bind_param("s", $_GET['searchWord']);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    while($row = $result->fetch_object()) {
      $arr[] = $row;
    }
    if(!$arr) exit('No rows');
  }
  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>

