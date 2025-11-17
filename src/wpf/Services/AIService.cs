using FitnessTracker.WPF.Models;

namespace FitnessTracker.WPF.Services
{
    /// <summary>
    /// AI Service - Tách riêng để dễ dàng bật/tắt
    /// Để tắt AI: Đơn giản set EnableAI = false trong constructor hoặc config
    /// </summary>
    public interface IAIService
    {
        bool IsEnabled { get; }
        Task<List<WorkoutExercise>> SuggestOptimalWorkoutAsync(List<Exercise> availableExercises, string muscleGroup, string goal);
        Task<FoodRecommendation> GetFoodRecommendationAsync(List<string> muscleGroups, int caloriesBurned, int totalSets, int totalReps);
        WorkoutMetrics CalculateWorkoutMetrics(List<WorkoutExercise> workoutExercises);
    }

    public class AIService : IAIService
    {
        // ============================================
        // BẬT/TẮT AI TẠI ĐÂY
        // ============================================
        public bool IsEnabled { get; private set; } = true; // Set = false để tắt AI
        
        public AIService()
        {
            // Có thể đọc từ config file
            // IsEnabled = ConfigurationManager.AppSettings["EnableAI"] == "true";
        }

        /// <summary>
        /// AI đề xuất bài tập tối ưu
        /// </summary>
        public async Task<List<WorkoutExercise>> SuggestOptimalWorkoutAsync(
            List<Exercise> availableExercises, 
            string muscleGroup, 
            string goal)
        {
            if (!IsEnabled)
            {
                // Nếu AI tắt, trả về danh sách mặc định
                return GetDefaultWorkout(availableExercises, goal);
            }

            // Simulate AI processing
            await Task.Delay(500);

            // Filter exercises
            var filtered = availableExercises.Where(e => e.MuscleGroup == muscleGroup).ToList();
            
            // Shuffle and select 3-5 exercises
            var random = new Random();
            var shuffled = filtered.OrderBy(x => random.Next()).ToList();
            var selectedCount = Math.Min(Math.Max(3, random.Next(3, 6)), shuffled.Count);
            var selected = shuffled.Take(selectedCount).ToList();

            // Configure based on goal
            var result = new List<WorkoutExercise>();
            foreach (var exercise in selected)
            {
                int sets = 3;
                int reps = exercise.Reps;
                int restTime = 60;

                switch (goal)
                {
                    case "Tăng cơ":
                        sets = 4;
                        reps = Math.Max(8, Math.Min(12, exercise.Reps));
                        restTime = 90;
                        break;
                    case "Giảm cân":
                        sets = 3;
                        reps = Math.Max(15, exercise.Reps);
                        restTime = 45;
                        break;
                    case "Tăng sức bền":
                        sets = 5;
                        reps = Math.Max(20, exercise.Reps);
                        restTime = 30;
                        break;
                }

                result.Add(new WorkoutExercise
                {
                    Exercise = exercise,
                    ExerciseId = exercise.Id,
                    Sets = sets,
                    Reps = reps,
                    RestTime = restTime,
                    Completed = false
                });
            }

            return result;
        }

        /// <summary>
        /// AI gợi ý dinh dưỡng
        /// </summary>
        public async Task<FoodRecommendation> GetFoodRecommendationAsync(
            List<string> muscleGroups, 
            int caloriesBurned, 
            int totalSets, 
            int totalReps)
        {
            if (!IsEnabled)
            {
                return GetDefaultFoodRecommendation();
            }

            // Simulate AI processing
            await Task.Delay(1500);

            // Calculate intensity
            double intensity = (totalSets * totalReps) / 100.0;
            int proteinGrams = (int)Math.Round(25 + intensity * 5);
            int carbGrams = (int)Math.Round(30 + (caloriesBurned / 4.0));
            int fatGrams = (int)Math.Round(10 + intensity * 2);

            string muscleGroupText = string.Join(", ", muscleGroups);

            return new FoodRecommendation
            {
                Summary = $"Dựa trên buổi tập {muscleGroupText} với {caloriesBurned} calories tiêu hao, cơ thể bạn cần bổ sung dinh dưỡng để phục hồi và phát triển cơ bắp.",
                ProteinAmount = $"{proteinGrams}g protein (khoảng {proteinGrams / 7} quả trứng hoặc {proteinGrams / 25}g thịt gà)",
                CarbAmount = $"{carbGrams}g carbohydrate (khoảng {carbGrams / 30}g cơm hoặc 2 củ khoai lang)",
                FatAmount = $"{fatGrams}g chất béo lành mạnh (bơ, hạt, dầu ô liu)",
                MealSuggestions = GenerateMealSuggestions(intensity),
                Timing = "Bổ sung protein trong vòng 30-60 phút sau tập. Bữa ăn chính sau 1-2 giờ.",
                RecoveryTips = GenerateRecoveryTips(muscleGroups)
            };
        }

