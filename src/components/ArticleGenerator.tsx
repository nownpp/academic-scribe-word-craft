import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenTool, Download } from 'lucide-react';
import { generateArticle } from '@/lib/article-generator';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const content = await generateArticle(topic);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating article:', error);
      setGeneratedContent('Error generating article. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToWord = async () => {
    if (!generatedContent) {
      alert('No content to export!');
      return;
    }

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun(generatedContent)],
          }),
        ],
      }],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'generated-article.docx');
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Failed to export to Word. Please try again.');
    }
  };

  return (
    <section className="container py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          اكتب مقالتك العلمية الآن
        </h2>
        <p className="text-gray-600 mb-6">
          أدخل عنوان المقال أو الموضوع الذي ترغب في الكتابة عنه، وسنقوم بإنشاء مقال علمي متكامل لك.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="أدخل عنوان المقال أو الموضوع"
            className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-right"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التوليد...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span>توليد البحث</span>
                </div>
              )}
            </Button>

            {generatedContent && !isGenerating && (
              <Button
                type="button"
                onClick={handleExportToWord}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف Word</span>
                </div>
              </Button>
            )}
          </div>
        </form>

        {generatedContent && (
          <div className="mt-8 p-6 rounded-xl shadow-md bg-white text-gray-700 text-right prose-arabic">
            <h3 className="text-xl font-semibold mb-4">المحتوى الذي تم توليده:</h3>
            <Textarea
              value={generatedContent}
              readOnly
              className="w-full h-96 px-4 py-3 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-right resize-none"
            />
          </div>
        )}
      </div>
    </section>
  );
};
