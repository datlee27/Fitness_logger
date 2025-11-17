using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Services;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class ReportsViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly MainViewModel _mainViewModel;

        [ObservableProperty]
        private string selectedTimeRange = "Tuần";

        [ObservableProperty]
        private int totalSessions;

        [ObservableProperty]
        private int totalCalories;

        [ObservableProperty]
        private int totalDuration;

        [ObservableProperty]
        private double avgCalories;

        [ObservableProperty]
        private double avgDuration;

        public ObservableCollection<string> TimeRanges { get; } = new() { "Ngày", "Tuần", "Tháng", "Năm" };

        public ReportsViewModel(IDatabaseService databaseService, MainViewModel mainViewModel)
        {
            _databaseService = databaseService;
            _mainViewModel = mainViewModel;
            LoadStatsAsync();
        }

        partial void OnSelectedTimeRangeChanged(string value)
        {
            LoadStatsAsync();
        }

        private async void LoadStatsAsync()
        {
            DateTime? startDate = null;
            var endDate = DateTime.Now;

            switch (SelectedTimeRange)
            {
                case "Ngày":
                    startDate = endDate.AddDays(-1);
                    break;
                case "Tuần":
                    startDate = endDate.AddDays(-7);
                    break;
                case "Tháng":
                    startDate = endDate.AddMonths(-1);
                    break;
                case "Năm":
                    startDate = endDate.AddYears(-1);
                    break;
            }

            var stats = await _databaseService.GetWorkoutStatsAsync(startDate, endDate);
            TotalSessions = stats.TotalSessions;
            TotalCalories = stats.TotalCalories;
            TotalDuration = stats.TotalDuration;
            AvgCalories = stats.AverageCaloriesPerSession;
            AvgDuration = stats.AverageDurationPerSession;
        }

        [RelayCommand]
        private void GoBack()
        {
            _mainViewModel.NavigateToDashboardCommand.Execute(null);
        }
    }
}
