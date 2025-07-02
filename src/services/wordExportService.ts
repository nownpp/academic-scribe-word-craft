
interface ResearchSettings {
  authorName: string;
  grade: string;
  supervisor: string;
  includeResearchPage?: boolean;
}

export async function exportToWord(
  content: string, 
  title: string, 
  researchSettings?: ResearchSettings
): Promise<void> {
  try {
    // إنشاء صفحة الغلاف إذا تم توفير إعدادات البحث
    const coverPage = researchSettings && (researchSettings.authorName || researchSettings.grade || researchSettings.supervisor) ? `
      <div class="cover-page">
        <div class="university-header">
          <h1 class="university-name">الجامعة</h1>
          <h2 class="faculty-name">كلية الآداب والعلوم</h2>
          <h3 class="department-name">قسم البحوث العلمية</h3>
        </div>
        
        <div class="research-title-section">
          <h1 class="research-title">${title}</h1>
          <p class="research-subtitle">بحث علمي متقدم</p>
        </div>
        
        <div class="research-info">
          ${researchSettings.authorName ? `<p class="info-line"><strong>إعداد الطالب:</strong> ${researchSettings.authorName}</p>` : ''}
          ${researchSettings.grade ? `<p class="info-line"><strong>الفرقة:</strong> ${researchSettings.grade}</p>` : ''}
          ${researchSettings.supervisor ? `<p class="info-line"><strong>إشراف:</strong> ${researchSettings.supervisor}</p>` : ''}
        </div>
        
        <div class="academic-year">
          <p>العام الأكاديمي ${new Date().getFullYear()}/${new Date().getFullYear() + 1}</p>
        </div>
      </div>
      <div class="page-break"></div>
    ` : '';

    // إنشاء محتوى HTML منسق للبحث العلمي  
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arabic Typesetting', 'Arial', 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.5;
            margin: 2cm;
            text-align: justify;
            direction: rtl;
          }
          
          /* صفحة الغلاف */
          .cover-page {
            text-align: center;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            page-break-after: always;
          }
          
          .university-header {
            margin-bottom: 40px;
          }
          
          .university-name {
            font-size: 28px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 10px;
          }
          
          .faculty-name {
            font-size: 22px;
            color: #2d3748;
            margin-bottom: 8px;
          }
          
          .department-name {
            font-size: 18px;
            color: #4a5568;
          }
          
          .research-title-section {
            margin: 40px 0;
            padding: 20px;
            border: 3px solid #1a365d;
            border-radius: 10px;
          }
          
          .research-title {
            font-size: 24px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 15px;
            line-height: 1.3;
          }
          
          .research-subtitle {
            font-size: 18px;
            color: #4a5568;
            font-style: italic;
          }
          
          .research-info {
            margin: 30px 0;
          }
          
          .info-line {
            font-size: 16px;
            margin: 10px 0;
            color: #2d3748;
          }
          
          .academic-year {
            margin-top: 40px;
            font-size: 16px;
            color: #4a5568;
          }
          
          /* المحتوى الرئيسي */
          .page-break {
            page-break-before: always;
          }
          
          .main-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a365d;
            text-align: center;
            margin: 30px 0;
            padding-bottom: 15px;
            border-bottom: 2px solid #1a365d;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
            margin: 25px 0 15px 0;
            text-decoration: underline;
          }
          
          .content {
            margin-top: 30px;
          }
          
          .paragraph {
            margin-bottom: 15px;
            text-indent: 1cm;
            line-height: 1.6;
            text-align: justify;
          }
          
          .list-item {
            margin-bottom: 8px;
            padding-right: 20px;
          }
          
          .references-section {
            margin-top: 40px;
            page-break-before: always;
          }
          
          .reference-item {
            margin-bottom: 10px;
            padding-right: 20px;
            font-size: 13px;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          @page {
            margin: 2cm;
            @bottom-center {
              content: counter(page);
            }
          }
          
          @media print {
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        ${coverPage}
        
        <div class="content">
          ${content.split('\n').filter(p => p.trim()).map(paragraph => {
            const trimmed = paragraph.trim();
            
            // العنوان الرئيسي
            if (trimmed.length > 0 && !trimmed.includes('.') && trimmed.length < 100 && 
                (trimmed === title || trimmed.includes(title.substring(0, 20)))) {
              return `<h1 class="main-title">${trimmed}</h1>`;
            }
            
            // العناوين الفرعية (تبدأ برقم أو تحتوي على كلمات مفتاحية)
            if (trimmed.match(/^\d+\./)) {
              return `<h2 class="section-title">${trimmed}</h2>`;
            }
            
            // المراجع
            if (trimmed.includes('المراجع') || trimmed.includes('References')) {
              return `<div class="references-section"><h2 class="section-title">${trimmed}</h2></div>`;
            }
            
            // عناصر القائمة
            if (trimmed.match(/^[•\-\*]/)) {
              return `<div class="list-item">${trimmed}</div>`;
            }
            
            // المراجع المفردة
            if (trimmed.match(/^\d+\s*[\.\-]/)) {
              return `<div class="reference-item">${trimmed}</div>`;
            }
            
            // الفقرات العادية
            return `<div class="paragraph">${trimmed}</div>`;
          }).join('')}
        </div>
        
        <div class="footer">
          <p>تم إنشاء هذا البحث بواسطة منصة البحوث العلمية</p>
          <p>مدعوم بتقنية Gemini Flash AI</p>
          <p>تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </body>
      </html>
    `;

    // إنشاء Blob مع محتوى HTML
    const blob = new Blob([htmlContent], { 
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
