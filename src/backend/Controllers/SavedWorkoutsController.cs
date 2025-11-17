using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTracker.API.Data;
using FitnessTracker.API.Models;

namespace FitnessTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedWorkoutsController : ControllerBase
    {
        private readonly FitnessDbContext _context;

        public SavedWorkoutsController(FitnessDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedWorkouts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSavedWorkouts()
        {
            var savedWorkouts = await _context.SavedWorkouts
                .Include(sw => sw.WorkoutSession)
                    .ThenInclude(ws => ws!.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .OrderByDescending(sw => sw.Date)
                .Select(sw => new
                {
                    sw.Id,
                    sw.Name,
                    sw.Date,
                    sw.MuscleGroup,
                    sw.TotalCalories,
                    sw.TotalDuration,
                    Exercises = sw.WorkoutSession!.WorkoutExercises.Select(we => new
                    {
                        Exercise = we.Exercise,
                        we.Sets,
                        we.ActualDuration
                    })
                })
                .ToListAsync();

            return Ok(savedWorkouts);
        }

        // GET: api/SavedWorkouts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSavedWorkout(int id)
        {
            var savedWorkout = await _context.SavedWorkouts
                .Include(sw => sw.WorkoutSession)
                    .ThenInclude(ws => ws!.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .Where(sw => sw.Id == id)
                .Select(sw => new
                {
                    sw.Id,
                    sw.Name,
                    sw.Date,
                    sw.MuscleGroup,
                    sw.TotalCalories,
                    sw.TotalDuration,
                    Exercises = sw.WorkoutSession!.WorkoutExercises.Select(we => new
                    {
                        Exercise = we.Exercise,
                        we.Sets,
                        we.ActualDuration
                    })
                })
                .FirstOrDefaultAsync();

            if (savedWorkout == null)
            {
                return NotFound();
            }

            return savedWorkout;
        }

        // POST: api/SavedWorkouts
        [HttpPost]
        public async Task<ActionResult<SavedWorkout>> PostSavedWorkout(SavedWorkoutDto dto)
        {
            var savedWorkout = new SavedWorkout
            {
                Name = dto.Name,
                Date = dto.Date,
                MuscleGroup = dto.MuscleGroup,
                TotalCalories = dto.TotalCalories,
                TotalDuration = dto.TotalDuration,
                WorkoutSessionId = dto.WorkoutSessionId
            };

            _context.SavedWorkouts.Add(savedWorkout);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSavedWorkout), new { id = savedWorkout.Id }, savedWorkout);
        }

        // DELETE: api/SavedWorkouts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSavedWorkout(int id)
        {
            var savedWorkout = await _context.SavedWorkouts.FindAsync(id);
            if (savedWorkout == null)
            {
                return NotFound();
            }

            _context.SavedWorkouts.Remove(savedWorkout);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO for creating saved workouts
    public class SavedWorkoutDto
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string MuscleGroup { get; set; } = string.Empty;
        public int TotalCalories { get; set; }
        public int TotalDuration { get; set; }
        public int? WorkoutSessionId { get; set; }
    }
}
