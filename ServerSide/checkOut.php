<?php //verify login
header('Access-Control-Allow-Origin: *'); //unsafe but just for now
session_start();
require_once 'login.php';
require_once 'authenticate.php';
$conn = new mysqli($hn, $un, $pw, $db);
if($conn->connect_error) {
  exit('Error connecting to database'); 
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
$conn->set_charset("utf8mb4");
if(isset($bookBarcode) && isset($borrowedBy) && !(empty($borrowedBy))){
  $bookBarcode = $_POST['bookBarcode'];
  $borrowedBy = $_POST['borrowedBy'];
}
else{
  echo "Missing value";
  destroy_session_and_data(); 
  //no longer trust this user because something has been tempered with
}

if (isset($_SESSION['userID'])  && isset($_SESSION['librarian'])
    && isset($_SESSION['token']))   
  {  
  if(validateLibrarian($_SESSION['userID'])){
    redirectToLogin();
  }
  $librarianID = $_SESSION['userID']; 
  echo "Welcome librarian:" + htmlentities($_SESSION['username']);  
  //Just in case something weird happens use html entities 
  if($librarianID == $borrowedBy){
    exit ("You can't sign out a book to your self!");
  }

  $verifyStmt = $conn->prepare("SELECT location, lostDate, FROM bookItem WHERE bookBarcode=?");
  $verifyStmt->bind_param("i", $bookBarcode);
  $verifyStmt->execute();
  $result = $verifyStmt->get_result();

  if(!$result){
    exit("Could not find book with barcode");
  }
  $result= $result->fetch_assoc();
  if(strcmp(trim($result['location']),"out")==0 || !(empty($result['lostDate']))) {
    //check f book has been taken out or if it has been reported as lost
     exit ("This book cannot signed out");
  }
  $transactionStmt = $conn->prepare("INSERT INTO transactions (bookBarcode, borrowedBy, issuerID) VALUES (?, ?, ?)");
  $transactionStmt->bind_param("iii", $bookBarcode, $borrowedBy , $librarianID);
  $transactionStmt->execute();
  echo "Book with barcode $bookBarcode has been issued to borrowedBy by the librarian $librarianID";
} 
else{
  redirectToLogin();//Send to login page
}
$conn->close(); 


?>
