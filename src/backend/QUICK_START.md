# 🚀 HƯỚNG DẪN NHANH - Chạy Backend trong 5 phút

## Bước 1: Cài đặt .NET SDK (nếu chưa có)

### Windows
1. Tải về: https://dotnet.microsoft.com/download/dotnet/8.0
2. Chạy file cài đặt
3. Mở Command Prompt và kiểm tra: `dotnet --version`

### Mac
```bash
brew install dotnet-sdk
```

### Linux (Ubuntu/Debian)
```bash
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0
```

## Bước 2: Cài đặt MySQL

### Windows
1. Tải MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Chọn "MySQL Server" và "MySQL Workbench"
3. Đặt root password (nhớ password này!)

### Mac
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Bước 3: Tạo Database

Mở MySQL command line hoặc MySQL Workbench:

```sql
CREATE DATABASE fitness_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc sử dụng file SQL có sẵn:
```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

## Bước 4: Cấu hình Connection String

Mở file `FitnessTracker.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=fitness_tracker;User=root;Password=YOUR_PASSWORD_HERE;"
  }
}
```

**⚠️ QUAN TRỌNG: Thay `YOUR_PASSWORD_HERE` bằng password MySQL của bạn!**

## Bước 5: Chạy Migration

```bash
cd FitnessTracker.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Nếu chưa có `dotnet ef`, cài đặt:
```bash
dotnet tool install --global dotnet-ef
```

## Bước 6: Chạy API

```bash
dotnet run
```

✅ **Xong!** API đang chạy tại:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## 🧪 Kiểm tra API

Mở trình duyệt và truy cập:
```
https://localhost:5001/swagger
```

Hoặc dùng curl:
```bash
curl http://localhost:5000/api/exercises
```

## 📋 Checklist nhanh

- [ ] .NET 8 SDK đã cài đặt
- [ ] MySQL đang chạy
- [ ] Database `fitness_tracker` đã tạo
- [ ] Connection string đã cập nhật password đúng
- [ ] Migration đã chạy thành công
- [ ] API đang chạy tại localhost:5000

## ❌ Troubleshooting nhanh

### Lỗi: "Unable to connect to MySQL"
```bash
# Kiểm tra MySQL có đang chạy không
# Windows:
services.msc (tìm MySQL)

# Mac/Linux:
sudo service mysql status
```

### Lỗi: "dotnet command not found"
- Cài lại .NET SDK
- Khởi động lại terminal/command prompt

### Lỗi: "Migration failed"
```bash
# Xóa và tạo lại
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 🎯 Endpoints chính để test

1. **GET /api/exercises** - Lấy danh sách bài tập
2. **POST /api/exercises** - Tạo bài tập mới
3. **GET /api/workoutsessions** - Lấy lịch sử tập luyện
4. **POST /api/workoutsessions** - Tạo buổi tập mới
5. **GET /api/savedworkouts** - Lấy bài tập đã lưu

## 🔗 Kết nối với Frontend

Trong file frontend (ví dụ: `utils/api.ts`), thêm:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getExercises() {
    const response = await fetch(`${API_BASE_URL}/exercises`);
    return response.json();
  },
  // ... các API khác
};
```

---

**Hoàn thành! Backend của bạn đã sẵn sàng 🎉**
