
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
  };
}

export const ResearchViewer: React.FC<ResearchViewerProps> = ({ 
  content, 
  title, 
  researchSettings 
}) => {
  const [fontSize, setFontSize] = useState(14);
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'justify'>('justify');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [editableContent, setEditableContent] = useState(content);
  const [isGenerating, setIsGenerating] = useState(false);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));

  const handleContentChange = (newContent: string) => {
    setEditableContent(newContent);
  };

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
        researchSettings
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

  const formatContentIntoPages = (text: string) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
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

  return (
    <div className="w-full">
      {/* أزرار التحكم */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Type className="w-5 h-5" />
            أدوات التحرير والتنسيق
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
              >
                <ZoomOut className="w-4 h-4" />
                تصغير
              </Button>
              <span className="text-sm font-medium bg-blue-50 px-3 py-1 rounded">
                {fontSize}px
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
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
              >
                <AlignLeft className="w-4 h-4" />
                يمين
              </Button>
              <Button
                variant={textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('center')}
              >
                <AlignCenter className="w-4 h-4" />
                وسط
              </Button>
              <Button
                variant={textAlign === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('justify')}
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
                className="px-3 py-1 border rounded text-sm bg-white"
              >
                <option value={1.2}>1.2</option>
                <option value={1.5}>1.5</option>
                <option value={1.6}>1.6</option>
                <option value={2.0}>2.0</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Edit3 className="w-4 h-4" />
              <span>حدد أي نص لتوليد محتوى جديد</span>
              {isGenerating && <Sparkles className="w-4 h-4 animate-spin" />}
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
            className="a4-page bg-white shadow-lg mb-8 p-8 relative"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              textAlign: textAlign,
            }}
          >
            <div className="content-area" dir="rtl">
              {pageContent.map((paragraph, paragraphIndex) => {
                const trimmed = paragraph.trim();
                
                // العنوان الرئيسي
                if (trimmed === title || (trimmed.length < 100 && pageIndex === 0 && paragraphIndex === 0)) {
                  return (
                    <h1 
                      key={paragraphIndex} 
                      className="text-center font-bold mb-8 pb-6 border-b-2 cursor-pointer hover:bg-blue-50 transition-colors rounded p-2"
                      style={{ 
                        color: '#1a365d', 
                        borderColor: '#1a365d',
                        fontSize: `${fontSize + 6}px`
                      }}
                    >
                      {trimmed}
                    </h1>
                  );
                }
                
                // العناوين الفرعية
                if (trimmed.match(/^\d+\./) || trimmed.includes('المقدمة') || trimmed.includes('الخاتمة') || trimmed.includes('المراجع')) {
                  return (
                    <h2 
                      key={paragraphIndex} 
                      className="font-bold mt-6 mb-4 underline cursor-pointer hover:bg-blue-50 transition-colors rounded p-2"
                      style={{ 
                        color: '#2d3748',
                        fontSize: `${fontSize + 2}px`
                      }}
                    >
                      {trimmed}
                    </h2>
                  );
                }
                
                // عناصر القائمة
                if (trimmed.match(/^[•\-\*]/)) {
                  return (
                    <div 
                      key={paragraphIndex} 
                      className="mr-6 mb-3 cursor-pointer hover:bg-gray-50 transition-colors rounded p-1"
                      style={{ color: '#4a5568' }}
                    >
                      {trimmed}
                    </div>
                  );
                }
                
                // المراجع المفردة
                if (trimmed.match(/^\d+\s*[\.\-]/)) {
                  return (
                    <div 
                      key={paragraphIndex} 
                      className="mr-6 mb-3 cursor-pointer hover:bg-gray-50 transition-colors rounded p-1"
                      style={{ 
                        color: '#4a5568',
                        fontSize: `${fontSize - 1}px`
                      }}
                    >
                      {trimmed}
                    </div>
                  );
                }
                
                // الفقرات العادية
                return (
                  <p 
                    key={paragraphIndex} 
                    className="mb-4 text-indent cursor-pointer hover:bg-gray-50 transition-colors rounded p-2"
                    style={{ 
                      color: '#2d3748',
                      textIndent: '1cm'
                    }}
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
            
            {/* رقم الصفحة */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
              {pageIndex + (researchSettings && (researchSettings.universityName || researchSettings.authorName) ? 2 : 1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
