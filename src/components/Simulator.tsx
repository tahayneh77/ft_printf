import React, { useState, useMemo } from 'react';
import { simulateFtPrintf } from '../utils/printfSimulator';
import { 
  Play, 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  Info, 
  CheckCircle, 
  Layers, 
  Plus, 
  Trash2,
  RefreshCw
} from 'lucide-react';

interface ArgItem {
  id: string;
  type: 'string' | 'number' | 'char' | 'pointer' | 'null';
  value: string;
}

const PRESETS = [
  {
    name: 'Standard Greeting',
    format: 'Hello %s, your grade is %d%%! Pointer: %p',
    args: [
      { id: '1', type: 'string', value: '42 Student' },
      { id: '2', type: 'number', value: '100' },
      { id: '3', type: 'pointer', value: '0x7ffd19ba00' },
    ] as ArgItem[],
  },
  {
    name: 'INT_MIN Boundary',
    format: 'Min integer is %d, Max is %d',
    args: [
      { id: '1', type: 'number', value: '-2147483648' },
      { id: '2', type: 'number', value: '2147483647' },
    ] as ArgItem[],
  },
  {
    name: 'Hexadecimal Formats',
    format: 'Hex: 0x%x | UPPER: 0x%X | Unsigned: %u',
    args: [
      { id: '1', type: 'number', value: '3735928559' },
      { id: '2', type: 'number', value: '3735928559' },
      { id: '3', type: 'number', value: '4294967295' },
    ] as ArgItem[],
  },
  {
    name: 'NULL Edge Cases',
    format: 'String: [%s], Pointer: [%p]',
    args: [
      { id: '1', type: 'null', value: 'NULL' },
      { id: '2', type: 'null', value: 'NULL' },
    ] as ArgItem[],
  },
  {
    name: 'Consecutive % Signs',
    format: 'Discount: 50%%%% off on %c item',
    args: [
      { id: '1', type: 'char', value: 'X' },
    ] as ArgItem[],
  },
];

