<?php
require_once 'session.php';

session_destroy();
echo json_encode(["success" => true, "message" => "Logged out successfully!"]);
?>
