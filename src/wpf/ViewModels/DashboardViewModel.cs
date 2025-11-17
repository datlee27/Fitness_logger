using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Services;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class DashboardViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly IAIService _aiService;
        private readonly MainViewModel _mainViewModel;

        [ObservableProperty]
        private int totalSessions;

        [ObservableProperty]
        private int totalCalories;

        [ObservableProperty]
        private int totalDuration;

        [ObservableProperty]
        private bool isAIEnabled;

        public DashboardViewModel(
            IDatabaseService databaseService, 
            IAIService aiService,
            MainViewModel mainViewModel)
        {
            _databaseService = databaseService;
            _aiService = aiService;
            _mainViewModel = mainViewModel;
            IsAIEnabled = _aiService.IsEnabled;
            
            LoadStatsAsync();
        }

        private async void LoadStatsAsync()
        {
            var stats = await _databaseService.GetWorkoutStatsAsync();
            TotalSessions = stats.TotalSessions;
            TotalCalories = stats.TotalCalories;
            TotalDuration = stats.TotalDuration;
        }

        [RelayCommand]
        private void StartWorkout()
        {
            _mainViewModel.NavigateToWorkoutCommand.Execute(null);
        }

        [RelayCommand]
        private void AddExercise()
        {
            _mainViewModel.NavigateToAddExerciseCommand.Execute(null);
        }

        [RelayCommand]
        private void ViewReports()
        {
            _mainViewModel.NavigateToReportsCommand.Execute(null);
        }

        [RelayCommand]
        private void ViewHistory()
        {
            _mainViewModel.NavigateToHistoryCommand.Execute(null);
        }
    }
}
