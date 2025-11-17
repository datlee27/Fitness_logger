import { Exercise, WorkoutSession, SavedWorkout } from '../types/workout';

const EXERCISES_KEY = 'fitness_exercises';
const SESSIONS_KEY = 'fitness_sessions';
const SAVED_WORKOUTS_KEY = 'fitness_saved_workouts';

export const storageUtils = {
  // Exercises
  getExercises: (): Exercise[] => {
    const data = localStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : getDefaultExercises();
  },
  
  saveExercises: (exercises: Exercise[]) => {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  },
  
  addExercise: (exercise: Exercise) => {
    const exercises = storageUtils.getExercises();
    exercises.push(exercise);
    storageUtils.saveExercises(exercises);
  },
  
  // Workout Sessions
  getSessions: (): WorkoutSession[] => {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    const sessions = JSON.parse(data);
    return sessions.map((s: any) => ({ ...s, date: new Date(s.date) }));
  },
  
  saveSessions: (sessions: WorkoutSession[]) => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },
  
  addSession: (session: WorkoutSession) => {
    const sessions = storageUtils.getSessions();
    sessions.push(session);
    storageUtils.saveSessions(sessions);
  },
  
  // Saved Workouts
  getSavedWorkouts: (): SavedWorkout[] => {
    const data = localStorage.getItem(SAVED_WORKOUTS_KEY);
    if (!data) return [];
    const workouts = JSON.parse(data);
    return workouts.map((w: any) => ({ ...w, date: new Date(w.date) }));
  },
  
  saveSavedWorkouts: (workouts: SavedWorkout[]) => {
    localStorage.setItem(SAVED_WORKOUTS_KEY, JSON.stringify(workouts));
  },
  
  addSavedWorkout: (workout: SavedWorkout) => {
    const workouts = storageUtils.getSavedWorkouts();
    workouts.push(workout);
    storageUtils.saveSavedWorkouts(workouts);
  },
  
  deleteSavedWorkout: (id: string) => {
    const workouts = storageUtils.getSavedWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    storageUtils.saveSavedWorkouts(filtered);
  }
};

function getDefaultExercises(): Exercise[] {
  return [
    // Ở nhà - Ngực
    {
      id: '1',
      name: 'Push-up',
      muscleGroup: 'Ngực',
      environment: 'Ở nhà',
      instructions: 'Nằm sấp, đặt tay rộng bằng vai, đẩy người lên xuống',
      reps: 15,
      calories: 7,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
    },
    {
      id: '2',
      name: 'Diamond Push-up',
      muscleGroup: 'Ngực',
      environment: 'Ở nhà',
      instructions: 'Push-up với hai tay khép lại tạo hình kim cương',
      reps: 12,
      calories: 8,
      duration: 2,
      difficulty: 'Khó',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
    },
    // Phòng gym - Ngực
    {
      id: '3',
      name: 'Bench Press',
      muscleGroup: 'Ngực',
      environment: 'Phòng gym',
      instructions: 'Nằm trên ghế, đẩy tạ từ ngực lên trên',
      reps: 10,
      calories: 10,
      duration: 3,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
    },
    // Ở nhà - Chân
    {
      id: '4',
      name: 'Squat',
      muscleGroup: 'Chân',
      environment: 'Cả hai',
      instructions: 'Đứng thẳng, chân rộng bằng vai, ngồi xuống như ngồi ghế',
      reps: 20,
      calories: 10,
      duration: 3,
      difficulty: 'Dễ',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'
    },
    {
      id: '5',
      name: 'Lunge',
      muscleGroup: 'Chân',
      environment: 'Cả hai',
      instructions: 'Bước chân về phía trước, hạ thấp người xuống',
      reps: 15,
      calories: 8,
      duration: 3,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'
    },
    // Phòng gym - Chân
    {
      id: '6',
      name: 'Leg Press',
      muscleGroup: 'Chân',
      environment: 'Phòng gym',
      instructions: 'Đẩy bàn đạp bằng chân trên máy leg press',
      reps: 12,
      calories: 12,
      duration: 3,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'
    },
    // Ở nhà - Bụng
    {
      id: '7',
      name: 'Plank',
      muscleGroup: 'Bụng',
      environment: 'Cả hai',
      instructions: 'Chống tay hoặc khuỷu tay, giữ thẳng người',
      reps: 1,
      calories: 5,
      duration: 1,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    },
    {
      id: '8',
      name: 'Crunch',
      muscleGroup: 'Bụng',
      environment: 'Cả hai',
      instructions: 'Nằm ngửa, gập bụng lên',
      reps: 20,
      calories: 5,
      duration: 2,
      difficulty: 'Dễ',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    },
    {
      id: '9',
      name: 'Mountain Climbers',
      muscleGroup: 'Bụng',
      environment: 'Ở nhà',
      instructions: 'Tư thế plank, luân phiên đưa đầu gối về phía ngực',
      reps: 30,
      calories: 8,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    },
    // Ở nhà - Tay
    {
      id: '10',
      name: 'Dips',
      muscleGroup: 'Tay',
      environment: 'Ở nhà',
      instructions: 'Dùng ghế, chống tay và hạ người xuống',
      reps: 15,
      calories: 6,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
    },
    // Phòng gym - Tay
    {
      id: '11',
      name: 'Bicep Curl',
      muscleGroup: 'Tay',
      environment: 'Phòng gym',
      instructions: 'Cầm tạ, uốn cong tay về phía vai',
      reps: 12,
      calories: 6,
      duration: 2,
      difficulty: 'Dễ',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
    },
    {
      id: '12',
      name: 'Tricep Extension',
      muscleGroup: 'Tay',
      environment: 'Phòng gym',
      instructions: 'Đưa tạ lên đầu, duỗi tay ra',
      reps: 12,
      calories: 6,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
    },
    // Phòng gym - Vai
    {
      id: '13',
      name: 'Shoulder Press',
      muscleGroup: 'Vai',
      environment: 'Phòng gym',
      instructions: 'Đẩy tạ từ vai lên trên đầu',
      reps: 10,
      calories: 8,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
    },
    {
      id: '14',
      name: 'Lateral Raise',
      muscleGroup: 'Vai',
      environment: 'Cả hai',
      instructions: 'Giơ tạ ra hai bên đến ngang vai',
      reps: 12,
      calories: 6,
      duration: 2,
      difficulty: 'Dễ',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
    },
    // Phòng gym - Lưng
    {
      id: '15',
      name: 'Pull-up',
      muscleGroup: 'Lưng',
      environment: 'Cả hai',
      instructions: 'Treo xà đơn, kéo người lên đến khi cằm qua xà',
      reps: 8,
      calories: 9,
      duration: 2,
      difficulty: 'Khó',
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400'
    },
    {
      id: '16',
      name: 'Bent Over Row',
      muscleGroup: 'Lưng',
      environment: 'Phòng gym',
      instructions: 'Cúi người, kéo tạ về phía ngực',
      reps: 12,
      calories: 8,
      duration: 2,
      difficulty: 'Trung bình',
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400'
    },
    {
      id: '17',
      name: 'Superman',
      muscleGroup: 'Lưng',
      environment: 'Ở nhà',
      instructions: 'Nằm sấp, nâng tay và chân lên cùng lúc',
      reps: 15,
      calories: 5,
      duration: 2,
      difficulty: 'Dễ',
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400'
    }
  ];
}
