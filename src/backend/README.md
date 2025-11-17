# Fitness Tracker API - C# Backend với MySQL

Backend API cho ứng dụng Fitness Tracker sử dụng ASP.NET Core 8.0 và MySQL.

## 📋 Yêu cầu hệ thống

- .NET 8.0 SDK hoặc cao hơn
- MySQL Server 8.0 hoặc cao hơn
- Visual Studio 2022 hoặc VS Code (hoặc bất kỳ IDE nào hỗ trợ .NET)

## 🚀 Cài đặt

### 1. Cài đặt .NET SDK

Tải và cài đặt .NET 8.0 SDK từ: https://dotnet.microsoft.com/download

Kiểm tra cài đặt:
```bash
dotnet --version
```

### 2. Cài đặt MySQL

**Windows:**
- Tải MySQL từ: https://dev.mysql.com/downloads/installer/
- Cài đặt MySQL Server và MySQL Workbench
- Ghi nhớ root password bạn đặt

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 3. Cấu hình Database

Mở MySQL command line hoặc MySQL Workbench và tạo database:

```sql
CREATE DATABASE fitness_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Cấu hình Connection String

Mở file `appsettings.json` và cập nhật connection string với thông tin MySQL của bạn:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=fitness_tracker;User=root;Password=YOUR_MYSQL_PASSWORD;"
  }
}
```

**Thay `YOUR_MYSQL_PASSWORD` bằng password MySQL của bạn!**

### 5. Cài đặt Entity Framework Core Tools

```bash
dotnet tool install --global dotnet-ef
```

Kiểm tra cài đặt:
```bash
dotnet ef
```

### 6. Tạo Migration và Database

Di chuyển vào thư mục project:
```bash
cd FitnessTracker.API
```

Tạo migration đầu tiên:
```bash
dotnet ef migrations add InitialCreate
```

Áp dụng migration vào database:
```bash
dotnet ef database update
```

## ▶️ Chạy ứng dụng

### Cách 1: Sử dụng .NET CLI

```bash
cd FitnessTracker.API
dotnet run
```

### Cách 2: Sử dụng Visual Studio

1. Mở file `FitnessTracker.API.csproj` trong Visual Studio
2. Nhấn F5 hoặc click nút "Run"

### Cách 3: Sử dụng VS Code

1. Mở thư mục `FitnessTracker.API` trong VS Code
2. Nhấn F5 hoặc Run > Start Debugging

## 📡 API Endpoints

Sau khi chạy, API sẽ có sẵn tại: `https://localhost:7xxx` hoặc `http://localhost:5xxx`

Swagger UI documentation: `https://localhost:7xxx/swagger`

### Exercises (Bài tập)

- `GET /api/exercises` - Lấy tất cả bài tập
- `GET /api/exercises/{id}` - Lấy bài tập theo ID
- `GET /api/exercises/muscle/{muscleGroup}` - Lấy bài tập theo vùng cơ
- `POST /api/exercises` - Tạo bài tập mới
- `PUT /api/exercises/{id}` - Cập nhật bài tập
- `DELETE /api/exercises/{id}` - Xóa bài tập

### Workout Sessions (Buổi tập)

- `GET /api/workoutsessions` - Lấy tất cả buổi tập
- `GET /api/workoutsessions/{id}` - Lấy buổi tập theo ID
- `GET /api/workoutsessions/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Lấy buổi tập theo khoảng thời gian
- `GET /api/workoutsessions/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Lấy thống kê
- `POST /api/workoutsessions` - Tạo buổi tập mới
- `DELETE /api/workoutsessions/{id}` - Xóa buổi tập

### Saved Workouts (Bài tập đã lưu)

- `GET /api/savedworkouts` - Lấy tất cả bài tập đã lưu
- `GET /api/savedworkouts/{id}` - Lấy bài tập đã lưu theo ID
- `POST /api/savedworkouts` - Lưu bài tập mới
- `DELETE /api/savedworkouts/{id}` - Xóa bài tập đã lưu

## 📊 Cấu trúc Database

### Bảng `Exercises`
- Id (int, primary key)
- Name (varchar)
- MuscleGroup (varchar)
- Instructions (varchar)
- Reps (int)
- Calories (int)
- Duration (int)
- ImageUrl (varchar, nullable)
- CreatedAt (datetime)

### Bảng `WorkoutSessions`
- Id (int, primary key)
- Date (datetime)
- TotalCalories (int)
- TotalDuration (int)
- Saved (boolean)

### Bảng `WorkoutExercises`
- Id (int, primary key)
- WorkoutSessionId (int, foreign key)
- ExerciseId (int, foreign key)
- Sets (int)
- ActualDuration (int, nullable)

### Bảng `SavedWorkouts`
- Id (int, primary key)
- Name (varchar)
- Date (datetime)
- MuscleGroup (varchar)
- TotalCalories (int)
- TotalDuration (int)
- WorkoutSessionId (int, foreign key, nullable)

## 🔧 Các lệnh hữu ích

### Tạo migration mới
```bash
dotnet ef migrations add MigrationName
```

### Cập nhật database
```bash
dotnet ef database update
```

### Xóa migration cuối cùng
```bash
dotnet ef migrations remove
```

### Xóa database
```bash
dotnet ef database drop
```

### Restore packages
```bash
dotnet restore
```

### Build project
```bash
dotnet build
```

### Clean project
```bash
dotnet clean
```

## 🧪 Test API

### Sử dụng Swagger UI
1. Chạy ứng dụng
2. Mở browser và truy cập: `https://localhost:7xxx/swagger`
3. Thử nghiệm các API endpoints

### Sử dụng curl

Lấy tất cả bài tập:
```bash
curl -X GET https://localhost:7xxx/api/exercises
```

Tạo bài tập mới:
```bash
curl -X POST https://localhost:7xxx/api/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Exercise",
    "muscleGroup": "Ngực",
    "instructions": "Test instructions",
    "reps": 10,
    "calories": 5,
    "duration": 2
  }'
```

## 🌐 Kết nối với Frontend

Cập nhật URL API trong frontend của bạn:

```typescript
const API_BASE_URL = 'https://localhost:7xxx/api';
```

## 🐛 Troubleshooting

### Lỗi kết nối MySQL
- Kiểm tra MySQL đã chạy: `sudo service mysql status` (Linux) hoặc Services (Windows)
- Kiểm tra username/password trong connection string
- Kiểm tra port MySQL (mặc định 3306)

### Lỗi migration
- Xóa migration và tạo lại: `dotnet ef migrations remove`
- Xóa database và tạo lại: `dotnet ef database drop` sau đó `dotnet ef database update`

### Lỗi CORS
- Kiểm tra cấu hình CORS trong `Program.cs`
- Đảm bảo frontend URL được cho phép

## 📝 Data mẫu

Database được seed với 8 bài tập mẫu:
1. Push-up (Ngực)
2. Squat (Chân)
3. Plank (Bụng)
4. Bicep Curl (Tay)
5. Shoulder Press (Vai)
6. Pull-up (Lưng)
7. Crunch (Bụng)
8. Lunge (Chân)

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. .NET SDK đã cài đặt đúng phiên bản
2. MySQL đang chạy
3. Connection string đúng
4. Migrations đã được apply
5. Port không bị conflict

---

**Chúc bạn code vui vẻ! 💪🏋️**
