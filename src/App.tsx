/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Archive, 
  ExternalLink,
  Layers,
  Sparkles,
  User
} from 'lucide-react';
import { CodeViewer } from './components/CodeViewer';
import { Simulator } from './components/Simulator';
import { TestSuite } from './components/TestSuite';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { NorminetteChecklist } from './components/NorminetteChecklist';
import { getCCodeFiles } from './data/cCodeFiles';
import JSZip from 'jszip';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'simulator' | 'tests' | 'arch' | 'norm'>('code');
  const [login, setLogin] = useState<string>('mtahayne');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const files = getCCodeFiles(login);
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.path, file.code);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ft_printf_${login || '42'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & 42 Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black font-mono shadow-md shadow-emerald-500/20 text-sm">
              42
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight font-mono">
                  ft_printf
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                  libftprintf.a
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Recoding libc printf &bull; Conversions: <span className="text-slate-300 font-mono">cspdiuxX%</span>
              </p>
            </div>
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500">Student:</span>
              <span className="text-emerald-400 font-mono font-medium">{login}</span>
            </div>

            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : 'Download Project (.zip)'}</span>
            </button>
          </div>
        </div>

        {/* Tab navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-800/40 py-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-slate-800 text-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>C Code &amp; Files (Turn-in)</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>42 Francinette Test Suite (28 Tests)</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'arch'
                ? 'bg-slate-800 text-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Variadic Architecture &amp; Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('norm')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'norm'
                ? 'bg-slate-800 text-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Norminette &amp; README Audit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'code' && (
          <CodeViewer login={login} onLoginChange={setLogin} />
        )}

        {activeTab === 'simulator' && (
          <Simulator />
        )}

        {activeTab === 'tests' && (
          <TestSuite />
        )}

        {activeTab === 'arch' && (
          <ArchitectureGuide />
        )}

        {activeTab === 'norm' && (
          <NorminetteChecklist />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>42 School Curriculum Project &bull;</span>
            <code className="text-emerald-400">libftprintf.a</code>
            <span className="text-slate-600">&bull;</span>
            <span>External functions: write, va_start, va_arg, va_copy, va_end</span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Target: <span className="text-slate-200">Makefile, *.h, *.c</span> &bull; Chapter V Readme Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
