import { Exercise, WorkoutExercise, MuscleGroup } from '../types/workout';

// AI Workout Suggestion Algorithm
export function suggestOptimalWorkout(
  availableExercises: Exercise[],
  muscleGroup: MuscleGroup,
  userGoal: 'Tăng cơ' | 'Giảm cân' | 'Tăng sức bền' = 'Tăng cơ'
): WorkoutExercise[] {
  // Filter exercises for the muscle group
  const filteredExercises = availableExercises.filter(e => e.muscleGroup === muscleGroup);
  
  // Shuffle and select 3-5 exercises
  const shuffled = [...filteredExercises].sort(() => Math.random() - 0.5);
  const selectedCount = Math.min(Math.max(3, Math.floor(Math.random() * 3) + 3), shuffled.length);
  const selected = shuffled.slice(0, selectedCount);
  
  // Configure based on goal
  return selected.map(exercise => {
    let sets = 3;
    let reps = exercise.reps;
    let restTime = 60; // seconds
    
    switch (userGoal) {
      case 'Tăng cơ':
        sets = 4;
        reps = Math.max(8, Math.min(12, exercise.reps));
        restTime = 90;
        break;
      case 'Giảm cân':
        sets = 3;
        reps = Math.max(15, exercise.reps);
        restTime = 45;
        break;
      case 'Tăng sức bền':
        sets = 5;
        reps = Math.max(20, exercise.reps);
        restTime = 30;
        break;
    }
    
    return {
      exercise,
      sets,
      reps,
      restTime,
      completed: false
    };
  });
}

// Calculate total workout metrics
export function calculateWorkoutMetrics(workoutExercises: WorkoutExercise[]) {
  let totalCalories = 0;
  let totalDuration = 0; // minutes
  let totalRestTime = 0; // seconds
  let totalSets = 0;
  let totalReps = 0;
  
  workoutExercises.forEach(we => {
    totalCalories += we.exercise.calories * we.sets;
    totalDuration += we.exercise.duration * we.sets;
    totalRestTime += we.restTime * (we.sets - 1); // rest between sets
    totalSets += we.sets;
    totalReps += we.reps * we.sets;
  });
  
  return {
    totalCalories,
    totalDuration,
    totalRestTime,
    totalSets,
    totalReps,
    estimatedTime: totalDuration + Math.floor(totalRestTime / 60)
  };
}

// AI Food Recommendation (Mock - in real app, would call LLM API)
export interface FoodRecommendation {
  summary: string;
  proteinAmount: string;
  carbAmount: string;
  fatAmount: string;
  mealSuggestions: string[];
  timing: string;
  recoveryTips: string[];
}

export async function getAIFoodRecommendation(
  muscleGroups: MuscleGroup[],
  caloriesBurned: number,
  totalSets: number,
  totalReps: number
): Promise<FoodRecommendation> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Calculate protein needs based on intensity
  const intensity = (totalSets * totalReps) / 100;
  const proteinGrams = Math.round(25 + intensity * 5);
  const carbGrams = Math.round(30 + (caloriesBurned / 4));
  const fatGrams = Math.round(10 + intensity * 2);
  
  const muscleGroupText = muscleGroups.join(', ');
  
  const recommendations: FoodRecommendation = {
    summary: `Dựa trên buổi tập ${muscleGroupText} với ${caloriesBurned} calories tiêu hao, cơ thể bạn cần bổ sung dinh dưỡng để phục hồi và phát triển cơ bắp.`,
    proteinAmount: `${proteinGrams}g protein (khoảng ${Math.round(proteinGrams / 7)} quả trứng hoặc ${Math.round(proteinGrams / 25)}g thịt gà)`,
    carbAmount: `${carbGrams}g carbohydrate (khoảng ${Math.round(carbGrams / 30)}g cơm hoặc 2 củ khoai lang)`,
    fatAmount: `${fatGrams}g chất béo lành mạnh (bơ, hạt, dầu ô liu)`,
    mealSuggestions: generateMealSuggestions(muscleGroups, intensity),
    timing: `Bổ sung protein trong vòng 30-60 phút sau tập. Bữa ăn chính sau 1-2 giờ.`,
    recoveryTips: generateRecoveryTips(muscleGroups)
  };
  
  return recommendations;
}

function generateMealSuggestions(muscleGroups: MuscleGroup[], intensity: number): string[] {
  const suggestions = [];
  
  if (intensity > 5) {
    suggestions.push('🍗 150g ức gà nướng + 100g cơm gạo lứt + rau xanh');
    suggestions.push('🥩 150g thịt bò xào + khoai lang luộc + bông cải xanh');
    suggestions.push('🐟 150g cá hồi nướng + quinoa + salad');
  } else {
    suggestions.push('🥚 3 quả trứng luộc + yến mạch + chuối');
    suggestions.push('🥛 Whey protein shake + chuối + bơ đậu phộng');
    suggestions.push('🍚 Cơm gà + rau củ luộc');
  }
  
  suggestions.push('🥤 Sinh tố protein: sữa tươi + chuối + yến mạch + whey');
  suggestions.push('🥗 Salad ức gà: ức gà + rau xà lách + cà chua + olive');
  
  return suggestions;
}

function generateRecoveryTips(muscleGroups: MuscleGroup[]): string[] {
  const tips = [
    '💧 Uống đủ 2-3 lít nước mỗi ngày',
    '😴 Ngủ đủ 7-9 giờ để cơ bắp phục hồi tối ưu',
    '🧘 Thực hiện các bài tập giãn cơ nhẹ nhàng'
  ];
  
  if (muscleGroups.includes('Chân')) {
    tips.push('🚶 Đi bộ nhẹ 10-15 phút để giảm đau cơ');
    tips.push('🛁 Ngâm chân nước ấm hoặc massage bắp chân');
  }
  
  if (muscleGroups.includes('Ngực') || muscleGroups.includes('Lưng')) {
    tips.push('🧘 Thực hiện bài tập giãn vai và lưng');
  }
  
  if (muscleGroups.includes('Tay') || muscleGroups.includes('Vai')) {
    tips.push('💪 Massage nhẹ các cơ tay sau tập');
  }
  
  tips.push('🍎 Bổ sung vitamin C từ hoa quả để giảm viêm');
  tips.push('⏰ Tập cùng nhóm cơ sau 48-72 giờ để phục hồi hoàn toàn');
  
  return tips;
}
