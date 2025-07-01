
export async function exportToWord(content: string, title: string): Promise<void> {
  try {
    // إنشاء محتوى HTML منسق للمقال
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arial', 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.8;
            margin: 2cm;
            text-align: justify;
            direction: rtl;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
            font-style: italic;
          }
          .content {
            margin-top: 30px;
          }
          .paragraph {
            margin-bottom: 15px;
            text-indent: 1cm;
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
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${title}</div>
          <div class="subtitle">مقال علمي مُنشأ بواسطة منصة المقالات العلمية</div>
        </div>
        
        <div class="content">
          ${content.split('\n').filter(p => p.trim()).map(paragraph => 
            `<div class="paragraph">${paragraph.trim()}</div>`
          ).join('')}
        </div>
        
        <div class="footer">
          <p>تم إنشاء هذا المقال بواسطة منصة المقالات العلمية</p>
          <p>تطوير: يوسف | مدعوم بتقنية Gemini AI</p>
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
    const fileName = `${title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_${Date.now()}.doc`;
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
