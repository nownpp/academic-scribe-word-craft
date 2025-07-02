
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut, FileText, Type, AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';

interface ResearchViewerProps {
  content: string;
  title: string;
  researchSettings?: {
    authorName: string;
    grade: string;
    supervisor: string;
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

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));

  const formatContentIntoPages = (text: string) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
    const pages: string[][] = [];
    let currentPage: string[] = [];
    let currentPageHeight = 0;
    const maxPageHeight = 800; // تقدير ارتفاع الصفحة
    
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

  const pages = formatContentIntoPages(content);

  const renderCoverPage = () => {
    if (!researchSettings || (!researchSettings.authorName && !researchSettings.grade && !researchSettings.supervisor)) {
      return null;
    }

    return (
      <div className="a4-page bg-white shadow-lg mb-8 p-8 flex flex-col justify-center items-center text-center">
        <div className="university-header mb-12">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">الجامعة</h1>
          <h2 className="text-2xl text-gray-700 mb-3">كلية الآداب والعلوم</h2>
          <h3 className="text-xl text-gray-600">قسم البحوث العلمية</h3>
        </div>
        
        <div className="research-title-section mb-12 p-6 border-4 border-blue-900 rounded-lg">
          <h1 className="text-2xl font-bold text-blue-900 mb-4 leading-tight">{title}</h1>
          <p className="text-lg text-gray-600 italic">بحث علمي متقدم</p>
        </div>
        
        <div className="research-info space-y-3 mb-12">
          {researchSettings.authorName && (
            <p className="text-lg"><strong>إعداد الطالب:</strong> {researchSettings.authorName}</p>
          )}
          {researchSettings.grade && (
            <p className="text-lg"><strong>الفرقة:</strong> {researchSettings.grade}</p>
          )}
          {researchSettings.supervisor && (
            <p className="text-lg"><strong>إشراف:</strong> {researchSettings.supervisor}</p>
          )}
        </div>
        
        <div className="academic-year">
          <p className="text-lg text-gray-600">العام الأكاديمي {new Date().getFullYear()}/${new Date().getFullYear() + 1}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* أزرار التحكم */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            أدوات التنسيق
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
              <span className="text-sm font-medium">{fontSize}px</span>
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
              <label className="text-sm font-medium">المسافة بين السطور:</label>
              <select
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={1.2}>1.2</option>
                <option value={1.5}>1.5</option>
                <option value={1.6}>1.6</option>
                <option value={2.0}>2.0</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معاينة البحث */}
      <div className="research-preview">
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
                    <h1 key={paragraphIndex} className="text-center font-bold text-blue-900 mb-6 pb-4 border-b-2 border-blue-900">
                      {trimmed}
                    </h1>
                  );
                }
                
                // العناوين الفرعية
                if (trimmed.match(/^\d+\./)) {
                  return (
                    <h2 key={paragraphIndex} className="font-bold text-gray-800 mt-6 mb-4 underline">
                      {trimmed}
                    </h2>
                  );
                }
                
                // المراجع
                if (trimmed.includes('المراجع') || trimmed.includes('References')) {
                  return (
                    <h2 key={paragraphIndex} className="font-bold text-gray-800 mt-8 mb-4 text-center">
                      {trimmed}
                    </h2>
                  );
                }
                
                // عناصر القائمة
                if (trimmed.match(/^[•\-\*]/)) {
                  return (
                    <div key={paragraphIndex} className="mr-6 mb-2">
                      {trimmed}
                    </div>
                  );
                }
                
                // المراجع المفردة
                if (trimmed.match(/^\d+\s*[\.\-]/)) {
                  return (
                    <div key={paragraphIndex} className="mr-6 mb-2 text-sm">
                      {trimmed}
                    </div>
                  );
                }
                
                // الفقرات العادية
                return (
                  <p key={paragraphIndex} className="mb-4 text-indent">
                    {trimmed}
                  </p>
                );
              })}
            </div>
            
            {/* رقم الصفحة */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
              {pageIndex + (researchSettings && (researchSettings.authorName || researchSettings.grade || researchSettings.supervisor) ? 2 : 1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
