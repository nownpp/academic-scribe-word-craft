
interface ArticleParams {
  topic: string;
  wordCount: number;
  language: string;
  sectionType?: 'complete' | 'introduction' | 'definition' | 'main_section' | 'conclusion' | 'references';
  sectionIndex?: number;
  previousContent?: string;
  researchSettings?: {
    authorName: string;
    grade: string;
    supervisor: string;
    universityName: string;
    facultyName: string;
    departmentName: string;
    includeResearchPage: boolean;
  };
}

const GEMINI_API_KEY = 'AIzaSyDXz2fpgbsBZeE7heHRBilsYJJlMT3zyik';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function createScientificResearchPrompt(params: ArticleParams): string {
  const { topic, wordCount, language, sectionType = 'complete', sectionIndex = 0, previousContent = '' } = params;
  const isArabic = language === 'arabic';
  const languageInstruction = isArabic ? 'اكتب باللغة العربية الفصحى' : 'Write in English';

  if (sectionType === 'complete') {
    return `${languageInstruction}

أنت خبير أكاديمي متخصص في كتابة البحوث العلمية. اكتب بحثًا علميًا احترافيًا متكاملًا.

موضوع البحث: "${topic}"
الحد الأدنى للكلمات: ${wordCount} كلمة

✅ البنية المطلوبة:

${topic}

المقدمة:
تمهيد مختصر عن أهمية الموضوع وبيان المشكلة البحثية وأهداف البحث.

العناصر التي سيناقشها البحث:
1. [المحور الأول]
2. [المحور الثاني] 
3. [المحور الثالث]
4. [المحور الرابع]
5. [المحور الخامس]

ثم تناول كل محور بالتفصيل:

1. [عنوان المحور الأول]
[محتوى مفصل وعلمي]

2. [عنوان المحور الثاني]
[محتوى مفصل وعلمي]

وهكذا...

الخاتمة:
تلخيص شامل للنتائج والتوصيات

المراجع:
قائمة بـ 15-20 مرجع علمي متنوع

✅ المواصفات:
- أسلوب أكاديمي علمي دقيق
- لا يقل عن ${wordCount} كلمة
- معلومات دقيقة وموثوقة
- تسلسل منطقي للأفكار
- أمثلة عملية وإحصائيات
- بدون استخدام رموز مثل * أو # أو -
- نص مقروء ومنسق بطريقة احترافية

ابدأ بالعنوان الآن:`;
  }

  // للكتابة المرحلية المحسنة
  const sectionPrompts = {
    introduction: `${languageInstruction}

أنت خبير أكاديمي متخصص في كتابة المقدمات العلمية. اكتب مقدمة علمية شاملة ومتخصصة لبحث بعنوان: "مقدمة بحث عن ${topic}"

المتطلبات الأساسية:
- الحد الأدنى: 600 كلمة (مهم جداً)
- أسلوب علمي أكاديمي احترافي
- بدون استخدام رموز مثل * أو # أو - أو •
- نص مقروء ومنسق بطريقة احترافية

يجب أن تتضمن المقدمة العناصر التالية بالتفصيل:

1. التمهيد والخلفية العامة للموضوع (150-200 كلمة)
   - أهمية الموضوع في الوقت الحالي
   - السياق التاريخي والعلمي
   - الحاجة إلى دراسة هذا الموضوع

2. بيان المشكلة البحثية (100-150 كلمة)
   - تحديد المشكلة بوضوح
   - الثغرات في الدراسات السابقة
   - التحديات الحالية في هذا المجال

3. أهداف البحث (100-150 كلمة)
   - الهدف الرئيسي للبحث
   - الأهداف الفرعية المتوقعة
   - النتائج المرجوة من البحث

4. أهمية البحث وفوائده (100-150 كلمة)
   - الأهمية النظرية
   - الأهمية التطبيقية
   - المساهمة المتوقعة في المجال

5. منهجية البحث ونطاقه (50-100 كلمة)
   - نبذة عن المنهج المتبع
   - حدود الدراسة
   - نطاق البحث

ابدأ بكتابة المقدمة الآن مع التأكد من عدم استخدام أي رموز وكتابة نص احترافي:`,

    definition: `${languageInstruction}

أنت خبير أكاديمي متخصص في التعريفات والمفاهيم العلمية. اكتب قسم التعريف والمفاهيم الأساسية لبحث بعنوان: "التعريف والمفاهيم الأساسية لموضوع ${topic}"

${previousContent ? `السياق من المراحل السابقة:\n${previousContent.substring(0, 500)}...\n\n` : ''}

المتطلبات الأساسية:
- الحد الأدنى: 600 كلمة (مهم جداً)
- أسلوب علمي أكاديمي دقيق
- بدون استخدام رموز مثل * أو # أو - أو •
- نص مقروء ومنسق بطريقة احترافية
- تعريفات دقيقة وموثقة علمياً

يجب أن يتضمن هذا القسم العناصر التالية بالتفصيل:

1. التعريف الشامل للموضوع الرئيسي (150-200 كلمة)
   - تعريف لغوي واصطلاحي
   - التعريف العلمي المتخصص
   - وجهات النظر المختلفة في التعريف

2. المصطلحات الأساسية والمفاهيم المرتبطة (200-250 كلمة)
   - تعريف المصطلحات الفنية المهمة
   - شرح المفاهيم النظرية الأساسية
   - العلاقة بين المفاهيم المختلفة

3. الإطار النظري والخلفية العلمية (150-200 كلمة)
   - النظريات الرئيسية في المجال
   - المدارس الفكرية المختلفة
   - التطور التاريخي للمفهوم

4. التصنيفات والأنواع (100 كلمة تقريباً)
   - تصنيف الموضوع إلى فئات
   - الأنواع المختلفة وخصائصها
   - المعايير المستخدمة في التصنيف

ابدأ بكتابة التعريف والمفاهيم الآن مع التأكد من عدم استخدام أي رموز:`,

    main_section: `${languageInstruction}

أنت خبير أكاديمي متخصص في كتابة المحاور البحثية المتقدمة. اكتب المحور رقم ${sectionIndex - 1} من بحث بعنوان: "المحور ${sectionIndex === 2 ? 'الأول' : sectionIndex === 3 ? 'الثاني' : 'الثالث'} في دراسة ${topic}"

${previousContent ? `محتوى المراحل السابقة:\n${previousContent.substring(0, 800)}...\n\n` : ''}

المتطلبات الأساسية:
- الحد الأدنى: 600 كلمة (مهم جداً)
- أسلوب علمي أكاديمي متقدم
- بدون استخدام رموز مثل * أو # أو - أو •
- نص مقروء ومنسق بطريقة احترافية
- ربط منطقي بالمحاور السابقة

يجب أن يتضمن هذا المحور العناصر التالية بالتفصيل:

1. عنوان فرعي واضح ومحدد للمحور (10-15 كلمة)

2. مقدمة المحور (80-100 كلمة)
   - ربط بالمحاور السابقة
   - تقديم للموضوع الفرعي
   - أهمية هذا الجانب

3. التحليل النظري المتعمق (200-250 كلمة)
   - عرض النظريات المتعلقة
   - تحليل علمي مفصل
   - وجهات النظر المختلفة

4. الأمثلة العملية والتطبيقات (150-200 كلمة)
   - حالات دراسية
   - أمثلة واقعية
   - تطبيقات عملية

5. البيانات والإحصائيات (100-150 كلمة)
   - معلومات رقمية موثقة
   - إحصائيات مهمة
   - مقارنات علمية

6. التحديات والحلول (80-100 كلمة)
   - التحديات الحالية
   - الحلول المقترحة
   - الاتجاهات المستقبلية

ابدأ بكتابة المحور الآن مع التأكد من عدم استخدام أي رموز:`,

    conclusion: `${languageInstruction}

أنت خبير أكاديمي متخصص في كتابة الخواتيم العلمية. اكتب خاتمة شاملة ومتكاملة لبحث بعنوان: "خاتمة ونتائج بحث عن ${topic}"

${previousContent ? `محتوى البحث الكامل السابق:\n${previousContent.substring(0, 1000)}...\n\n` : ''}

المتطلبات الأساسية:
- الحد الأدنى: 600 كلمة (مهم جداً)
- أسلوب علمي أكاديمي احترافي
- بدون استخدام رموز مثل * أو # أو - أو •
- نص مقروء ومنسق بطريقة احترافية
- ربط شامل بجميع محاور البحث

يجب أن تتضمن الخاتمة العناصر التالية بالتفصيل:

1. ملخص شامل للبحث (150-200 كلمة)
   - إعادة صياغة موجزة لأهداف البحث
   - تلخيص المحاور الرئيسية
   - الربط بين أجزاء البحث المختلفة

2. النتائج الرئيسية (200-250 كلمة)
   - أهم النتائج التي توصل إليها البحث
   - الاكتشافات الجديدة أو التأكيدات المهمة
   - النتائج المتوقعة والنتائج المفاجئة

3. الاستنتاجات المهمة (100-150 كلمة)
   - الخلاصات العلمية المهمة
   - الأفكار الجديدة المستخلصة
   - التفسيرات النظرية للنتائج

4. التوصيات العملية (100-150 كلمة)
   - توصيات للممارسين في المجال
   - اقتراحات للتطبيق العملي
   - إرشادات للاستفادة من النتائج

5. المقترحات للبحوث المستقبلية (50-100 كلمة)
   - المجالات التي تحتاج لمزيد من البحث
   - الفجوات التي يمكن سدها
   - الاتجاهات البحثية المستقبلية

ابدأ بكتابة الخاتمة الآن مع التأكد من عدم استخدام أي رموز:`,

    references: `${languageInstruction}

أنت خبير أكاديمي متخصص في توثيق المراجع العلمية. اكتب قائمة مراجع علمية موثقة وشاملة لبحث بعنوان: "${topic}"

المتطلبات الأساسية:
- عدد المراجع: 3-4 مراجع فقط (حسب المطلوب)
- تنوع في مصادر المراجع
- بدون استخدام رموز مثل * أو # أو - أو •
- تنسيق أكاديمي احترافي

يجب أن تتضمن قائمة المراجع:

1. كتاب أكاديمي متخصص في الموضوع
2. مقال بحثي في مجلة علمية محكمة
3. دراسة أو تقرير من مؤسسة علمية موثقة
4. مرجع إضافي (كتاب أو مقال حديث)

تنسيق المراجع (استخدم الأرقام فقط):

1. [اسم المؤلف الأول]، [اسم المؤلف الثاني إن وجد]. ([السنة]). [عنوان الكتاب أو المقال]. [مكان النشر]: [دار النشر أو اسم المجلة].

2. [اسم المؤلف]. ([السنة]). [عنوان المقال]. [اسم المجلة]، المجلد ([رقم العدد])، الصفحات.

3. [اسم المؤسسة أو المؤلف]. ([السنة]). [عنوان التقرير أو الدراسة]. [المدينة]: [الناشر].

4. [اسم المؤلف]. ([السنة]). [عنوان المرجع]. [معلومات النشر].

ملاحظة مهمة: استخدم أسماء مؤلفين ومراجع حقيقية ومناسبة للموضوع، مع سنوات نشر متنوعة وحديثة نسبياً.

ابدأ بكتابة قائمة المراجع الآن:`
  };

  return sectionPrompts[sectionType] || sectionPrompts.main_section;
}

