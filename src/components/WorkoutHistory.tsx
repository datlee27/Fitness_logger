import { useState } from 'react';
import { ArrowLeft, Trash2, Play, Flame, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { storageUtils } from '../utils/storage';
import { SavedWorkout } from '../types/workout';

interface WorkoutHistoryProps {
  onBack: () => void;
}

export default function WorkoutHistory({ onBack }: WorkoutHistoryProps) {
  const [workouts, setWorkouts] = useState<SavedWorkout[]>(storageUtils.getSavedWorkouts());

  const handleDelete = (id: string) => {
    storageUtils.deleteSavedWorkout(id);
    setWorkouts(storageUtils.getSavedWorkouts());
  };

  const handleDoAgain = (workout: SavedWorkout) => {
    // In a real implementation, this would navigate to workout with pre-filled data
    console.log('Do workout again:', workout);
  };

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: { [key: string]: string } = {
      'Tay': 'bg-orange-100 text-orange-700 border-orange-200',
      'Ngực': 'bg-blue-100 text-blue-700 border-blue-200',
      'Vai': 'bg-purple-100 text-purple-700 border-purple-200',
      'Chân': 'bg-green-100 text-green-700 border-green-200',
      'Bụng': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Lưng': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[muscleGroup] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-slate-800 ml-2">Nhật ký tập luyện</h1>
        </div>

        {workouts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Play className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-slate-800 mb-2">Chưa có bài tập nào</h2>
            <p className="text-slate-600 mb-6">
              Hoàn thành một buổi tập và lưu lại để xem ở đây
            </p>
            <Button onClick={onBack} className="bg-orange-500 hover:bg-orange-600">
              Bắt đầu tập luyện
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-slate-800">{workout.name || 'Buổi tập'}</h2>
                      <Badge className={getMuscleGroupColor(workout.muscleGroup)}>
                        {workout.muscleGroup}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(workout.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{workout.totalCalories} cal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{workout.totalDuration} phút</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-slate-600 text-sm mb-2">Các bài tập:</p>
                  <div className="space-y-1">
                    {workout.exercises.map((we, idx) => (
                      <div key={idx} className="text-sm text-slate-700">
                        • {we.exercise.name} - {we.sets} sets × {we.exercise.reps} reps
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDoAgain(workout)}
                    className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Tập lại
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa bài tập?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa "{workout.name || 'Buổi tập'}" khỏi nhật ký? 
                          Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(workout.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
