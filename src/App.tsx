import { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutStartNew from './components/WorkoutStartNew';
import AddExercise from './components/AddExercise';
import ReportPage from './components/ReportPage';
import WorkoutHistory from './components/WorkoutHistory';
import { Toaster } from './components/ui/sonner';

type Screen = 'dashboard' | 'workout' | 'add' | 'reports' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'workout':
        return <WorkoutStartNew onBack={() => setCurrentScreen('dashboard')} />;
      case 'add':
        return <AddExercise onBack={() => setCurrentScreen('dashboard')} />;
      case 'reports':
        return <ReportPage onBack={() => setCurrentScreen('dashboard')} />;
      case 'history':
        return <WorkoutHistory onBack={() => setCurrentScreen('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toaster />
    </>
  );
}
