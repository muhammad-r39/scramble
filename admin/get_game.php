<?php
require_once 'config.php';
require_once 'session.php';

header('Content-Type: application/json');
/*
$stmt = $pdo->prepare("SELECT * FROM game_data WHERE date = CURDATE()");
$stmt->execute();
$game = $stmt->fetch(PDO::FETCH_ASSOC);
*/


$game["letters"] = "ACCOUNT";
$game["high_score"] = 17;
$game["boost_slot"] = 3;
$game["boost_multiplier"] = 3;
$game["start_time"] = time();

echo json_encode([
    "success" => true,
    "letters" => str_split($game["letters"]),
    "highScore" => $game["high_score"],
    "boost" => ["slot" => $game["boost_slot"], "by" => $game["boost_multiplier"]],
    "points" => ["A" => 1, "B" => 3, "C" => 3, "D" => 2, "E" => 1, "F" => 4,
        "G" => 2, "H" => 4, "I" => 1, "J" => 8, "K" => 5, "L" => 1,
        "M" => 3, "N" => 1, "O" => 1, "P" => 3, "Q" => 10, "R" => 1,
        "S" => 1, "T" => 1, "U" => 1, "V" => 4, "W" => 4, "X" => 8,
        "Y" => 4, "Z" => 10],
    "start_time" => $game["start_time"]
]);

?>