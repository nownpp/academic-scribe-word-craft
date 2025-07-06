
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

    // إنشاء مستند PDF جديد
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // إعدادات الصفحة
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;
    let currentPageNumber = 1;
    const lineHeight = 8;
    const tableOfContents: TableOfContentsItem[] = [];

    // دالة لإضافة صفحة جديدة
    const addNewPage = () => {
      doc.addPage();
      currentPageNumber++;
      yPosition = margin;
    };

    // دالة للتحقق من الحاجة لصفحة جديدة
    const checkPageBreak = (additionalHeight: number = lineHeight) => {
      if (yPosition + additionalHeight > pageHeight - margin) {
        addNewPage();
      }
    };

    // دالة لإضافة نص مع دعم أفضل للعربية
    const addText = (
      text: string, 
      fontSize: number = 12, 
      isBold: boolean = false, 
      alignment: 'right' | 'center' | 'left' = 'right',
      addToTOC: boolean = false
    ) => {
      doc.setFontSize(fontSize);
      
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      // إضافة إلى الفهرس إذا كان مطلوباً
      if (addToTOC && text.trim()) {
        tableOfContents.push({
          title: text.trim(),
          pageNumber: currentPageNumber
        });
      }

      // معالجة النص العربي وتقسيمه
      const processedText = processArabicText(text);
      const lines = doc.splitTextToSize(processedText, maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        checkPageBreak();
        
        let xPosition = margin;
        if (alignment === 'center') {
          xPosition = pageWidth / 2;
        } else if (alignment === 'right') {
          xPosition = pageWidth - margin;
        }
        
        doc.text(lines[i], xPosition, yPosition, { align: alignment });
        yPosition += lineHeight;
      }
    };

    // دالة لمعالجة النص العربي
    const processArabicText = (text: string): string => {
      return text
        .replace(/[\u202A-\u202E]/g, '') // إزالة رموز التحكم في الاتجاه
        .replace(/\s+/g, ' ') // توحيد المسافات
        .trim();
    };

    // إضافة صفحة الغلاف
    if (researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
      // اسم الجامعة
      if (researchSettings.universityName) {
        addText(researchSettings.universityName, 18, true, 'center');
        yPosition += 10;
      }

      // اسم الكلية
      if (researchSettings.facultyName) {
        addText(researchSettings.facultyName, 14, false, 'center');
        yPosition += 5;
      }

      // اسم القسم
      if (researchSettings.departmentName) {
        addText(researchSettings.departmentName, 12, false, 'center');
        yPosition += 15;
      }

      // عنوان البحث
      yPosition += 30;
      addText(title, 16, true, 'center');
      yPosition += 30;

      // معلومات الطالب
      if (researchSettings.authorName) {
        addText(`إعداد: ${researchSettings.authorName}`, 12, false, 'center');
        yPosition += 8;
      }

      if (researchSettings.grade) {
        addText(`الفرقة: ${researchSettings.grade}`, 12, false, 'center');
        yPosition += 8;
      }

      if (researchSettings.supervisor) {
        addText(`إشراف: ${researchSettings.supervisor}`, 12, false, 'center');
        yPosition += 15;
      }

      // العام الأكاديمي
      const currentYear = new Date().getFullYear();
      addText(`العام الأكاديمي ${currentYear}/${currentYear + 1}`, 11, false, 'center');

      // صفحة جديدة للفهرس
      addNewPage();
    }

    // معالجة المحتوى أولاً لاستخراج العناوين
    const cleanContent = cleanDisplayContent(content);
    const contentLines = cleanContent.split('\n').filter(line => line.trim());
    
    // تحليل المحتوى لإنشاء الفهرس
    let tempPageNumber = currentPageNumber + 1; // +1 لأننا سنضيف صفحة الفهرس
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

      // تقدير ارتفاع السطر
      const estimatedLines = Math.ceil(trimmedLine.length / 80);
      const estimatedHeight = estimatedLines * lineHeight + (isSectionHeader(trimmedLine) ? 15 : 5);
      
      if (tempYPosition + estimatedHeight > pageHeight - margin) {
        tempPageNumber++;
        tempYPosition = margin;
      } else {
        tempYPosition += estimatedHeight;
      }
    }

    // إضافة صفحة الفهرس
    addText('الفهرس', 16, true, 'center');
    yPosition += 20;
    
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // إضافة عناصر الفهرس
    for (const item of tempTOC) {
      checkPageBreak(15);
      
      // العنوان
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(item.title, margin, yPosition, { align: 'right' });
      
      // رقم الصفحة
      doc.text(item.pageNumber.toString(), pageWidth - margin, yPosition, { align: 'left' });
      
      // خط منقط
      const dotStartX = margin + doc.getTextWidth(item.title) + 5;
      const dotEndX = pageWidth - margin - doc.getTextWidth(item.pageNumber.toString()) - 5;
      const dotY = yPosition - 2;
      
      for (let x = dotStartX; x < dotEndX; x += 3) {
        doc.circle(x, dotY, 0.3, 'F');
      }
      
      yPosition += 8;
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
        yPosition += 8;
        addText(trimmedLine, 14, true, 'right', true);
        yPosition += 8;
      } else {
        addText(trimmedLine, 11, false, 'right');
        yPosition += 5;
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
        i.toString(), 
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
         text.length < 100 && text.includes(':');
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
