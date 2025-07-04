
interface ResearchSettings {
  authorName: string;
  grade: string;
  supervisor: string;
  universityName: string;
  facultyName: string;
  departmentName: string;
}

export async function exportToWord(
  content: string, 
  title: string, 
  researchSettings?: ResearchSettings
): Promise<void> {
  try {
    // إنشاء صفحة الغلاف إذا تم توفير إعدادات البحث
    const coverPage = researchSettings && (researchSettings.universityName || researchSettings.authorName) ? `
      <div style="page-break-after: always; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: space-around;">
        <div style="margin-bottom: 40px;">
          <h1 style="font-size: 32px; font-weight: bold; color: #1a365d; margin-bottom: 15px;">${researchSettings.universityName || 'الجامعة الأهلية'}</h1>
          <h2 style="font-size: 24px; color: #2d3748; margin-bottom: 10px;">${researchSettings.facultyName || 'كلية الآداب والعلوم'}</h2>
          <h3 style="font-size: 20px; color: #4a5568;">${researchSettings.departmentName || 'قسم البحوث العلمية'}</h3>
        </div>
        
        <div style="margin: 50px 0; padding: 30px; border: 4px solid #1a365d; border-radius: 15px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1a365d; margin-bottom: 20px; line-height: 1.4;">${title}</h1>
          <p style="font-size: 20px; color: #4a5568; font-style: italic;">بحث علمي متقدم</p>
        </div>
        
        <div style="margin: 40px 0;">
          ${researchSettings.authorName ? `<p style="font-size: 18px; margin: 15px 0; color: #2d3748;"><strong>إعداد الطالب:</strong> ${researchSettings.authorName}</p>` : ''}
          ${researchSettings.grade ? `<p style="font-size: 18px; margin: 15px 0; color: #2d3748;"><strong>الفرقة:</strong> ${researchSettings.grade}</p>` : ''}
          ${researchSettings.supervisor ? `<p style="font-size: 18px; margin: 15px 0; color: #2d3748;"><strong>إشراف:</strong> ${researchSettings.supervisor}</p>` : ''}
        </div>
        
        <div style="margin-top: 50px;">
          <p style="font-size: 18px; color: #4a5568;">العام الأكاديمي ${new Date().getFullYear()}/${new Date().getFullYear() + 1}</p>
        </div>
      </div>
    ` : '';

    // تنظيف وتنسيق المحتوى
    const cleanContent = content
      .replace(/تم توليد هذا المحتوى بواسطة.*?Gemini.*?\n?/gi, '')
      .replace(/✍️.*?اكتب مقالًا علميًا احترافيًا.*?\n/gi, '')
      .replace(/باستخدام نموذج Gemini Flash.*?\n/gi, '')
      .trim();

    // إنشاء محتوى HTML منسق للبحث العلمي مع تحسينات لفتح الملف
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <meta name="ProgId" content="Word.Document">
        <meta name="Generator" content="Microsoft Word">
        <meta name="Originator" content="Microsoft Word">
        <link rel="File-List" href="filelist.xml">
        <title>${title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowRevisions/>
            <w:DoNotPrintRevisions/>
            <w:DisplayHorizontalDrawingGridEvery>0</w:DisplayHorizontalDrawingGridEvery>
            <w:DisplayVerticalDrawingGridEvery>2</w:DisplayVerticalDrawingGridEvery>
            <w:UseMarginsForDrawingGridOrigin/>
            <w:ValidateAgainstSchemas/>
            <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
            <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
            <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
            <w:Compatibility>
              <w:BreakWrappedTables/>
              <w:SnapToGridInCell/>
              <w:WrapTextWithPunct/>
              <w:UseAsianBreakRules/>
              <w:DontGrowAutofit/>
            </w:Compatibility>
            <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.25in 1.0in 1.25in;
            mso-header-margin: .5in;
            mso-footer-margin: .5in;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          
          body {
            font-family: 'Arabic Typesetting', 'Arial', 'Times New Roman', serif;
            font-size: 14pt;
            line-height: 1.6;
            text-align: justify;
            direction: rtl;
            color: #2d3748;
            margin: 0;
            padding: 0;
          }
          
          .main-title {
            font-size: 22pt;
            font-weight: bold;
            color: #1e40af;
            text-align: center;
            margin: 40px 0;
            padding-bottom: 20px;
            border-bottom: 3px solid #1e40af;
          }
          
          .major-heading {
            font-size: 18pt;
            font-weight: bold;
            color: #dc2626;
            margin: 30px 0 20px 0;
            text-decoration: underline;
            text-underline-offset: 5px;
          }
          
          .section-heading {
            font-size: 16pt;
            font-weight: bold;
            color: #7c3aed;
            margin: 25px 0 15px 0;
          }
          
          .sub-heading {
            font-size: 15pt;
            font-weight: 600;
            color: #059669;
            margin: 20px 0 10px 0;
          }
          
          .paragraph {
            margin-bottom: 18px;
            text-indent: 1.5cm;
            line-height: 1.8;
            text-align: justify;
            color: #2d3748;
            font-size: 14pt;
          }
          
          .reference-item {
            margin-bottom: 15px;
            padding: 8px 15px;
            font-size: 13pt;
            color: #4a5568;
            line-height: 1.6;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            background-color: #f9fafb;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 12pt;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${coverPage}
          
          <div class="content">
            ${cleanContent.split('\n').filter(p => p.trim()).map(paragraph => {
              const trimmed = paragraph.trim();
              
              // العنوان الرئيسي
              if (trimmed.length > 0 && !trimmed.includes('.') && trimmed.length < 100 && 
                  (trimmed === title || trimmed.includes(title.substring(0, 20)))) {
                return `<h1 class="main-title">${trimmed}</h1>`;
              }
              
              // العناوين الرئيسية
              if (trimmed.includes('المقدمة') || trimmed.includes('الخاتمة') || trimmed.includes('المراجع')) {
                return `<h2 class="major-heading">${trimmed}</h2>`;
              }
              
              // العناوين الفرعية
              if (trimmed.includes('التعريف والمفاهيم') || trimmed.includes('المحور')) {
                return `<h3 class="section-heading">${trimmed}</h3>`;
              }
              
              // العناوين الفرعية المرقمة
              if (trimmed.match(/^\d+\./) && trimmed.length < 200) {
                return `<h4 class="sub-heading">${trimmed}</h4>`;
              }
              
              // المراجع المفردة
              if (trimmed.match(/^\d+\s*[\.\-]/)) {
                return `<div class="reference-item">${trimmed}</div>`;
              }
              
              // الفقرات العادية
              return `<p class="paragraph">${trimmed}</p>`;
            }).join('')}
          </div>
          
          <div class="footer">
            <p>تم إنشاء هذا البحث بواسطة منصة البحوث العلمية الاحترافية</p>
            <p>تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إنشاء Blob مع محتوى HTML محسن لـ Word
    const blob = new Blob(['\ufeff', htmlContent], { 
      type: 'application/msword;charset=utf-8' 
    });

    // إنشاء رابط التحميل
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // تنسيق اسم الملف
    const fileName = `${title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_بحث_علمي_${Date.now()}.doc`;
    link.download = fileName;
    
    // تحميل الملف
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // تنظيف الرابط
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('خطأ في تصدير الملف:', error);
    throw new Error('فشل في تصدير الملف. يرجى المحاولة مرة أخرى.');
  }
}
