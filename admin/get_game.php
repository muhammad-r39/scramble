<?php
require_once 'config.php';
require_once 'session.php';
include __DIR__ . '/points.php';

header('Content-Type: application/json');

$stmt = $pdo->prepare("SELECT * FROM game_data ORDER BY ID DESC LIMIT 1");
$stmt->execute();
$game = $stmt->fetch(PDO::FETCH_ASSOC);

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :user_id");
$stmt->execute(['user_id' => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("SELECT * FROM leaderboard ORDER BY time_taken ASC LIMIT 10");
$stmt->execute();
$leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "letters" => str_split($game["letters"]),
    "highScore" => $game["high_score"],
    "bestWord" => $game["best_word"],
    "boost" => ["slot" => $game["boost_slot"], "by" => $game["boost_multiplier"]],
    "points" => LETTER_POINTS,
    "started_at" => $game['created_at'],
    "user" => $user,
    "leaderboard" => $leaderboard
]);

?>