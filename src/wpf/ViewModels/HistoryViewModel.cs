using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Models;
using FitnessTracker.WPF.Services;
using System.Windows;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class HistoryViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly MainViewModel _mainViewModel;

        [ObservableProperty]
        private ObservableCollection<SavedWorkout> savedWorkouts = new();

        public HistoryViewModel(IDatabaseService databaseService, MainViewModel mainViewModel)
        {
            _databaseService = databaseService;
            _mainViewModel = mainViewModel;
            LoadSavedWorkoutsAsync();
        }

        private async void LoadSavedWorkoutsAsync()
        {
            var workouts = await _databaseService.GetSavedWorkoutsAsync();
            SavedWorkouts.Clear();
            foreach (var workout in workouts)
            {
                SavedWorkouts.Add(workout);
            }
        }

        [RelayCommand]
        private async Task DeleteWorkoutAsync(SavedWorkout workout)
        {
            var result = MessageBox.Show(
                $"Bạn có chắc chắn muốn xóa '{workout.Name}'?",
                "Xác nhận xóa",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                await _databaseService.DeleteSavedWorkoutAsync(workout.Id);
                SavedWorkouts.Remove(workout);
                MessageBox.Show("Đã xóa thành công!", "Thành công", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        [RelayCommand]
        private void GoBack()
        {
            _mainViewModel.NavigateToDashboardCommand.Execute(null);
        }
    }
}
