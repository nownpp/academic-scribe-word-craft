
import React from 'react';
import { Heart, Code, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold">منصة المقالات العلمية</h3>
          </div>
          
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            منصة متخصصة في كتابة المقالات العلمية والبحثية بالذكاء الاصطناعي، 
            مصممة لتلبية احتياجات الطلاب والباحثين وصناع المحتوى العلمي
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
            <span>تم التصميم بواسطة</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-blue-400">Yousef</span>
            <Code className="w-4 h-4 text-blue-400" />
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>• مدعوم بتقنية Gemini AI من Google</span>
              <span>• تصدير مباشر إلى ملفات Word</span>
              <span>• محتوى علمي عالي الجودة</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
