<?php
require_once 'config.php';
require_once 'session.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

$result = [
  'success' => false,
  'message' => 'Something went wrong!'
];

// Ensure 'action' exists in the request data
if (isset($data['action']) && $data['action'] == 'updatePlayerStartTime') {
  try {
    $stmt = $pdo->prepare("UPDATE users SET last_active = NOW() WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id]);

    if ($stmt->rowCount() > 0) { // Check if update was successful
      $result = [
        'success' => true,
        'message' => 'Player start time updated.',
        'start_time' => date('Y-m-d H:i:s') // CURDATE() sets today's date
      ];
    } else {
      $result['message'] = 'No changes made. User not found or already up to date.';
    }
  } catch (PDOException $e) {
    $result['message'] = 'Database error: ' . $e->getMessage();
  }
}

echo json_encode($result);
?>
