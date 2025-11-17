using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Models;
using FitnessTracker.WPF.Services;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class WorkoutViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly IAIService _aiService;
        private readonly MainViewModel _mainViewModel;

        // Step management
        [ObservableProperty]
        private string currentStep = "Environment"; // Environment, Select, Active, Rest, Complete, Results

        // Environment & Goal
        [ObservableProperty]
        private string? selectedEnvironment;

        [ObservableProperty]
        private string selectedGoal = "Tăng cơ";

        [ObservableProperty]
        private string? selectedMuscleGroup;

        // Exercises
        [ObservableProperty]
        private ObservableCollection<Exercise> availableExercises = new();

        [ObservableProperty]
        private ObservableCollection<WorkoutExercise> selectedExercises = new();

        // Workout execution
        [ObservableProperty]
        private int currentExerciseIndex;

        [ObservableProperty]
        private int currentSet = 1;

        [ObservableProperty]
        private WorkoutExercise? currentWorkoutExercise;

        [ObservableProperty]
        private bool isResting;

        [ObservableProperty]
        private int restTimeRemaining;

        [ObservableProperty]
        private string restTimeDisplay = "1:00";

        // Metrics
        [ObservableProperty]
        private int totalCalories;

        [ObservableProperty]
        private int estimatedTime;

        [ObservableProperty]
        private int totalSets;

        [ObservableProperty]
        private DateTime? workoutStartTime;

        [ObservableProperty]
        private DateTime? workoutEndTime;

        // Results
        [ObservableProperty]
        private FoodRecommendation? foodRecommendation;

        [ObservableProperty]
        private bool isLoadingAI;

        [ObservableProperty]
        private string workoutName = "";

        public ObservableCollection<string> MuscleGroups { get; } = new(Models.MuscleGroups.All);
        public ObservableCollection<string> Environments { get; } = new(Models.Environments.All);
        public ObservableCollection<string> Goals { get; } = new() { "Tăng cơ", "Giảm cân", "Tăng sức bền" };

        private System.Windows.Threading.DispatcherTimer? _restTimer;

        public WorkoutViewModel(
            IDatabaseService databaseService,
            IAIService aiService,
            MainViewModel mainViewModel)
        {
            _databaseService = databaseService;
            _aiService = aiService;
            _mainViewModel = mainViewModel;
        }

        [RelayCommand]
        private void SelectEnvironment(string environment)
        {
            SelectedEnvironment = environment;
        }

        [RelayCommand]
        private void ContinueToMuscleSelection()
        {
            if (string.IsNullOrEmpty(SelectedEnvironment)) return;
            CurrentStep = "Select";
        }

        [RelayCommand]
        private async Task LoadExercisesAsync()
        {
            if (string.IsNullOrEmpty(SelectedMuscleGroup)) return;
            
            var exercises = await _databaseService.GetExercisesByMuscleGroupAsync(
                SelectedMuscleGroup, 
                SelectedEnvironment);
            
            AvailableExercises.Clear();
            foreach (var ex in exercises)
            {
                AvailableExercises.Add(ex);
            }
        }

        [RelayCommand]
        private void ToggleExerciseSelection(Exercise exercise)
        {
            var existing = SelectedExercises.FirstOrDefault(we => we.ExerciseId == exercise.Id);
            if (existing != null)
            {
                SelectedExercises.Remove(existing);
            }
            else
            {
                SelectedExercises.Add(new WorkoutExercise
                {
                    Exercise = exercise,
                    ExerciseId = exercise.Id,
                    Sets = 3,
                    Reps = exercise.Reps,
                    RestTime = 60
                });
            }
            CalculateMetrics();
        }

        [RelayCommand]
        private async Task AISuggestWorkoutAsync()
        {
            if (string.IsNullOrEmpty(SelectedMuscleGroup)) return;

            var suggested = await _aiService.SuggestOptimalWorkoutAsync(
                AvailableExercises.ToList(),
                SelectedMuscleGroup,
                SelectedGoal);

            SelectedExercises.Clear();
            foreach (var ex in suggested)
            {
                SelectedExercises.Add(ex);
            }
            CalculateMetrics();
        }

        [RelayCommand]
        private void StartWorkout()
        {
            if (SelectedExercises.Count == 0) return;

            WorkoutStartTime = DateTime.Now;
            CurrentStep = "Active";
            CurrentExerciseIndex = 0;
            CurrentSet = 1;
            UpdateCurrentExercise();
        }

        [RelayCommand]
        private void CompleteSet()
        {
            if (CurrentWorkoutExercise == null) return;

            if (CurrentSet < CurrentWorkoutExercise.Sets)
            {
                // Start rest
                CurrentSet++;
                StartRest(CurrentWorkoutExercise.RestTime);
            }
            else
            {
                // Move to next exercise
                if (CurrentExerciseIndex < SelectedExercises.Count - 1)
                {
                    CurrentExerciseIndex++;
                    CurrentSet = 1;
                    UpdateCurrentExercise();
                    StartRest(60); // 1 minute between exercises
                }
                else
                {
                    FinishWorkout();
                }
            }
        }

        [RelayCommand]
        private void SkipRest()
        {
            _restTimer?.Stop();
            IsResting = false;
            CurrentStep = "Active";
            UpdateCurrentExercise();
        }

        private void StartRest(int seconds)
        {
            IsResting = true;
            RestTimeRemaining = seconds;
            CurrentStep = "Rest";
            UpdateRestTimeDisplay();

            _restTimer = new System.Windows.Threading.DispatcherTimer();
            _restTimer.Interval = TimeSpan.FromSeconds(1);
            _restTimer.Tick += (s, e) =>
            {
                RestTimeRemaining--;
                UpdateRestTimeDisplay();

                if (RestTimeRemaining <= 0)
                {
                    _restTimer.Stop();
                    IsResting = false;
                    CurrentStep = "Active";
                    UpdateCurrentExercise();
                }
            };
            _restTimer.Start();
        }

        private void UpdateRestTimeDisplay()
        {
            int minutes = RestTimeRemaining / 60;
            int seconds = RestTimeRemaining % 60;
            RestTimeDisplay = $"{minutes}:{seconds:D2}";
        }

        private void UpdateCurrentExercise()
        {
            if (CurrentExerciseIndex < SelectedExercises.Count)
            {
                CurrentWorkoutExercise = SelectedExercises[CurrentExerciseIndex];
            }
        }

        private async void FinishWorkout()
        {
            WorkoutEndTime = DateTime.Now;
            CurrentStep = "Complete";

            // Load AI recommendations
            if (_aiService.IsEnabled)
            {
                IsLoadingAI = true;
                try
                {
                    var metrics = _aiService.CalculateWorkoutMetrics(SelectedExercises.ToList());
                    var muscleGroups = SelectedExercises
                        .Select(we => we.Exercise.MuscleGroup)
                        .Distinct()
                        .ToList();

                    FoodRecommendation = await _aiService.GetFoodRecommendationAsync(
                        muscleGroups,
                        metrics.TotalCalories,
                        metrics.TotalSets,
                        metrics.TotalReps);
                }
                finally
                {
                    IsLoadingAI = false;
                }
            }
        }

        [RelayCommand]
        private async Task SaveWorkoutAsync(bool shouldSave)
        {
            var metrics = _aiService.CalculateWorkoutMetrics(SelectedExercises.ToList());
            
            var session = new WorkoutSession
            {
                Date = DateTime.Now,
                TotalCalories = metrics.TotalCalories,
                TotalDuration = metrics.TotalDuration,
                TotalRestTime = metrics.TotalRestTime,
                Saved = shouldSave,
                Environment = SelectedEnvironment,
                Goal = SelectedGoal,
                WorkoutExercises = SelectedExercises.ToList()
            };

            await _databaseService.AddWorkoutSessionAsync(session);

            if (shouldSave && !string.IsNullOrEmpty(WorkoutName))
            {
                var savedWorkout = new SavedWorkout
                {
                    Name = WorkoutName,
                    Date = DateTime.Now,
                    MuscleGroup = SelectedMuscleGroup!,
                    TotalCalories = metrics.TotalCalories,
                    TotalDuration = metrics.TotalDuration,
                    WorkoutSessionId = session.Id
                };

                await _databaseService.AddSavedWorkoutAsync(savedWorkout);
            }

            CurrentStep = "Results";
        }

        [RelayCommand]
        private void GoBack()
        {
            _mainViewModel.NavigateToDashboardCommand.Execute(null);
        }

        private void CalculateMetrics()
        {
            if (!SelectedExercises.Any()) return;

            var metrics = _aiService.CalculateWorkoutMetrics(SelectedExercises.ToList());
            TotalCalories = metrics.TotalCalories;
            EstimatedTime = metrics.EstimatedTime;
            TotalSets = metrics.TotalSets;
        }
    }
}
