<?php
$conn = new mysqli("localhost", "user", "password", "database");

$id = $_POST["id"];

$sql = "DELETE FROM fiches WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

echo "Fiche supprimée avec succès";
