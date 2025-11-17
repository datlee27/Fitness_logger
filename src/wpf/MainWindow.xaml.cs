using System.Windows;
using FitnessTracker.WPF.ViewModels;

namespace FitnessTracker.WPF
{
    public partial class MainWindow : Window
    {
        public MainWindow(MainViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }
    }
}
