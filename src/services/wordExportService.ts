
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, PageOrientation, convertInchesToTwip, TableOfContents, StyleLevel } from 'docx';
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

interface TableOfContentsItem {
  title: string;
  level: number;
}

export const generateWordDocument = async (
  content: string,
  title: string,
  researchSettings?: ResearchSettings
) => {
  try {
    console.log('بدء إنشاء مستند Word...');
    
    if (!content || content.trim().length === 0) {
      throw new Error('لا يوجد محتوى للتصدير');
    }

    if (!title || title.trim().length === 0) {
      throw new Error('لا يوجد عنوان للمستند');
    }

    // تنظيف وتنسيق المحتوى
    const cleanContent = cleanDisplayContent(content);
    const contentLines = cleanContent.split('\n').filter(line => line.trim());
    
    // إنشاء المستند
    const children: (Paragraph | TableOfContents)[] = [];

    // إضافة صفحة الغلاف إذا كانت الإعدادات متوفرة
    if (researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
      // اسم الجامعة
      if (researchSettings.universityName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.universityName,
                bold: true,
                size: 48,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // اسم الكلية والقسم
      if (researchSettings.facultyName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.facultyName,
                size: 32,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.departmentName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.departmentName,
                size: 28,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          })
        );
      }

      // عنوان البحث
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 36,
              font: 'Arial',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: '1f4e79' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: '1f4e79' },
            left: { style: BorderStyle.SINGLE, size: 6, color: '1f4e79' },
            right: { style: BorderStyle.SINGLE, size: 6, color: '1f4e79' },
          },
        })
      );

      // معلومات الطالب والإشراف
      if (researchSettings.authorName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إعداد: ${researchSettings.authorName}`,
                size: 28,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.grade) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `الفرقة: ${researchSettings.grade}`,
                size: 24,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.supervisor) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إشراف: ${researchSettings.supervisor}`,
                size: 28,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // العام الأكاديمي
      const currentYear = new Date().getFullYear();
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `العام الأكاديمي ${currentYear}/${currentYear + 1}`,
              size: 24,
              font: 'Arial',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          pageBreakBefore: false,
        })
      );

      // كسر صفحة بعد الغلاف
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '', size: 1 })],
          pageBreakBefore: true,
        })
      );
    }

    // إنشاء جدول المحتويات
    const tocItems: TableOfContentsItem[] = [];
    
    // تحليل المحتوى لإنشاء جدول المحتويات
    contentLines.forEach(line => {
      const trimmedLine = line.trim();
      if (isSectionHeader(trimmedLine)) {
        let level = 1;
        if (trimmedLine.includes('المحور') || trimmedLine.includes('التعريف')) {
          level = 2;
        } else if (trimmedLine.match(/^\d+\./)) {
          level = 3;
        }
        
        tocItems.push({
          title: trimmedLine,
          level: level
        });
      }
    });

    // إضافة عنوان الفهرس
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'الفهرس',
            bold: true,
            size: 36,
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        heading: HeadingLevel.HEADING_1,
      })
    );

    // إضافة عناصر الفهرس
    tocItems.forEach(item => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.title,
              size: item.level === 1 ? 24 : item.level === 2 ? 22 : 20,
              font: 'Arial',
              bold: item.level === 1,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          indent: {
            left: convertInchesToTwip(item.level * 0.5),
          },
        })
      );
    });

    // كسر صفحة قبل المحتوى الرئيسي
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '', size: 1 })],
        pageBreakBefore: true,
      })
    );

    // إضافة المحتوى الرئيسي
    contentLines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '', size: 1 })],
            spacing: { after: 200 },
          })
        );
        return;
      }

      if (isSectionHeader(trimmedLine)) {
        // العناوين الرئيسية
        if (trimmedLine.includes('المقدمة') || trimmedLine.includes('الخاتمة') || trimmedLine.includes('المراجع')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 32,
                  font: 'Arial',
                  color: 'c5504b',
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400, after: 300 },
              heading: HeadingLevel.HEADING_1,
            })
          );
        }
        // العناوين الفرعية
        else if (trimmedLine.includes('المحور') || trimmedLine.includes('التعريف')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 28,
                  font: 'Arial',
                  color: '7030a0',
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 300, after: 250 },
              heading: HeadingLevel.HEADING_2,
            })
          );
        }
        // العناوين المرقمة
        else if (trimmedLine.match(/^\d+\./)) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 24,
                  font: 'Arial',
                  color: '375623',
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 250, after: 200 },
              heading: HeadingLevel.HEADING_3,
            })
          );
        }
        // عناوين أخرى
        else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 26,
                  font: 'Arial',
                  color: '1f4e79',
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 300, after: 250 },
              heading: HeadingLevel.HEADING_2,
            })
          );
        }
      } else {
        // الفقرات العادية
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 22,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 360 },
            indent: {
              firstLine: convertInchesToTwip(0.5),
            },
          })
        );
      }
    });

    // إنشاء المستند النهائي
    const doc = new Document({
      creator: researchSettings?.authorName || 'مولد الأبحاث العلمية',
      title: title,
      description: 'بحث علمي تم إنشاؤه بواسطة مولد الأبحاث العلمية',
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
              size: {
                orientation: PageOrientation.PORTRAIT,
              },
            },
          },
          children: children,
        },
      ],
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Arial',
              size: 22,
            },
            paragraph: {
              spacing: {
                line: 360,
                after: 240,
              },
            },
          },
        ],
      },
    });

    // تصدير المستند
    const buffer = await Packer.toBuffer(doc);
    const fileName = createSafeFileName(title, 'docx');
    
    console.log(`حفظ ملف Word باسم: ${fileName}`);
    saveAs(new Blob([buffer]), fileName);
    
    console.log('تم تصدير Word بنجاح!');
    return true;

  } catch (error) {
    console.error('خطأ في تصدير Word:', error);
    throw new Error(`فشل في تصدير ملف Word: ${error instanceof Error ? error.message : 'خطأ غير محدد'}`);
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
