<?php
$wordFiles = [
  'src/english-words.10.txt',
  'src/english-words.20.txt',
  'src/english-words.35.txt',
  'src/english-words.40.txt',
  'src/english-words.50.txt',
  'src/english-words.55.txt',
  'src/english-words.60.txt',
  'src/english-words.80.txt',
  'src/english-words.80.txt',
  'src/english-words.95.txt'
];
$wordFileOutput = 'output/words.php';

// Load existing words if words.php exists
$existingWords = file_exists($wordFileOutput) ? include($wordFileOutput) : [];

// Process each wordlist file
foreach ($wordFiles as $file) {
    if (!file_exists($file)) {
        echo "File not found: $file\n";
        continue;
    }

    $words = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($words as $word) {
        $word = strtolower(trim($word));

        // Filter out words with special characters and limit to 7 letters
        if (!preg_match('/^[a-z]{1,7}$/', $word)) {
            continue;
        }

        // Add word to array if it's not already present
        $existingWords[$word] = true;
    }
}

// Generate PHP code for words.php
$phpContent = "<?php\n\nreturn " . var_export($existingWords, true) . ";\n";

// Save the updated words.php file
file_put_contents($wordFileOutput, $phpContent);

echo "Words successfully added to words.php!\n";
?>
