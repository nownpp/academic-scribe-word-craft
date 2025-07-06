
import jsPDF from 'jspdf';

interface ResearchSettings {
  authorName: string;
  grade: string;
  supervisor: string;
  universityName: string;
  facultyName: string;
  departmentName: string;
  includeResearchPage: boolean;
}

interface TableOfContentsItem {
  title: string;
  pageNumber: number;
}

export const generatePDFDocument = async (
  content: string,
  title: string,
  researchSettings?: ResearchSettings
) => {
  try {
    console.log('بدء إنشاء مستند PDF...');
    
    if (!content || content.trim().length === 0) {
      throw new Error('لا يوجد محتوى للتصدير');
    }

    if (!title || title.trim().length === 0) {
      throw new Error('لا يوجد عنوان للمستند');
    }

    // إنشاء مستند PDF جديد مع الإعدادات الصحيحة
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    // إعدادات الصفحة
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;
    let currentPageNumber = 1;
    const lineHeight = 7;
    const tableOfContents: TableOfContentsItem[] = [];

    // دالة لإضافة صفحة جديدة
    const addNewPage = () => {
      doc.addPage();
      currentPageNumber++;
      yPosition = margin;
    };

    // دالة للتحقق من الحاجة لصفحة جديدة
    const checkPageBreak = (additionalHeight: number = lineHeight) => {
      if (yPosition + additionalHeight > pageHeight - margin - 15) {
        addNewPage();
      }
    };

    // دالة لإضافة نص مع تحسين معالجة النص العربي
    const addText = (
      text: string, 
      fontSize: number = 12, 
      isBold: boolean = false, 
      alignment: 'right' | 'center' | 'left' = 'right',
      addToTOC: boolean = false
    ) => {
      // تنظيف النص من الرموز غير المرغوبة
      const cleanText = text
        .replace(/[\u202A-\u202E\u200E\u200F]/g, '') // إزالة رموز التحكم في الاتجاه
        .replace(/\s+/g, ' ') // توحيد المسافات
        .trim();

      if (!cleanText) return;

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');

      // إضافة إلى الفهرس إذا كان مطلوباً
      if (addToTOC && cleanText.trim()) {
        tableOfContents.push({
          title: cleanText.trim(),
          pageNumber: currentPageNumber
        });
      }

      // تقسيم النص بشكل أفضل
      const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
      const words = cleanText.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // كلمة طويلة جداً - قسمها
            for (let i = 0; i < word.length; i += maxCharsPerLine) {
              lines.push(word.substring(i, i + maxCharsPerLine));
            }
            currentLine = '';
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // إضافة الأسطر
      for (let i = 0; i < lines.length; i++) {
        checkPageBreak();
        
        let xPosition = margin;
        if (alignment === 'center') {
          xPosition = pageWidth / 2;
        } else if (alignment === 'right') {
          xPosition = pageWidth - margin;
        }
        
        doc.text(lines[i], xPosition, yPosition, { 
          align: alignment,
          baseline: 'top'
        });
        yPosition += lineHeight;
      }
    };

    // إضافة صفحة الغلاف
    if (researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
      // اسم الجامعة
      if (researchSettings.universityName) {
        addText(researchSettings.universityName, 20, true, 'center');
        yPosition += 15;
      }

      // اسم الكلية
      if (researchSettings.facultyName) {
        addText(researchSettings.facultyName, 16, false, 'center');
        yPosition += 10;
      }

      // اسم القسم
      if (researchSettings.departmentName) {
        addText(researchSettings.departmentName, 14, false, 'center');
        yPosition += 20;
      }

      // عنوان البحث
      yPosition += 40;
      addText(title, 18, true, 'center');
      yPosition += 40;

      // معلومات الطالب
      if (researchSettings.authorName) {
        addText(`إعداد: ${researchSettings.authorName}`, 14, false, 'center');
        yPosition += 10;
      }

      if (researchSettings.grade) {
        addText(`الفرقة: ${researchSettings.grade}`, 14, false, 'center');
        yPosition += 10;
      }

      if (researchSettings.supervisor) {
        addText(`إشراف: ${researchSettings.supervisor}`, 14, false, 'center');
        yPosition += 20;
      }

      // العام الأكاديمي
      const currentYear = new Date().getFullYear();
      addText(`العام الأكاديمي ${currentYear}/${currentYear + 1}`, 12, false, 'center');

      // صفحة جديدة للفهرس
      addNewPage();
    }

    // معالجة المحتوى لإنشاء الفهرس
    const cleanContent = cleanDisplayContent(content);
    const contentLines = cleanContent.split('\n').filter(line => line.trim());
    
    // تحليل المحتوى المسبق لإنشاء الفهرس
    let tempPageNumber = currentPageNumber + 1; // +1 لصفحة الفهرس
    const tempTOC: TableOfContentsItem[] = [];
    let tempYPosition = margin;
    
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (isSectionHeader(trimmedLine)) {
        tempTOC.push({
          title: trimmedLine,
          pageNumber: tempPageNumber
        });
      }

      // تقدير ارتفاع السطر بشكل أكثر دقة
      const fontSize = isSectionHeader(trimmedLine) ? 14 : 12;
      const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
      const estimatedLines = Math.ceil(trimmedLine.length / maxCharsPerLine);
      const estimatedHeight = estimatedLines * lineHeight + (isSectionHeader(trimmedLine) ? 20 : 8);
      
      if (tempYPosition + estimatedHeight > pageHeight - margin - 15) {
        tempPageNumber++;
        tempYPosition = margin;
      }
      tempYPosition += estimatedHeight;
    }

    // إضافة صفحة الفهرس
    addText('الفهرس', 18, true, 'center');
    yPosition += 15;
    
    // خط تحت العنوان
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // إضافة عناصر الفهرس
    for (const item of tempTOC) {
      checkPageBreak(20);
      
      // العنوان على اليمين
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const titleText = item.title.length > 60 ? item.title.substring(0, 60) + '...' : item.title;
      doc.text(titleText, pageWidth - margin, yPosition, { align: 'right' });
      
      // رقم الصفحة على اليسار
      doc.text(item.pageNumber.toString(), margin, yPosition, { align: 'left' });
      
      // خط منقط بين العنوان ورقم الصفحة
      const titleWidth = doc.getTextWidth(titleText);
      const pageNumWidth = doc.getTextWidth(item.pageNumber.toString());
      const dotStartX = pageWidth - margin - titleWidth - 5;
      const dotEndX = margin + pageNumWidth + 5;
      
      if (dotStartX > dotEndX) {
        const dotCount = Math.floor((dotStartX - dotEndX) / 4);
        for (let i = 0; i < dotCount; i++) {
          const dotX = dotEndX + (i * 4);
          doc.circle(dotX, yPosition - 2, 0.3, 'F');
        }
      }
      
      yPosition += 10;
    }

    // صفحة جديدة للمحتوى الرئيسي
    addNewPage();

    // إضافة المحتوى الرئيسي
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        yPosition += 5;
        continue;
      }

      // تحديد نوع السطر وتنسيقه
      if (isSectionHeader(trimmedLine)) {
        yPosition += 10;
        addText(trimmedLine, 14, true, 'right', true);
        yPosition += 10;
        
        // خط تحت العنوان
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.3);
        doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
        yPosition += 5;
      } else {
        addText(trimmedLine, 12, false, 'right');
        yPosition += 3;
      }
    }

    // إضافة أرقام الصفحات
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // تخطي ترقيم صفحة الغلاف
      if (i === 1 && researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
        continue;
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `- ${i} -`, 
        pageWidth / 2, 
        pageHeight - 10, 
        { align: 'center' }
      );
    }

    // إنشاء اسم الملف
    const fileName = createSafeFileName(title, 'pdf');
    
    console.log(`حفظ ملف PDF باسم: ${fileName}`);
    
    // حفظ الملف
    doc.save(fileName);
    
    console.log('تم تصدير PDF بنجاح!');
    return true;

  } catch (error) {
    console.error('خطأ في تصدير PDF:', error);
    throw new Error(`فشل في تصدير ملف PDF: ${error instanceof Error ? error.message : 'خطأ غير محدد'}`);
  }
};

// دالة لتنظيف المحتوى
const cleanDisplayContent = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/###/g, '')
    .replace(/##/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/^\s*[\*\-\+•]\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_\_(.*?)\_\_/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/تم توليد هذا المحتوى بواسطة.*?\n?/gi, '')
    .replace(/أنت خبير أكاديمي.*?\n?/gi, '')
    .replace(/اكتب.*?علميًا.*?\n?/gi, '');
};

// دالة لتحديد العناوين
const isSectionHeader = (text: string): boolean => {
  const headers = [
    'المقدمة',
    'التعريف',
    'المحور',
    'الخاتمة',
    'المراجع',
    'النتائج',
    'التوصيات',
    'الفصل',
    'المبحث'
  ];
  
  return headers.some(header => text.includes(header)) || 
         text.match(/^\d+[\.\-\)]\s*/) !== null ||
         (text.length < 100 && text.includes(':'));
};

// دالة لإنشاء اسم ملف آمن
const createSafeFileName = (title: string, extension: string): string => {
  try {
    const cleanTitle = title
      .trim()
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    return cleanTitle ? `${cleanTitle}.${extension}` : `بحث_علمي.${extension}`;
  } catch (error) {
    return `بحث_علمي.${extension}`;
  }
};
