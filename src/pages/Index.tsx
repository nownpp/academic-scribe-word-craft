
import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ArticleGenerator } from '@/components/ArticleGenerator';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <Hero />
      {/* Ad Section */}
      <div className="w-full flex justify-center py-4 bg-white">
        <div id="ad-container" className="flex justify-center">
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '022a16431c45fce5085dcfa4482f1dcf',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
              document.write('<script type="text/javascript" src="//www.highperformanceformat.com/022a16431c45fce5085dcfa4482f1dcf/invoke.js"></' + 'script>');
            `
          }} />
        </div>
      </div>
      <ArticleGenerator />
      <Footer />
    </div>
  );
};

export default Index;
