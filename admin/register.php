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
  $gameId = isset($data['gameId']) ? trim($data['gameId']) : 0;

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
                          first_name, last_name, email, password, created_at, win, last_hint, $hintColumn,
                          total_played, total_win, current_streak, max_streak, last_game)
                        VALUES (
                          :first_name, :last_name, :email, :password, NOW(), :win, :hintsUsed, 1,
                          :total_played, :total_win, :current_streak, :max_streak, :last_game)");

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
  $stmt->bindParam(':last_game', $gameId, PDO::PARAM_INT);

  if ($stmt->execute()) {
    $result['success'] = true;
    $result['message'] = 'Registration successful.';
  } else {
    $result['message'] = 'Registration failed. Please try again later.';
  }

}

echo json_encode($result);

?>