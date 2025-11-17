import { useState, useMemo } from 'react';
import { ArrowLeft, Flame, Clock, Activity, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { storageUtils } from '../utils/storage';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportPageProps {
  onBack: () => void;
}

type TimeRange = 'day' | 'week' | 'month' | 'year';

export default function ReportPage({ onBack }: ReportPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const sessions = storageUtils.getSessions();

  const filteredSessions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return sessions.filter(s => new Date(s.date) >= filterDate);
  }, [sessions, timeRange]);

  const stats = useMemo(() => {
    const totalCalories = filteredSessions.reduce((sum, s) => sum + s.totalCalories, 0);
    const totalDuration = filteredSessions.reduce((sum, s) => sum + s.totalDuration, 0);
    const totalSessions = filteredSessions.length;

    return { totalCalories, totalDuration, totalSessions };
  }, [filteredSessions]);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string; calories: number; duration: number }>();

    filteredSessions.forEach(session => {
      const dateKey = new Date(session.date).toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });

      if (dataMap.has(dateKey)) {
        const existing = dataMap.get(dateKey)!;
        existing.calories += session.totalCalories;
        existing.duration += session.totalDuration;
      } else {
        dataMap.set(dateKey, {
          date: dateKey,
          calories: session.totalCalories,
          duration: session.totalDuration
        });
      }
    });

    return Array.from(dataMap.values()).slice(-7);
  }, [filteredSessions]);

  const muscleGroupData = useMemo(() => {
    const muscleMap = new Map<string, number>();

    filteredSessions.forEach(session => {
      session.exercises.forEach(we => {
        const muscle = we.exercise.muscleGroup;
        muscleMap.set(muscle, (muscleMap.get(muscle) || 0) + 1);
      });
    });

    return Array.from(muscleMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredSessions]);

  const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#eab308', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-slate-800 ml-2">Báo cáo</h1>
        </div>

        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="day">Ngày</TabsTrigger>
            <TabsTrigger value="week">Tuần</TabsTrigger>
            <TabsTrigger value="month">Tháng</TabsTrigger>
            <TabsTrigger value="year">Năm</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-white/90 text-sm mb-1">Tổng Calories</p>
            <p className="text-white">{stats.totalCalories.toLocaleString()} cal</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-white/90 text-sm mb-1">Tổng thời gian</p>
            <p className="text-white">{stats.totalDuration} phút</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-white/90 text-sm mb-1">Tổng buổi tập</p>
            <p className="text-white">{stats.totalSessions} buổi</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-slate-800 mb-4">Calories đốt theo ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#f97316" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-slate-800 mb-4">Thời gian tập theo ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="duration" stroke="#3b82f6" name="Thời gian (phút)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {muscleGroupData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-slate-800 mb-4">Phân bổ vùng cơ tập</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}
