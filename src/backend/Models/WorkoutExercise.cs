using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTracker.API.Models
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

        public int? ActualDuration { get; set; }

        // Navigation properties
        [ForeignKey("WorkoutSessionId")]
        public WorkoutSession WorkoutSession { get; set; } = null!;

        [ForeignKey("ExerciseId")]
        public Exercise Exercise { get; set; } = null!;
    }
}
