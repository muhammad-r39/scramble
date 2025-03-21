-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 05:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `letterley`
--

-- --------------------------------------------------------

--
-- Table structure for table `game_data`
--

CREATE TABLE `game_data` (
  `id` int(11) NOT NULL,
  `letters` varchar(7) NOT NULL,
  `boost_slot` tinyint(4) NOT NULL,
  `boost_multiplier` tinyint(4) NOT NULL CHECK (`boost_multiplier` in (2,3)),
  `high_score` int(11) NOT NULL,
  `best_word` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_data`
--

INSERT INTO `game_data` (`id`, `letters`, `boost_slot`, `boost_multiplier`, `high_score`, `best_word`, `created_at`) VALUES
(1, 'KLJUEIX', 3, 3, 26, 'LUX', '2025-03-17 13:34:58'),
(2, 'TAIXHBZ', 5, 2, 19, 'ZAX', '2025-03-17 20:19:30'),
(3, 'IPLEOVS', 6, 2, 16, 'PLOSIVE', '2025-03-17 20:20:30'),
(4, 'VOALZMS', 7, 3, 14, 'MOZ', '2025-03-17 20:20:34'),
(5, 'JLUSEXH', 1, 3, 34, 'JEUX', '2025-03-17 20:20:38'),
(6, 'SWAFBVE', 5, 2, 14, 'BESAW', '2025-03-17 20:20:41'),
(7, 'TYLAEWU', 6, 3, 15, 'LUTEWAY', '2025-03-17 20:20:46'),
(8, 'SLEOADH', 1, 2, 14, 'HEALDS', '2025-03-17 20:20:50'),
(9, 'DJHRBUO', 7, 2, 14, 'HOJU', '2025-03-17 20:20:56'),
(10, 'NEGBUZT', 6, 3, 17, 'UZBEG', '2025-03-17 20:20:59'),
(11, 'IKPHNOA', 6, 3, 14, 'HOPAK', '2025-03-17 20:21:03'),
(12, 'BZHAEYU', 1, 3, 35, 'ZEBU', '2025-03-17 20:21:07'),
(13, 'CJDAERS', 5, 2, 15, 'DJERSA', '2025-03-17 20:21:10'),
(14, 'MGIPXCE', 7, 3, 12, 'MIX', '2025-03-17 20:21:14'),
(15, 'SOBAMTC', 2, 2, 14, 'COMBATS', '2025-03-17 20:21:16'),
(16, 'VWDIAZO', 6, 2, 15, 'WIZ', '2025-03-17 20:21:20'),
(17, 'UZEVATW', 2, 2, 22, 'AZT', '2025-03-17 20:21:26'),
(18, 'ANZUOJL', 4, 2, 16, 'ZONULA', '2025-03-17 20:21:29'),
(19, 'LAEBQJR', 6, 3, 17, 'JARBLE', '2025-03-17 20:21:31'),
(20, 'OZAHICK', 4, 3, 38, 'CHIZ', '2025-03-17 20:21:34'),
(21, 'UGDLZIH', 6, 2, 16, 'GHZ', '2025-03-17 20:21:36'),
(22, 'ZUEMAFB', 2, 2, 25, 'EZBA', '2025-03-17 20:21:38'),
(23, 'HBIWEAP', 7, 2, 13, 'WHIBA', '2025-03-17 20:21:41'),
(24, 'LUSGWIE', 7, 2, 8, 'SWIG', '2025-03-17 20:21:43'),
(25, 'MIQODAV', 1, 2, 24, 'QAID', '2025-03-17 20:21:47'),
(26, 'RZEPAJX', 4, 2, 25, 'PREZ', '2025-03-17 20:21:49'),
(27, 'QHXIEAY', 3, 3, 30, 'HEXA', '2025-03-17 20:21:52'),
(28, 'KSYBUIV', 4, 2, 19, 'SKIVY', '2025-03-21 00:26:19'),
(29, 'MOZIKFD', 3, 2, 25, 'FIZ', '2025-03-21 00:26:21'),
(30, 'USENLXR', 6, 3, 12, 'EXULS', '2025-03-21 00:28:04'),
(31, 'AFHGUEZ', 1, 3, 33, 'ZAG', '2025-03-21 00:36:09'),
(32, 'EUWCOTZ', 5, 2, 18, 'TOWZE', '2025-03-21 00:38:04'),
(33, 'IHONECQ', 4, 3, 18, 'NICHE', '2025-03-21 00:39:05'),
(34, 'WENKOFD', 7, 3, 14, 'FOWK', '2025-03-21 00:42:05'),
(35, 'UDBEOJP', 7, 2, 15, 'JOBED', '2025-03-21 00:44:41'),
(36, 'EUCFPKG', 4, 3, 23, 'FUCK', '2025-03-21 00:45:13'),
(37, 'EISAHYX', 5, 2, 16, 'HEXIS', '2025-03-21 00:45:21'),
(38, 'POCAVRF', 1, 2, 14, 'FCP', '2025-03-21 00:47:55'),
(39, 'BUYODZK', 5, 3, 17, 'DOZY', '2025-03-21 00:49:58'),
(40, 'RUEGKOW', 7, 2, 12, 'WROKE', '2025-03-21 00:55:49'),
(41, 'MRFNOUK', 4, 3, 21, 'FORK', '2025-03-21 00:58:30'),
(42, 'WQBUJER', 3, 2, 12, 'JURE', '2025-03-21 01:02:08'),
(43, 'VKTFOLA', 4, 3, 21, 'VOLK', '2025-03-21 01:12:14'),
(44, 'URIEZKN', 7, 3, 18, 'ZINKE', '2025-03-21 01:15:53'),
(45, 'SUEKJTY', 7, 2, 16, 'JUKES', '2025-03-21 01:22:35'),
(46, 'FOIVBUM', 4, 3, 19, 'BUMF', '2025-03-21 01:23:10'),
(47, 'USAFJOK', 5, 2, 17, 'JAUKS', '2025-03-21 01:34:23'),
(48, 'ATERKGV', 3, 3, 20, 'KAVER', '2025-03-21 01:36:12'),
(49, 'SOIDNEH', 4, 2, 14, 'NOSHED', '2025-03-21 02:17:11'),
(50, 'PDUESOZ', 6, 2, 15, 'ZEPS', '2025-03-21 02:19:11'),
(51, 'GEIOVDK', 3, 3, 19, 'DOKE', '2025-03-21 02:20:48'),
(52, 'UALVWEQ', 5, 2, 18, 'QUAVE', '2025-03-21 03:00:51'),
(53, 'SRIPUHG', 3, 2, 14, 'GRIPHUS', '2025-03-21 03:17:04'),
(54, 'EPHDAIV', 4, 3, 15, 'HEAP', '2025-03-21 03:17:18'),
(55, 'VUIHGCE', 6, 3, 13, 'CHIVE', '2025-03-21 03:35:40'),
(56, 'YRWEOUP', 7, 3, 12, 'WYPE', '2025-03-21 04:16:52'),
(57, 'QYUAMZB', 3, 2, 24, 'BUZ', '2025-03-21 04:20:19'),
(58, 'PEJOXBV', 3, 3, 30, 'PBX', '2025-03-21 04:21:57');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `score` int(10) UNSIGNED NOT NULL,
  `time_taken` time NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `win` int(1) NOT NULL DEFAULT 0,
  `last_hint` int(11) NOT NULL DEFAULT 0,
  `hint_0` int(11) NOT NULL DEFAULT 0,
  `hint_1` int(11) NOT NULL DEFAULT 0,
  `hint_2` int(11) NOT NULL DEFAULT 0,
  `hint_3` int(11) NOT NULL DEFAULT 0,
  `hint_4` int(11) NOT NULL DEFAULT 0,
  `hint_5` int(11) NOT NULL DEFAULT 0,
  `hint_6` int(11) NOT NULL DEFAULT 0,
  `total_played` int(11) NOT NULL DEFAULT 0,
  `total_win` int(11) NOT NULL DEFAULT 0,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `max_streak` int(11) NOT NULL DEFAULT 0,
  `last_game` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `created_at`, `win`, `last_hint`, `hint_0`, `hint_1`, `hint_2`, `hint_3`, `hint_4`, `hint_5`, `hint_6`, `total_played`, `total_win`, `current_streak`, `max_streak`, `last_game`) VALUES
(1, 'Muhammad', 'Russell', 'muhammad@letterley.com', '$2y$10$DXHPpAFTedzHmp3XHwBVGuGPc4fy8RnSpEMAF1IAU/4xLgJsNJthi', '2025-03-21 02:02:32', 1, 0, 3, 4, 0, 3, 3, 1, 0, 9, 6, 6, 7, 58);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game_data`
--
ALTER TABLE `game_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game_data`
--
ALTER TABLE `game_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
