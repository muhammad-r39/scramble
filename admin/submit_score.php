<?php
require_once 'config.php';
require_once 'session.php';

$username = $_POST['username'];
$timeTaken = $_POST['time_taken']; // Time in seconds

$sql = "SELECT high_score FROM game_data WHERE date = CURDATE()";
$highScore = $conn->query($sql)->fetch_assoc()['high_score'];

// Insert player result
$sql = "INSERT INTO leaderboard (username, score, time_taken, date)
        VALUES (?, ?, ?, CURDATE())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sdi", $username, $highScore, $timeTaken);
$stmt->execute();

// Get top 10 players
$result = $conn->query("SELECT username, time_taken FROM leaderboard WHERE date = CURDATE() ORDER BY time_taken ASC LIMIT 10");
$topPlayers = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(["topPlayers" => $topPlayers]);
