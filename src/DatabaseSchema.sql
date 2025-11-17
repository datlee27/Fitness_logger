-- ================================================================================
-- FITNESS TRACKER - MYSQL DATABASE SCHEMA
-- ================================================================================
-- Version: 1.0
-- Database: MySQL 8.0+
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- ================================================================================

-- Xóa database nếu tồn tại (CHÚ Ý: Chỉ dùng cho development)
-- DROP DATABASE IF EXISTS FitnessTrackerDB;

-- Tạo database
CREATE DATABASE IF NOT EXISTS FitnessTrackerDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE FitnessTrackerDB;

-- ================================================================================
-- TABLE 1: Users - Quản lý người dùng
-- ================================================================================
CREATE TABLE Users (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    PasswordSalt VARCHAR(255) NOT NULL,
    
    -- Thông tin cá nhân
    FullName VARCHAR(100),
    DateOfBirth DATE,
    Gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    Height DECIMAL(5,2), -- cm
    Weight DECIMAL(5,2), -- kg
    
    -- Mục tiêu và môi trường
    FitnessGoal ENUM('MuscleBuilding', 'WeightLoss', 'Endurance') DEFAULT 'WeightLoss',
    PreferredEnvironment ENUM('Home', 'Gym') DEFAULT 'Home',
    
    -- Settings
    IsAIEnabled BOOLEAN DEFAULT TRUE,
    PreferredUnit ENUM('Metric', 'Imperial') DEFAULT 'Metric',
    ThemeMode ENUM('Light', 'Dark') DEFAULT 'Light',
    
    -- Metadata
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    LastLoginAt DATETIME,
    IsActive BOOLEAN DEFAULT TRUE,
    
    INDEX idx_username (Username),
    INDEX idx_email (Email),
    INDEX idx_created (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 2: Exercises - Thư viện bài tập
-- ================================================================================
CREATE TABLE Exercises (
    ExerciseId INT PRIMARY KEY AUTO_INCREMENT,
    
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    
    -- Phân loại
    Category ENUM('Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'FullBody') NOT NULL,
    MuscleGroup VARCHAR(100), -- Chi tiết hơn: "Upper Chest", "Lower Back", etc.
    
    -- Mức độ và môi trường
    DifficultyLevel ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    EquipmentNeeded VARCHAR(255), -- "Dumbbell, Bench" hoặc "None" cho bodyweight
    Environment ENUM('Both', 'Home', 'Gym') DEFAULT 'Both',
    
    -- Hướng dẫn
    Instructions TEXT,
    VideoUrl VARCHAR(500),
    ImageUrl VARCHAR(500),
    
    -- Metrics
    EstimatedCaloriesPerRep DECIMAL(5,2),
    DefaultSets INT DEFAULT 3,
    DefaultReps INT DEFAULT 10,
    DefaultRestSeconds INT DEFAULT 60,
    
    -- Metadata
    CreatedBy INT, -- NULL = system, có giá trị = user tạo
    IsPublic BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId) ON DELETE SET NULL,
    INDEX idx_category (Category),
    INDEX idx_environment (Environment),
    INDEX idx_difficulty (DifficultyLevel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 3: WorkoutPlans - Kế hoạch tập luyện
-- ================================================================================
CREATE TABLE WorkoutPlans (
    WorkoutPlanId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    
    PlanName VARCHAR(100) NOT NULL,
    Description TEXT,
    
    -- Cấu hình
    Goal ENUM('MuscleBuilding', 'WeightLoss', 'Endurance') NOT NULL,
    Environment ENUM('Home', 'Gym') NOT NULL,
    DurationWeeks INT DEFAULT 4,
    DaysPerWeek INT DEFAULT 3,
    
    -- AI Generated
    IsAIGenerated BOOLEAN DEFAULT FALSE,
    AIPrompt TEXT,
    
    -- Status
    IsActive BOOLEAN DEFAULT TRUE,
    StartDate DATE,
    EndDate DATE,
    
    -- Metadata
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX idx_user (UserId),
    INDEX idx_active (IsActive),
    INDEX idx_goal (Goal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 4: WorkoutPlanExercises - Bài tập trong kế hoạch
-- ================================================================================
CREATE TABLE WorkoutPlanExercises (
    WorkoutPlanExerciseId INT PRIMARY KEY AUTO_INCREMENT,
    WorkoutPlanId INT NOT NULL,
    ExerciseId INT NOT NULL,
    
    DayNumber INT NOT NULL, -- Ngày thứ mấy trong tuần (1-7)
    OrderIndex INT NOT NULL, -- Thứ tự trong ngày
    
    -- Cấu hình cho bài tập này
    PlannedSets INT DEFAULT 3,
    PlannedReps INT DEFAULT 10,
    PlannedWeight DECIMAL(6,2), -- kg
    PlannedRestSeconds INT DEFAULT 60,
    Notes TEXT,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (WorkoutPlanId) REFERENCES WorkoutPlans(WorkoutPlanId) ON DELETE CASCADE,
    FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId) ON DELETE CASCADE,
    INDEX idx_plan (WorkoutPlanId),
    INDEX idx_day (DayNumber),
    UNIQUE KEY unique_plan_exercise_order (WorkoutPlanId, DayNumber, OrderIndex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 5: WorkoutSessions - Buổi tập thực tế
-- ================================================================================
CREATE TABLE WorkoutSessions (
    WorkoutSessionId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    WorkoutPlanId INT, -- NULL nếu là free workout
    
    SessionName VARCHAR(100),
    SessionDate DATE NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME,
    
    -- Metrics
    TotalDurationMinutes INT,
    TotalCaloriesBurned INT,
    AverageHeartRate INT,
    
    -- Đánh giá
    DifficultyRating INT CHECK (DifficultyRating BETWEEN 1 AND 5),
    EnergyLevel INT CHECK (EnergyLevel BETWEEN 1 AND 5),
    Notes TEXT,
    
    -- Status
    Status ENUM('Planned', 'InProgress', 'Completed', 'Skipped') DEFAULT 'Planned',
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (WorkoutPlanId) REFERENCES WorkoutPlans(WorkoutPlanId) ON DELETE SET NULL,
    INDEX idx_user_date (UserId, SessionDate),
    INDEX idx_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 6: WorkoutSessionExercises - Bài tập trong buổi tập
-- ================================================================================
CREATE TABLE WorkoutSessionExercises (
    WorkoutSessionExerciseId INT PRIMARY KEY AUTO_INCREMENT,
    WorkoutSessionId INT NOT NULL,
    ExerciseId INT NOT NULL,
    
    OrderIndex INT NOT NULL,
    
    -- Kế hoạch
    PlannedSets INT,
    PlannedReps INT,
    PlannedWeight DECIMAL(6,2),
    
    -- Thực tế hoàn thành
    CompletedSets INT DEFAULT 0,
    
    Notes TEXT,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (WorkoutSessionId) REFERENCES WorkoutSessions(WorkoutSessionId) ON DELETE CASCADE,
    FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId) ON DELETE CASCADE,
    INDEX idx_session (WorkoutSessionId),
    UNIQUE KEY unique_session_exercise_order (WorkoutSessionId, OrderIndex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 7: Sets - Chi tiết từng set
-- ================================================================================
CREATE TABLE Sets (
    SetId INT PRIMARY KEY AUTO_INCREMENT,
    WorkoutSessionExerciseId INT NOT NULL,
    
    SetNumber INT NOT NULL,
    Reps INT NOT NULL,
    Weight DECIMAL(6,2), -- kg
    RestSeconds INT,
    
    -- Metrics
    FormRating INT CHECK (FormRating BETWEEN 1 AND 5), -- Đánh giá form tập
    DifficultyRating INT CHECK (DifficultyRating BETWEEN 1 AND 5),
    
    CompletedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (WorkoutSessionExerciseId) REFERENCES WorkoutSessionExercises(WorkoutSessionExerciseId) ON DELETE CASCADE,
    INDEX idx_session_exercise (WorkoutSessionExerciseId),
    INDEX idx_set_number (SetNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 8: ProgressRecords - Theo dõi tiến độ
-- ================================================================================
CREATE TABLE ProgressRecords (
    ProgressRecordId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    
    RecordDate DATE NOT NULL,
    
    -- Body measurements
    Weight DECIMAL(5,2),
    BodyFatPercentage DECIMAL(4,2),
    
    -- Circumferences (cm)
    Chest DECIMAL(5,2),
    Waist DECIMAL(5,2),
    Hips DECIMAL(5,2),
    LeftArm DECIMAL(5,2),
    RightArm DECIMAL(5,2),
    LeftThigh DECIMAL(5,2),
    RightThigh DECIMAL(5,2),
    
    -- Photos
    FrontPhotoUrl VARCHAR(500),
    SidePhotoUrl VARCHAR(500),
    BackPhotoUrl VARCHAR(500),
    
    -- Notes
    Notes TEXT,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX idx_user_date (UserId, RecordDate),
    UNIQUE KEY unique_user_date (UserId, RecordDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 9: NutritionSuggestions - Gợi ý dinh dưỡng từ AI
-- ================================================================================
CREATE TABLE NutritionSuggestions (
    NutritionSuggestionId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    WorkoutSessionId INT,
    
    SuggestionDate DATE NOT NULL,
    
    -- Macros
    RecommendedCalories INT,
    RecommendedProteinGrams INT,
    RecommendedCarbsGrams INT,
    RecommendedFatsGrams INT,
    
    -- Meals
    PreWorkoutMeal TEXT,
    PostWorkoutMeal TEXT,
    DailyMealPlan TEXT,
    
    -- AI Info
    IsAIGenerated BOOLEAN DEFAULT TRUE,
    AIPrompt TEXT,
    AIResponse TEXT,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (WorkoutSessionId) REFERENCES WorkoutSessions(WorkoutSessionId) ON DELETE SET NULL,
    INDEX idx_user_date (UserId, SuggestionDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 10: UserFavorites - Bài tập yêu thích
-- ================================================================================
CREATE TABLE UserFavorites (
    UserFavoriteId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    ExerciseId INT NOT NULL,
    
    AddedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId) ON DELETE CASCADE,
    UNIQUE KEY unique_user_exercise (UserId, ExerciseId),
    INDEX idx_user (UserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 11: AppSettings - Cài đặt ứng dụng
-- ================================================================================
CREATE TABLE AppSettings (
    SettingId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    
    SettingKey VARCHAR(100) NOT NULL,
    SettingValue TEXT,
    
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    UNIQUE KEY unique_user_key (UserId, SettingKey),
    INDEX idx_user (UserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- TABLE 12: AILogs - Lưu lại các lần gọi AI (cho debugging)
-- ================================================================================
CREATE TABLE AILogs (
    AILogId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    
    RequestType ENUM('WorkoutPlan', 'NutritionAdvice', 'ExerciseSuggestion') NOT NULL,
    RequestPrompt TEXT NOT NULL,
    ResponseText TEXT,
    
    StatusCode INT,
    ErrorMessage TEXT,
    ExecutionTimeMs INT,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE SET NULL,
    INDEX idx_user (UserId),
    INDEX idx_type (RequestType),
    INDEX idx_created (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================================
-- SEED DATA - Dữ liệu mẫu cho Exercise Library
-- ================================================================================

-- Chest Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Push-ups', 'Chest', 'Upper Chest', 'Beginner', 'None', 'Both', 'Classic bodyweight chest exercise', 3, 15, 60),
('Bench Press', 'Chest', 'Middle Chest', 'Intermediate', 'Barbell, Bench', 'Gym', 'Compound chest exercise with barbell', 4, 8, 90),
('Incline Dumbbell Press', 'Chest', 'Upper Chest', 'Intermediate', 'Dumbbells, Incline Bench', 'Gym', 'Targets upper chest with dumbbells', 3, 10, 75),
('Dumbbell Flyes', 'Chest', 'Middle Chest', 'Intermediate', 'Dumbbells, Bench', 'Gym', 'Isolation exercise for chest stretch', 3, 12, 60),
('Dips', 'Chest', 'Lower Chest', 'Intermediate', 'Dip Bar or Chair', 'Both', 'Bodyweight exercise for lower chest', 3, 10, 60);

-- Back Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Pull-ups', 'Back', 'Lats', 'Intermediate', 'Pull-up Bar', 'Both', 'Classic back and biceps exercise', 3, 8, 90),
('Bent Over Rows', 'Back', 'Middle Back', 'Intermediate', 'Barbell', 'Gym', 'Compound back exercise', 4, 10, 75),
('Lat Pulldown', 'Back', 'Lats', 'Beginner', 'Cable Machine', 'Gym', 'Machine-based lat exercise', 3, 12, 60),
('Deadlift', 'Back', 'Full Back', 'Advanced', 'Barbell', 'Gym', 'King of back exercises', 4, 6, 120),
('Dumbbell Rows', 'Back', 'Middle Back', 'Intermediate', 'Dumbbell, Bench', 'Both', 'Unilateral back exercise', 3, 10, 60);

-- Legs Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Squats', 'Legs', 'Quadriceps', 'Intermediate', 'Barbell', 'Gym', 'Compound leg exercise', 4, 10, 90),
('Bodyweight Squats', 'Legs', 'Quadriceps', 'Beginner', 'None', 'Both', 'Basic squat movement', 3, 15, 45),
('Lunges', 'Legs', 'Quadriceps', 'Beginner', 'None or Dumbbells', 'Both', 'Unilateral leg exercise', 3, 12, 60),
('Leg Press', 'Legs', 'Quadriceps', 'Beginner', 'Leg Press Machine', 'Gym', 'Machine-based leg exercise', 3, 12, 75),
('Romanian Deadlift', 'Legs', 'Hamstrings', 'Intermediate', 'Barbell or Dumbbells', 'Gym', 'Hamstring focused exercise', 3, 10, 75);

-- Shoulders Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Overhead Press', 'Shoulders', 'Anterior Deltoid', 'Intermediate', 'Barbell', 'Gym', 'Compound shoulder exercise', 4, 8, 90),
('Dumbbell Shoulder Press', 'Shoulders', 'Anterior Deltoid', 'Beginner', 'Dumbbells', 'Both', 'Basic shoulder press', 3, 10, 60),
('Lateral Raises', 'Shoulders', 'Medial Deltoid', 'Beginner', 'Dumbbells', 'Both', 'Isolation for side delts', 3, 15, 45),
('Face Pulls', 'Shoulders', 'Posterior Deltoid', 'Intermediate', 'Cable Machine', 'Gym', 'Rear delt and upper back', 3, 15, 45),
('Pike Push-ups', 'Shoulders', 'Anterior Deltoid', 'Intermediate', 'None', 'Home', 'Bodyweight shoulder exercise', 3, 12, 60);

-- Arms Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Bicep Curls', 'Arms', 'Biceps', 'Beginner', 'Dumbbells', 'Both', 'Classic bicep exercise', 3, 12, 60),
('Hammer Curls', 'Arms', 'Biceps', 'Beginner', 'Dumbbells', 'Both', 'Bicep and forearm builder', 3, 12, 60),
('Tricep Dips', 'Arms', 'Triceps', 'Beginner', 'Bench or Chair', 'Both', 'Bodyweight tricep exercise', 3, 12, 60),
('Tricep Pushdown', 'Arms', 'Triceps', 'Beginner', 'Cable Machine', 'Gym', 'Cable tricep isolation', 3, 15, 45),
('Close-Grip Push-ups', 'Arms', 'Triceps', 'Beginner', 'None', 'Home', 'Tricep-focused push-up', 3, 12, 45);

-- Core Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds) VALUES
('Plank', 'Core', 'Full Core', 'Beginner', 'None', 'Both', 'Isometric core exercise (hold 30-60s)', 3, 1, 60),
('Crunches', 'Core', 'Abs', 'Beginner', 'None', 'Both', 'Basic ab exercise', 3, 20, 45),
('Russian Twists', 'Core', 'Obliques', 'Intermediate', 'None or Weight', 'Both', 'Rotational core exercise', 3, 20, 45),
('Leg Raises', 'Core', 'Lower Abs', 'Intermediate', 'None', 'Both', 'Lower ab focused exercise', 3, 15, 60),
('Mountain Climbers', 'Core', 'Full Core', 'Intermediate', 'None', 'Both', 'Dynamic core and cardio', 3, 20, 45);

-- Cardio Exercises
INSERT INTO Exercises (Name, Category, MuscleGroup, DifficultyLevel, EquipmentNeeded, Environment, Description, DefaultSets, DefaultReps, DefaultRestSeconds, EstimatedCaloriesPerRep) VALUES
('Running', 'Cardio', 'Full Body', 'Beginner', 'None', 'Both', 'Classic cardio exercise', 1, 1, 0, 10.0),
('Jumping Jacks', 'Cardio', 'Full Body', 'Beginner', 'None', 'Both', 'Full body warm-up exercise', 3, 30, 30, 0.5),
('Burpees', 'Cardio', 'Full Body', 'Intermediate', 'None', 'Both', 'High intensity full body', 3, 15, 60, 1.2),
('Jump Rope', 'Cardio', 'Full Body', 'Beginner', 'Jump Rope', 'Both', 'Cardio and coordination', 3, 100, 60, 0.8),
('High Knees', 'Cardio', 'Full Body', 'Beginner', 'None', 'Both', 'Running in place variation', 3, 30, 45, 0.6);


-- ================================================================================
-- VIEWS - Các view hữu ích cho query
-- ================================================================================

-- View: Tổng số buổi tập của mỗi user
CREATE VIEW UserWorkoutStats AS
SELECT 
    u.UserId,
    u.Username,
    COUNT(DISTINCT ws.WorkoutSessionId) as TotalSessions,
    COUNT(DISTINCT DATE(ws.SessionDate)) as TotalDays,
    SUM(ws.TotalDurationMinutes) as TotalMinutes,
    SUM(ws.TotalCaloriesBurned) as TotalCalories
FROM Users u
LEFT JOIN WorkoutSessions ws ON u.UserId = ws.UserId AND ws.Status = 'Completed'
GROUP BY u.UserId, u.Username;


-- View: Tiến độ cân nặng theo thời gian
CREATE VIEW WeightProgress AS
SELECT 
    pr.UserId,
    u.Username,
    pr.RecordDate,
    pr.Weight,
    LAG(pr.Weight) OVER (PARTITION BY pr.UserId ORDER BY pr.RecordDate) as PreviousWeight,
    pr.Weight - LAG(pr.Weight) OVER (PARTITION BY pr.UserId ORDER BY pr.RecordDate) as WeightChange
FROM ProgressRecords pr
JOIN Users u ON pr.UserId = u.UserId
WHERE pr.Weight IS NOT NULL
ORDER BY pr.UserId, pr.RecordDate;


-- View: Bài tập phổ biến nhất
CREATE VIEW PopularExercises AS
SELECT 
    e.ExerciseId,
    e.Name,
    e.Category,
    COUNT(wse.WorkoutSessionExerciseId) as TimesUsed
FROM Exercises e
LEFT JOIN WorkoutSessionExercises wse ON e.ExerciseId = wse.ExerciseId
GROUP BY e.ExerciseId, e.Name, e.Category
ORDER BY TimesUsed DESC;


-- ================================================================================
-- STORED PROCEDURES - Các thủ tục hữu ích
-- ================================================================================

DELIMITER //

-- Procedure: Lấy thống kê user trong khoảng thời gian
CREATE PROCEDURE GetUserStatistics(
    IN p_UserId INT,
    IN p_StartDate DATE,
    IN p_EndDate DATE
)
BEGIN
    SELECT 
        COUNT(DISTINCT ws.WorkoutSessionId) as TotalSessions,
        SUM(ws.TotalDurationMinutes) as TotalMinutes,
        SUM(ws.TotalCaloriesBurned) as TotalCalories,
        AVG(ws.DifficultyRating) as AvgDifficulty,
        COUNT(DISTINCT DATE(ws.SessionDate)) as ActiveDays
    FROM WorkoutSessions ws
    WHERE ws.UserId = p_UserId
        AND ws.SessionDate BETWEEN p_StartDate AND p_EndDate
        AND ws.Status = 'Completed';
END //

-- Procedure: Lấy personal records (PR) cho các bài tập
CREATE PROCEDURE GetPersonalRecords(IN p_UserId INT)
BEGIN
    SELECT 
        e.ExerciseId,
        e.Name as ExerciseName,
        MAX(s.Weight) as MaxWeight,
        MAX(s.Reps) as MaxReps,
        MAX(s.Weight * s.Reps) as MaxVolume,
        COUNT(DISTINCT wse.WorkoutSessionExerciseId) as TimesPerformed
    FROM Users u
    JOIN WorkoutSessions ws ON u.UserId = ws.UserId
    JOIN WorkoutSessionExercises wse ON ws.WorkoutSessionId = wse.WorkoutSessionId
    JOIN Exercises e ON wse.ExerciseId = e.ExerciseId
    JOIN Sets s ON wse.WorkoutSessionExerciseId = s.WorkoutSessionExerciseId
    WHERE u.UserId = p_UserId
    GROUP BY e.ExerciseId, e.Name
    ORDER BY MaxWeight DESC;
END //

DELIMITER ;


-- ================================================================================
-- INDEXES BỔ SUNG (Performance optimization)
-- ================================================================================

-- Composite indexes cho các query thường dùng
CREATE INDEX idx_workout_session_user_date_status ON WorkoutSessions(UserId, SessionDate, Status);
CREATE INDEX idx_sets_exercise_weight ON Sets(WorkoutSessionExerciseId, Weight DESC);
CREATE INDEX idx_progress_user_date ON ProgressRecords(UserId, RecordDate DESC);


-- ================================================================================
-- TRIGGERS - Tự động cập nhật dữ liệu
-- ================================================================================

DELIMITER //

-- Trigger: Tự động cập nhật LastLoginAt khi user login
CREATE TRIGGER trg_update_last_login
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    IF NEW.IsActive = TRUE AND OLD.IsActive = FALSE THEN
        SET NEW.LastLoginAt = NOW();
    END IF;
END //

-- Trigger: Tính tổng số set đã hoàn thành
CREATE TRIGGER trg_update_completed_sets
AFTER INSERT ON Sets
FOR EACH ROW
BEGIN
    UPDATE WorkoutSessionExercises
    SET CompletedSets = (
        SELECT COUNT(*) 
        FROM Sets 
        WHERE WorkoutSessionExerciseId = NEW.WorkoutSessionExerciseId
    )
    WHERE WorkoutSessionExerciseId = NEW.WorkoutSessionExerciseId;
END //

DELIMITER ;


-- ================================================================================
-- DEMO DATA - Tạo user mẫu để test
-- ================================================================================

-- User mẫu (password: "123456" - đã hash với bcrypt)
INSERT INTO Users (Username, Email, PasswordHash, PasswordSalt, FullName, Gender, Height, Weight, FitnessGoal, PreferredEnvironment) VALUES
('demo_user', 'demo@fitness.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'randomsalt123', 'Demo User', 'Male', 175.0, 75.0, 'MuscleBuilding', 'Gym'),
('home_user', 'home@fitness.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'randomsalt456', 'Home Trainer', 'Female', 165.0, 60.0, 'WeightLoss', 'Home');


-- ================================================================================
-- BACKUP & MAINTENANCE COMMANDS
-- ================================================================================

-- Để backup database:
-- mysqldump -u root -p FitnessTrackerDB > fitness_backup.sql

-- Để restore database:
-- mysql -u root -p FitnessTrackerDB < fitness_backup.sql

-- Để xem kích thước database:
-- SELECT 
--     table_schema AS 'Database',
--     ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
-- FROM information_schema.tables
-- WHERE table_schema = 'FitnessTrackerDB'
-- GROUP BY table_schema;


-- ================================================================================
-- HẾT DATABASE SCHEMA
-- ================================================================================
