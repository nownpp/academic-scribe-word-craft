
import React from 'react';
import { Brain, FileText, Download, Clock, Shield, Users } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'ذكاء اصطناعي متقدم',
      description: 'نستخدم تقنية Gemini AI من Google لتوليد محتوى علمي دقيق ومتخصص',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      title: 'أسلوب أكاديمي احترافي',
      description: 'مقالات تتبع المعايير الأكاديمية والعلمية مع تنسيق احترافي',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Download,
      title: 'تصدير فوري إلى Word',
      description: 'احصل على ملف Word منسق وجاهز للطباعة والتقديم مباشرة',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'سرعة في الإنجاز',
      description: 'احصل على مقالك كاملاً في دقائق معدودة دون انتظار',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Shield,
      title: 'دقة وجودة عالية',
      description: 'محتوى موثوق ومراجع علمية مناسبة للأبحاث الأكاديمية',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Users,
      title: 'مناسب للجميع',
      description: 'مصمم للطلاب والباحثين وصناع المحتوى العلمي',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            لماذا تختار منصتنا؟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نوفر لك الأدوات والتقنيات الحديثة لإنشاء محتوى علمي متميز
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
