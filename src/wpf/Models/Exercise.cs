using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTracker.WPF.Models
{
    public class Exercise
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string MuscleGroup { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Environment { get; set; } = "Cả hai";

        [Required]
        [MaxLength(1000)]
        public string Instructions { get; set; } = string.Empty;

        public int Reps { get; set; }

        public int Calories { get; set; }

        public int Duration { get; set; } // in minutes

        [MaxLength(50)]
        public string Difficulty { get; set; } = "Trung bình";

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    }

    // Enums for validation
    public static class MuscleGroups
    {
        public const string Tay = "Tay";
        public const string Nguc = "Ngực";
        public const string Vai = "Vai";
        public const string Chan = "Chân";
        public const string Bung = "Bụng";
        public const string Lung = "Lưng";

        public static string[] All = { Tay, Nguc, Vai, Chan, Bung, Lung };
    }

    public static class Environments
    {
        public const string Home = "Ở nhà";
        public const string Gym = "Phòng gym";
        public const string Both = "Cả hai";

        public static string[] All = { Home, Gym, Both };
    }

    public static class Difficulties
    {
        public const string Easy = "Dễ";
        public const string Medium = "Trung bình";
        public const string Hard = "Khó";

        public static string[] All = { Easy, Medium, Hard };
    }
}
