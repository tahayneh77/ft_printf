import React, { useState } from 'react';
import { CFile, getCCodeFiles } from '../data/cCodeFiles';
import JSZip from 'jszip';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Archive, 
  Terminal, 
  User, 
  CheckCircle2, 
  FileText,
  Layers
} from 'lucide-react';

interface CodeViewerProps {
  login: string;
  onLoginChange: (login: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ login, onLoginChange }) => {
  const files = getCCodeFiles(login);
  const [selectedFileName, setSelectedFileName] = useState<string>('ft_printf.c');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeFile = files.find((f) => f.name === selectedFileName) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
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
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryColor = (cat: CFile['category']) => {
    switch (cat) {
      case 'core': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'helper': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'header': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'build': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'docs': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'test': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              42 Repository Files
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {files.length} files
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Norminette-compliant, Makefile &amp; Chapter V README ready for turn-in
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 42 Login Configurator */}
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">42 Login:</span>
            <input
              type="text"
              value={login}
              onChange={(e) => onLoginChange(e.target.value.trim() || 'student')}
              placeholder="mtahayne"
              maxLength={12}
              className="w-24 bg-transparent text-emerald-400 font-mono focus:outline-none border-b border-transparent focus:border-emerald-500 text-xs"
            />
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>{isZipping ? 'Generating ZIP...' : 'Download .ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Main split: File tabs + Code content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[560px]">
        {/* Left Column: File List */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800 rounded-xl overflow-y-auto max-h-[650px]">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Project Files</span>
            <span className="text-[10px] text-emerald-400 font-mono">libftprintf.a</span>
          </div>

          {files.map((file) => {
            const isSelected = file.name === selectedFileName;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFileName(file.name)}
                className={`flex flex-col text-left px-3 py-2.5 rounded-lg transition-all text-xs group cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-mono font-medium truncate">
                    {file.category === 'docs' ? (
                      <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    ) : file.category === 'build' ? (
                      <Terminal className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    ) : (
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono ${getCategoryColor(
                      file.category
                    )}`}
                  >
                    {file.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {file.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-9 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Header of Code Pane */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-300 ml-2 font-semibold">
                {activeFile.path}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                — {activeFile.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Code text area with line numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950/90 leading-relaxed max-h-[580px]">
            <pre className="flex">
              <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 font-mono text-xs">
                {activeFile.code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="pl-4 flex-1 overflow-x-auto text-slate-300 whitespace-pre">
                {activeFile.code}
              </div>
            </pre>
          </div>

          {/* Quick build cheat sheet footer */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Norminette v4 Compatible</span>
              </span>
              <span className="text-slate-600">•</span>
              <span>Functions: &le; 25 lines</span>
              <span className="text-slate-600">•</span>
              <span>No forbidden functions</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Build command: <code className="text-emerald-400">make</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
