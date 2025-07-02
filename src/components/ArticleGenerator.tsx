
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Download, Sparkles, AlertCircle, Settings, PlayCircle, Pause, SkipForward } from 'lucide-react';
import { toast } from 'sonner';
import { generateArticleSection } from '@/services/geminiService';
import { exportToWord } from '@/services/wordExportService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResearchViewer } from '@/components/ResearchViewer';

interface ResearchSection {
  title: string;
  content: string;
  completed: boolean;
}

export const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('600');
  const [language, setLanguage] = useState('arabic');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepByStep, setIsStepByStep] = useState(false);
  
  // Research settings
  const [researchSettings, setResearchSettings] = useState({
    authorName: '',
    grade: '',
    supervisor: '',
    includeResearchPage: false
  });

  // Research sections
  const [researchSections, setResearchSections] = useState<ResearchSection[]>([
    { title: 'المقدمة', content: '', completed: false },
    { title: 'التعريف بالموضوع', content: '', completed: false },
    { title: 'المحور الأول', content: '', completed: false },
    { title: 'المحور الثاني', content: '', completed: false },
    { title: 'المحور الثالث', content: '', completed: false },
    { title: 'الخاتمة', content: '', completed: false },
    { title: 'المراجع', content: '', completed: false },
  ]);

  const researchSteps = [
    'المقدمة وأهمية الموضوع',
    'التعريف بالموضوع والمفاهيم الأساسية',
    'المحور الأول من البحث',
    'المحور الثاني من البحث', 
    'المحور الثالث من البحث',
    'الخاتمة والنتائج',
    'المراجع والمصادر'
  ];

  const handleGenerateComplete = async () => {
    if (!topic.trim()) {
      toast.error('يرجى إدخال موضوع المقال');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedArticle('');
    
    try {
      console.log('بدء إنشاء المقال الكامل...');
      
      const article = await generateArticleSection({
        topic: topic.trim(),
        wordCount: parseInt(wordCount),
        language,
        sectionType: 'complete',
        researchSettings
      });
      
      if (article && article.trim()) {
        setGeneratedArticle(article);
        toast.success('تم إنشاء المقال بنجاح!');
      } else {
        throw new Error('تم إنشاء مقال فارغ');
      }
    } catch (error) {
      console.error('خطأ في إنشاء المقال:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      toast.error(`فشل في إنشاء المقال: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async (sectionIndex: number) => {
    if (!topic.trim()) {
      toast.error('يرجى إدخال موضوع المقال');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(sectionIndex);
    
    try {
      const sectionType = sectionIndex === 0 ? 'introduction' :
                         sectionIndex === 1 ? 'definition' :
                         sectionIndex === researchSteps.length - 2 ? 'conclusion' :
                         sectionIndex === researchSteps.length - 1 ? 'references' :
                         'main_section';

      const previousContent = researchSections.slice(0, sectionIndex)
        .filter(section => section.completed)
        .map(section => `${section.title}:\n${section.content}`)
        .join('\n\n');

      const content = await generateArticleSection({
        topic: topic.trim(),
        wordCount: Math.ceil(parseInt(wordCount) / researchSteps.length),
        language,
        sectionType,
        sectionIndex,
        previousContent,
        researchSettings
      });

      if (content && content.trim()) {
        const updatedSections = [...researchSections];
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          content: content.trim(),
          completed: true
        };
        setResearchSections(updatedSections);
        
        // تحديث المقال الكامل
        const completeArticle = updatedSections
          .filter(section => section.completed)
          .map(section => `${section.title}\n\n${section.content}`)
          .join('\n\n');
        
        setGeneratedArticle(completeArticle);
        toast.success(`تم إنشاء ${researchSteps[sectionIndex]} بنجاح!`);
      } else {
        throw new Error('تم إنشاء محتوى فارغ');
      }
    } catch (error) {
      console.error('خطأ في إنشاء القسم:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      toast.error(`فشل في إنشاء ${researchSteps[sectionIndex]}: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToWord = async () => {
    if (!generatedArticle) {
      toast.error('لا يوجد مقال للتصدير');
      return;
    }

    setIsExporting(true);
    try {
      await exportToWord(generatedArticle, topic, researchSettings);
      toast.success('تم تصدير المقال إلى Word بنجاح!');
    } catch (error) {
      console.error('خطأ في تصدير المقال:', error);
      toast.error('حدث خطأ أثناء تصدير المقال');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ✍️ إنشاء مقال علمي احترافي
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            اكتب مقالًا علميًا احترافيًا حول الموضوع المطلوب باستخدام نموذج Gemini Flash
            <br />
            مع تنسيق أكاديمي متقدم وبنية علمية متكاملة لا تقل عن 11 ورقة بحثية
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-blue-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    إعدادات المقال العلمي
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        إعداد البحث
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>إعدادات البحث (اختيارية)</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="authorName">اسم معد البحث</Label>
                          <Input
                            id="authorName"
                            value={researchSettings.authorName}
                            onChange={(e) => setResearchSettings(prev => ({
                              ...prev,
                              authorName: e.target.value
                            }))}
                            placeholder="أدخل اسم الباحث"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade">الفرقة/المستوى</Label>
                          <Input
                            id="grade"
                            value={researchSettings.grade}
                            onChange={(e) => setResearchSettings(prev => ({
                              ...prev,
                              grade: e.target.value
                            }))}
                            placeholder="مثال: الفرقة الثالثة"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supervisor">إشراف</Label>
                          <Input
                            id="supervisor"
                            value={researchSettings.supervisor}
                            onChange={(e) => setResearchSettings(prev => ({
                              ...prev,
                              supervisor: e.target.value
                            }))}
                            placeholder="أدخل اسم المشرف"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                    موضوع البحث العلمي *
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="مثال: آثار الاحتباس الحراري على الأمن الغذائي العالمي"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wordCount" className="text-sm font-medium text-gray-700">
                      الحد الأدنى للكلمات
                    </Label>
                    <Select value={wordCount} onValueChange={setWordCount}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="600">600 كلمة</SelectItem>
                        <SelectItem value="1000">1000 كلمة</SelectItem>
                        <SelectItem value="1500">1500 كلمة</SelectItem>
                        <SelectItem value="2000">2000 كلمة</SelectItem>
                        <SelectItem value="3000">3000 كلمة</SelectItem>
                        <SelectItem value="5000">5000 كلمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                      اللغة
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arabic">العربية</SelectItem>
                        <SelectItem value="english">الإنجليزية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">خطأ في إنشاء المقال</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={handleGenerateComplete}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isGenerating && !isStepByStep ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري إنشاء البحث الكامل...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        إنشاء البحث الكامل
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={() => setIsStepByStep(!isStepByStep)}
                    variant="outline"
                    className="w-full"
                  >
                    {isStepByStep ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        إخفاء الكتابة المرحلية
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-5 h-5 mr-2" />
                        كتابة مرحلية
                      </>
                    )}
                  </Button>
                </div>

                {isStepByStep && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">المراحل:</h4>
                    {researchSteps.map((step, index) => (
                      <Button
                        key={index}
                        onClick={() => handleGenerateSection(index)}
                        disabled={isGenerating}
                        variant={researchSections[index].completed ? "default" : "outline"}
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        {isGenerating && currentStep === index ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : researchSections[index].completed ? (
                          <span className="w-4 h-4 mr-2 bg-green-500 rounded-full text-xs">✓</span>
                        ) : (
                          <span className="w-4 h-4 mr-2 bg-gray-300 rounded-full text-xs">{index + 1}</span>
                        )}
                        {step}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Article */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-6 h-6" />
                      البحث العلمي المُنشأ
                    </span>
                    {generatedArticle && (
                      <Button
                        onClick={handleExportToWord}
                        disabled={isExporting}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            تصدير...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            تصدير إلى Word
                          </>
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                      <p className="text-lg text-gray-600">
                        {isStepByStep 
                          ? `جاري إنشاء: ${researchSteps[currentStep]}...`
                          : 'جاري إنشاء البحث العلمي...'
                        }
                      </p>
                      <p className="text-sm text-gray-500 mt-2">قد يستغرق هذا بضع دقائق لإنشاء بحث متكامل</p>
                    </div>
                  ) : generatedArticle ? (
                    <ResearchViewer 
                      content={generatedArticle} 
                      title={topic}
                      researchSettings={researchSettings}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">سيظهر البحث العلمي هنا بعد الإنشاء</p>
                      <p className="text-sm text-gray-400 mt-2">
                        أدخل موضوعك واختر طريقة الإنشاء (كامل أو مرحلي)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
