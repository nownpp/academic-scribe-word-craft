
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Download, Sparkles, AlertCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { generateArticle } from '@/services/geminiService';
import { exportToWord } from '@/services/wordExportService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('600');
  const [language, setLanguage] = useState('arabic');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  
  // Research settings (optional)
  const [researchSettings, setResearchSettings] = useState({
    authorName: '',
    grade: '',
    supervisor: '',
    includeResearchPage: false
  });

  const handleGenerateArticle = async () => {
    if (!topic.trim()) {
      toast.error('يرجى إدخال موضوع المقال');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedArticle('');
    
    try {
      console.log('بدء إنشاء المقال...');
      
      const article = await generateArticle({
        topic: topic.trim(),
        wordCount: parseInt(wordCount),
        language,
        researchSettings
      });
      
      if (article && article.trim()) {
        setGeneratedArticle(article);
        toast.success('تم إنشاء المقال بنجاح!');
        console.log('تم إنشاء المقال بنجاح');
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

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">✅ مواصفات البحث العلمي:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• أسلوب أكاديمي علمي دقيق</li>
                    <li>• بنية منطقية مع عناصر مرقمة</li>
                    <li>• لا يقل عن 11 ورقة بحثية</li>
                    <li>• يتضمن مقدمة ومحاور وخاتمة ومراجع</li>
                    <li>• تنسيق Word احترافي</li>
                  </ul>
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

                <Button 
                  onClick={handleGenerateArticle}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      جاري إنشاء البحث العلمي...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      إنشاء البحث العلمي
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Article */}
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
                    <p className="text-lg text-gray-600">جاري إنشاء البحث العلمي...</p>
                    <p className="text-sm text-gray-500 mt-2">قد يستغرق هذا بضع دقائق لإنشاء بحث متكامل</p>
                  </div>
                ) : generatedArticle ? (
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-right" dir="rtl">
                      {generatedArticle.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4 leading-relaxed text-gray-800">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">سيظهر البحث العلمي هنا بعد الإنشاء</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {error ? 'حدث خطأ في إنشاء البحث' : 'أدخل موضوعك واضغط على إنشاء البحث العلمي'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
