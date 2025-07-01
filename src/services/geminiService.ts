
interface ArticleParams {
  topic: string;
  articleType: string;
  wordCount: number;
  language: string;
}

const GEMINI_API_KEY = 'AIzaSyBHPTJbMjDX1xVNGMKBH5d8wg_wBaeDKQ0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generateArticle(params: ArticleParams): Promise<string> {
  const { topic, articleType, wordCount, language } = params;
  
  const isArabic = language === 'arabic';
  const languageInstruction = isArabic ? 'اكتب باللغة العربية' : 'Write in English';
  
  const prompt = `
${languageInstruction}. أنت كاتب أكاديمي متخصص في كتابة المقالات العلمية والبحثية. 

اكتب مقالاً علمياً احترافياً حول الموضوع التالي: "${topic}"

نوع المقال: ${articleType || 'مقال علمي عام'}
عدد الكلمات المطلوب: ${wordCount} كلمة تقريباً

يجب أن يتضمن المقال:
1. مقدمة جذابة ومناسبة للموضوع
2. عرض منطقي ومنظم للأفكار الرئيسية
3. استخدام أسلوب أكاديمي دقيق ومناسب
4. تقسيم المحتوى إلى فقرات واضحة ومترابطة
5. خاتمة تلخص النقاط الرئيسية
6. استخدام المصطلحات العلمية المناسبة

المقال يجب أن يكون:
- دقيقاً علمياً ومناسباً للاستخدام الأكاديمي
- منظماً ومنسقاً بطريقة احترافية
- خالياً من الأخطاء اللغوية والنحوية
- مدعماً بالحقائق والمعلومات الموثقة

ابدأ الكتابة مباشرة دون مقدمات إضافية.
  `;

  try {
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
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('لم يتم الحصول على استجابة صحيحة من الخدمة');
    }
  } catch (error) {
    console.error('خطأ في استدعاء Gemini API:', error);
    throw new Error('فشل في إنشاء المقال. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.');
  }
}
