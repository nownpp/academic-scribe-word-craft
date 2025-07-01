
import React from 'react';
import { BookOpen, FileText, Download, Sparkles } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative container mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <BookOpen className="w-12 h-12 text-blue-300" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            منصة كتابة المقالات العلمية
            <span className="block text-blue-300 mt-2">بالذكاء الاصطناعي</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
            أنشئ مقالات علمية وبحثية عالية الجودة في دقائق معدودة مع إمكانية التصدير المباشر إلى ملف Word منسق واحترافي
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">مدعوم بـ Gemini AI</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <FileText className="w-5 h-5 text-green-300" />
              <span className="text-sm font-medium">أسلوب أكاديمي دقيق</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Download className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">تصدير فوري إلى Word</span>
            </div>
          </div>
          
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
