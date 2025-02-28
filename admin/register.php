<?php
require_once 'config.php';
require_once 'session.php';

$data = json_decode(file_get_contents("php://input"), true);
$result = ['success' => false, 'message' => 'Something went wrong!'];

if ($data['action'] == 'register') {
  $firstName = trim($data['firstName']);
  $lastName = trim($data['lastName']);
  $email = trim($data['email']);
  $password = trim($data['password']);

  $guest = $data['guestPlayer'];
  $guestStartedAt = isset($guest['playerStartedAt']) ? $guest['playerStartedAt'] : NULL;
  $guestWin = isset($guest['playerWon']) ? $guest['playerWon'] : 0;
  $guestScore = isset($guest['playerScore']) ? $guest['playerScore'] : 0;
  $guestBeatTime = isset($guest['playerBeatTime']) ? $guest['playerBeatTime'] : '';

  // Validate input
  if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
      echo json_encode(['success' => false, 'message' => 'All fields are required.']);
      exit;
  }

  // Check if the email already exists
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
  $stmt->bindParam(':email', $email);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
      echo json_encode(['success' => false, 'message' => 'Email is already registered.']);
      exit;
  }

  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Insert the new user into the database
  $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password, created_at, last_active, win, beat_time)
                          VALUES (:first_name, :last_name, :email, :password, NOW(), :last_active, :win, :beat_time)");
  $stmt->bindParam(':first_name', $firstName);
  $stmt->bindParam(':last_name', $lastName);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':password', $hashedPassword);
  $stmt->bindParam(':last_active', $guestStartedAt);
  $stmt->bindParam(':win', $guestWin, PDO::PARAM_INT);
  $stmt->bindParam(':beat_time', $guestBeatTime);

  if ($stmt->execute()) {
    $result['success'] = true;
    $result['message'] = 'Registration successful.';
  } else {
    $result['message'] = 'Registration failed. Please try again later.';
  }

  if ($guestWin > 0) {
    // Insert into Leaderboard
    $stmt = $pdo->prepare("INSERT INTO leaderboard (fullname, score, time_taken, date) VALUES (:fullname, :score, :timeTaken, NOW())");

    $stmt->execute([
      'fullname' => $firstName . ' ' . $lastName,
      'score' => $guestScore,
      'timeTaken' => $guestBeatTime
    ]);
    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($res) {
      $result['success'] = true;
      $result['message'] = 'Leaderboard Updated.';
    } else {
      $result['message'] = 'Failed to Update Leaderboard.';
    }
  }
}
echo json_encode($result);
?>
