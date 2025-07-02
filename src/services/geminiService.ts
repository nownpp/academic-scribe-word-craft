
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

ابدأ بالعنوان الآن:`;
  }

  // للكتابة المرحلية
  const sectionPrompts = {
    introduction: `${languageInstruction}

اكتب مقدمة علمية شاملة لبحث بعنوان: "${topic}"

يجب أن تتضمن المقدمة:
- تمهيد عن أهمية الموضوع
- بيان المشكلة البحثية
- أهداف البحث
- منهجية البحث

الطول: حوالي ${wordCount} كلمة
الأسلوب: علمي أكاديمي

ابدأ بكتابة المقدمة:`,

    definition: `${languageInstruction}

اكتب قسم التعريف والمفاهيم الأساسية لبحث بعنوان: "${topic}"

${previousContent ? `السياق السابق:\n${previousContent}\n\n` : ''}

يجب أن يتضمن هذا القسم:
- تعريف المصطلحات الأساسية
- المفاهيم النظرية المهمة
- الإطار النظري للبحث
- الخلفية العلمية للموضوع

الطول: حوالي ${wordCount} كلمة
الأسلوب: علمي أكاديمي دقيق

ابدأ بكتابة التعريف:`,

    main_section: `${languageInstruction}

اكتب المحور رقم ${sectionIndex - 1} من بحث بعنوان: "${topic}"

${previousContent ? `المحتوى السابق:\n${previousContent}\n\n` : ''}

يجب أن يتضمن هذا المحور:
- عنوان فرعي واضح
- تحليل علمي مفصل
- أمثلة عملية
- بيانات وإحصائيات (إن أمكن)
- ربط بالمحاور السابقة

الطول: حوالي ${wordCount} كلمة
الأسلوب: علمي أكاديمي

ابدأ بكتابة المحور:`,

    conclusion: `${languageInstruction}

اكتب خاتمة شاملة لبحث بعنوان: "${topic}"

${previousContent ? `محتوى البحث السابق:\n${previousContent}\n\n` : ''}

يجب أن تتضمن الخاتمة:
- تلخيص النتائج الرئيسية
- الاستنتاجات المهمة
- التوصيات المستقبلية
- المقترحات للبحوث القادمة

الطول: حوالي ${wordCount} كلمة
الأسلوب: علمي أكاديمي

ابدأ بكتابة الخاتمة:`,

    references: `${languageInstruction}

اكتب قائمة مراجع علمية لبحث بعنوان: "${topic}"

قم بإنشاء قائمة تتضمن:
- 3-4 مراجع أكاديمية متنوعة
- كتب علمية
- مقالات بحثية
- مصادر موثوقة

تنسيق المراجع:
1. [اسم المؤلف]. ([السنة]). [عنوان الكتاب/المقال]. [دار النشر/المجلة].
2. [اسم المؤلف]. ([السنة]). [عنوان الكتاب/المقال]. [دار النشر/المجلة].

ابدأ بكتابة المراجع:`
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
