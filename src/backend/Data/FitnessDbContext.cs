using Microsoft.EntityFrameworkCore;
using FitnessTracker.API.Models;

namespace FitnessTracker.API.Data
{
    public class FitnessDbContext : DbContext
    {
        public FitnessDbContext(DbContextOptions<FitnessDbContext> options) : base(options)
        {
        }

        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<SavedWorkout> SavedWorkouts { get; set; }

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
                new Exercise
                {
                    Id = 1,
                    Name = "Push-up",
                    MuscleGroup = "Ngực",
                    Instructions = "Nằm sấp, đặt tay rộng bằng vai, đẩy người lên xuống",
                    Reps = 15,
                    Calories = 7,
                    Duration = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                },
                new Exercise
                {
                    Id = 2,
                    Name = "Squat",
                    MuscleGroup = "Chân",
                    Instructions = "Đứng thẳng, chân rộng bằng vai, ngồi xuống như ngồi ghế",
                    Reps = 20,
                    Calories = 10,
                    Duration = 3,
                    ImageUrl = "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400"
                },
                new Exercise
                {
                    Id = 3,
                    Name = "Plank",
                    MuscleGroup = "Bụng",
                    Instructions = "Chống tay hoặc khuỷu tay, giữ thẳng người",
                    Reps = 1,
                    Calories = 5,
                    Duration = 1,
                    ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
                },
                new Exercise
                {
                    Id = 4,
                    Name = "Bicep Curl",
                    MuscleGroup = "Tay",
                    Instructions = "Cầm tạ, uốn cong tay về phía vai",
                    Reps = 12,
                    Calories = 6,
                    Duration = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400"
                },
                new Exercise
                {
                    Id = 5,
                    Name = "Shoulder Press",
                    MuscleGroup = "Vai",
                    Instructions = "Đẩy tạ từ vai lên trên đầu",
                    Reps = 10,
                    Calories = 8,
                    Duration = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400"
                },
                new Exercise
                {
                    Id = 6,
                    Name = "Pull-up",
                    MuscleGroup = "Lưng",
                    Instructions = "Treo xà đơn, kéo người lên đến khi cằm qua xà",
                    Reps = 8,
                    Calories = 9,
                    Duration = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400"
                },
                new Exercise
                {
                    Id = 7,
                    Name = "Crunch",
                    MuscleGroup = "Bụng",
                    Instructions = "Nằm ngửa, gập bụng lên",
                    Reps = 20,
                    Calories = 5,
                    Duration = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
                },
                new Exercise
                {
                    Id = 8,
                    Name = "Lunge",
                    MuscleGroup = "Chân",
                    Instructions = "Bước chân về phía trước, hạ thấp người xuống",
                    Reps = 15,
                    Calories = 8,
                    Duration = 3,
                    ImageUrl = "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400"
                }
            );
        }
    }
}
