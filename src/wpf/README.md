# 🏋️ Fitness Tracker WPF Application

Ứng dụng quản lý tập luyện được xây dựng bằng WPF (.NET 8), Entity Framework Core, và MySQL.

## 📋 Yêu cầu

- .NET 8.0 SDK
- MySQL 8.0+
- Visual Studio 2022 (recommended)

## 🚀 Cài đặt

### 1. Clone và mở project

```bash
cd wpf/FitnessTracker.WPF
```

### 2. Cấu hình MySQL Connection String

Mở file `Data/FitnessDbContext.cs` và cập nhật connection string:

```csharp
var connectionString = "Server=localhost;Port=3306;Database=fitness_tracker_wpf;User=root;Password=YOUR_PASSWORD;";
```

Hoặc sử dụng `appsettings.json` (khuyến nghị).

### 3. Tạo Database

Mở Package Manager Console trong Visual Studio và chạy:

```bash
Add-Migration InitialCreate
Update-Database
```

Hoặc sử dụng .NET CLI:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Chạy ứng dụng

Trong Visual Studio: Nhấn F5

Hoặc dùng CLI:
```bash
dotnet run
```

## 🤖 Bật/Tắt AI

### Cách 1: Trong Code

Mở file `Services/AIService.cs` và thay đổi:

```csharp
public bool IsEnabled { get; private set; } = true; // Set = false để tắt AI
```

### Cách 2: Trong appsettings.json

```json
{
  "AppSettings": {
    "EnableAI": false
  }
}
```

Sau đó update constructor của AIService để đọc từ config.

### Khi AI bị tắt:

- ✅ Ứng dụng vẫn hoạt động bình thường
- ✅ Chọn bài tập thủ công như thường
- ✅ Đề xuất bài tập sẽ dùng logic đơn giản (chọn 3 bài đầu tiên)
- ❌ Không có gợi ý dinh dưỡng từ AI
- ❌ Không có tối ưu hóa bài tập theo mục tiêu

## 📁 Cấu trúc Project

```
FitnessTracker.WPF/
├── Models/                    # Entity models
│   ├── Exercise.cs
│   ├── WorkoutSession.cs
│   ├── WorkoutExercise.cs
│   └── SavedWorkout.cs
├── Data/                      # Database context
│   └── FitnessDbContext.cs
├── Services/                  # Business logic
│   ├── DatabaseService.cs     # Database operations
│   └── AIService.cs           # AI features (có thể tắt)
├── ViewModels/                # MVVM ViewModels
│   ├── MainViewModel.cs
│   ├── DashboardViewModel.cs
│   ├── WorkoutViewModel.cs
│   ├── AddExerciseViewModel.cs
│   ├── ReportsViewModel.cs
│   └── HistoryViewModel.cs
├── Views/                     # XAML Views
│   ├── DashboardView.xaml
│   ├── WorkoutView.xaml
│   ├── AddExerciseView.xaml
│   ├── ReportsView.xaml
│   └── HistoryView.xaml
├── App.xaml                   # Application entry point
├── MainWindow.xaml            # Main window
└── appsettings.json           # Configuration
```

## 🎯 Tính năng

### 1. Dashboard
- Hiển thị thống kê tổng quan
- Quick access đến các chức năng chính
- Hiển thị trạng thái AI (bật/tắt)

### 2. Bắt đầu tập luyện
- Chọn môi trường: Ở nhà / Phòng gym
- Chọn mục tiêu: Tăng cơ / Giảm cân / Tăng sức bền
- Chọn nhóm cơ
- Chọn bài tập thủ công HOẶC AI đề xuất
- Đồng hồ đếm ngược trong lúc tập
- Thời gian nghỉ tự động
- Gợi ý dinh dưỡng sau tập (nếu AI bật)

### 3. Thêm bài tập
- Tạo bài tập tùy chỉnh
- Phân loại theo nhóm cơ, môi trường, độ khó
- Lưu vào database

### 4. Báo cáo
- Thống kê theo ngày/tuần/tháng/năm
- Tổng calories, thời gian, buổi tập
- Trung bình mỗi buổi

### 5. Nhật ký
- Xem các bài tập đã lưu
- Tập lại
- Xóa bài tập

## 🗄️ Database Schema

### Exercises
- Id, Name, MuscleGroup, Environment
- Instructions, Reps, Calories, Duration
- Difficulty, ImageUrl, CreatedAt

### WorkoutSessions
- Id, Date, TotalCalories, TotalDuration
- TotalRestTime, Saved, Environment, Goal

### WorkoutExercises (Join table)
- Id, WorkoutSessionId, ExerciseId
- Sets, Reps, RestTime, ActualDuration, Completed

### SavedWorkouts
- Id, Name, Date, MuscleGroup
- TotalCalories, TotalDuration, WorkoutSessionId

## 🎨 Công nghệ sử dụng

- **Framework**: WPF (.NET 8.0)
- **Pattern**: MVVM với CommunityToolkit.Mvvm
- **Database**: MySQL với Entity Framework Core
- **ORM**: Pomelo.EntityFrameworkCore.MySql
- **DI**: Microsoft.Extensions.DependencyInjection
- **Charts**: LiveCharts.Wpf (optional)

## 🔧 Troubleshooting

### Lỗi kết nối MySQL
```
Kiểm tra:
1. MySQL server đang chạy
2. Connection string đúng (user, password, port)
3. Database đã được tạo
```

### Lỗi Migration
```bash
# Xóa migration cũ
dotnet ef migrations remove

# Tạo lại
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### AI không hoạt động
```
Kiểm tra:
1. AIService.IsEnabled = true
2. Không có exception trong GetFoodRecommendationAsync
3. Database có dữ liệu exercises
```

## 📝 Seed Data

Database được seed với 17 bài tập mẫu:
- Phân loại theo 6 nhóm cơ
- Chia theo môi trường (Ở nhà / Phòng gym / Cả hai)
- 3 mức độ khó

## 🚀 Deployment

### Build Release

```bash
dotnet publish -c Release -r win-x64 --self-contained
```

Output sẽ có tại: `bin/Release/net8.0-windows/win-x64/publish/`

### Tạo Installer

Sử dụng:
- WiX Toolset
- Inno Setup
- Advanced Installer

## 📞 Support

Nếu gặp vấn đề:
1. Check connection string
2. Kiểm tra MySQL đang chạy
3. Verify migrations đã applied
4. Check AI service enabled/disabled

---

**Chúc bạn code vui vẻ! 💪🔥**
