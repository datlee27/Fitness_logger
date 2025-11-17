# 🚀 HƯỚNG DẪN NHANH - WPF Application

## 5 Bước để chạy ứng dụng WPF

### Bước 1: Cài đặt .NET 8 SDK

Download tại: https://dotnet.microsoft.com/download/dotnet/8.0

Kiểm tra:
```bash
dotnet --version
```

### Bước 2: Cài đặt MySQL

**Windows:**
- Tải MySQL Installer từ https://dev.mysql.com/downloads/installer/
- Cài đặt MySQL Server
- Nhớ password của root user!

### Bước 3: Cấu hình Connection String

Mở file `Data/FitnessDbContext.cs`, dòng 17:

```csharp
var connectionString = "Server=localhost;Port=3306;Database=fitness_tracker_wpf;User=root;Password=YOUR_PASSWORD;";
```

**Thay `YOUR_PASSWORD` bằng password MySQL của bạn!**

### Bước 4: Tạo Database

Mở terminal trong folder `wpf/FitnessTracker.WPF`:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Nếu chưa có `dotnet ef`:
```bash
dotnet tool install --global dotnet-ef
```

### Bước 5: Chạy ứng dụng

#### Cách 1: Visual Studio
1. Mở file `FitnessTracker.WPF.csproj` trong Visual Studio 2022
2. Nhấn F5

#### Cách 2: Command Line
```bash
cd wpf/FitnessTracker.WPF
dotnet run
```

## ✅ Checklist

- [ ] .NET 8 SDK đã cài
- [ ] MySQL đang chạy
- [ ] Connection string đã cập nhật password
- [ ] Database migration đã chạy
- [ ] Ứng dụng mở thành công

## 🤖 Bật/Tắt AI

### Tắt AI nhanh:

Mở `Services/AIService.cs`, dòng 20:

```csharp
public bool IsEnabled { get; private set; } = false; // Tắt AI
```

Khi AI tắt:
- ✅ App vẫn chạy bình thường
- ❌ Không có AI đề xuất bài tập thông minh
- ❌ Không có gợi ý dinh dưỡng

## 📊 Dữ liệu mẫu

Database tự động tạo 17 bài tập mẫu khi chạy migration!

## ❓ Lỗi thường gặp

### "Unable to connect to MySQL"
```bash
# Kiểm tra MySQL có chạy không
# Windows: Services.msc → tìm MySQL
```

### "A network-related error"
```
→ Kiểm tra password trong connection string
→ Kiểm tra port 3306
```

### "No DbContext was found"
```bash
dotnet restore
dotnet build
```

## 🎯 Test nhanh

1. Mở app
2. Nhấn "Bắt đầu tập luyện"
3. Chọn "Ở nhà"
4. Chọn "Tăng cơ"
5. Chọn "Ngực"
6. Nhấn "AI Đề xuất tối ưu"
7. Nhấn "Bắt đầu tập luyện"

---

**Hoàn thành! Ứng dụng WPF của bạn đã sẵn sàng! 🎉**
