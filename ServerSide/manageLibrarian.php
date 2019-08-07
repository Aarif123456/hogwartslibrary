<?php //manage Librarian
  header('Access-Control-Allow-Origin: *'); //unsafe but just for now
  require_once 'login.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if($conn->connect_error) {
    exit('Error connecting to database'); //Should be a message a typical user could understand in production
  }
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
  $conn->set_charset("utf8mb4");

  if (isset($_POST['userID'])   && !(empty($_POST['userID'])) &&
      isset($_POST['active'])  &&  isset($_POST['add']))
  {
   
   try{ //prepare and insert to avoid injection
    $conn->autocommit(FALSE); 
    //Insert user account info
    $stmt = $conn->prepare("INSERT INTO librarianAccount (librarianID, active) VALUES (?, ?)");
    $id = (is_numeric($_POST['userID']) ? (int)$_POST['userID'] : -1);
    if($id==-1){
      exit( "Invalid user ID");
    }
    $active = (is_numeric($_POST['active']) ? (int)$_POST['active'] : 1);
    $stmt->bind_param("ii", $id , $active);
    $stmt->execute();
    echo "Librarian created with id: $id";
  //And update members table to show that member is now a librarian - done with SQL database

    $stmt->close();
    $conn->autocommit(TRUE);

   }catch(Exception $e) {
    $conn->rollback(); //remove all queries from queue if error (undo)
    exit( "something went wrong:(");
   }
  }
  elseif (isset($_POST['add'])) {
    exit("Missing a value somewhere!");
  }

  $conn->close();
  

?>
