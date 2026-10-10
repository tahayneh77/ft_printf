import React from 'react';
import { 
  Cpu, 
  Layers, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  Code2
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Intro banner */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
          <BookOpen className="w-5 h-5" />
          <span>42 ft_printf Architecture &amp; C Variadic Internals</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The <code className="text-emerald-400">ft_printf</code> project teaches how the C compiler and hardware communicate arbitrary numbers of parameters across the stack and CPU registers without fixed prototypes. Below is the technical breakdown required for 42 peer evaluations and Chapter V explanations.
        </p>
      </div>

      {/* Grid of concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Variadic Macros Mechanism */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>1. How &lt;stdarg.h&gt; Operates</span>
          </div>

          <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
            <p>
              Under the x86-64 System V ABI, the first six integer/pointer arguments are passed via registers (<code className="text-slate-400 font-mono">rdi, rsi, rdx, rcx, r8, r9</code>), and subsequent arguments are pushed onto the call stack.
            </p>
            <ul className="space-y-2 font-mono text-[11px] bg-slate-900 p-3 rounded-lg border border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">va_list args:</span>
                <span className="text-slate-300">An opaque pointer/structure representing the current argument cursor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">va_start(args, format):</span>
                <span className="text-slate-300">Anchors the cursor right after the last named parameter (<code className="text-emerald-300">format</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">va_arg(args, type):</span>
                <span className="text-slate-300">Fetches the next value cast to <code className="text-emerald-300">type</code> and advances the internal pointer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">va_end(args):</span>
                <span className="text-slate-300">Releases internal register save areas / stack references.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Type Promotions in Variadics */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>2. Default Argument Promotions</span>
          </div>

          <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
            <p>
              In C, unprototyped variadic arguments undergo <strong>default promotion</strong>:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>char / short argument</span>
                <span className="text-amber-400 font-bold">&rarr; promotes to int</span>
              </div>
              <div className="text-[10px] text-slate-400 pl-2 border-l border-slate-700">
                This is why for <code className="text-emerald-400">%c</code>, we invoke <code className="text-emerald-400">va_arg(args, int)</code> and NOT <code className="text-rose-400">va_arg(args, char)</code>!
              </div>
              <div className="flex items-center justify-between text-slate-300 pt-1">
                <span>float argument</span>
                <span className="text-amber-400 font-bold">&rarr; promotes to double</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 pt-1">
                <span>pointer argument</span>
                <span className="text-amber-400 font-bold">&rarr; remains void *</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The INT_MIN Edge Case */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>3. The Tricky INT_MIN (-2147483648)</span>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              In standard two's-complement 32-bit signed integers:
            </p>
            <div className="p-2.5 bg-black/60 rounded font-mono text-[11px] text-rose-300 border border-slate-800">
              INT_MIN = -2147483648<br />
              INT_MAX =  2147483647<br />
              -(-2147483648) = OVERFLOW! (UB in signed 32-bit)
            </div>
            <p>
              If your code simply did <code className="text-slate-400">n = -n;</code>, negative INT_MIN remains negative or causes undefined behavior.
            </p>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[11px] text-emerald-300">
              <strong>Our Solution:</strong> Cast to <code className="font-mono text-emerald-200">long num = n;</code> before negating. Long is 64-bit on x86_64, completely immune to signed 32-bit overflow.
            </div>
          </div>
        </div>

        {/* 4. Stream Writing vs Buffer Management */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>4. Direct Stream Writing &amp; Return Count</span>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              The 42 subject specifies: <em className="text-slate-400">"Do not implement the buffer management of the original printf()."</em>
            </p>
            <ul className="space-y-1.5 text-[11px] list-disc list-inside text-slate-300">
              <li>
                Each helper immediately invokes <code className="text-emerald-400 font-mono">write(1, buffer, len)</code>.
              </li>
              <li>
                Each write returns the count of bytes successfully written to file descriptor 1.
              </li>
              <li>
                Memory footprint is exactly <strong className="text-emerald-400">0 bytes heap allocation</strong> (zero calls to <code className="font-mono">malloc</code>, guaranteed 0 leaks on valgrind).
              </li>
              <li>
                The return value of <code className="text-emerald-400 font-mono">ft_printf()</code> represents the total accumulated bytes written.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conversion Specifiers Quick Reference Card */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Conversion Specifiers Summary Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-3">Specifier</th>
                <th className="py-2 px-3">va_arg Type</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Edge Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%c</td>
                <td className="py-2.5 px-3 text-sky-400">int</td>
                <td className="py-2.5 px-3 font-sans">Single ASCII character</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Null byte <code className="text-slate-300">'\0'</code> prints 1 byte</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%s</td>
                <td className="py-2.5 px-3 text-sky-400">char *</td>
                <td className="py-2.5 px-3 font-sans">Null-terminated string</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans"><code className="text-slate-300">NULL</code> outputs <code className="text-slate-300">"(null)"</code></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%p</td>
                <td className="py-2.5 px-3 text-sky-400">void *</td>
                <td className="py-2.5 px-3 font-sans">Pointer in lowercase hex</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans"><code className="text-slate-300">NULL</code> outputs <code className="text-slate-300">"(nil)"</code> on Linux</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%d / %i</td>
                <td className="py-2.5 px-3 text-sky-400">int</td>
                <td className="py-2.5 px-3 font-sans">Base 10 signed decimal</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans"><code className="text-slate-300">INT_MIN</code> (-2147483648) handled via long</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%u</td>
                <td className="py-2.5 px-3 text-sky-400">unsigned int</td>
                <td className="py-2.5 px-3 font-sans">Base 10 unsigned integer</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans"><code className="text-slate-300">UINT_MAX</code> (4294967295) without sign</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%x</td>
                <td className="py-2.5 px-3 text-sky-400">unsigned int</td>
                <td className="py-2.5 px-3 font-sans">Lowercase hexadecimal (0-9, a-f)</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans">0 outputs single <code className="text-slate-300">"0"</code></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%X</td>
                <td className="py-2.5 px-3 text-sky-400">unsigned int</td>
                <td className="py-2.5 px-3 font-sans">Uppercase hexadecimal (0-9, A-F)</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Uses uppercase digits table</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">%%</td>
                <td className="py-2.5 px-3 text-slate-500">none</td>
                <td className="py-2.5 px-3 font-sans">Literal percent sign</td>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Consumes no arguments from va_list</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
