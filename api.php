<?php
ini_set('display_errors', 1); error_reporting(E_ALL);

function getFavorites(user){
	$userList = getUsers();
	
}

function getUsers(){
	return $users = json.decode(file_get_contents("users.json"));
}

function registerUsers($username, $password){
	$userList = getUsers();

	$userExists = FALSE;
	foreach ($userList->users as $user){
		if($user->userName === username){
			$userExists = TRUE;
			break;
		}
	}

	if(!$userExists){
		$newUser = array(
			'userName' => $username,
			'password' => $password,
			'favorites' => array()
		);
		array_push($userList->users, $newUser);
		saveUsers($userList);
	}else{
		error();
	}
}	

function saveUsers($usersList) {
  $filename = 'users.json';
  $myfile = fopen($users_filename, 'w') or die("Unable to open file!");
  fwrite($file, json_encode($usersList));
  fclose($file);
}

function error() {
  $code = 400;
  $text = 'Bad Request';
  $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
  header($protocol . ' ' . $code . ' ' . $text);
  $GLOBALS['http_response_code'] = $code;
}

function handleReq(){
	  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['command'] === 'favorites') {
      $data = get_favorites($_GET['username'], $_GET['password']);
    } else {
      error();
    }
  } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['command'] === 'register') {
      $data = register_user($_POST['username'], $_POST['password']);
    } else if ($_POST['command'] === 'add_favorite') {
      $data = add_favorite($_POST['username'], $_POST['password'], $_POST['favorite']);
    } else if ($_POST['command'] === 'delete_favorite') {
      $data = add_favorite($_POST['username'], $_POST['password'], $_POST['favorite']);
    } else {
      error();
    }
  } else {
    error();
  }
  
  header('Content-Type: application/json');
  echo json_encode($data);	
}

handleReq();
?>
