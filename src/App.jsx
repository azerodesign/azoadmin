import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Store from './pages/Store';
import UsersPage from './pages/Users';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import { Search, Bell, Mail, Menu, X } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-foreground font-sans flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          {/* Mobile Menu Toggle + Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-primary transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative flex-1 sm:w-80 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search task"
                className="w-full bg-white border-none rounded-full py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">⌘ F</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 justify-end">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-primary transition-colors">
              <Mail size={20} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-200">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="User" className="w-10 h-10 rounded-full" />
              <div className="hidden md:block">
                <h4 className="text-sm font-bold">Admin User</h4>
                <p className="text-xs text-gray-500">admin@azoai.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Rendering */}
        <div className="pb-10">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'store' && <Store />}
          {activePage === 'tasks' && <Tasks />}
          {activePage === 'calendar' && <Calendar />}
          {activePage === 'analytics' && <Analytics />}
          {activePage === 'team' && <Team />}
          {activePage === 'users' && <UsersPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
