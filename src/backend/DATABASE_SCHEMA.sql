-- =============================================
-- Fitness Tracker Database Schema
-- MySQL 8.0+
-- =============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS fitness_tracker 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE fitness_tracker;

-- =============================================
-- Bảng Exercises (Bài tập)
-- =============================================
CREATE TABLE IF NOT EXISTS `Exercises` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(200) NOT NULL,
    `MuscleGroup` VARCHAR(50) NOT NULL,
    `Instructions` VARCHAR(1000) NOT NULL,
    `Reps` INT NOT NULL DEFAULT 0,
    `Calories` INT NOT NULL DEFAULT 0,
    `Duration` INT NOT NULL DEFAULT 0 COMMENT 'Thời gian tính bằng phút',
    `ImageUrl` VARCHAR(500) NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_muscle_group` (`MuscleGroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng WorkoutSessions (Buổi tập luyện)
-- =============================================
CREATE TABLE IF NOT EXISTS `WorkoutSessions` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `TotalCalories` INT NOT NULL DEFAULT 0,
    `TotalDuration` INT NOT NULL DEFAULT 0 COMMENT 'Tổng thời gian tính bằng phút',
    `Saved` TINYINT(1) NOT NULL DEFAULT 0,
    INDEX `idx_date` (`Date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng WorkoutExercises (Bài tập trong buổi tập)
-- =============================================
CREATE TABLE IF NOT EXISTS `WorkoutExercises` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `WorkoutSessionId` INT NOT NULL,
    `ExerciseId` INT NOT NULL,
    `Sets` INT NOT NULL DEFAULT 1,
    `ActualDuration` INT NULL COMMENT 'Thời gian thực tế tính bằng phút',
    FOREIGN KEY (`WorkoutSessionId`) REFERENCES `WorkoutSessions`(`Id`) ON DELETE CASCADE,
    FOREIGN KEY (`ExerciseId`) REFERENCES `Exercises`(`Id`) ON DELETE RESTRICT,
    INDEX `idx_workout_session` (`WorkoutSessionId`),
    INDEX `idx_exercise` (`ExerciseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng SavedWorkouts (Bài tập đã lưu)
-- =============================================
CREATE TABLE IF NOT EXISTS `SavedWorkouts` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(200) NOT NULL,
    `Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `MuscleGroup` VARCHAR(50) NOT NULL,
    `TotalCalories` INT NOT NULL DEFAULT 0,
    `TotalDuration` INT NOT NULL DEFAULT 0 COMMENT 'Tổng thời gian tính bằng phút',
    `WorkoutSessionId` INT NULL,
    FOREIGN KEY (`WorkoutSessionId`) REFERENCES `WorkoutSessions`(`Id`) ON DELETE SET NULL,
    INDEX `idx_muscle_group` (`MuscleGroup`),
    INDEX `idx_date` (`Date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Dữ liệu mẫu cho bảng Exercises
-- =============================================
INSERT INTO `Exercises` (`Name`, `MuscleGroup`, `Instructions`, `Reps`, `Calories`, `Duration`, `ImageUrl`) VALUES
('Push-up', 'Ngực', 'Nằm sấp, đặt tay rộng bằng vai, đẩy người lên xuống', 15, 7, 2, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Squat', 'Chân', 'Đứng thẳng, chân rộng bằng vai, ngồi xuống như ngồi ghế', 20, 10, 3, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),
('Plank', 'Bụng', 'Chống tay hoặc khuỷu tay, giữ thẳng người', 1, 5, 1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Bicep Curl', 'Tay', 'Cầm tạ, uốn cong tay về phía vai', 12, 6, 2, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Shoulder Press', 'Vai', 'Đẩy tạ từ vai lên trên đầu', 10, 8, 2, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'),
('Pull-up', 'Lưng', 'Treo xà đơn, kéo người lên đến khi cằm qua xà', 8, 9, 2, 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400'),
('Crunch', 'Bụng', 'Nằm ngửa, gập bụng lên', 20, 5, 2, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Lunge', 'Chân', 'Bước chân về phía trước, hạ thấp người xuống', 15, 8, 3, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400');

-- =============================================
-- Dữ liệu mẫu cho bảng WorkoutSessions
-- =============================================
INSERT INTO `WorkoutSessions` (`Date`, `TotalCalories`, `TotalDuration`, `Saved`) VALUES
(DATE_SUB(NOW(), INTERVAL 7 DAY), 45, 12, 1),
(DATE_SUB(NOW(), INTERVAL 5 DAY), 38, 10, 1),
(DATE_SUB(NOW(), INTERVAL 2 DAY), 52, 15, 0);

-- =============================================
-- Dữ liệu mẫu cho bảng WorkoutExercises
-- =============================================
INSERT INTO `WorkoutExercises` (`WorkoutSessionId`, `ExerciseId`, `Sets`, `ActualDuration`) VALUES
(1, 1, 3, 6),
(1, 3, 3, 3),
(1, 7, 3, 3),
(2, 2, 3, 9),
(2, 8, 2, 6),
(3, 4, 3, 6),
(3, 5, 3, 6),
(3, 6, 2, 4);

-- =============================================
-- Dữ liệu mẫu cho bảng SavedWorkouts
-- =============================================
INSERT INTO `SavedWorkouts` (`Name`, `Date`, `MuscleGroup`, `TotalCalories`, `TotalDuration`, `WorkoutSessionId`) VALUES
('Buổi tập ngực cơ bản', DATE_SUB(NOW(), INTERVAL 7 DAY), 'Ngực', 45, 12, 1),
('Tập chân toàn diện', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Chân', 38, 10, 2);

-- =============================================
-- Views hữu ích
-- =============================================

-- View: Thống kê tổng quan
CREATE OR REPLACE VIEW `vw_WorkoutStats` AS
SELECT 
    COUNT(DISTINCT ws.Id) AS TotalSessions,
    SUM(ws.TotalCalories) AS TotalCaloriesAllTime,
    SUM(ws.TotalDuration) AS TotalDurationAllTime,
    AVG(ws.TotalCalories) AS AvgCaloriesPerSession,
    AVG(ws.TotalDuration) AS AvgDurationPerSession
FROM `WorkoutSessions` ws;

-- View: Bài tập phổ biến nhất
CREATE OR REPLACE VIEW `vw_PopularExercises` AS
SELECT 
    e.Id,
    e.Name,
    e.MuscleGroup,
    COUNT(we.Id) AS TimesUsed,
    SUM(we.Sets) AS TotalSets
FROM `Exercises` e
LEFT JOIN `WorkoutExercises` we ON e.Id = we.ExerciseId
GROUP BY e.Id, e.Name, e.MuscleGroup
ORDER BY TimesUsed DESC;

-- View: Thống kê theo vùng cơ
CREATE OR REPLACE VIEW `vw_MuscleGroupStats` AS
SELECT 
    e.MuscleGroup,
    COUNT(DISTINCT we.WorkoutSessionId) AS SessionCount,
    COUNT(we.Id) AS ExerciseCount,
    SUM(we.Sets) AS TotalSets
FROM `Exercises` e
JOIN `WorkoutExercises` we ON e.Id = we.ExerciseId
GROUP BY e.MuscleGroup
ORDER BY SessionCount DESC;

-- =============================================
-- Stored Procedures hữu ích
-- =============================================

-- Lấy thống kê theo khoảng thời gian
DELIMITER //
CREATE PROCEDURE `sp_GetStatsByDateRange`(
    IN p_StartDate DATETIME,
    IN p_EndDate DATETIME
)
BEGIN
    SELECT 
        COUNT(ws.Id) AS TotalSessions,
        SUM(ws.TotalCalories) AS TotalCalories,
        SUM(ws.TotalDuration) AS TotalDuration,
        AVG(ws.TotalCalories) AS AvgCalories,
        AVG(ws.TotalDuration) AS AvgDuration
    FROM `WorkoutSessions` ws
    WHERE ws.Date BETWEEN p_StartDate AND p_EndDate;
END //
DELIMITER ;

-- =============================================
-- Indexes bổ sung để tối ưu performance
-- =============================================
CREATE INDEX `idx_exercises_muscle_calories` ON `Exercises`(`MuscleGroup`, `Calories`);
CREATE INDEX `idx_sessions_date_saved` ON `WorkoutSessions`(`Date`, `Saved`);

-- =============================================
-- Kết thúc schema
-- =============================================
