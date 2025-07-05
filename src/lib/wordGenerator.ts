
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
  const children: Paragraph[] = [];

  // إضافة صفحة الغلاف إذا كانت المعلومات متوفرة
  if (researchSettings && (researchSettings.universityName || researchSettings.authorName)) {
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
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 36,
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
            italic: true,
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
        children: [new TextRun({ text: '', break: 1 })],
        pageBreakBefore: true,
      })
    );
  }

  // معالجة محتوى البحث
  const lines = content.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;

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
  }

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

  // تصدير الملف
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  const fileName = title ? `${title.substring(0, 50)}.docx` : 'البحث_العلمي.docx';
  saveAs(blob, fileName);
};

// دوال مساعدة لتحديد نوع النص
const isMainTitle = (text: string, title: string): boolean => {
  return text === title || (text.length < 100 && text.includes(title.substring(0, 20)));
};

const isSectionTitle = (text: string): boolean => {
  const sectionKeywords = ['المقدمة', 'الخاتمة', 'المراجع', 'التعريف والمفاهيم'];
  return sectionKeywords.some(keyword => text.includes(keyword));
};

const isSubSectionTitle = (text: string): boolean => {
  return text.includes('المحور') || (text.match(/^\d+\./) && text.length < 200);
};

const isReference = (text: string): boolean => {
  return text.match(/^\d+\s*[\.\-]/);
};
