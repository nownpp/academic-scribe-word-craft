
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ResearchSettings {
  authorName: string;
  grade: string;
  supervisor: string;
  universityName: string;
  facultyName: string;
  departmentName: string;
  includeResearchPage: boolean;
}

export const generateWordDocument = async (
  content: string,
  title: string,
  researchSettings?: ResearchSettings
) => {
  try {
    console.log('بدء إنشاء مستند Word...');
    
    // التحقق من صحة البيانات المدخلة
    if (!content || content.trim().length === 0) {
      throw new Error('لا يوجد محتوى للتصدير');
    }

    if (!title || title.trim().length === 0) {
      throw new Error('لا يوجد عنوان للمستند');
    }

    // إنشاء مصفوفة الفقرات
    const documentParagraphs: Paragraph[] = [];

    // إضافة صفحة الغلاف إذا توفرت المعلومات
    if (researchSettings) {
      // عنوان الجامعة
      if (researchSettings.universityName) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.universityName,
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // اسم الكلية
      if (researchSettings.facultyName) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.facultyName,
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      // اسم القسم
      if (researchSettings.departmentName) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.departmentName,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // عنوان البحث
      documentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // معلومات الطالب
      if (researchSettings.authorName) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إعداد: ${researchSettings.authorName}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.grade) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `الفرقة: ${researchSettings.grade}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.supervisor) {
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إشراف: ${researchSettings.supervisor}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // إضافة العام الحالي
      const currentYear = new Date().getFullYear();
      documentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `العام الأكاديمي ${currentYear}/${currentYear + 1}`,
              size: 16,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        })
      );

      // فاصل صفحة
      documentParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '' })],
          pageBreakBefore: true,
        })
      );
    }

    // معالجة المحتوى الرئيسي بطريقة بسيطة
    const contentLines = content.split('\n').filter(line => line.trim());
    
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // تحديد نوع السطر
      if (isSectionHeader(trimmedLine)) {
        // عناوين الأقسام
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          })
        );
      } else {
        // الفقرات العادية
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 16,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 120, after: 120 },
          })
        );
      }
    }

    console.log(`تم إنشاء ${documentParagraphs.length} فقرة`);

    // إنشاء المستند بإعدادات بسيطة
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: documentParagraphs,
        },
      ],
    });

    console.log('تحويل المستند إلى buffer...');
    
    // تحويل إلى buffer
    const buffer = await Packer.toBuffer(doc);
    
    console.log(`حجم الملف: ${buffer.byteLength} bytes`);

    // إنشاء البلوب
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // إنشاء اسم الملف
    const fileName = createSafeFileName(title);
    
    console.log(`حفظ الملف باسم: ${fileName}`);
    
    // حفظ الملف
    saveAs(blob, fileName);
    
    console.log('تم تصدير المستند بنجاح!');
    return true;

  } catch (error) {
    console.error('خطأ في تصدير المستند:', error);
    throw new Error(`فشل في تصدير الملف: ${error instanceof Error ? error.message : 'خطأ غير محدد'}`);
  }
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
const createSafeFileName = (title: string): string => {
  try {
    // تنظيف العنوان
    const cleanTitle = title
      .trim()
      .replace(/[<>:"/\\|?*]/g, '') // إزالة الأحرف غير المسموحة
      .replace(/\s+/g, '_') // استبدال المسافات بخط سفلي
      .substring(0, 50); // تقليل الطول

    return cleanTitle ? `${cleanTitle}.docx` : 'بحث_علمي.docx';
  } catch (error) {
    return 'بحث_علمي.docx';
  }
};
