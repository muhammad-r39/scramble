<?php
require_once 'config.php';
require_once 'session.php';

// Get the JSON data from the frontend
$data = json_decode(file_get_contents("php://input"), true);
$result = ['success' => false, 'message' => 'Something went wrong!'];

if ($data['action'] == 'login') {
  $email = $data['email'];
  $password = $data['password'];
  $gameId = isset($data['gameId']) ? trim($data['gameId']) : 0;

  $guest = $data['guestPlayer'];
  $guestWin = isset($guest['playerWon']) ? $guest['playerWon'] : 0;
  $hintsUsed = isset($guest['hintsUsed']) ? $guest['hintsUsed'] : 0;

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

  if ($guestWin > 0 && isset($result['user'])) {
    $lastGame = $result['user']['last_game'];
    $currentStreak = $gameId === ($lastGame + 1) || $gameId === $lastGame ? $result['user']['current_streak'] : 0;
    $newStreak = $currentStreak + 1;
    $hintColumn = "hint_" . $hintsUsed;

    $stmt = $pdo->prepare("UPDATE users SET
                            win = 1,
                            last_hint = :hintsUsed,
                            $hintColumn = $hintColumn + 1,
                            total_played = total_played + 1,
                            total_win = total_win + 1,
                            current_streak = :new_streak,
                            max_streak = GREATEST(max_streak, :new_streak),
                            last_game = :last_game
                            WHERE id = :user_id");

    $stmt->bindParam(':hintsUsed', $hintsUsed, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $result['user']['id'], PDO::PARAM_INT);
    $stmt->bindParam(':new_streak', $newStreak, PDO::PARAM_INT);
    $stmt->bindParam(':last_game', $gameId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      $result['success'] = true;
      $result['message'] = 'Login successful and progress saved.';
    } else {
      $result['message'] = 'Login Success but Failed to Update User.';
    }
  }

}
echo json_encode($result);
?>
