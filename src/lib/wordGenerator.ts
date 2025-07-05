
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
    console.log('Research settings:', researchSettings);

    // التحقق من وجود المحتوى
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.error('No valid content provided for export');
      throw new Error('لا يوجد محتوى صالح للتصدير');
    }

    // التحقق من وجود العنوان
    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.error('No valid title provided');
      throw new Error('لا يوجد عنوان صالح للتصدير');
    }

    const children: Paragraph[] = [];

    // إضافة صفحة الغلاف إذا كانت المعلومات متوفرة
    if (researchSettings && Object.values(researchSettings).some(value => value && value.trim())) {
      console.log('Adding cover page...');
      
      // عنوان الجامعة
      if (researchSettings.universityName && researchSettings.universityName.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.universityName.trim(),
                bold: true,
                size: 32,
                color: '1a365d',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // اسم الكلية
      if (researchSettings.facultyName && researchSettings.facultyName.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.facultyName.trim(),
                size: 24,
                color: '2d3748',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      // اسم القسم
      if (researchSettings.departmentName && researchSettings.departmentName.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: researchSettings.departmentName.trim(),
                size: 20,
                color: '4a5568',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // عنوان البحث
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title.trim(),
              bold: true,
              size: 28,
              color: '1a365d',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'بحث علمي متقدم',
              italics: true,
              size: 18,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // معلومات الباحث
      if (researchSettings.authorName && researchSettings.authorName.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إعداد الطالب: ${researchSettings.authorName.trim()}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.grade && researchSettings.grade.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `الفرقة: ${researchSettings.grade.trim()}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      if (researchSettings.supervisor && researchSettings.supervisor.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `إشراف: ${researchSettings.supervisor.trim()}`,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
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
              size: 16,
              color: '666666',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
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
    const cleanContent = content.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = cleanContent.split('\n').filter(line => line && line.trim().length > 0);
    console.log('Number of lines to process:', lines.length);
    
    if (lines.length === 0) {
      throw new Error('لا يوجد محتوى صالح للمعالجة');
    }

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
                  size: 24,
                  color: '1e40af',
                }),
              ],
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 300 },
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
                  size: 20,
                  color: 'dc2626',
                }),
              ],
              alignment: AlignmentType.START,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
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
                  size: 18,
                  color: '7c3aed',
                }),
              ],
              alignment: AlignmentType.START,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 180, after: 120 },
            })
          );
        } else if (isReference(trimmedLine)) {
          // المراجع
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  size: 16,
                  color: '374151',
                }),
              ],
              alignment: AlignmentType.START,
              spacing: { before: 80, after: 80 },
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
                  size: 16,
                  color: '1f2937',
                }),
              ],
              alignment: AlignmentType.BOTH,
              spacing: { before: 120, after: 120 },
              indent: { firstLine: 600 },
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
                size: 16,
                color: '1f2937',
              }),
            ],
            alignment: AlignmentType.BOTH,
            spacing: { before: 120, after: 120 },
          })
        );
      }
    }

    if (children.length === 0) {
      console.error('No content was processed successfully');
      throw new Error('فشل في معالجة المحتوى - لا توجد فقرات صالحة');
    }

    console.log('Creating Word document with', children.length, 'paragraphs...');

    // إنشاء الوثيقة مع إعدادات محسنة
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
              size: {
                orientation: 'portrait',
              },
            },
          },
          children: children,
        },
      ],
      styles: {
        default: {
          document: {
            run: {
              font: 'Arial',
              size: 16,
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
                before: 0,
                after: 0,
              },
            },
          },
        },
      },
    });

    console.log('Converting document to buffer...');
    
    // تصدير الملف مع معالجة أفضل للأخطاء
    let buffer: ArrayBuffer;
    try {
      buffer = await Packer.toBuffer(doc);
    } catch (packError) {
      console.error('Error during document packing:', packError);
      throw new Error('فشل في تحويل الوثيقة إلى تنسيق Word');
    }

    if (!buffer || buffer.byteLength === 0) {
      throw new Error('تم إنشاء ملف فارغ - يرجى المحاولة مرة أخرى');
    }

    console.log('Buffer size:', buffer.byteLength, 'bytes');

    // إنشاء البلوب مع التحقق من النوع
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    if (blob.size === 0) {
      throw new Error('فشل في إنشاء الملف - حجم الملف صفر');
    }
    
    console.log('Blob size:', blob.size, 'bytes');
    
    // إنشاء اسم الملف بشكل آمن
    let fileName = 'البحث_العلمي.docx';
    try {
      if (title && title.trim()) {
        const cleanTitle = title.trim()
          .substring(0, 50)
          .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
          .replace(/\s+/g, '_')
          .replace(/[^\w\s\u0600-\u06FF_-]/g, ''); // Keep Arabic, Latin, underscore, hyphen
        
        if (cleanTitle && cleanTitle.length > 0) {
          fileName = `${cleanTitle}.docx`;
        }
      }
    } catch (nameError) {
      console.warn('Error creating filename, using default:', nameError);
    }
    
    console.log('Saving file as:', fileName);
    
    // حفظ الملف مع معالجة الأخطاء
    try {
      saveAs(blob, fileName);
    } catch (saveError) {
      console.error('Error during file save:', saveError);
      throw new Error('فشل في حفظ الملف - يرجى التحقق من إعدادات المتصفح');
    }
    
    console.log('Word document generated and saved successfully!');
    return true;

  } catch (error) {
    console.error('خطأ في تصدير الملف:', error);
    
    // معلومات إضافية للتشخيص
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // رفع خطأ واضح للمستخدم
    let errorMessage = 'خطأ غير محدد في التصدير';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(`فشل في تصدير ملف Word: ${errorMessage}`);
  }
};

// دوال مساعدة لتحديد نوع النص - محسنة مع معالجة أفضل للأخطاء
const isMainTitle = (text: string, title?: string): boolean => {
  try {
    if (!text || !title) return false;
    const normalizedText = text.trim().toLowerCase();
    const normalizedTitle = title.trim().toLowerCase();
    return normalizedText === normalizedTitle || 
           (normalizedText.length < 100 && normalizedTitle.includes(normalizedText.substring(0, Math.min(20, normalizedText.length))));
  } catch {
    return false;
  }
};

const isSectionTitle = (text: string): boolean => {
  try {
    if (!text || typeof text !== 'string') return false;
    const sectionKeywords = ['المقدمة', 'الخاتمة', 'المراجع', 'التعريف والمفاهيم', 'النتائج', 'التوصيات'];
    return sectionKeywords.some(keyword => text.includes(keyword));
  } catch {
    return false;
  }
};

const isSubSectionTitle = (text: string): boolean => {
  try {
    if (!text || typeof text !== 'string') return false;
    const numberPattern = /^\d+\./;
    return text.includes('المحور') || 
           text.includes('الفصل') || 
           text.includes('القسم') ||
           (numberPattern.test(text) && text.length < 200);
  } catch {
    return false;
  }
};

const isReference = (text: string): boolean => {
  try {
    if (!text || typeof text !== 'string') return false;
    const referencePattern = /^\d+[\.\-\s]/;
    return referencePattern.test(text.trim());
  } catch {
    return false;
  }
};
