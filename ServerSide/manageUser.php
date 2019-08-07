<?php //manage user
  header('Access-Control-Allow-Origin: *'); //unsafe but just for now
  /*
  $http_origin = $_SERVER['HTTP_ORIGIN'];

  $allowed_domains = array(
    'http://domain1.com',
    'http://domain2.com',
  );

  if (in_array($http_origin, $allowed_domains))
  {  
      header("Access-Control-Allow-Origin: $http_origin");
  }*/
  require_once 'login.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if($conn->connect_error) {
    exit('Error connecting to database'); //Should be a message a typical user could understand in production
  }
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
  $conn->set_charset("utf8mb4");

  if (isset($_POST['fname'])   && !(empty($_POST['fname'])) &&
      isset($_POST['lname'])    && !(empty($_POST['lname'])) &&
      isset($_POST['username'])   && !(empty($_POST['username'])) &&
      isset($_POST['password'])   && !(empty($_POST['password'])) &&
      isset($_POST['userCategory'])   && !(empty($_POST['userCategory'])) &&
      isset($_POST['userType'])   && !(empty($_POST['userType'])) &&
      isset($_POST['add']))
  {
   
   try{ //prepare and insert to avoid injection
    $conn->autocommit(FALSE); //turn on transactions
    //store user info
    $stmt = $conn->prepare("INSERT INTO members (fname, lname,userType) VALUES (?, ?, ?)");
    //important to make sure there is no white space in userType because it will be used to compare
    $stmt->bind_param("sss", $_POST['fname'],$_POST['lname'],$_POST['userType']);
    $stmt->execute();
    $id = $conn->insert_id;
    $stmt->close();
    //Insert user account info
    $stmt = $conn->prepare("INSERT INTO userAccount (userID, userName,password) VALUES (?, ?, ?)");
    $password = password_hash($_POST['password'],PASSWORD_DEFAULT); //hash password and store
    //password_verify will make sure it is correct without having to store it
    $stmt->bind_param("iss", $id, $_POST['username'], $password);
    $stmt->execute();
    $stmt->close();
    echo "User id is $id <br>";    
    if((strcmp(trim($_POST['userType']),"student")==0)&& (isset($_POST['house'])   && !(empty($_POST['house'])))) {
      $stmt = $conn->prepare("INSERT INTO students (studentID,major, house) VALUES (?, ?, ?)");
      $stmt->bind_param("iss",$id, $_POST['userCategory'],$_POST['house']);
      $stmt->execute();
      $stmt->close();
      echo "Student added<br>";
    }
    else{
      $stmt = $conn->prepare("INSERT INTO professor (professorID,department) VALUES (?, ?)");
      $stmt->bind_param("is",$id, $_POST['userCategory']);
      $stmt->execute();
      $stmt->close();
      echo "professor added<br>";
    }

    $conn->autocommit(TRUE);
   }catch(Exception $e) {
    $conn->rollback(); //remove all queries from queue if error (undo)
    echo "something went wrong:(";
   }
  }
  elseif (isset($_POST['add'])) {
    echo "Missing a value somewhere<br>";
  }

  $conn->close();
  

?>
