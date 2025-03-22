<?php
require_once 'config.php';
require_once 'session.php';
include __DIR__ . '/points.php';

header('Content-Type: application/json');

$stmt = $pdo->prepare("SELECT * FROM game_data ORDER BY ID DESC LIMIT 1");
$stmt->execute();
$game = $stmt->fetch(PDO::FETCH_ASSOC);
$current_game_id = $game['id'];

$user = false;
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

if ($user_id) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Check if user hasn't played this game period yet
        if ($user['last_game'] != $current_game_id) {
            // Update total_played and last_game
            $updateStmt = $pdo->prepare("UPDATE users SET
                                        total_played = total_played + 1,
                                        last_game = :game_id
                                        WHERE id = :user_id");
            $updateStmt->execute([
                'game_id' => $current_game_id,
                'user_id' => $user_id
            ]);

            // Refresh user data after update
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :user_id");
            $stmt->execute(['user_id' => $user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
}

echo json_encode([
    "success" => true,
    "letters" => str_split($game["letters"]),
    "high_score" => $game["high_score"],
    "best_word" => $game["best_word"],
    "boost_slot" => $game["boost_slot"],
    "points" => LETTER_POINTS,
    "game_id" => $current_game_id,
    "started_at" => $game['created_at'],
    "user" => $user,
]);

?>