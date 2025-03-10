<?php
require_once 'config.php';
$words = include_once '../word-engine/output/words.php';
include __DIR__ . '/points.php';

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

function calculateWordScore($word, $slot, $multiplier) {
  $points = LETTER_POINTS;
  $score = 0;

  for ($i = 0; $i < strlen($word); $i++) {
    $point = ($i == ($slot - 1)) ? $points[$word[$i]] * $multiplier : $points[$word[$i]];
    $score += $point;
  }

  return $score;
}

function findBestWord($letters, $words, $slot, $multiplier) {
  $result = [
    'success' => false, 'bestWord' => '', 'highScore' => 0
  ];

  for ($i = 1; $i <= count($letters); $i++) {
    $permutations = generatePermutations($letters, $i);
    foreach ($permutations as $word) {
      $lowercaseWord = strtolower($word);
      if (isset($words[$lowercaseWord])) {
        $score = calculateWordScore($word, $slot, $multiplier);
        if ($score > $result['highScore']) {
          $result['highScore'] = $score;
          $result['bestWord'] = $word;
        }
      }
    }
  }
  
  $result['success'] = true;
  return $result;
}

function generatePermutations($letters, $length) {
  $result = [];
  $permutations = permutations($letters, $length);
  foreach ($permutations as $perm) {
    $result[] = implode('', $perm);
  }
  return array_unique($result);
}

function permutations($array, $length) {
  if ($length === 1) {
    return array_map(fn($el) => [$el], $array);
  }

  $result = [];
  foreach ($array as $key => $value) {
    $remaining = $array;
    unset($remaining[$key]);
    foreach (permutations(array_values($remaining), $length - 1) as $perm) {
      array_unshift($perm, $value);
      $result[] = $perm;
    }
  }
  return $result;
}

// Ensure a valid word is found
$attempts = 0;
$maxAttempts = 10; // Prevent infinite loops

do {
  $letters = getRandomLetters();
  $boostSlot = rand(1, 7);
  $boostMultiplier = (rand(0, 1) == 0) ? 2 : 3;

  if (!isset($words) || !is_array($words)) {
    die("Error: Word list not found.");
  }

  $result = findBestWord($letters, $words, $boostSlot, $boostMultiplier);
  $attempts++;

} while ($result['success'] && strlen($result['bestWord']) < 3 && $attempts < $maxAttempts);

if ($result['success'] && strlen($result['bestWord']) >= 3) {
  $stmt = $pdo->prepare("INSERT INTO game_data (letters, boost_slot, boost_multiplier, high_score, best_word) VALUES (?, ?, ?, ?, ?)");
  $stmt->execute([implode('', $letters), $boostSlot, $boostMultiplier, $result['highScore'], $result['bestWord']]);

  try {
    $pdo->beginTransaction();
    $pdo->exec("DELETE FROM leaderboard");
    $pdo->exec("UPDATE users SET last_active = NULL, win = 0, beat_time = ''");
    $pdo->commit();
  } catch (PDOException $e) {
    $pdo->rollBack();
    echo "Error resetting game: " . $e->getMessage();
  }

  echo "Game data generated successfully!";
} else {
  echo "Failed to generate a valid word after multiple attempts.";
}

?>
