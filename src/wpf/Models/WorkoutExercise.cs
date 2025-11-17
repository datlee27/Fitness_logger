using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTracker.WPF.Models
{
    public class WorkoutExercise
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int WorkoutSessionId { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public int RestTime { get; set; } // in seconds

        public int? ActualDuration { get; set; }

        public bool Completed { get; set; }

        // Navigation properties
        [ForeignKey("WorkoutSessionId")]
        public WorkoutSession WorkoutSession { get; set; } = null!;

        [ForeignKey("ExerciseId")]
        public Exercise Exercise { get; set; } = null!;
    }
}
