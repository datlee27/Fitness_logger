using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using FitnessTracker.WPF.Services;
using FitnessTracker.WPF.ViewModels;

namespace FitnessTracker.WPF
{
    public partial class App : Application
    {
        private ServiceProvider? _serviceProvider;

        public App()
        {
            var services = new ServiceCollection();
            ConfigureServices(services);
            _serviceProvider = services.BuildServiceProvider();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Services
            services.AddSingleton<IDatabaseService, DatabaseService>();
            services.AddSingleton<IAIService, AIService>();

            // ViewModels
            services.AddTransient<MainViewModel>();

            // Main Window
            services.AddSingleton<MainWindow>();
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            var mainWindow = _serviceProvider!.GetRequiredService<MainWindow>();
            mainWindow.Show();
        }
    }
}
