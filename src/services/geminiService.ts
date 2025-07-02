
interface ArticleParams {
  topic: string;
  articleType: string;
  wordCount: number;
  language: string;
}

const GEMINI_API_KEY = 'AIzaSyDXz2fpgbsBZeE7heHRBilsYJJlMT3zyik';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
      articleStructure = isArabic ? `
1. المقدمة (تعريف بالموضوع وأهميته)
2. مراجعة الأدبيات (الدراسات السابقة)
3. المنهجية (الطريقة المتبعة في البحث)
4. النتائج والتحليل
5. المناقشة والتفسير
6. الخاتمة والتوصيات
7. المراجع` : `
1. Introduction (Topic definition and importance)
2. Literature Review (Previous studies)
3. Methodology (Research approach)
4. Results and Analysis
5. Discussion and Interpretation
6. Conclusion and Recommendations
7. References`;
      
      specificInstructions = isArabic ? `
- استخدم منهجية علمية واضحة
- اذكر أرقام وإحصائيات علمية مناسبة
- استخدم مصطلحات بحثية دقيقة
- اجعل الأسلوب أكاديمي ومتخصص` : `
- Use clear scientific methodology
- Include appropriate scientific numbers and statistics
- Use precise research terminology
- Make the style academic and specialized`;
      break;
      
    case 'review':
      articleStructure = isArabic ? `
1. المقدمة (نظرة عامة على الموضوع)
2. تاريخ وتطور الموضوع
3. النظريات والمفاهيم الأساسية
4. الدراسات والبحوث الحديثة
5. التحليل النقدي للأدبيات
6. الفجوات البحثية والتوصيات
7. الخاتمة` : `
1. Introduction (Overview of the topic)
2. History and development of the topic
3. Basic theories and concepts
4. Recent studies and research
5. Critical analysis of literature
6. Research gaps and recommendations
7. Conclusion`;
      
      specificInstructions = isArabic ? `
- راجع وحلل الأدبيات الموجودة
- قارن بين النظريات والدراسات المختلفة
- اذكر نقاط القوة والضعف في الدراسات
- قدم نظرة شاملة ونقدية` : `
- Review and analyze existing literature
- Compare different theories and studies
- Mention strengths and weaknesses in studies
- Provide comprehensive and critical perspective`;
      break;
      
    case 'analysis':
      articleStructure = isArabic ? `
1. المقدمة (تحديد موضوع التحليل)
2. الإطار النظري
3. منهجية التحليل
4. التحليل التفصيلي
5. النتائج والاستنتاجات
6. التوصيات والحلول
7. الخاتمة` : `
1. Introduction (Defining the analysis topic)
2. Theoretical framework
3. Analysis methodology
4. Detailed analysis
5. Results and conclusions
6. Recommendations and solutions
7. Conclusion`;
      
      specificInstructions = isArabic ? `
- استخدم أدوات التحليل المناسبة
- قدم تحليلاً عميقاً ومفصلاً
- استخدم الأمثلة والحالات العملية
- اربط النتائج بالواقع العملي` : `
- Use appropriate analysis tools
- Provide deep and detailed analysis
- Use examples and practical cases
- Connect results to practical reality`;
      break;
      
    case 'case-study':
      articleStructure = isArabic ? `
1. المقدمة (تعريف بالحالة)
2. خلفية الحالة
3. منهجية دراسة الحالة
4. عرض وتحليل البيانات
5. النتائج والاستنتاجات
6. الدروس المستفادة
7. التوصيات والتطبيقات` : `
1. Introduction (Case definition)
2. Case background
3. Case study methodology
4. Data presentation and analysis
5. Results and conclusions
6. Lessons learned
7. Recommendations and applications`;
      
      specificInstructions = isArabic ? `
- اختر حالة واقعية ومناسبة للموضوع
- قدم تفاصيل دقيقة عن الحالة
- حلل الحالة من زوايا متعددة
- استخرج الدروس والعبر العملية` : `
- Choose realistic and appropriate case for the topic
- Provide accurate details about the case
- Analyze the case from multiple angles
- Extract practical lessons and insights`;
      break;
      
    case 'survey':
      articleStructure = isArabic ? `
1. المقدمة (أهداف الاستطلاع)
2. منهجية البحث
3. تصميم الاستطلاع وأدواته
4. جمع البيانات والعينة
5. تحليل النتائج والإحصائيات
6. مناقشة النتائج
7. الخاتمة والتوصيات` : `
1. Introduction (Survey objectives)
2. Research methodology
3. Survey design and tools
4. Data collection and sample
5. Results analysis and statistics
6. Results discussion
7. Conclusion and recommendations`;
      
      specificInstructions = isArabic ? `
- قدم نتائج إحصائية واقعية
- استخدم الرسوم البيانية الوصفية
- حلل البيانات بطريقة علمية
- فسر النتائج بوضوح` : `
- Provide realistic statistical results
- Use descriptive charts
- Analyze data scientifically
- Interpret results clearly`;
      break;
      
    default:
      articleStructure = isArabic ? `
1. المقدمة
2. التعريفات والمفاهيم الأساسية
3. العرض الرئيسي (3-4 نقاط رئيسية)
4. التطبيقات العملية
5. التحديات والحلول
6. الخاتمة` : `
1. Introduction
2. Definitions and basic concepts
3. Main presentation (3-4 main points)
4. Practical applications
5. Challenges and solutions
6. Conclusion`;
      
      specificInstructions = isArabic ? `
- استخدم أسلوب علمي ومنطقي
- قدم معلومات دقيقة ومفيدة
- استخدم أمثلة واقعية` : `
- Use scientific and logical style
- Provide accurate and useful information
- Use realistic examples`;
  }
  
  const promptText = `${languageInstruction}

You are a specialized academic expert in scientific and research writing. Your task is to write a high-quality professional scientific article.

Article Topic: "${topic}"
Article Type: ${articleType || (isArabic ? 'مقال علمي عام' : 'General Scientific Article')}
Required Word Count: ${wordCount} words
Language: ${isArabic ? 'Arabic' : 'English'}

Required Article Structure:
${articleStructure}

Special Instructions:
${specificInstructions}

Required Quality Standards:
${isArabic ? `
- أسلوب أكاديمي احترافي ودقيق
- استخدام المصطلحات العلمية المناسبة
- تنظيم منطقي وتسلسل واضح للأفكار
- معلومات دقيقة وموثوقة
- خلو من الأخطاء اللغوية والنحوية
- ترقيم وتنسيق مناسب للنشر الأكاديمي` : `
- Professional and precise academic style
- Use appropriate scientific terminology
- Logical organization and clear flow of ideas
- Accurate and reliable information
- Free from linguistic and grammatical errors
- Appropriate numbering and formatting for academic publication`}

Text Formatting:
${isArabic ? `
- استخدم العناوين الفرعية بوضوح
- اجعل الفقرات متوازنة ومترابطة
- استخدم الانتقالات السلسة بين الأفكار` : `
- Use clear subheadings
- Make paragraphs balanced and interconnected
- Use smooth transitions between ideas`}

${isArabic ? 'ابدأ الكتابة فوراً دون مقدمات إضافية واكتب المقال كاملاً بالتفصيل.' : 'Start writing immediately without additional introductions and write the complete article in detail.'}`;

  return promptText;
}

export async function generateArticle(params: ArticleParams): Promise<string> {
  const prompt = createSpecializedPrompt(params);
  
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
        throw new Error('تم إنشاء مقال فارغ من الخدمة');
      }
      
      console.log('تم إنشاء المقال بنجاح، عدد الأحرف:', generatedText.length);
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
    
    throw new Error('حدث خطأ غير متوقع في إنشاء المقال');
  }
}
