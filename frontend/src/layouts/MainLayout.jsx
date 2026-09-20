import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, TrendingUp, Target, Repeat, Lightbulb, User, LogOut, Wallet } from 'lucide-react';

const MainLayout = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Income', path: '/income', icon: TrendingUp },
    { name: 'Transactions', path: '/transactions', icon: Wallet },
    { name: 'Budgets', path: '/budgets', icon: Target },
    { name: 'Recurring', path: '/recurring', icon: Repeat },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  return (
    <div className="flex h-screen font-sans bg-transparent">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col glass m-4 rounded-3xl overflow-hidden">
        <div className="h-20 flex items-center px-6 border-b border-white/20">
          <div className="bg-white/20 p-2 rounded-xl mr-3 shadow-sm border border-white/30 backdrop-blur-sm">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">SmartExpense</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-sm border border-white/30 backdrop-blur-md' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/20 p-5 bg-white/5">
          <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md border border-white/40">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-pink-400 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden m-4 ml-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 glass rounded-2xl mb-4 flex items-center justify-between px-4">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-white mr-2" />
            <span className="text-lg font-bold text-white">SmartExpense</span>
          </div>
          <button onClick={logout} className="text-gray-300 hover:text-pink-400 bg-white/10 border border-white/20 p-2 rounded-lg">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 glass rounded-3xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
