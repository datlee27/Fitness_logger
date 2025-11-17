using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTracker.WPF.Models
{
    public class SavedWorkout
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(50)]
        public string MuscleGroup { get; set; } = string.Empty;

        public int TotalCalories { get; set; }

        public int TotalDuration { get; set; } // in minutes

        // Reference to the workout session
        public int? WorkoutSessionId { get; set; }

        [ForeignKey("WorkoutSessionId")]
        public WorkoutSession? WorkoutSession { get; set; }
    }
}
