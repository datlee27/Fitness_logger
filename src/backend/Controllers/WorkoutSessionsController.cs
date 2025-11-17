using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTracker.API.Data;
using FitnessTracker.API.Models;

namespace FitnessTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutSessionsController : ControllerBase
    {
        private readonly FitnessDbContext _context;

        public WorkoutSessionsController(FitnessDbContext context)
        {
            _context = context;
        }

        // GET: api/WorkoutSessions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkoutSession>>> GetWorkoutSessions()
        {
            return await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .OrderByDescending(ws => ws.Date)
                .ToListAsync();
        }

        // GET: api/WorkoutSessions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkoutSession>> GetWorkoutSession(int id)
        {
            var workoutSession = await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .FirstOrDefaultAsync(ws => ws.Id == id);

            if (workoutSession == null)
            {
                return NotFound();
            }

            return workoutSession;
        }

        // GET: api/WorkoutSessions/date-range?startDate=2025-01-01&endDate=2025-12-31
        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<WorkoutSession>>> GetWorkoutSessionsByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var sessions = await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .Where(ws => ws.Date >= startDate && ws.Date <= endDate)
                .OrderByDescending(ws => ws.Date)
                .ToListAsync();

            return sessions;
        }

        // GET: api/WorkoutSessions/stats?startDate=2025-01-01&endDate=2025-12-31
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetWorkoutStats(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate)
        {
            var query = _context.WorkoutSessions.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(ws => ws.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(ws => ws.Date <= endDate.Value);
            }

            var stats = new
            {
                TotalSessions = await query.CountAsync(),
                TotalCalories = await query.SumAsync(ws => ws.TotalCalories),
                TotalDuration = await query.SumAsync(ws => ws.TotalDuration),
                AverageCaloriesPerSession = await query.AverageAsync(ws => (double?)ws.TotalCalories) ?? 0,
                AverageDurationPerSession = await query.AverageAsync(ws => (double?)ws.TotalDuration) ?? 0
            };

            return stats;
        }

        // POST: api/WorkoutSessions
        [HttpPost]
        public async Task<ActionResult<WorkoutSession>> PostWorkoutSession(WorkoutSessionDto dto)
        {
            var workoutSession = new WorkoutSession
            {
                Date = dto.Date,
                TotalCalories = dto.TotalCalories,
                TotalDuration = dto.TotalDuration,
                Saved = dto.Saved
            };

            _context.WorkoutSessions.Add(workoutSession);
            await _context.SaveChangesAsync();

            // Add workout exercises
            foreach (var exerciseDto in dto.Exercises)
            {
                var workoutExercise = new WorkoutExercise
                {
                    WorkoutSessionId = workoutSession.Id,
                    ExerciseId = exerciseDto.ExerciseId,
                    Sets = exerciseDto.Sets,
                    ActualDuration = exerciseDto.ActualDuration
                };
                _context.WorkoutExercises.Add(workoutExercise);
            }

            await _context.SaveChangesAsync();

            // Reload with exercises
            await _context.Entry(workoutSession)
                .Collection(ws => ws.WorkoutExercises)
                .Query()
                .Include(we => we.Exercise)
                .LoadAsync();

            return CreatedAtAction(nameof(GetWorkoutSession), new { id = workoutSession.Id }, workoutSession);
        }

        // DELETE: api/WorkoutSessions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkoutSession(int id)
        {
            var workoutSession = await _context.WorkoutSessions.FindAsync(id);
            if (workoutSession == null)
            {
                return NotFound();
            }

            _context.WorkoutSessions.Remove(workoutSession);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO for creating workout sessions
    public class WorkoutSessionDto
    {
        public DateTime Date { get; set; }
        public int TotalCalories { get; set; }
        public int TotalDuration { get; set; }
        public bool Saved { get; set; }
        public List<WorkoutExerciseDto> Exercises { get; set; } = new();
    }

    public class WorkoutExerciseDto
    {
        public int ExerciseId { get; set; }
        public int Sets { get; set; }
        public int? ActualDuration { get; set; }
    }
}
