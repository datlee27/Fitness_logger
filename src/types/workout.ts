export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  environment: Environment;
  instructions: string;
  reps: number;
  calories: number;
  duration: number; // in minutes
  imageUrl?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
}

export type MuscleGroup = 'Tay' | 'Ngực' | 'Vai' | 'Chân' | 'Bụng' | 'Lưng';
export type Environment = 'Ở nhà' | 'Phòng gym' | 'Cả hai';

export interface WorkoutSession {
  id: string;
  date: Date;
  exercises: WorkoutExercise[];
  totalCalories: number;
  totalDuration: number;
  totalRestTime: number;
  saved: boolean;
  environment?: Environment;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restTime: number; // seconds between sets
  actualDuration?: number;
  completed?: boolean;
}

export interface SavedWorkout {
  id: string;
  name: string;
  date: Date;
  muscleGroup: MuscleGroup;
  exercises: WorkoutExercise[];
  totalCalories: number;
  totalDuration: number;
}
