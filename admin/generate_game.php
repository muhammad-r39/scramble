<?php
require_once 'config.php';
$words = include_once '../word-engine/output/words.php';

function getRandomLetters() {
    $vowels = ['A', 'E', 'I', 'O', 'U'];
    $consonants = array_diff(range('A', 'Z'), $vowels);

    $numVowels = rand(2, 3);
    $numConsonants = 7 - $numVowels;

    $letters = array_merge(
        array_rand(array_flip($vowels), $numVowels),
        array_rand(array_flip($consonants), $numConsonants)
    );

    shuffle($letters);
    return $letters;
}

function calculateWordScore($word, $boostSlot, $boostMultiplier) {
    $points = [
        'A' => 1, 'B' => 3, 'C' => 3, 'D' => 2, 'E' => 1, 'F' => 4, 'G' => 2, 'H' => 4, 'I' => 1, 'J' => 8, 'K' => 5, 
        'L' => 1, 'M' => 3, 'N' => 1, 'O' => 1, 'P' => 3, 'Q' => 10, 'R' => 1, 'S' => 1, 'T' => 1, 'U' => 1, 'V' => 4, 
        'W' => 4, 'X' => 8, 'Y' => 4, 'Z' => 10
    ];

    $score = 0;
    for ($i = 0; $i < strlen($word); $i++) {
        $score += $points[$word[$i]];
        if ($i == $boostSlot) {
            $score *= $boostMultiplier;
        }
    }

    return $score;
}

$letters = getRandomLetters();
$boostSlot = rand(0, 6);
$boostMultiplier = (rand(0, 1) == 0) ? 2 : 3;

$bestWord = '';
$highScore = 0;

if (!isset($words) || !is_array($words)) {
    die("Error: Word list not found.");
}
foreach ($words as $word) {
    $word = strtoupper($word); // Ensure all words are uppercase
    if (strlen($word) <= 7 && count(array_diff(str_split($word), $letters)) == 0) {
        $score = calculateWordScore($word, $boostSlot, $boostMultiplier);
        if ($score > $highScore) {
            $highScore = $score;
            $bestWord = $word;
        }
    }
}

$stmt = $pdo->prepare("INSERT INTO game_data (letters, boost_slot, boost_multiplier, high_score, best_word) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([implode('', $letters), $boostSlot, $boostMultiplier, $highScore, $bestWord]);

echo "Game data generated successfully!";
?>
