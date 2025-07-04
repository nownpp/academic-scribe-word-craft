import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut, FileText, Type, AlignLeft, AlignCenter, AlignJustify, Edit3, Sparkles } from 'lucide-react';
import { generateArticleSection } from '@/services/geminiService';
import { toast } from 'sonner';

interface ResearchViewerProps {
  content: string;
  title: string;
  researchSettings?: {
    authorName: string;
    grade: string;
    supervisor: string;
    universityName: string;
    facultyName: string;
    departmentName: string;
    includeResearchPage: boolean;
  };
}

export const ResearchViewer: React.FC<ResearchViewerProps> = ({ 
  content, 
  title, 
  researchSettings 
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'justify'>('justify');
  const [lineHeight, setLineHeight] = useState(1.8);
  const [editableContent, setEditableContent] = useState(content);
  const [isGenerating, setIsGenerating] = useState(false);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));

  const generateNewContent = async (selectedText: string, context: string) => {
    if (!selectedText.trim()) return;
    
    setIsGenerating(true);
    try {
      const newContent = await generateArticleSection({
        topic: `تطوير وتوسيع الفكرة: ${selectedText}`,
        wordCount: 200,
        language: 'arabic',
        sectionType: 'main_section',
        previousContent: context,
        researchSettings: researchSettings ? {
          ...researchSettings,
          includeResearchPage: true
        } : undefined
      });
      
      if (newContent) {
        // إدراج المحتوى الجديد مكان النص المحدد
        const updatedContent = editableContent.replace(selectedText, newContent.trim());
        setEditableContent(updatedContent);
        toast.success('تم توليد محتوى جديد بنجاح!');
      }
    } catch (error) {
      toast.error('فشل في توليد المحتوى الجديد');
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanDisplayContent = (text: string) => {
    return text
      // إزالة الرموز غير المرغوب فيها
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/^\s*[\*\-\+•]\s+/gm, '')
      // تنظيف علامات التنسيق
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_\_(.*?)\_\_/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // إزالة النصوص غير المرغوب فيها
      .replace(/تم توليد هذا المحتوى بواسطة.*?\n?/gi, '')
      .replace(/أنت خبير أكاديمي.*?\n?/gi, '')
      .replace(/اكتب.*?علميًا.*?\n?/gi, '');
  };

  const formatContentIntoPages = (text: string) => {
    const cleanedText = cleanDisplayContent(text);
    const paragraphs = cleanedText.split('\n').filter(p => p.trim());
    const pages: string[][] = [];
    let currentPage: string[] = [];
    let currentPageHeight = 0;
    const maxPageHeight = 800;
    
    paragraphs.forEach(paragraph => {
      const estimatedHeight = Math.ceil(paragraph.length / 80) * (fontSize * lineHeight);
      
      if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [paragraph];
        currentPageHeight = estimatedHeight;
      } else {
        currentPage.push(paragraph);
        currentPageHeight += estimatedHeight;
      }
    });
    
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    return pages;
  };

  const pages = formatContentIntoPages(editableContent);

  const renderCoverPage = () => {
    if (!researchSettings || (!researchSettings.universityName && !researchSettings.authorName)) {
      return null;
    }

    return (
      <div className="a4-page bg-white shadow-lg mb-8 p-8 flex flex-col justify-center items-center text-center">
        <div className="university-header mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-6" style={{ color: '#1a365d' }}>
            {researchSettings.universityName || 'الجامعة الأهلية'}
          </h1>
          <h2 className="text-2xl text-gray-700 mb-4" style={{ color: '#2d3748' }}>
            {researchSettings.facultyName || 'كلية الآداب والعلوم'}
          </h2>
          <h3 className="text-xl text-gray-600" style={{ color: '#4a5568' }}>
            {researchSettings.departmentName || 'قسم البحوث العلمية'}
          </h3>
        </div>
        
        <div className="research-title-section mb-12 p-8 border-4 rounded-lg" style={{ borderColor: '#1a365d' }}>
          <h1 className="text-3xl font-bold text-blue-900 mb-6 leading-tight" style={{ color: '#1a365d' }}>
            {title}
          </h1>
          <p className="text-xl text-gray-600 italic" style={{ color: '#4a5568' }}>
            بحث علمي متقدم
          </p>
        </div>
        
        <div className="research-info space-y-4 mb-12 text-lg" style={{ color: '#2d3748' }}>
          {researchSettings.authorName && (
            <p><strong>إعداد الطالب:</strong> {researchSettings.authorName}</p>
          )}
          {researchSettings.grade && (
            <p><strong>الفرقة:</strong> {researchSettings.grade}</p>
          )}
          {researchSettings.supervisor && (
            <p><strong>إشراف:</strong> {researchSettings.supervisor}</p>
          )}
        </div>
        
        <div className="academic-year">
          <p className="text-lg text-gray-600">
            العام الأكاديمي {new Date().getFullYear()}/{new Date().getFullYear() + 1}
          </p>
        </div>
      </div>
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 10) {
      const confirmed = window.confirm(`هل تريد توليد محتوى جديد حول: "${selectedText.substring(0, 50)}..."؟`);
      if (confirmed) {
        generateNewContent(selectedText, editableContent);
      }
    }
  };

  // دالة لتحديد نوع العنصر وإعطاؤه التنسيق المناسب
  const getElementStyle = (text: string, index: number) => {
    const trimmed = text.trim();
    
    // العنوان الرئيسي للبحث
    if (trimmed === title || (trimmed.length < 100 && index === 0)) {
      return {
        component: 'h1',
        className: 'text-center font-bold mb-10 pb-8 border-b-4 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 rounded-lg p-6 shadow-lg',
        style: { 
          color: '#1e40af', // أزرق قوي
          borderColor: '#1e40af',
          fontSize: `${fontSize + 12}px`,
          fontWeight: '900',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
        }
      };
    }
    
    // العناوين الرئيسية (المقدمة، الخاتمة، المراجع)
    if (trimmed.includes('المقدمة') || trimmed.includes('الخاتمة') || trimmed.includes('المراجع')) {
      return {
        component: 'h2',
        className: 'font-bold mt-10 mb-8 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 border-r-8 shadow-md',
        style: { 
          color: '#dc2626', // أحمر قوي
          borderColor: '#dc2626',
          fontSize: `${fontSize + 6}px`,
          fontWeight: '800',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }
      };
    }
    
    // العناوين الفرعية (التعريف والمحاور)
    if (trimmed.includes('التعريف والمفاهيم') || trimmed.includes('المحور')) {
      return {
        component: 'h2',
        className: 'font-bold mt-8 mb-6 p-5 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 border-r-6 shadow-sm',
        style: { 
          color: '#7c3aed', // بنفسجي
          borderColor: '#7c3aed',
          fontSize: `${fontSize + 4}px`,
          fontWeight: '700',
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }
      };
    }
    
    // العناوين الفرعية المرقمة
    if (trimmed.match(/^\d+\./) && trimmed.length < 200) {
      return {
        component: 'h3',
        className: 'font-semibold mt-6 mb-4 p-4 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-300 border-r-4',
        style: { 
          color: '#059669', // أخضر
          borderColor: '#059669',
          fontSize: `${fontSize + 2}px`,
          fontWeight: '600',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
        }
      };
    }
    
    // المراجع المرقمة - تحسين خاص
    if (trimmed.match(/^\d+\s*[\.\-]/)) {
      return {
        component: 'div',
        className: 'mr-4 mb-4 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 border-2 border-dashed shadow-sm',
        style: { 
          color: '#374151',
          borderColor: '#6b7280',
          fontSize: `${fontSize - 1}px`,
          lineHeight: 1.8,
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }
      };
    }
    
    // الفقرات العادية - تحسين مميز
    return {
      component: 'p',
      className: 'mb-6 text-indent cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 rounded-lg p-4 leading-relaxed shadow-sm border border-transparent hover:border-blue-200',
      style: { 
        color: '#1f2937', // لون داكن للنص
        textIndent: '2cm',
        lineHeight: 2.0,
        fontWeight: '400',
        fontSize: `${fontSize}px`,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        textAlign: 'justify' as const
      }
    };
  };

  return (
    <div className="w-full">
      {/* أزرار التحكم */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Type className="w-5 h-5" />
            أدوات التحرير والتنسيق المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 10}
                className="hover:bg-blue-50 border-blue-200"
              >
                <ZoomOut className="w-4 h-4" />
                تصغير
              </Button>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-lg text-blue-800 shadow-sm">
                {fontSize}px
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                className="hover:bg-blue-50 border-blue-200"
              >
                <ZoomIn className="w-4 h-4" />
                تكبير
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('right')}
                className={textAlign === 'right' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 border-blue-200'}
              >
                <AlignLeft className="w-4 h-4" />
                يمين
              </Button>
              <Button
                variant={textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('center')}
                className={textAlign === 'center' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 border-blue-200'}
              >
                <AlignCenter className="w-4 h-4" />
                وسط
              </Button>
              <Button
                variant={textAlign === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('justify')}
                className={textAlign === 'justify' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 border-blue-200'}
              >
                <AlignJustify className="w-4 h-4" />
                ضبط
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">تباعد الأسطر:</label>
              <select
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white hover:border-blue-400 focus:border-blue-500 shadow-sm"
              >
                <option value={1.5}>1.5</option>
                <option value={1.8}>1.8</option>
                <option value={2.0}>2.0</option>
                <option value={2.2}>2.2</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-lg shadow-sm">
              <Edit3 className="w-4 h-4" />
              <span>حدد أي نص لتوليد محتوى جديد</span>
              {isGenerating && <Sparkles className="w-4 h-4 animate-spin text-blue-600" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معاينة البحث */}
      <div className="research-preview" onMouseUp={handleTextSelection}>
        {renderCoverPage()}
        
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="a4-page bg-white shadow-xl mb-8 p-8 relative border border-gray-200"
            style={{
              fontFamily: "'Amiri', 'Arabic Typesetting', 'Times New Roman', serif",
              textAlign: textAlign,
              lineHeight: lineHeight,
            }}
          >
            <div className="content-area" dir="rtl">
              {pageContent.map((paragraph, paragraphIndex) => {
                const elementStyle = getElementStyle(paragraph, paragraphIndex);
                const Component = elementStyle.component as any;
                
                return (
                  <Component
                    key={paragraphIndex}
                    className={elementStyle.className}
                    style={elementStyle.style}
                  >
                    {paragraph.trim()}
                  </Component>
                );
              })}
            </div>
            
            {/* رقم الصفحة محسن */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full shadow-md border">
              صفحة {pageIndex + (researchSettings && (researchSettings.universityName || researchSettings.authorName) ? 2 : 1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
