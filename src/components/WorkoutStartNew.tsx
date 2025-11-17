import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check, Flame, Clock, Repeat, Sparkles, Home, Dumbbell as GymIcon, RefreshCw, Search, Timer, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { storageUtils } from '../utils/storage';
import { suggestOptimalWorkout, calculateWorkoutMetrics, getAIFoodRecommendation, FoodRecommendation } from '../utils/aiSuggestions';
import { Exercise, MuscleGroup, WorkoutExercise, WorkoutSession, SavedWorkout, Environment } from '../types/workout';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface WorkoutStartNewProps {
  onBack: () => void;
}

type Step = 'environment' | 'select' | 'exercise' | 'active' | 'rest' | 'complete' | 'results';
type Goal = 'Tăng cơ' | 'Giảm cân' | 'Tăng sức bền';

export default function WorkoutStartNew({ onBack }: WorkoutStartNewProps) {
  const [step, setStep] = useState<Step>('environment');
  const [environment, setEnvironment] = useState<Environment | ''>('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');
  const [goal, setGoal] = useState<Goal>('Tăng cơ');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutEndTime, setWorkoutEndTime] = useState<Date | null>(null);
  const [foodRecommendation, setFoodRecommendation] = useState<FoodRecommendation | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const muscleGroups: MuscleGroup[] = ['Tay', 'Ngực', 'Vai', 'Chân', 'Bụng', 'Lưng'];

  useEffect(() => {
    if (environment && muscleGroup) {
      const allExercises = storageUtils.getExercises();
      const filtered = allExercises.filter(e => 
        e.muscleGroup === muscleGroup && 
        (e.environment === environment || e.environment === 'Cả hai')
      );
      setExercises(filtered);
    }
  }, [environment, muscleGroup]);

  // Rest timer countdown
  useEffect(() => {
    if (isResting && restTimeRemaining > 0) {
      const timer = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResting, restTimeRemaining]);

  const handleSelectExercise = (exercise: Exercise) => {
    const exists = selectedExercises.find(e => e.exercise.id === exercise.id);
    if (exists) {
      setSelectedExercises(selectedExercises.filter(e => e.exercise.id !== exercise.id));
    } else {
      const newWorkoutExercise: WorkoutExercise = {
        exercise,
        sets: 3,
        reps: exercise.reps,
        restTime: 60,
        completed: false
      };
      setSelectedExercises([...selectedExercises, newWorkoutExercise]);
    }
  };

  const handleAISuggestion = () => {
    if (!muscleGroup) return;
    
    const suggested = suggestOptimalWorkout(exercises, muscleGroup as MuscleGroup, goal);
    setSelectedExercises(suggested);
    toast('AI đã tạo bộ bài tập tối ưu!', {
      description: `${suggested.length} bài tập phù hợp với mục tiêu ${goal}`
    });
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length > 0) {
      setWorkoutStartTime(new Date());
      setStep('active');
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
    }
  };

  const handleCompleteSet = () => {
    const currentWorkoutExercise = selectedExercises[currentExerciseIndex];
    
    if (currentSet < currentWorkoutExercise.sets) {
      // Start rest period
      setIsResting(true);
      setRestTimeRemaining(currentWorkoutExercise.restTime);
      setStep('rest');
      setCurrentSet(currentSet + 1);
    } else {
      // Move to next exercise or finish
      if (currentExerciseIndex < selectedExercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestTimeRemaining(60); // 1 minute rest between exercises
        setStep('rest');
      } else {
        handleFinishWorkout();
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
    setStep('active');
  };

  const handleFinishWorkout = async () => {
    setWorkoutEndTime(new Date());
    setStep('complete');
    
    // Load AI food recommendations
    setLoadingAI(true);
    try {
      const metrics = calculateWorkoutMetrics(selectedExercises);
      const muscleGroups = Array.from(new Set(selectedExercises.map(we => we.exercise.muscleGroup)));
      const recommendation = await getAIFoodRecommendation(
        muscleGroups,
        metrics.totalCalories,
        metrics.totalSets,
        metrics.totalReps
      );
      setFoodRecommendation(recommendation);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveWorkout = (save: boolean) => {
    const metrics = calculateWorkoutMetrics(selectedExercises);
    const actualDuration = workoutStartTime && workoutEndTime 
      ? Math.round((workoutEndTime.getTime() - workoutStartTime.getTime()) / 60000)
      : metrics.totalDuration;
    
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: selectedExercises,
      totalCalories: metrics.totalCalories,
      totalDuration: actualDuration,
      totalRestTime: metrics.totalRestTime,
      saved: save,
      environment: environment as Environment
    };
    
    storageUtils.addSession(session);

    if (save && workoutName) {
      const savedWorkout: SavedWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        date: new Date(),
        muscleGroup: muscleGroup as MuscleGroup,
        exercises: selectedExercises,
        totalCalories: metrics.totalCalories,
        totalDuration: actualDuration
      };
      storageUtils.addSavedWorkout(savedWorkout);
    }

    setShowSaveDialog(false);
    setStep('results');
  };

  const metrics = calculateWorkoutMetrics(selectedExercises);
  const progress = selectedExercises.length > 0 
    ? ((currentExerciseIndex * selectedExercises[0].sets + currentSet) / 
       (selectedExercises.length * selectedExercises[0].sets)) * 100 
    : 0;

  // Environment selection
  if (step === 'environment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 pt-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-slate-800 ml-2">Chọn môi trường tập luyện</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card
              className={`p-8 cursor-pointer transition-all ${environment === 'Ở nhà' ? 'ring-2 ring-orange-500 bg-orange-50' : ''}`}
              onClick={() => setEnvironment('Ở nhà')}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-slate-800 mb-2">Ở nhà</h2>
                <p className="text-slate-600 text-sm">Bài tập không cần dụng cụ hoặc dụng cụ đơn giản</p>
              </div>
            </Card>

            <Card
              className={`p-8 cursor-pointer transition-all ${environment === 'Phòng gym' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
              onClick={() => setEnvironment('Phòng gym')}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                  <GymIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-slate-800 mb-2">Phòng gym</h2>
                <p className="text-slate-600 text-sm">Bài tập sử dụng máy móc và thiết bị chuyên nghiệp</p>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <Label>Mục tiêu của bạn</Label>
            <Tabs value={goal} onValueChange={(v) => setGoal(v as Goal)} className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Tăng cơ">Tăng cơ</TabsTrigger>
                <TabsTrigger value="Giảm cân">Giảm cân</TabsTrigger>
                <TabsTrigger value="Tăng sức bền">Tăng sức bền</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>

          {environment && (
            <Button onClick={() => setStep('select')} className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
              Tiếp tục
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Exercise selection
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 pt-4">
            <Button variant="ghost" size="icon" onClick={() => setStep('environment')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-slate-800 ml-2">Chọn nhóm cơ và bài tập</h1>
          </div>

          <Card className="p-6 mb-6">
            <Label>Chọn nhóm cơ tập</Label>
            <Select value={muscleGroup} onValueChange={(value) => setMuscleGroup(value as MuscleGroup)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn nhóm cơ..." />
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
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleAISuggestion}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Đề xuất tối ưu
                </Button>
                <Button
                  onClick={() => setSelectedExercises([])}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <h2 className="text-slate-800 mb-4">
                Bài tập có sẵn ({exercises.length})
              </h2>
              <div className="space-y-3 mb-6">
                {exercises.map(exercise => {
                  const isSelected = selectedExercises.find(e => e.exercise.id === exercise.id);
                  const selectedExercise = isSelected;
                  
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
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-800">{exercise.name}</h3>
                            {exercise.difficulty && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                exercise.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                                exercise.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {exercise.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{exercise.instructions}</p>
                          {isSelected && selectedExercise && (
                            <div className="bg-white rounded-lg p-3 mb-2">
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="text-slate-600">Sets:</span>
                                  <span className="ml-2">{selectedExercise.sets}</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">Reps:</span>
                                  <span className="ml-2">{selectedExercise.reps}</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">Nghỉ:</span>
                                  <span className="ml-2">{selectedExercise.restTime}s</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Repeat className="w-4 h-4" />
                              <span>{exercise.reps} reps</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span>{exercise.calories} cal/set</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{exercise.duration} phút</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {selectedExercises.length > 0 && (
                <>
                  <Card className="p-6 mb-4 bg-gradient-to-r from-orange-50 to-green-50">
                    <h3 className="text-slate-800 mb-3">Tổng quan buổi tập</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-slate-600 text-sm mb-1">Bài tập</p>
                        <p className="text-slate-800">{selectedExercises.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600 text-sm mb-1">Tổng Calories</p>
                        <p className="text-slate-800">{metrics.totalCalories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600 text-sm mb-1">Thời gian</p>
                        <p className="text-slate-800">{metrics.estimatedTime} phút</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600 text-sm mb-1">Tổng Sets</p>
                        <p className="text-slate-800">{metrics.totalSets}</p>
                      </div>
                    </div>
                  </Card>

                  <Button onClick={handleStartWorkout} className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Bắt đầu tập luyện
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Active workout
  if (step === 'active') {
    const currentWorkoutExercise = selectedExercises[currentExerciseIndex];
    const currentExercise = currentWorkoutExercise?.exercise;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="pt-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/80">
                Bài tập {currentExerciseIndex + 1}/{selectedExercises.length}
              </p>
              <p className="text-sm text-white/80">
                Set {currentSet}/{currentWorkoutExercise.sets}
              </p>
            </div>
            <Progress value={progress} className="h-2 bg-orange-700" />
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
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Repeat className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 text-sm">Reps mục tiêu</p>
                  <p className="text-slate-800">{currentWorkoutExercise.reps}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <span className="text-slate-800 text-2xl mb-2 block">Set {currentSet}</span>
                  <p className="text-slate-600 text-sm">/ {currentWorkoutExercise.sets} sets</p>
                </div>
              </div>
            </Card>
          )}

          <Button
            onClick={handleCompleteSet}
            className="w-full bg-white text-orange-600 hover:bg-orange-50"
            size="lg"
          >
            {currentSet < currentWorkoutExercise.sets ? 'Hoàn thành Set' : 
             currentExerciseIndex < selectedExercises.length - 1 ? 'Bài tập tiếp theo' : 
             'Hoàn thành buổi tập'}
          </Button>
        </div>
      </div>
    );
  }

  // Rest period
  if (step === 'rest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Timer className="w-20 h-20 mx-auto mb-4 animate-pulse" />
          <h1 className="text-white mb-2">Thời gian nghỉ</h1>
          <div className="text-6xl mb-6">
            {Math.floor(restTimeRemaining / 60)}:{(restTimeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-white/90 mb-8">
            Uống nước và thư giãn cơ bắp
          </p>
          <Button
            onClick={handleSkipRest}
            variant="outline"
            className="bg-white text-blue-600 hover:bg-blue-50"
            size="lg"
          >
            Bỏ qua nghỉ ngơi
          </Button>
        </div>
      </div>
    );
  }

  // Complete and save dialog
  if (step === 'complete') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
          <div className="max-w-4xl mx-auto pt-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-white mb-2">Xuất sắc!</h1>
              <p className="text-white/90">Bạn đã hoàn thành buổi tập</p>
            </div>

            {loadingAI && (
              <Card className="bg-white/10 backdrop-blur-sm text-white p-6 mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <div>
                    <p>AI đang phân tích...</p>
                    <p className="text-sm text-white/80">Đang tạo gợi ý dinh dưỡng cho bạn</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="bg-white text-slate-800 p-6 mb-6">
              <h2 className="text-slate-800 mb-4">Kết quả buổi tập</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-slate-600 text-sm mb-1">Calories đốt</p>
                  <p className="text-slate-800">{metrics.totalCalories} cal</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-slate-600 text-sm mb-1">Thời gian</p>
                  <p className="text-slate-800">
                    {workoutStartTime && workoutEndTime 
                      ? Math.round((workoutEndTime.getTime() - workoutStartTime.getTime()) / 60000)
                      : metrics.totalDuration} phút
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Repeat className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-slate-600 text-sm mb-1">Tổng Sets</p>
                  <p className="text-slate-800">{metrics.totalSets}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Coffee className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-slate-600 text-sm mb-1">Nghỉ ngơi</p>
                  <p className="text-slate-800">{Math.floor(metrics.totalRestTime / 60)} phút</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Đặt tên buổi tập (tùy chọn)</Label>
                <input
                  type="text"
                  placeholder={`Buổi tập ${muscleGroup}`}
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="w-full bg-white text-green-600 hover:bg-green-50"
                size="lg"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lưu bài tập này?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có muốn lưu bài tập này vào Nhật ký để sử dụng lại không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleSaveWorkout(false)}>
                Không lưu
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleSaveWorkout(true)}>
                Lưu lại
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Results with AI food recommendations
  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 pt-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-slate-800 ml-2">Tổng kết buổi tập</h1>
          </div>

          {/* Workout Summary */}
          <Card className="p-6 mb-6">
            <h2 className="text-slate-800 mb-4">Chi tiết buổi tập</h2>
            <div className="space-y-3">
              {selectedExercises.map((we, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-800">{we.exercise.name}</p>
                    <p className="text-slate-600 text-sm">
                      {we.sets} sets × {we.reps} reps
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </Card>

          {/* AI Food Recommendations */}
          {foodRecommendation && (
            <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <h2 className="text-slate-800">Gợi ý dinh dưỡng AI</h2>
              </div>

              <p className="text-slate-700 mb-4">{foodRecommendation.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-slate-600 text-sm mb-1">Protein</p>
                  <p className="text-slate-800 text-sm">{foodRecommendation.proteinAmount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-slate-600 text-sm mb-1">Carbohydrate</p>
                  <p className="text-slate-800 text-sm">{foodRecommendation.carbAmount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-slate-600 text-sm mb-1">Chất béo</p>
                  <p className="text-slate-800 text-sm">{foodRecommendation.fatAmount}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mb-4">
                <h3 className="text-slate-800 mb-2">Gợi ý bữa ăn</h3>
                <div className="space-y-2">
                  {foodRecommendation.mealSuggestions.map((meal, idx) => (
                    <p key={idx} className="text-slate-700 text-sm">{meal}</p>
                  ))}
                </div>
              </div>

              <div className="bg-amber-100 p-4 rounded-lg mb-4">
                <p className="text-amber-900 text-sm">
                  ⏰ {foodRecommendation.timing}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-slate-800 mb-2">Tips phục hồi</h3>
                <div className="space-y-1">
                  {foodRecommendation.recoveryTips.map((tip, idx) => (
                    <p key={idx} className="text-slate-700 text-sm">{tip}</p>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Button onClick={onBack} className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