export const Simulator: React.FC = () => {
  const [formatString, setFormatString] = useState<string>('Hello %s! Score: %d at %p');
  const [nilOption, setNilOption] = useState<'(nil)' | '0x0'>('(nil)');
  const [argsList, setArgsList] = useState<ArgItem[]>([
    { id: 'a1', type: 'string', value: 'Cadet' },
    { id: 'a2', type: 'number', value: '42' },
    { id: 'a3', type: 'pointer', value: '0x7ffeefbff568' },
  ]);

  const parsedArgs = useMemo(() => {
    return argsList.map((arg) => {
      if (arg.type === 'null') return null;
      if (arg.type === 'number') {
        const parsed = parseInt(arg.value, 10);
        return isNaN(parsed) ? 0 : parsed;
      }
      if (arg.type === 'char') {
        return arg.value ? arg.value.charAt(0) : '\0';
      }
      if (arg.type === 'pointer') {
        if (!arg.value || arg.value.toLowerCase() === 'null' || arg.value === '0') return null;
        return arg.value;
      }
      return arg.value;
    });
  }, [argsList]);

  const simulation = useMemo(() => {
    return simulateFtPrintf(formatString, parsedArgs, { nilFormat: nilOption });
  }, [formatString, parsedArgs, nilOption]);

  const addArg = () => {
    setArgsList([
      ...argsList,
      { id: String(Date.now()), type: 'string', value: 'new_val' },
    ]);
  };

  const removeArg = (id: string) => {
    setArgsList(argsList.filter((a) => a.id !== id));
  };

  const updateArg = (id: string, updates: Partial<ArgItem>) => {
    setArgsList(
      argsList.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setFormatString(preset.format);
    setArgsList(preset.args);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-100">Quick Test Scenarios:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => loadPreset(p)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Format String & Arguments Inputs */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Format String Input */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Format String (<code className="text-emerald-400 lowercase">const char *format</code>)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">NULL pointer:</span>
                <button
                  onClick={() => setNilOption(nilOption === '(nil)' ? '0x0' : '(nil)')}
                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-mono text-[11px] cursor-pointer"
                >
                  {nilOption} {nilOption === '(nil)' ? '(Linux)' : '(macOS)'}
                </button>
              </div>
            </div>
            <input
              type="text"
              value={formatString}
              onChange={(e) => setFormatString(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-emerald-300 focus:outline-none focus:border-emerald-500 shadow-inner"
              placeholder='e.g. "Result: %d, string: %s"'
            />
            <p className="text-[11px] text-slate-400">
              Supported specifiers: <code className="text-emerald-400">%c</code>, <code className="text-emerald-400">%s</code>, <code className="text-emerald-400">%p</code>, <code className="text-emerald-400">%d</code>, <code className="text-emerald-400">%i</code>, <code className="text-emerald-400">%u</code>, <code className="text-emerald-400">%x</code>, <code className="text-emerald-400">%X</code>, <code className="text-emerald-400">%%</code>
            </p>
          </div>

          {/* Variadic Arguments List */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Variadic Arguments (<code className="text-sky-400 lowercase">...</code>)
              </label>
              <button
                onClick={addArg}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Argument</span>
              </button>
            </div>

            {argsList.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                No variadic arguments. The format string will print without specifier replacement.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {argsList.map((arg, idx) => (
                  <div
                    key={arg.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800"
                  >
                    <span className="w-6 text-center font-mono text-xs text-slate-500">
                      #{idx + 1}
                    </span>

                    <select
                      value={arg.type}
                      onChange={(e) => updateArg(arg.id, { type: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
                    >
                      <option value="string">string (%s)</option>
                      <option value="number">int / hex (%d, %i, %u, %x, %X)</option>
                      <option value="char">char (%c)</option>
                      <option value="pointer">pointer (%p)</option>
                      <option value="null">NULL ptr</option>
                    </select>

                    <input
                      type="text"
                      disabled={arg.type === 'null'}
                      value={arg.type === 'null' ? 'NULL' : arg.value}
                      onChange={(e) => updateArg(arg.id, { value: e.target.value })}
                      placeholder={arg.type === 'null' ? 'NULL' : 'value...'}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 disabled:opacity-50"
                    />

                    <button
                      onClick={() => removeArg(arg.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                      title="Remove argument"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Output Preview & Detailed Byte Stream Analysis */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Output Display Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                STDOUT Stream Output
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Return Value (<code className="text-emerald-400">int</code>):
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                  {simulation.returnVal} bytes
                </span>
              </div>
            </div>

            {/* Simulated Terminal Screen */}
            <div className="p-3.5 bg-black/90 rounded-lg border border-slate-900 font-mono text-sm min-h-[90px] text-emerald-400 whitespace-pre-wrap break-all shadow-inner">
              {simulation.output.length === 0 ? (
                <span className="text-slate-600 italic">(Empty output)</span>
              ) : (
                simulation.output
              )}
            </div>

            {/* Equivalent C invocation snippet */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto">
              <span className="text-emerald-400">int</span> len = ft_printf(
              <span className="text-amber-300">"{formatString}"</span>
              {argsList.length > 0 && ', '}
              {argsList.map((a, i) => (
                <span key={a.id} className="text-sky-300">
                  {a.type === 'string'
                    ? `"${a.value}"`
                    : a.type === 'char'
                    ? `'${a.value[0] || '?'}'`
                    : a.type === 'null'
                    ? 'NULL'
                    : a.value}
                  {i < argsList.length - 1 ? ', ' : ''}
                </span>
              ))}
              ); <span className="text-slate-600">// =&gt; returns {simulation.returnVal}</span>
            </div>
          </div>

          {/* Hex Dump & Conversion Steps breakdown */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              Argument Ingestion Trace (va_arg)
            </h4>

            <div className="space-y-1.5 max-h-[170px] overflow-y-auto">
              {simulation.steps.map((st, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono border ${
                    st.type === 'specifier'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        st.type === 'specifier'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {st.raw}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-200">"{st.printedChunk}"</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    +{st.bytesCount} byte{st.bytesCount !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Byte Hex Dump View */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                Raw Byte Array ({simulation.hexDump.length} bytes):
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-[11px] max-h-[80px] overflow-y-auto">
                {simulation.hexDump.map((hex, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  >
                    {hex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
