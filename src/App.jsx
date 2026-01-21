import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import UnifiedDashboard from './pages/UnifiedDashboard';
import Store from './pages/Store';
import UsersPage from './pages/Users';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import BotDetails from './pages/BotDetails';
import Statistics from './pages/Statistics';
import { Search, Bell, Mail, Menu } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden selection:bg-primary/30 selection:text-white">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen bg-background">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm text-muted hover:text-primary transition-colors border border-border-light/10"
            >
              <Menu size={20} />
            </button>
            <div className="relative flex-1 sm:w-80 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search resources, users, bots..."
                className="w-full bg-surface-l2 border border-white/5 rounded-full py-3.5 pl-12 pr-4 shadow-2xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground placeholder:text-muted/50 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 justify-end">
            <button className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm text-muted hover:text-primary transition-colors border border-border-light/10">
              <Mail size={20} />
            </button>
            <button className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm text-muted hover:text-primary transition-colors border border-border-light/10">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=2D63FF&color=F9FAFB&bold=true" alt="User" className="w-10 h-10 rounded-full border border-white/10 ring-2 ring-primary/20" />
              <div className="hidden md:block">
                <h4 className="text-sm font-bold">Admin User</h4>
                <p className="text-xs text-gray-500">online</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Rendering */}
        <div className="max-w-[1440px] mx-auto pb-10 px-0 sm:px-4">
          {activePage === 'dashboard' && <UnifiedDashboard />}
          {activePage === 'bot-details' && <BotDetails />}
          {activePage === 'store' && <Store />}
          {activePage === 'tasks' && <Tasks />}
          {activePage === 'calendar' && <Calendar />}
          {activePage === 'analytics' && <Analytics />}
          {activePage === 'team' && <Team />}
          {activePage === 'users' && <UsersPage />}
          {activePage === 'settings' && <Settings />}
          {activePage === 'statistics' && <Statistics />}
          {activePage === 'help' && <HelpCenter />}
        </div>
      </main>
    </div>
  );
}

export default App;
