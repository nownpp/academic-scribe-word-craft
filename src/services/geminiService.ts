
interface ArticleParams {
  topic: string;
  articleType: string;
  wordCount: number;
  language: string;
}

const GEMINI_API_KEY = 'AIzaSyDMogr3BbF-Eggljeb6GoPvupsjvz6e-KI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// إنشاء بروومت متخصص حسب نوع المقال
function createSpecializedPrompt(params: ArticleParams): string {
  const { topic, articleType, wordCount, language } = params;
  
  const isArabic = language === 'arabic';
  const languageInstruction = isArabic ? 'اكتب المقال كاملاً باللغة العربية' : 'Write the entire article in English';
  
  let articleStructure = '';
  let specificInstructions = '';
  
  // تخصيص البروومت حسب نوع المقال
  switch (articleType) {
    case 'research':
      articleStructure = `
1. المقدمة (تعريف بالموضوع وأهميته)
2. مراجعة الأدبيات (الدراسات السابقة)
3. المنهجية (الطريقة المتبعة في البحث)
4. النتائج والتحليل
5. المناقشة والتفسير
6. الخاتمة والتوصيات
7. المراجع (اذكر مراجع علمية مناسبة)`;
      
      specificInstructions = `
- استخدم منهجية علمية واضحة
- اذكر أرقام وإحصائيات علمية مناسبة
- استخدم مصطلحات بحثية دقيقة
- اجعل الأسلوب أكاديمي ومتخصص`;
      break;
      
    case 'review':
      articleStructure = `
1. المقدمة (نظرة عامة على الموضوع)
2. تاريخ وتطور الموضوع
3. النظريات والمفاهيم الأساسية
4. الدراسات والبحوث الحديثة
5. التحليل النقدي للأدبيات
6. الفجوات البحثية والتوصيات
7. الخاتمة`;
      
      specificInstructions = `
- راجع وحلل الأدبيات الموجودة
- قارن بين النظريات والدراسات المختلفة
- اذكر نقاط القوة والضعف في الدراسات
- قدم نظرة شاملة ونقدية`;
      break;
      
    case 'analysis':
      articleStructure = `
1. المقدمة (تحديد موضوع التحليل)
2. الإطار النظري
3. منهجية التحليل
4. التحليل التفصيلي
5. النتائج والاستنتاجات
6. التوصيات والحلول
7. الخاتمة`;
      
      specificInstructions = `
- استخدم أدوات التحليل المناسبة
- قدم تحليلاً عميقاً ومفصلاً
- استخدم الأمثلة والحالات العملية
- اربط النتائج بالواقع العملي`;
      break;
      
    case 'case-study':
      articleStructure = `
1. المقدمة (تعريف بالحالة)
2. خلفية الحالة
3. منهجية دراسة الحالة
4. عرض وتحليل البيانات
5. النتائج والاستنتاجات
6. الدروس المستفادة
7. التوصيات والتطبيقات`;
      
      specificInstructions = `
- اختر حالة واقعية ومناسبة للموضوع
- قدم تفاصيل دقيقة عن الحالة
- حلل الحالة من زوايا متعددة
- استخرج الدروس والعبر العملية`;
      break;
      
    case 'survey':
      articleStructure = `
1. المقدمة (أهداف الاستطلاع)
2. منهجية البحث
3. تصميم الاستطلاع وأدواته
4. جمع البيانات والعينة
5. تحليل النتائج والإحصائيات
6. مناقشة النتائج
7. الخاتمة والتوصيات`;
      
      specificInstructions = `
- قدم نتائج إحصائية واقعية
- استخدم الرسوم البيانية الوصفية
- حلل البيانات بطريقة علمية
- فسر النتائج بوضوح`;
      break;
      
    default:
      articleStructure = `
1. المقدمة
2. التعريفات والمفاهيم الأساسية
3. العرض الرئيسي (3-4 نقاط رئيسية)
4. التطبيقات العملية
5. التحديات والحلول
6. الخاتمة`;
      
      specificInstructions = `
- استخدم أسلوب علمي ومنطقي
- قدم معلومات دقيقة ومفيدة
- استخدم أمثلة واقعية`;
  }
  
  return `${languageInstruction}

أنت خبير أكاديمي متخصص في الكتابة العلمية والبحثية. مهمتك كتابة مقال علمي احترافي عالي الجودة.

موضوع المقال: "${topic}"
نوع المقال: ${articleType || 'مقال علمي عام'}
عدد الكلمات المطلوب: ${wordCount} كلمة
اللغة: ${isArabic ? 'العربية' : 'الإنجليزية'}

هيكل المقال المطلوب:
${articleStructure}

تعليمات خاصة:
${specificInstructions}

معايير الجودة المطلوبة:
- أسلوب أكاديمي احترافي ودقيق
- استخدام المصطلحات العلمية المناسبة
- تنظيم منطقي وتسلسل واضح للأفكار
- معلومات دقيقة وموثوقة
- خلو من الأخطاء اللغوية والنحوية
- ترقيم وتنسيق مناسب للنشر الأكاديمي

تنسيق النص:
- استخدم العناوين الفرعية بوضوح
- اجعل الفقرات متوازنة ومترابطة
- استخدم الانتقالات السلسة بين الأفكار

ابدأ الكتابة فوراً دون مقدمات إضافية واكتب المقال كاملاً بالتفصيل.`;
}

export async function generateArticle(params: ArticleParams): Promise<string> {
  const prompt = createSpecializedPrompt(params);
  
  try {
    console.log('إرسال طلب إلى Gemini API...');
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
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    console.log('حالة الاستجابة:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('خطأ في API:', errorText);
      throw new Error(`خطأ في API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('استجابة API:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('تم إنشاء المقال بنجاح');
      return generatedText;
    } else {
      console.error('بنية الاستجابة غير متوقعة:', data);
      throw new Error('لم يتم الحصول على استجابة صحيحة من الخدمة');
    }
  } catch (error) {
    console.error('خطأ في استدعاء Gemini API:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك وإعادة المحاولة.');
    }
    
    throw new Error(`فشل في إنشاء المقال: ${error.message}`);
  }
}
