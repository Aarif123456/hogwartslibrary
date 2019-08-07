<?php //verify login
  header('Access-Control-Allow-Origin: *'); //unsafe but just for now
  session_start();
  ob_start();
  require_once 'login.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if($conn->connect_error) {
    exit('Error connecting to database'); 
  }
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); //Allow error handling instead of exception handling
  $conn->set_charset("utf8mb4");

  if (isset($_POST['username'])   && !(empty($_POST['username'])) &&
    isset($_POST['userType'])   && !(empty($_POST['userType']))){ 
    $stmt = $conn->prepare("SELECT userID,password FROM userAccount WHERE userName = ?");
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row =$result->fetch_assoc();
    if($result->num_rows === 0){
      echo 'Username not taken';
    }
    elseif(isset($_POST['password'])   && !(empty($_POST['password']))){
      //compare password to database
      if (password_verify($_POST['password'], $row['password'])) {
        session_regenerate_id();
        if(strcmp(trim($_POST['userType']),"librarian")==0) {  //determine if user is a librarian 
          $id = (int)($row['userID']);
          $result1 = $conn->query("SELECT librarian FROM members WHERE memberID = $id");
          if(!$result1) {
            exit ("Unable to get member info. Query failed");
          }
          $row1 =$result1->fetch_assoc();
          if($row1['librarian'] == 0){
            exit( 'User is not a librarian');
          }
          $_SESSION['librarian'] = true;
        }
        else{
          $_SESSION['librarian'] = false;
        }
        storeInfo($row['userID'],$_POST['username']);
        echo 'Password is valid!'; 
        //header('Location:dashboard.html'); //go to dashboard if login succesful 
      } 
      else {
        echo 'Invalid password.';
      }
    }else{ //password not set means that user was just trying to verify the username
      echo 'Username is taken';
    } 
  } 
  else{
    echo 'Missing value';
  }
  $conn->close(); 
function storeInfo($userID,$username){
  $SECRET_KEY= "5A7234753778214125442A472D4B614E645267556B58703273357638792F423F4528482B4D6251655368566D597133743677397A24432646294A404E635266556A576E5A7234753778214125442A472D4B6150645367566B59703273357638792F423F4528482B4D6251655468576D5A7134743677397A24432646294A404E635266556A586E327235753878214125442A472D4B6150645367566B597033733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46294A404E635266556A586E3272357538782F413F4428472B4B6150645367566B5970337336763979244226452948404D6351655468576D5A7134743777217A25432A"; //**not the best way to use secret key 
  $token = random_bytes(128);
  $_SESSION['token'] = $token; //** unsafe to use session to store to token 
  //doing it temporarily 
  $cookie = $userID . ':' . $token;
  $mac = hash_hmac('sha256', $cookie, $SECRET_KEY); 
  $cookie .= ':' . $mac;
  setcookie('rememberme', $cookie);
  $_SESSION['userID'] = $userID ;
  $_SESSION['username'] = $username;
  ob_end_flush();
}
?>
