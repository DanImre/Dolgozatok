import React from 'react';
import { Navbar } from '../../components/Navbar';

export const CreateTest: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7f5] text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-display font-bold mb-4">Create Test</h1>
        <p className="text-slate-500">This page is under construction. It is only accessible to Teachers.</p>
      </main>
    </div>
  );
};
