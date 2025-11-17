import { Dumbbell, Plus, BarChart3, BookOpen } from 'lucide-react';
import { Card } from './ui/card';

interface DashboardProps {
  onNavigate: (screen: 'dashboard' | 'workout' | 'add' | 'reports' | 'history') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const menuItems = [
    {
      id: 'workout',
      title: 'Bắt đầu tập luyện',
      icon: Dumbbell,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'Bắt đầu buổi tập mới'
    },
    {
      id: 'add',
      title: 'Thêm bài tập',
      icon: Plus,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      description: 'Tạo bài tập tùy chỉnh'
    },
    {
      id: 'reports',
      title: 'Báo cáo',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Xem thống kê của bạn'
    },
    {
      id: 'history',
      title: 'Nhật ký tập luyện',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'Các bài tập đã lưu'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-green-500 rounded-full mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-slate-800 mb-2">Fitness Tracker</h1>
          <p className="text-slate-600">Theo dõi và cải thiện sức khỏe của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                onClick={() => onNavigate(item.id as any)}
              >
                <div className={`${item.color} p-8 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12" />
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/40 rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-white mb-2">{item.title}</h2>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