        /// <summary>
        /// Tính toán metrics buổi tập
        /// </summary>
        public WorkoutMetrics CalculateWorkoutMetrics(List<WorkoutExercise> workoutExercises)
        {
            int totalCalories = 0;
            int totalDuration = 0;
            int totalRestTime = 0;
            int totalSets = 0;
            int totalReps = 0;

            foreach (var we in workoutExercises)
            {
                totalCalories += we.Exercise.Calories * we.Sets;
                totalDuration += we.Exercise.Duration * we.Sets;
                totalRestTime += we.RestTime * (we.Sets - 1);
                totalSets += we.Sets;
                totalReps += we.Reps * we.Sets;
            }

            return new WorkoutMetrics
            {
                TotalCalories = totalCalories,
                TotalDuration = totalDuration,
                TotalRestTime = totalRestTime,
                TotalSets = totalSets,
                TotalReps = totalReps,
                EstimatedTime = totalDuration + (totalRestTime / 60)
            };
        }

        // ============================================
        // PRIVATE HELPER METHODS
        // ============================================

        private List<WorkoutExercise> GetDefaultWorkout(List<Exercise> exercises, string goal)
        {
            // Fallback khi AI tắt - chọn 3 bài đầu tiên
            var selected = exercises.Take(3).ToList();
            var result = new List<WorkoutExercise>();

            foreach (var exercise in selected)
            {
                result.Add(new WorkoutExercise
                {
                    Exercise = exercise,
                    ExerciseId = exercise.Id,
                    Sets = 3,
                    Reps = exercise.Reps,
                    RestTime = 60,
                    Completed = false
                });
            }

            return result;
        }

        private FoodRecommendation GetDefaultFoodRecommendation()
        {
            return new FoodRecommendation
            {
                Summary = "Bổ sung dinh dưỡng sau tập để phục hồi cơ bắp.",
                ProteinAmount = "30g protein",
                CarbAmount = "50g carbohydrate",
                FatAmount = "15g chất béo",
                MealSuggestions = new List<string>
                {
                    "🍗 Ức gà + cơm + rau",
                    "🥚 Trứng + bánh mì",
                    "🥤 Whey protein shake"
                },
                Timing = "Bổ sung protein trong 30-60 phút sau tập.",
                RecoveryTips = new List<string>
                {
                    "💧 Uống đủ nước",
                    "😴 Ngủ đủ giấc",
                    "🧘 Giãn cơ"
                }
            };
        }

        private List<string> GenerateMealSuggestions(double intensity)
        {
            var suggestions = new List<string>();

            if (intensity > 5)
            {
                suggestions.Add("🍗 150g ức gà nướng + 100g cơm gạo lứt + rau xanh");
                suggestions.Add("🥩 150g thịt bò xào + khoai lang luộc + bông cải xanh");
                suggestions.Add("🐟 150g cá hồi nướng + quinoa + salad");
            }
            else
            {
                suggestions.Add("🥚 3 quả trứng luộc + yến mạch + chuối");
                suggestions.Add("🥛 Whey protein shake + chuối + bơ đậu phộng");
                suggestions.Add("🍚 Cơm gà + rau củ luộc");
            }

            suggestions.Add("🥤 Sinh tố protein: sữa tươi + chuối + yến mạch + whey");
            suggestions.Add("🥗 Salad ức gà: ức gà + rau xà lách + cà chua + olive");

            return suggestions;
        }

        private List<string> GenerateRecoveryTips(List<string> muscleGroups)
        {
            var tips = new List<string>
            {
                "💧 Uống đủ 2-3 lít nước mỗi ngày",
                "😴 Ngủ đủ 7-9 giờ để cơ bắp phục hồi tối ưu",
                "🧘 Thực hiện các bài tập giãn cơ nhẹ nhàng"
            };

            if (muscleGroups.Contains(MuscleGroups.Chan))
            {
                tips.Add("🚶 Đi bộ nhẹ 10-15 phút để giảm đau cơ");
                tips.Add("🛁 Ngâm chân nước ấm hoặc massage bắp chân");
            }

            if (muscleGroups.Contains(MuscleGroups.Nguc) || muscleGroups.Contains(MuscleGroups.Lung))
            {
                tips.Add("🧘 Thực hiện bài tập giãn vai và lưng");
            }

            if (muscleGroups.Contains(MuscleGroups.Tay) || muscleGroups.Contains(MuscleGroups.Vai))
            {
                tips.Add("💪 Massage nhẹ các cơ tay sau tập");
            }

            tips.Add("🍎 Bổ sung vitamin C từ hoa quả để giảm viêm");
            tips.Add("⏰ Tập cùng nhóm cơ sau 48-72 giờ để phục hồi hoàn toàn");

            return tips;
        }
    }

    // ============================================
    // DATA MODELS
    // ============================================

    public class WorkoutMetrics
    {
        public int TotalCalories { get; set; }
        public int TotalDuration { get; set; }
        public int TotalRestTime { get; set; }
        public int TotalSets { get; set; }
        public int TotalReps { get; set; }
        public int EstimatedTime { get; set; }
    }

    public class FoodRecommendation
    {
        public string Summary { get; set; } = string.Empty;
        public string ProteinAmount { get; set; } = string.Empty;
        public string CarbAmount { get; set; } = string.Empty;
        public string FatAmount { get; set; } = string.Empty;
        public List<string> MealSuggestions { get; set; } = new();
        public string Timing { get; set; } = string.Empty;
        public List<string> RecoveryTips { get; set; } = new();
    }
}
