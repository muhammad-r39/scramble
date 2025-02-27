<?php
require_once 'config.php';
require_once 'session.php';

// Get the JSON data from the frontend
$data = json_decode(file_get_contents("php://input"), true);

if ($data['action'] == 'login') {
    $email = $data['email'];
    $password = $data['password'];

    // Validate email and password
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in both fields.']);
        exit;
    }

    // Prepare and execute SQL query to check user
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Successful login
        $_SESSION['user_id'] = $user['id'];

        echo json_encode(['success' => true, 'message' => 'Login successful.', 'user' => $user]);
    } else {
        // Invalid credentials
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
}
?>
