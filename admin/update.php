<?php
require_once 'config.php';
require_once 'session.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

$result = [
  'success' => false,
  'message' => 'Something went wrong!'
];

// Update Hint Use
if (isset($data['action']) && $data['action'] == 'updatePlayerHintUse') {
  try {
    $stmt = $pdo->prepare("UPDATE users SET last_hint = last_hint + 1 WHERE id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $result['success'] = true;
    $result['message'] = 'Hints updated.';
  } catch (PDOException $e) {
    $result['message'] = "Error updating hint usage: " . $e->getMessage();
  }
}

// Update Win Status
if (isset($data['action']) && $data['action'] == 'updatePlayerWin') {
  try {
    // Get current hint count for this user
    $stmt = $pdo->prepare("SELECT last_hint FROM users WHERE id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
      throw new Exception("User not found");
    }

    $hintsUsed = $userData['last_hint'];
    $currentStreak = $userData['current_streak'];
    $newStreak = $currentStreak + 1;
    $hintColumn = "hint_" . $hintsUsed;

    // Update user stats using prepared statement
    $stmt = $pdo->prepare("UPDATE users
                SET
                win = 1,
                total_win = total_win + 1,
                $hintColumn = $hintColumn + 1,
                current_streak = :new_streak,
                max_streak = GREATEST(max_streak, :new_streak)
                WHERE id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':new_streak', $newStreak, PDO::PARAM_INT);
    $stmt->execute();

    $result['success'] = true;
    $result['message'] = 'Player status updated.';
  } catch (Exception $e) {
    $result['message'] = "Error updating win status: " . $e->getMessage();
  }
}
echo json_encode($result);
?>
