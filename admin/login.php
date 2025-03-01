<?php
require_once 'config.php';
require_once 'session.php';

// Get the JSON data from the frontend
$data = json_decode(file_get_contents("php://input"), true);
$result = ['success' => false, 'message' => 'Something went wrong!'];

if ($data['action'] == 'login') {
  $email = $data['email'];
  $password = $data['password'];

  $guest = $data['guestPlayer'];
  $guestStartedAt = isset($guest['playerStartedAt']) ? $guest['playerStartedAt'] : NULL;
  $guestWin = isset($guest['playerWon']) ? $guest['playerWon'] : 0;
  $guestScore = isset($guest['playerScore']) ? $guest['playerScore'] : 0;
  $guestBeatTime = isset($guest['playerBeatTime']) ? $guest['playerBeatTime'] : '';

  // Validate email and password
  if (empty($email) || empty($password)) {
      echo json_encode(['success' => false, 'message' => 'Please fill in both fields.']);
      exit;
  }

  // Prepare and execute SQL query to check user
  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
  $stmt->bindParam(':email', $email);
  $stmt->execute();

  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    // Successful login
    $_SESSION['user_id'] = $user['id'];

    $result['success'] = true;
    $result['message'] = 'Login successful.';
    $result['user'] = $user;
  } else {
    // Invalid credentials
    $result['message'] = 'Invalid email or password.';
  }

  if ($guestStartedAt && isset($result['user'])) {
    // Update User table
    $stmt = $pdo->prepare("UPDATE users SET last_active = :last_active WHERE id = :user_id");
    $stmt->execute(['user_id' => $result['user']['id'], 'last_active' => $guestStartedAt]);

    if ($stmt->rowCount() > 0) {
      $result['success'] = true;
      $result['message'] = 'Login successful.';
    } else {
      $result['message'] = 'Failed to Update User.';
    }
  }

  if ($guestWin > 0 && isset($result['user'])) {
    $stmt = $pdo->prepare("UPDATE users SET win = 1 WHERE id = :user_id");
    $stmt->execute(['user_id' => $result['user']['id']]);
    if ($stmt->rowCount() > 0) {
      $result['success'] = true;
      $result['message'] = 'Login successful.';
    } else {
      $result['message'] = 'Failed to Update User.';
    }

    // Insert into Leaderboard
    $stmt = $pdo->prepare("INSERT INTO leaderboard (fullname, score, time_taken, date) VALUES (:fullname, :score, :timeTaken, NOW())");

    $stmt->execute([
      'fullname' => $result['user']['first_name'] . ' ' . $result['user']['last_name'],
      'score' => $guestScore,
      'timeTaken' => $guestBeatTime
    ]);

    if ($stmt->rowCount() > 0) {
      $result['success'] = true;
      $result['message'] = 'Leaderboard Updated.';
    } else {
      $result['message'] = 'Failed to Update Leaderboard.';
    }
  }

}
echo json_encode($result);
?>
