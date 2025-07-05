
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
    console.log('Starting Word document generation...');
    console.log('Content length:', content?.length || 0);
    console.log('Title:', title);

    if (!content || content.trim() === '') {
      console.error('No content provided for export');
      throw new Error('لا يوجد محتوى للتصدير');
    }

    const children: Paragraph[] = [];

    // إضافة صفحة الغلاف إذا كانت المعلومات متوفرة
    if (researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
      console.log('Adding cover page...');
      
      // عنوان الجامعة
      if (researchSettings.universityName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.universityName,
                bold: true,
                size: 48,
                color: '1a365d',
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
                color: '2d3748',
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
                color: '4a5568',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          })
        );
      }

      // عنوان البحث
      if (title && title.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: title.trim(),
                bold: true,
                size: 36,
                color: '1a365d',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'بحث علمي متقدم',
              italics: true,
              size: 24,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        })
      );

      // معلومات الباحث
      if (researchSettings.authorName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إعداد الطالب: ${researchSettings.authorName}`,
                size: 24,
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
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // العام الأكاديمي
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `العام الأكاديمي ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
              size: 20,
              color: '666666',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
        })
      );

      // فاصل صفحة
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '' })],
          pageBreakBefore: true,
        })
      );
    }

    // معالجة محتوى البحث
    console.log('Processing research content...');
    const lines = content.split('\n').filter(line => line && line.trim().length > 0);
    console.log('Number of lines to process:', lines.length);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.length === 0) continue;

      try {
        // تحديد نوع النص وتنسيقه
        if (isMainTitle(trimmedLine, title)) {
          // العنوان الرئيسي
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 32,
                  color: '1e40af',
                }),
              ],
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 400 },
            })
          );
        } else if (isSectionTitle(trimmedLine)) {
          // عناوين الأقسام الرئيسية
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 26,
                  color: 'dc2626',
                }),
              ],
              alignment: AlignmentType.START,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            })
          );
        } else if (isSubSectionTitle(trimmedLine)) {
          // العناوين الفرعية
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 22,
                  color: '7c3aed',
                }),
              ],
              alignment: AlignmentType.START,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 150 },
            })
          );
        } else if (isReference(trimmedLine)) {
          // المراجع
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  size: 20,
                  color: '374151',
                }),
              ],
              alignment: AlignmentType.START,
              spacing: { before: 100, after: 100 },
              indent: { left: 400 },
            })
          );
        } else {
          // الفقرات العادية
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  size: 22,
                  color: '1f2937',
                }),
              ],
              alignment: AlignmentType.BOTH,
              spacing: { before: 150, after: 150 },
              indent: { firstLine: 800 },
            })
          );
        }
      } catch (lineError) {
        console.error(`Error processing line ${i}:`, lineError);
        // إضافة النص كفقرة بسيطة في حالة الخطأ
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 22,
                color: '1f2937',
              }),
            ],
            alignment: AlignmentType.BOTH,
            spacing: { before: 150, after: 150 },
          })
        );
      }
    }

    if (children.length === 0) {
      console.error('No content was processed');
      throw new Error('لم يتم معالجة أي محتوى للتصدير');
    }

    console.log('Creating Word document with', children.length, 'paragraphs...');

    // إنشاء الوثيقة
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    console.log('Converting document to buffer...');
    // تصدير الملف
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // إنشاء اسم الملف بشكل آمن
    let fileName = 'البحث_العلمي.docx';
    if (title && title.trim()) {
      const cleanTitle = title.trim()
        .substring(0, 50)
        .replace(/[^\w\s\u0600-\u06FF-]/g, '') // Keep Arabic characters and basic Latin
        .replace(/\s+/g, '_');
      if (cleanTitle) {
        fileName = `${cleanTitle}.docx`;
      }
    }
    
    console.log('Saving file as:', fileName);
    saveAs(blob, fileName);
    
    console.log('Word document generated successfully!');
    return true;
  } catch (error) {
    console.error('خطأ في تصدير الملف:', error);
    
    // معلومات إضافية للتشخيص
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير محدد في التصدير';
    throw new Error(`فشل في تصدير الملف: ${errorMessage}`);
  }
};

// دوال مساعدة لتحديد نوع النص - مع معالجة أفضل للأخطاء
const isMainTitle = (text: string, title?: string): boolean => {
  try {
    if (!text || !title) return false;
    return text === title || (text.length < 100 && title && text.includes(title.substring(0, Math.min(20, title.length))));
  } catch {
    return false;
  }
};

const isSectionTitle = (text: string): boolean => {
  try {
    if (!text) return false;
    const sectionKeywords = ['المقدمة', 'الخاتمة', 'المراجع', 'التعريف والمفاهيم'];
    return sectionKeywords.some(keyword => text.includes(keyword));
  } catch {
    return false;
  }
};

const isSubSectionTitle = (text: string): boolean => {
  try {
    if (!text) return false;
    const numberPattern = /^\d+\./;
    return text.includes('المحور') || (numberPattern.test(text) && text.length < 200);
  } catch {
    return false;
  }
};

const isReference = (text: string): boolean => {
  try {
    if (!text) return false;
    const referencePattern = /^\d+\s*[\.\-]/;
    return referencePattern.test(text);
  } catch {
    return false;
  }
};
