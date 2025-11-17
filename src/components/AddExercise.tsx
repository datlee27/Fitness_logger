import { useState } from 'react';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { storageUtils } from '../utils/storage';
import { MuscleGroup, Exercise, Environment } from '../types/workout';
import { toast } from 'sonner@2.0.3';

interface AddExerciseProps {
  onBack: () => void;
}

export default function AddExercise({ onBack }: AddExerciseProps) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');
  const [environment, setEnvironment] = useState<Environment>('Cả hai');
  const [instructions, setInstructions] = useState('');
  const [reps, setReps] = useState(10);
  const [calories, setCalories] = useState(5);
  const [duration, setDuration] = useState(2);
  const [difficulty, setDifficulty] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Trung bình');
  const [saved, setSaved] = useState(false);

  const muscleGroups: MuscleGroup[] = ['Tay', 'Ngực', 'Vai', 'Chân', 'Bụng', 'Lưng'];
  const environments: Environment[] = ['Ở nhà', 'Phòng gym', 'Cả hai'];

  const handleSave = () => {
    if (!name || !muscleGroup || !instructions) {
      toast('Vui lòng điền đầy đủ thông tin', {
        description: 'Tên bài tập, vùng cơ và hướng dẫn là bắt buộc'
      });
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      name,
      muscleGroup: muscleGroup as MuscleGroup,
      environment,
      instructions,
      reps,
      calories,
      duration,
      difficulty
    };

    storageUtils.addExercise(exercise);
    setSaved(true);
    toast('Đã thêm bài tập thành công!', {
      description: `${name} đã được thêm vào danh sách`
    });

    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleCancel = () => {
    onBack();
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 p-4 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-white mb-2">Đã lưu!</h1>
          <p className="text-white/90">Bài tập đã được thêm thành công</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-slate-800 ml-2">Thêm bài tập mới</h1>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <Label>Tên bài tập *</Label>
            <Input
              placeholder="Ví dụ: Push-up"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Vùng cơ *</Label>
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
          </div>

          <div>
            <Label>Môi trường *</Label>
            <Select value={environment} onValueChange={(value) => setEnvironment(value as Environment)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn môi trường..." />
              </SelectTrigger>
              <SelectContent>
                {environments.map(env => (
                  <SelectItem key={env} value={env}>{env}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Độ khó</Label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dễ">Dễ</SelectItem>
                <SelectItem value="Trung bình">Trung bình</SelectItem>
                <SelectItem value="Khó">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Hướng dẫn chi tiết *</Label>
            <Textarea
              placeholder="Mô tả cách thực hiện bài tập..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Số reps</Label>
              <Input
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Calories (ước tính)</Label>
              <Input
                type="number"
                min="1"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Thời gian (phút)</Label>
              <Input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              size="lg"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-500 hover:bg-green-600"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Lưu bài tập
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
