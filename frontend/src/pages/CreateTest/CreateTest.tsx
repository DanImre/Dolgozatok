import React from 'react';
import { useCreateTest } from './useCreateTest';
import { PageEditor } from './components/PageEditor';
import { Plus, Save, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../locales/LanguageContext';

export const CreateTest: React.FC = () => {
  const { test, addPage, updatePage, deletePage, updateTitle, movePage, saveTest } = useCreateTest();
  const navigate = useNavigate();
  const { lang, language, setLanguage } = useTranslation();
  const t = lang.createTest;

  const toggleLanguage = () => {
    setLanguage(language === 'hu' ? 'en' : 'hu');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7f5] text-slate-800">
      {/* Top Toolbar replacing Navbar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={test.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-2xl font-display font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 w-full max-w-lg"
            placeholder={t.placeholders.testTitle}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-600 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-sm shadow-sm"
            title={t.tooltips.changeLanguage}
          >
            <Globe size={16} className="text-emerald-600" /> {language.toUpperCase()}
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-sm shadow-sm flex items-center gap-2"
          >
            <X size={18} />
            {t.cancel}
          </button>
          <button 
            onClick={saveTest}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save size={18} />
            {t.saveTest}
          </button>
        </div>
      </header>

      {/* Main Editor Canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
        {test.pages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
            <h2 className="text-xl font-medium text-slate-600 mb-2">{t.noPages}</h2>
            <p className="text-slate-500 mb-6">{t.noPagesSub}</p>
            <button 
              onClick={addPage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              {t.addFirstPage}
            </button>
          </div>
        ) : (
          test.pages.map((page, index) => (
            <PageEditor 
              key={page.id}
              page={page}
              pageIndex={index}
              onUpdate={(updatedPage) => updatePage(page.id, updatedPage)}
              onDelete={() => deletePage(page.id)}
              onMoveUp={index > 0 ? () => movePage(index, -1) : undefined}
              onMoveDown={index < test.pages.length - 1 ? () => movePage(index, 1) : undefined}
            />
          ))
        )}

        {test.pages.length > 0 && (
          <div className="flex justify-center mt-4 pb-12">
            <button 
              onClick={addPage}
              className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm rounded-xl font-medium transition-colors"
            >
              <Plus size={20} />
              {t.addNewPage}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
