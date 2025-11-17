using Microsoft.EntityFrameworkCore;
using FitnessTracker.WPF.Data;
using FitnessTracker.WPF.Models;

namespace FitnessTracker.WPF.Services
{
    public interface IDatabaseService
    {
        // Exercises
        Task<List<Exercise>> GetExercisesAsync();
        Task<List<Exercise>> GetExercisesByMuscleGroupAsync(string muscleGroup, string? environment = null);
        Task<Exercise?> GetExerciseByIdAsync(int id);
        Task<Exercise> AddExerciseAsync(Exercise exercise);
        Task<Exercise> UpdateExerciseAsync(Exercise exercise);
        Task DeleteExerciseAsync(int id);

        // Workout Sessions
        Task<List<WorkoutSession>> GetWorkoutSessionsAsync();
        Task<WorkoutSession?> GetWorkoutSessionByIdAsync(int id);
        Task<List<WorkoutSession>> GetWorkoutSessionsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<WorkoutSession> AddWorkoutSessionAsync(WorkoutSession session);
        Task DeleteWorkoutSessionAsync(int id);

        // Saved Workouts
        Task<List<SavedWorkout>> GetSavedWorkoutsAsync();
        Task<SavedWorkout?> GetSavedWorkoutByIdAsync(int id);
        Task<SavedWorkout> AddSavedWorkoutAsync(SavedWorkout workout);
        Task DeleteSavedWorkoutAsync(int id);

        // Statistics
        Task<WorkoutStats> GetWorkoutStatsAsync(DateTime? startDate = null, DateTime? endDate = null);
    }

    public class DatabaseService : IDatabaseService
    {
        private readonly FitnessDbContext _context;

        public DatabaseService()
        {
            _context = new FitnessDbContext();
            // Ensure database is created
            _context.Database.EnsureCreated();
        }

        // Exercises
        public async Task<List<Exercise>> GetExercisesAsync()
        {
            return await _context.Exercises.ToListAsync();
        }

        public async Task<List<Exercise>> GetExercisesByMuscleGroupAsync(string muscleGroup, string? environment = null)
        {
            var query = _context.Exercises.Where(e => e.MuscleGroup == muscleGroup);
            
            if (!string.IsNullOrEmpty(environment))
            {
                query = query.Where(e => e.Environment == environment || e.Environment == Environments.Both);
            }
            
            return await query.ToListAsync();
        }

        public async Task<Exercise?> GetExerciseByIdAsync(int id)
        {
            return await _context.Exercises.FindAsync(id);
        }

        public async Task<Exercise> AddExerciseAsync(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<Exercise> UpdateExerciseAsync(Exercise exercise)
        {
            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task DeleteExerciseAsync(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise != null)
            {
                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();
            }
        }

        // Workout Sessions
        public async Task<List<WorkoutSession>> GetWorkoutSessionsAsync()
        {
            return await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .OrderByDescending(ws => ws.Date)
                .ToListAsync();
        }

        public async Task<WorkoutSession?> GetWorkoutSessionByIdAsync(int id)
        {
            return await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .FirstOrDefaultAsync(ws => ws.Id == id);
        }

        public async Task<List<WorkoutSession>> GetWorkoutSessionsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.WorkoutSessions
                .Include(ws => ws.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .Where(ws => ws.Date >= startDate && ws.Date <= endDate)
                .OrderByDescending(ws => ws.Date)
                .ToListAsync();
        }

        public async Task<WorkoutSession> AddWorkoutSessionAsync(WorkoutSession session)
        {
            _context.WorkoutSessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task DeleteWorkoutSessionAsync(int id)
        {
            var session = await _context.WorkoutSessions.FindAsync(id);
            if (session != null)
            {
                _context.WorkoutSessions.Remove(session);
                await _context.SaveChangesAsync();
            }
        }

        // Saved Workouts
        public async Task<List<SavedWorkout>> GetSavedWorkoutsAsync()
        {
            return await _context.SavedWorkouts
                .Include(sw => sw.WorkoutSession)
                    .ThenInclude(ws => ws!.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .OrderByDescending(sw => sw.Date)
                .ToListAsync();
        }

        public async Task<SavedWorkout?> GetSavedWorkoutByIdAsync(int id)
        {
            return await _context.SavedWorkouts
                .Include(sw => sw.WorkoutSession)
                    .ThenInclude(ws => ws!.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .FirstOrDefaultAsync(sw => sw.Id == id);
        }

        public async Task<SavedWorkout> AddSavedWorkoutAsync(SavedWorkout workout)
        {
            _context.SavedWorkouts.Add(workout);
            await _context.SaveChangesAsync();
            return workout;
        }

        public async Task DeleteSavedWorkoutAsync(int id)
        {
            var workout = await _context.SavedWorkouts.FindAsync(id);
            if (workout != null)
            {
                _context.SavedWorkouts.Remove(workout);
                await _context.SaveChangesAsync();
            }
        }

        // Statistics
        public async Task<WorkoutStats> GetWorkoutStatsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.WorkoutSessions.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(ws => ws.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(ws => ws.Date <= endDate.Value);

            var sessions = await query.ToListAsync();

            return new WorkoutStats
            {
                TotalSessions = sessions.Count,
                TotalCalories = sessions.Sum(ws => ws.TotalCalories),
                TotalDuration = sessions.Sum(ws => ws.TotalDuration),
                AverageCaloriesPerSession = sessions.Any() ? sessions.Average(ws => ws.TotalCalories) : 0,
                AverageDurationPerSession = sessions.Any() ? sessions.Average(ws => ws.TotalDuration) : 0
            };
        }
    }

    public class WorkoutStats
    {
        public int TotalSessions { get; set; }
        public int TotalCalories { get; set; }
        public int TotalDuration { get; set; }
        public double AverageCaloriesPerSession { get; set; }
        public double AverageDurationPerSession { get; set; }
    }
}
