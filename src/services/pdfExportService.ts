
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
    const lineHeight = 8;

    // دالة لإضافة صفحة جديدة
    const addNewPage = () => {
      doc.addPage();
      yPosition = margin;
    };

    // دالة للتحقق من الحاجة لصفحة جديدة
    const checkPageBreak = (additionalHeight: number = lineHeight) => {
      if (yPosition + additionalHeight > pageHeight - margin) {
        addNewPage();
      }
    };

    // دالة لإضافة نص مع دعم النص العربي
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, alignment: 'right' | 'center' | 'left' = 'right') => {
      doc.setFontSize(fontSize);
      
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      // تقسيم النص إلى أسطر متعددة
      const lines = doc.splitTextToSize(text, maxWidth);
      
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

    // إضافة صفحة الغلاف إذا توفرت المعلومات
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
      yPosition += 20;
      addText(title, 16, true, 'center');
      yPosition += 20;

      // معلومات الطالب
      if (researchSettings.authorName) {
        addText(`إعداد: ${researchSettings.authorName}`, 12, false, 'center');
        yPosition += 5;
      }

      if (researchSettings.grade) {
        addText(`الفرقة: ${researchSettings.grade}`, 12, false, 'center');
        yPosition += 5;
      }

      if (researchSettings.supervisor) {
        addText(`إشراف: ${researchSettings.supervisor}`, 12, false, 'center');
        yPosition += 10;
      }

      // العام الأكاديمي
      const currentYear = new Date().getFullYear();
      addText(`العام الأكاديمي ${currentYear}/${currentYear + 1}`, 11, false, 'center');

      // صفحة جديدة للمحتوى
      addNewPage();
    }

    // معالجة المحتوى الرئيسي
    const cleanContent = cleanDisplayContent(content);
    const contentLines = cleanContent.split('\n').filter(line => line.trim());
    
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        yPosition += 5;
        continue;
      }

      // تحديد نوع السطر وتنسيقه
      if (isSectionHeader(trimmedLine)) {
        yPosition += 5;
        addText(trimmedLine, 14, true, 'right');
        yPosition += 5;
      } else {
        addText(trimmedLine, 11, false, 'right');
        yPosition += 3;
      }
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
    'التوصيات'
  ];
  
  return headers.some(header => text.includes(header));
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
