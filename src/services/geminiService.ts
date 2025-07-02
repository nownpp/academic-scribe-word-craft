
interface ArticleParams {
  topic: string;
  wordCount: number;
  language: string;
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
  const { topic, wordCount, language, researchSettings } = params;
  
  const isArabic = language === 'arabic';
  const languageInstruction = isArabic ? 'اكتب البحث كاملاً باللغة العربية' : 'Write the entire research in English';
  
  const promptText = `${languageInstruction}

أنت خبير أكاديمي متخصص في كتابة البحوث العلمية. مهمتك كتابة بحث علمي احترافي متكامل.

موضوع البحث: "${topic}"
الحد الأدنى للكلمات: ${wordCount} كلمة (يجب أن يكون البحث مفصلاً وشاملاً)
اللغة: ${isArabic ? 'العربية الفصحى' : 'English'}

📋 متطلبات البحث الأساسية:

${isArabic ? `
✅ البنية المطلوبة:

1. المقدمة:
   - تمهيد مختصر عن أهمية الموضوع
   - بيان المشكلة البحثية
   - أهدف البحث

2. العناصر الأساسية (المحاور):
   - قائمة مرقمة واضحة توضح أهم ما سيتم تناوله في البحث
   - يجب أن تكون شاملة ومنطقية

3. تناول كل عنصر على حدة:
   - عنوان فرعي واضح لكل محور
   - شرح مفصل وعلمي دقيق
   - أمثلة واقعية وبيانات علمية
   - ربط المحاور ببعضها البعض

4. الخاتمة:
   - تلخيص النتائج الرئيسية
   - التوصيات المستقبلية

5. المراجع:
   - قائمة بالمصادر العلمية المرجعية (عامة)
   - على الأقل 15-20 مرجع متنوع

✅ المواصفات العلمية:

- الأسلوب: أكاديمي علمي دقيق
- اللغة: عربية فصحى سليمة خالية من الأخطاء
- الطول: لا يقل عن ${wordCount} كلمة (يجب الوصول لحجم 11+ ورقة بحثية)
- المحتوى: معلومات دقيقة وموثوقة مع تحليل عميق
- التنظيم: تسلسل منطقي واضح للأفكار
- الأمثلة: استخدام حالات عملية وأرقام إحصائية مناسبة

✅ التنسيق المطلوب:

العنوان الرئيسي:
[عنوان البحث - واضح ومحدد]

المقدمة:
فقرة تمهيدية شاملة عن الموضوع وأهميته

العناصر التي سيناقشها البحث:
1. [المحور الأول]
2. [المحور الثاني] 
3. [المحور الثالث]
[... وهكذا حسب الموضوع]

ثم تناول كل محور بالتفصيل:

1. [عنوان المحور الأول]
[محتوى مفصل وعلمي عن هذا المحور]

2. [عنوان المحور الثاني]  
[محتوى مفصل وعلمي عن هذا المحور]

وهكذا حتى إنهاء جميع المحاور...

الخاتمة:
[تلخيص شامل للنتائج والتوصيات]

المراجع:
[قائمة بالمصادر العلمية]` : `
✅ Required Structure:

1. Introduction:
   - Brief overview of topic importance
   - Research problem statement
   - Research objectives

2. Main Elements (Outline):
   - Clear numbered list showing what will be discussed
   - Must be comprehensive and logical

3. Detailed discussion of each element:
   - Clear subheading for each section
   - Detailed and precise scientific explanation
   - Real examples and scientific data
   - Connect sections logically

4. Conclusion:
   - Summary of main findings
   - Future recommendations

5. References:
   - List of scientific sources (general)
   - At least 15-20 diverse references

✅ Scientific Specifications:

- Style: Academic and scientifically precise
- Language: Proper English free from errors
- Length: Minimum ${wordCount} words (must reach 11+ research pages)
- Content: Accurate and reliable information with deep analysis
- Organization: Clear logical flow of ideas
- Examples: Use practical cases and appropriate statistics`}

🎯 تعليمات مهمة:
- ابدأ الكتابة فوراً دون مقدمات إضافية
- اكتب البحث كاملاً ومفصلاً
- تأكد من الوصول للحد الأدنى من الكلمات المطلوبة
- اجعل البحث علمياً ومفيداً وقابلاً للنشر الأكاديمي
- استخدم معلومات دقيقة وموثوقة
- اربط المحاور ببعضها البعض بطريقة منطقية

ابدأ بالعنوان الرئيسي الآن:`;

  return promptText;
}

export async function generateArticle(params: ArticleParams): Promise<string> {
  const prompt = createScientificResearchPrompt(params);
  
  try {
    console.log('إرسال طلب إلى Gemini Flash API...');
    console.log('المعاملات:', params);
    
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
        throw new Error('تم إنشاء بحث فارغ من الخدمة');
      }
      
      console.log('تم إنشاء البحث بنجاح، عدد الأحرف:', generatedText.length);
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
    
    throw new Error('حدث خطأ غير متوقع في إنشاء البحث');
  }
}
