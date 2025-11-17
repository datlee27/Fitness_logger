using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessTracker.WPF.Models;
using FitnessTracker.WPF.Services;
using System.Windows;

namespace FitnessTracker.WPF.ViewModels
{
    public partial class AddExerciseViewModel : ObservableObject
    {
        private readonly IDatabaseService _databaseService;
        private readonly MainViewModel _mainViewModel;

        [ObservableProperty]
        private string name = "";

        [ObservableProperty]
        private string? selectedMuscleGroup;

        [ObservableProperty]
        private string selectedEnvironment = Environments.Both;

        [ObservableProperty]
        private string selectedDifficulty = Difficulties.Medium;

        [ObservableProperty]
        private string instructions = "";

        [ObservableProperty]
        private int reps = 10;

        [ObservableProperty]
        private int calories = 5;

        [ObservableProperty]
        private int duration = 2;

        public ObservableCollection<string> MuscleGroups { get; } = new(Models.MuscleGroups.All);
        public ObservableCollection<string> Environments { get; } = new(Models.Environments.All);
        public ObservableCollection<string> Difficulties { get; } = new(Models.Difficulties.All);

        public AddExerciseViewModel(IDatabaseService databaseService, MainViewModel mainViewModel)
        {
            _databaseService = databaseService;
            _mainViewModel = mainViewModel;
        }

        [RelayCommand]
        private async Task SaveAsync()
        {
            if (string.IsNullOrWhiteSpace(Name) || 
                string.IsNullOrEmpty(SelectedMuscleGroup) || 
                string.IsNullOrWhiteSpace(Instructions))
            {
                MessageBox.Show("Vui lòng điền đầy đủ thông tin!", "Lỗi", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var exercise = new Exercise
            {
                Name = Name,
                MuscleGroup = SelectedMuscleGroup,
                Environment = SelectedEnvironment,
                Instructions = Instructions,
                Reps = Reps,
                Calories = Calories,
                Duration = Duration,
                Difficulty = SelectedDifficulty
            };

            await _databaseService.AddExerciseAsync(exercise);
            MessageBox.Show($"Đã thêm bài tập '{Name}' thành công!", "Thành công", MessageBoxButton.OK, MessageBoxImage.Information);
            GoBack();
        }

        [RelayCommand]
        private void GoBack()
        {
            _mainViewModel.NavigateToDashboardCommand.Execute(null);
        }
    }
}