export async function generateArticleSection(params: ArticleParams): Promise<string> {
  const prompt = createScientificResearchPrompt(params);
  
  try {
    console.log('إرسال طلب إلى Gemini Flash API...');
    console.log('نوع القسم:', params.sectionType);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log('حالة الاستجابة:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('خطأ في API:', errorData || response.statusText);
      
      if (response.status === 403) {
        throw new Error('مفتاح API غير صحيح أو منتهي الصلاحية');
      } else if (response.status === 429) {
        throw new Error('تم تجاوز حد الاستخدام، يرجى المحاولة لاحقاً');
      } else if (response.status >= 500) {
        throw new Error('خطأ في الخادم، يرجى المحاولة لاحقاً');
      } else {
        throw new Error(`خطأ في API: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('استجابة API:', data);
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      if (!generatedText || generatedText.trim().length === 0) {
        throw new Error('تم إنشاء محتوى فارغ من الخدمة');
      }
      
      console.log('تم إنشاء المحتوى بنجاح، عدد الأحرف:', generatedText.length);
      return generatedText.trim();
    } else {
      console.error('بنية الاستجابة غير متوقعة:', data);
      
      if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
        throw new Error('تم رفض المحتوى لأسباب الأمان، يرجى تعديل الموضوع');
      }
      
      throw new Error('لم يتم الحصول على استجابة صحيحة من الخدمة');
    }
  } catch (error) {
    console.error('خطأ في استدعاء Gemini API:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك وإعادة المحاولة.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('حدث خطأ غير متوقع في إنشاء المحتوى');
  }
}

// للتوافق مع الكود الموجود
export const generateArticle = generateArticleSection;
