using Microsoft.EntityFrameworkCore;
using FitnessTracker.WPF.Models;

namespace FitnessTracker.WPF.Data
{
    public class FitnessDbContext : DbContext
    {
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<SavedWorkout> SavedWorkouts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = "Server=localhost;Port=3306;Database=fitness_tracker_wpf;User=root;Password=your_password;";
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.WorkoutSession)
                .WithMany(ws => ws.WorkoutExercises)
                .HasForeignKey(we => we.WorkoutSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.Exercise)
                .WithMany(e => e.WorkoutExercises)
                .HasForeignKey(we => we.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SavedWorkout>()
                .HasOne(sw => sw.WorkoutSession)
                .WithMany()
                .HasForeignKey(sw => sw.WorkoutSessionId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Exercise>().HasData(
                // Ở nhà - Ngực
                new Exercise { Id = 1, Name = "Push-up", MuscleGroup = MuscleGroups.Nguc, Environment = Environments.Home, Instructions = "Nằm sấp, đặt tay rộng bằng vai, đẩy người lên xuống", Reps = 15, Calories = 7, Duration = 2, Difficulty = Difficulties.Medium },
                new Exercise { Id = 2, Name = "Diamond Push-up", MuscleGroup = MuscleGroups.Nguc, Environment = Environments.Home, Instructions = "Push-up với hai tay khép lại tạo hình kim cương", Reps = 12, Calories = 8, Duration = 2, Difficulty = Difficulties.Hard },
                
                // Phòng gym - Ngực
                new Exercise { Id = 3, Name = "Bench Press", MuscleGroup = MuscleGroups.Nguc, Environment = Environments.Gym, Instructions = "Nằm trên ghế, đẩy tạ từ ngực lên trên", Reps = 10, Calories = 10, Duration = 3, Difficulty = Difficulties.Medium },
                
                // Chân
                new Exercise { Id = 4, Name = "Squat", MuscleGroup = MuscleGroups.Chan, Environment = Environments.Both, Instructions = "Đứng thẳng, chân rộng bằng vai, ngồi xuống như ngồi ghế", Reps = 20, Calories = 10, Duration = 3, Difficulty = Difficulties.Easy },
                new Exercise { Id = 5, Name = "Lunge", MuscleGroup = MuscleGroups.Chan, Environment = Environments.Both, Instructions = "Bước chân về phía trước, hạ thấp người xuống", Reps = 15, Calories = 8, Duration = 3, Difficulty = Difficulties.Medium },
                new Exercise { Id = 6, Name = "Leg Press", MuscleGroup = MuscleGroups.Chan, Environment = Environments.Gym, Instructions = "Đẩy bàn đạp bằng chân trên máy leg press", Reps = 12, Calories = 12, Duration = 3, Difficulty = Difficulties.Medium },
                
                // Bụng
                new Exercise { Id = 7, Name = "Plank", MuscleGroup = MuscleGroups.Bung, Environment = Environments.Both, Instructions = "Chống tay hoặc khuỷu tay, giữ thẳng người", Reps = 1, Calories = 5, Duration = 1, Difficulty = Difficulties.Medium },
                new Exercise { Id = 8, Name = "Crunch", MuscleGroup = MuscleGroups.Bung, Environment = Environments.Both, Instructions = "Nằm ngửa, gập bụng lên", Reps = 20, Calories = 5, Duration = 2, Difficulty = Difficulties.Easy },
                new Exercise { Id = 9, Name = "Mountain Climbers", MuscleGroup = MuscleGroups.Bung, Environment = Environments.Home, Instructions = "Tư thế plank, luân phiên đưa đầu gối về phía ngực", Reps = 30, Calories = 8, Duration = 2, Difficulty = Difficulties.Medium },
                
                // Tay
                new Exercise { Id = 10, Name = "Dips", MuscleGroup = MuscleGroups.Tay, Environment = Environments.Home, Instructions = "Dùng ghế, chống tay và hạ người xuống", Reps = 15, Calories = 6, Duration = 2, Difficulty = Difficulties.Medium },
                new Exercise { Id = 11, Name = "Bicep Curl", MuscleGroup = MuscleGroups.Tay, Environment = Environments.Gym, Instructions = "Cầm tạ, uốn cong tay về phía vai", Reps = 12, Calories = 6, Duration = 2, Difficulty = Difficulties.Easy },
                new Exercise { Id = 12, Name = "Tricep Extension", MuscleGroup = MuscleGroups.Tay, Environment = Environments.Gym, Instructions = "Đưa tạ lên đầu, duỗi tay ra", Reps = 12, Calories = 6, Duration = 2, Difficulty = Difficulties.Medium },
                
                // Vai
                new Exercise { Id = 13, Name = "Shoulder Press", MuscleGroup = MuscleGroups.Vai, Environment = Environments.Gym, Instructions = "Đẩy tạ từ vai lên trên đầu", Reps = 10, Calories = 8, Duration = 2, Difficulty = Difficulties.Medium },
                new Exercise { Id = 14, Name = "Lateral Raise", MuscleGroup = MuscleGroups.Vai, Environment = Environments.Both, Instructions = "Giơ tạ ra hai bên đến ngang vai", Reps = 12, Calories = 6, Duration = 2, Difficulty = Difficulties.Easy },
                
                // Lưng
                new Exercise { Id = 15, Name = "Pull-up", MuscleGroup = MuscleGroups.Lung, Environment = Environments.Both, Instructions = "Treo xà đơn, kéo người lên đến khi cằm qua xà", Reps = 8, Calories = 9, Duration = 2, Difficulty = Difficulties.Hard },
                new Exercise { Id = 16, Name = "Bent Over Row", MuscleGroup = MuscleGroups.Lung, Environment = Environments.Gym, Instructions = "Cúi người, kéo tạ về phía ngực", Reps = 12, Calories = 8, Duration = 2, Difficulty = Difficulties.Medium },
                new Exercise { Id = 17, Name = "Superman", MuscleGroup = MuscleGroups.Lung, Environment = Environments.Home, Instructions = "Nằm sấp, nâng tay và chân lên cùng lúc", Reps = 15, Calories = 5, Duration = 2, Difficulty = Difficulties.Easy }
            );
        }
    }
}
