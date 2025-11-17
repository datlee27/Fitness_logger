using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTracker.WPF.Models
{
    public class WorkoutSession
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        public int TotalCalories { get; set; }

        public int TotalDuration { get; set; } // in minutes

        public int TotalRestTime { get; set; } // in seconds

        public bool Saved { get; set; }

        [MaxLength(50)]
        public string? Environment { get; set; }

        [MaxLength(50)]
        public string? Goal { get; set; }

        // Navigation property
        public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    }
}
