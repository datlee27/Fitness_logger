using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Services;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly IAIService _aiService;

        [ObservableProperty]
        private object? currentView;

        [ObservableProperty]
        private string currentPageTitle = "Dashboard";

        public MainViewModel(IDatabaseService databaseService, IAIService aiService)
        {
            _databaseService = databaseService;
            _aiService = aiService;
            
            // Start with Dashboard
            NavigateToDashboard();
        }

        [RelayCommand]
        private void NavigateToDashboard()
        {
            CurrentView = new DashboardViewModel(_databaseService, _aiService, this);
            CurrentPageTitle = "Fitness Tracker - Dashboard";
        }

        [RelayCommand]
        private void NavigateToWorkout()
        {
            CurrentView = new WorkoutViewModel(_databaseService, _aiService, this);
            CurrentPageTitle = "Bắt đầu tập luyện";
        }

        [RelayCommand]
        private void NavigateToAddExercise()
        {
            CurrentView = new AddExerciseViewModel(_databaseService, this);
            CurrentPageTitle = "Thêm bài tập mới";
        }

        [RelayCommand]
        private void NavigateToReports()
        {
            CurrentView = new ReportsViewModel(_databaseService, this);
            CurrentPageTitle = "Báo cáo";
        }

        [RelayCommand]
        private void NavigateToHistory()
        {
            CurrentView = new HistoryViewModel(_databaseService, this);
            CurrentPageTitle = "Nhật ký tập luyện";
        }
    }
}
