<?php
require_once 'config.php';
require_once 'session.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

$result = [
  'success' => false,
  'message' => 'Something went wrong!'
];

// Update Start Time
if (isset($data['action']) && $data['action'] == 'updatePlayerStartTime') {
  try {
    $stmt = $pdo->prepare("UPDATE users SET last_active = NOW() WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id]);

    if ($stmt->rowCount() > 0) {
      $stmt = $pdo->prepare("SELECT last_active FROM users WHERE id = :user_id");
      $stmt->execute(['user_id' => $user_id]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      $result = [
        'success' => true,
        'message' => 'Player start time updated.',
        'start_time' => $user['last_active']
      ];
    } else {
      $result['message'] = 'No changes made. User not found or already up to date.';
    }
  } catch (PDOException $e) {
    $result['message'] = 'Database error: ' . $e->getMessage();
  }
}

// Update Win Status
if (isset($data['action']) && $data['action'] == 'updatePlayerWin') {
  $beatTime = $data['beatTime'];
  $score = $data['score'];

  try {
    // Update User table
    $stmt = $pdo->prepare("UPDATE users SET win = 1, beat_time = :beatTime WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id, 'beatTime' => $beatTime]);

    // Get User Data
    $stmt = $pdo->prepare("SELECT first_name, last_name FROM users WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
      $result['message'] = 'User Updated.';

      // Insert into Leaderboard
      $stmt = $pdo->prepare("INSERT INTO leaderboard (fullname, score, time_taken, date) VALUES (:fullname, :score, :timeTaken, NOW())");
      
      $stmt->execute([
        'fullname' => $user['first_name'] . ' ' . $user['last_name'],
        'score' => $score,
        'timeTaken' => $beatTime
      ]);

      if ($stmt->rowCount() > 0) {
        $result['message'] .= ' Leaderboard Updated.';
      } else {
        $result['message'] .= ' Failed to Update Leaderboard.';
      }

      $result['success'] = true;
    } else {
      $result['message'] = 'Failed to retrieve user data.';
    }

  } catch (PDOException $e) {
    $result['message'] = 'Database error: ' . $e->getMessage();
  }
}

echo json_encode($result);
?>
