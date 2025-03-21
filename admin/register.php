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
  error_log(implode(', ', $guest));
  $guestWin = isset($guest['playerWon']) ? $guest['playerWon'] : 0;
  $hintsUsed = isset($guest['hintsUsed']) ? $guest['hintsUsed'] : 0;

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

  $hintColumn = "hint_" . $hintsUsed;

  // Insert the new user into the database
  $stmt = $pdo->prepare("INSERT INTO users (
                          first_name, last_name, email, password, created_at, win, last_hint,
                          total_played, total_win, current_streak, max_streak, $hintColumn)
                        VALUES (
                          :first_name, :last_name, :email, :password, NOW(), :win, :hintsUsed,
                          :total_played, :total_win, :current_streak, :max_streak, 1)");

  $stmt->bindParam(':first_name', $firstName);
  $stmt->bindParam(':last_name', $lastName);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':password', $hashedPassword);
  $stmt->bindParam(':win', $guestWin, PDO::PARAM_INT);
  $stmt->bindParam(':hintsUsed', $hintsUsed, PDO::PARAM_INT);

  $totalPlayed = 1;
  $totalWin = $guestWin ? 1 : 0;
  $currentStreak = $guestWin ? 1 : 0;
  $maxStreak = $guestWin ? 1 : 0;

  $stmt->bindParam(':total_played', $totalPlayed, PDO::PARAM_INT);
  $stmt->bindParam(':total_win', $totalWin, PDO::PARAM_INT);
  $stmt->bindParam(':current_streak', $currentStreak, PDO::PARAM_INT);
  $stmt->bindParam(':max_streak', $maxStreak, PDO::PARAM_INT);

  if ($stmt->execute()) {
    $result['success'] = true;
    $result['message'] = 'Registration successful.';
  } else {
    $result['message'] = 'Registration failed. Please try again later.';
  }
/*
  if ($guestWin > 0) {
    // Insert into Leaderboard
    $stmt = $pdo->prepare("INSERT INTO leaderboard (fullname, score, time_taken, date) VALUES (:fullname, :score, :timeTaken, NOW())");

    $stmt->execute([
      'fullname' => $firstName . ' ' . $lastName,
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
*/
}

echo json_encode($result);

?>