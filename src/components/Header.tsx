
import React from 'react';
import { BookOpen } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg border-b-4 border-blue-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-4">
          <BookOpen className="w-10 h-10 text-white animate-pulse" />
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">منصة كتابة المقالات</h1>
        </div>
      </div>
    </header>
  );
};
