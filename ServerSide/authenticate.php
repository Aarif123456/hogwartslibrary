<?php //verify login

function validateUser($id){ //verify user did not fake authentication
    $SECRET_KEY= "5A7234753778214125442A472D4B614E645267556B58703273357638792F423F4528482B4D6251655368566D597133743677397A24432646294A404E635266556A576E5A7234753778214125442A472D4B6150645367566B59703273357638792F423F4528482B4D6251655468576D5A7134743677397A24432646294A404E635266556A586E327235753878214125442A472D4B6150645367566B597033733676397924423F4528482B4D6251655468576D5A7134743777217A25432A46294A404E635266556A586E3272357538782F413F4428472B4B6150645367566B5970337336763979244226452948404D6351655468576D5A7134743777217A25432A";
  $cookie = isset($_COOKIE['rememberme']) ? $_COOKIE['rememberme'] : '';
  if ($cookie) {
      list ($user, $token, $mac) = explode(':', $cookie); //get info from cookie
      if (!hash_equals(hash_hmac('sha256', $user . ':' . $token, $SECRET_KEY), $mac)) {
          return false;
      }
      $usertoken = $_SESSION['token']; //** Unsafe token storage
      if (hash_equals($usertoken, $token)) {
          return ($user==$id); //make sure it is the correct user
      }
  }
}
function  redirectToLogin(){
  destroy_session_and_data();
  header("Location: /login.html");
}

function validatelibrarian($id){
  $librarian = $_SESSION['librarian'];
  return (!validateUser($id ) || !$librarian);
}

function destroy_session_and_data(){
  $_SESSION = array();
  setcookie(session_name(), '', time() - 1, '/');
  session_destroy();
}
function rememberMe() {

   /* $stmt = $conn->prepare("SELECT * FROM userAccount WHERE userID = ?");
  $stmt->bind_param("s", $_SESSION['userID']);
  $stmt->execute();
  $result = $stmt->get_result();
  $row =$result->fetch_assoc();
  if($_SESSION['username']==$row['username'] && $_SESSION['password']==$row['password']){
    return true;
  }
  return false;*/
}
?>
