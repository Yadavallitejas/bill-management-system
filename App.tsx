
import React, { useState } from 'react';
import { LedgerProvider } from './store/LedgerContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { UserDirectory } from './components/UserDirectory';
import { UserDetail } from './components/UserDetail';

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleNavigateToUser = (id: string) => {
    setSelectedUserId(id);
    setView('user_detail');
  };

  const handleNavigate = (newView: string) => {
    setView(newView);
    setSelectedUserId(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onViewUser={handleNavigateToUser} />;
      case 'users':
        return <UserDirectory onSelectUser={handleNavigateToUser} />;
      case 'user_detail':
        return selectedUserId ? (
          <UserDetail userId={selectedUserId} onBack={() => setView('users')} />
        ) : <Dashboard onViewUser={handleNavigateToUser} />;
      default:
        return <Dashboard onViewUser={handleNavigateToUser} />;
    }
  };

  return (
    <LedgerProvider>
      <Layout onNavigate={handleNavigate} activeView={view}>
        {renderContent()}
      </Layout>
    </LedgerProvider>
  );
};

export default App;
