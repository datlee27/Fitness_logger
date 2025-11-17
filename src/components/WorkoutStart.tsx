import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check, Flame, Clock, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { storageUtils } from '../utils/storage';
import { Exercise, MuscleGroup, WorkoutExercise, WorkoutSession, SavedWorkout } from '../types/workout';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorkoutStartProps {
  onBack: () => void;
}

export default function WorkoutStart({ onBack }: WorkoutStartProps) {
  const [step, setStep] = useState<'select' | 'exercise' | 'active' | 'complete'>('select');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sets, setSets] = useState<number>(3);
  const [isActive, setIsActive] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  const muscleGroups: MuscleGroup[] = ['Tay', 'Ngực', 'Vai', 'Chân', 'Bụng', 'Lưng'];

  useEffect(() => {
    if (muscleGroup) {
      const allExercises = storageUtils.getExercises();
      setExercises(allExercises.filter(e => e.muscleGroup === muscleGroup));
    }
  }, [muscleGroup]);

  const handleSelectExercise = (exercise: Exercise) => {
    const exists = selectedExercises.find(e => e.exercise.id === exercise.id);
    if (exists) {
      setSelectedExercises(selectedExercises.filter(e => e.exercise.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, { exercise, sets: 3 }]);
    }
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length > 0) {
      setStep('active');
      setIsActive(true);
    }
  };

  const handleFinishWorkout = () => {
    setIsActive(false);
    setStep('complete');
  };

  const calculateTotals = () => {
    const totalCalories = selectedExercises.reduce((sum, we) => sum + (we.exercise.calories * we.sets), 0);
    const totalDuration = selectedExercises.reduce((sum, we) => sum + (we.exercise.duration * we.sets), 0);
    return { totalCalories, totalDuration };
  };

  const handleSaveWorkout = (save: boolean) => {
    const { totalCalories, totalDuration } = calculateTotals();
    
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: selectedExercises,
      totalCalories,
      totalDuration,
      saved: save
    };
    
    storageUtils.addSession(session);

    if (save && workoutName) {
      const savedWorkout: SavedWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        date: new Date(),
        muscleGroup: muscleGroup as MuscleGroup,
        exercises: selectedExercises,
        totalCalories,
        totalDuration
      };
      storageUtils.addSavedWorkout(savedWorkout);
    }

    setShowSaveDialog(false);
    onBack();
  };

  const { totalCalories, totalDuration } = calculateTotals();
  const progress = selectedExercises.length > 0 ? ((currentExerciseIndex + 1) / selectedExercises.length) * 100 : 0;

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 pt-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-slate-800 ml-2">Bắt đầu tập luyện</h1>
          </div>

          <Card className="p-6 mb-6">
            <Label>Chọn vùng cơ tập</Label>
            <Select value={muscleGroup} onValueChange={(value) => setMuscleGroup(value as MuscleGroup)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn vùng cơ..." />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {muscleGroup && exercises.length > 0 && (
            <>
              <h2 className="text-slate-800 mb-4">Chọn bài tập</h2>
              <div className="space-y-3 mb-6">
                {exercises.map(exercise => {
                  const isSelected = selectedExercises.find(e => e.exercise.id === exercise.id);
                  return (
                    <Card
                      key={exercise.id}
                      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : ''}`}
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      <div className="flex items-start p-4">
                        <ImageWithFallback
                          src={exercise.imageUrl || ''}
                          alt={exercise.name}
                          className="w-20 h-20 rounded-lg object-cover mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="text-slate-800 mb-1">{exercise.name}</h3>
                          <p className="text-slate-600 text-sm mb-2">{exercise.instructions}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Repeat className="w-4 h-4" />
                              <span>{exercise.reps} reps</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span>{exercise.calories} cal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{exercise.duration} phút</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {selectedExercises.length > 0 && (
                <Card className="p-6 mb-6">
                  <Label>Số lượng sets</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={sets}
                    onChange={(e) => {
                      const newSets = parseInt(e.target.value) || 1;
                      setSets(newSets);
                      setSelectedExercises(selectedExercises.map(we => ({ ...we, sets: newSets })));
                    }}
                    className="mt-2"
                  />
                </Card>
              )}

              {selectedExercises.length > 0 && (
                <Button onClick={handleStartWorkout} className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Bắt đầu tập luyện
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 'active') {
    const currentWorkoutExercise = selectedExercises[currentExerciseIndex];
    const currentExercise = currentWorkoutExercise?.exercise;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="pt-4 mb-6">
            <Progress value={progress} className="h-2 bg-orange-700" />
            <p className="text-sm mt-2 text-white/80">
              Bài tập {currentExerciseIndex + 1}/{selectedExercises.length}
            </p>
          </div>

          {currentExercise && (
            <Card className="bg-white text-slate-800 p-6 mb-6">
              <ImageWithFallback
                src={currentExercise.imageUrl || ''}
                alt={currentExercise.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h1 className="text-slate-800 mb-2">{currentExercise.name}</h1>
              <p className="text-slate-600 mb-4">{currentExercise.instructions}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Repeat className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 text-sm">Reps</p>
                  <p className="text-slate-800">{currentExercise.reps}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 text-sm">Calories</p>
                  <p className="text-slate-800">{currentExercise.calories}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 text-sm">Thời gian</p>
                  <p className="text-slate-800">{currentExercise.duration}p</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-slate-600 text-sm">Sets</p>
                <p className="text-slate-800">{currentWorkoutExercise.sets} sets</p>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {currentExerciseIndex < selectedExercises.length - 1 ? (
              <Button
                onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                className="w-full bg-white text-orange-600 hover:bg-orange-50"
                size="lg"
              >
                Bài tập tiếp theo
              </Button>
            ) : (
              <Button
                onClick={handleFinishWorkout}
                className="w-full bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Hoàn thành
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
          <div className="max-w-4xl mx-auto pt-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-white mb-2">Chúc mừng!</h1>
              <p className="text-white/90">Bạn đã hoàn thành buổi tập</p>
            </div>

            <Card className="bg-white text-slate-800 p-6 mb-6">
              <h2 className="text-slate-800 mb-4">Kết quả buổi tập</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 mb-1">Tổng Calories</p>
                  <p className="text-slate-800">{totalCalories} cal</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-slate-600 mb-1">Tổng thời gian</p>
                  <p className="text-slate-800">{totalDuration} phút</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Đặt tên cho buổi tập (tùy chọn)</Label>
                <Input
                  placeholder="Ví dụ: Buổi tập ngực hôm nay"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="w-full bg-white text-green-600 hover:bg-green-50"
                size="lg"
              >
                Lưu kết quả
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lưu bài tập này?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có muốn lưu bài tập này vào Nhật ký tập luyện để sử dụng lại sau này không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleSaveWorkout(false)}>
                Không
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleSaveWorkout(true)}>
                Có, lưu lại
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return null;
}
