
import React from 'react';
import { BookOpen } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">منصة كتابة المقالات</h1>
        </div>
      </div>
    </header>
  );
};
