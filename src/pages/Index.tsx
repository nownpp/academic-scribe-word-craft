
import React from 'react';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ArticleGenerator } from '@/components/ArticleGenerator';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Hero />
      <Features />
      <ArticleGenerator />
      <Footer />
    </div>
  );
};

export default Index;
