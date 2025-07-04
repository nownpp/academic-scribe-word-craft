
import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ArticleGenerator } from '@/components/ArticleGenerator';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="pt-8">
        <Hero />
        <ArticleGenerator />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
