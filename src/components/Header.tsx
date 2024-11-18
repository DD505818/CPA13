import React, { useState } from 'react';
import { Menu, Bell, Settings, User, X, Brain, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="p-1 hover:bg-white/10 rounded-lg md:hidden transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-300" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                DDGPT Trading
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button className="p-2 hover:bg-white/10 rounded-full relative transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="absolute hidden group-hover:block top-full mt-1 right-0 bg-gray-800 text-xs py-1 px-2 rounded">
                Notifications
              </span>
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="absolute hidden group-hover:block top-full mt-1 right-0 bg-gray-800 text-xs py-1 px-2 rounded">
                Toggle Theme
              </span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <Settings className="w-5 h-5" />
              <span className="absolute hidden group-hover:block top-full mt-1 right-0 bg-gray-800 text-xs py-1 px-2 rounded">
                Settings
              </span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}