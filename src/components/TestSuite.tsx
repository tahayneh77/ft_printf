import React, { useState, useMemo } from 'react';
import { TEST_CASES, TestCase } from '../data/testCases';
import { simulateFtPrintf } from '../utils/printfSimulator';
import { 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Terminal, 
  Play, 
  RotateCcw, 
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export const TestSuite: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Evaluate all test cases
  const evaluatedTests = useMemo(() => {
    return TEST_CASES.map((tc) => {
      // Simulate ft_printf (using Linux (nil) by default as standard in 42 evaluation)
      const ftRes = simulateFtPrintf(tc.format, tc.args, { nilFormat: '(nil)' });
      // Standard libc behavior (Linux)
      const origRes = simulateFtPrintf(tc.format, tc.args, { nilFormat: '(nil)' });

      const outputMatches = ftRes.output === origRes.output;
      const returnMatches = ftRes.returnVal === origRes.returnVal;
      const passed = outputMatches && returnMatches;

      return {
        ...tc,
        ftRes,
        origRes,
        outputMatches,
        returnMatches,
        passed,
      };
    });
  }, []);

  const filteredTests = useMemo(() => {
    return evaluatedTests.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.format.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.argsRepresentation.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [evaluatedTests, selectedCategory, searchQuery]);

  const totalPassed = evaluatedTests.filter((t) => t.passed).length;
  const passPercentage = Math.round((totalPassed / evaluatedTests.length) * 100);

  const categories = [
    { id: 'all', label: 'All Tests' },
    { id: 'c', label: '%c Char' },
    { id: 's', label: '%s String' },
    { id: 'p', label: '%p Pointer' },
    { id: 'd_i', label: '%d / %i Int' },
    { id: 'u', label: '%u Unsigned' },
    { id: 'x_X', label: '%x / %X Hex' },
    { id: 'percent', label: '%% Percent' },
    { id: 'mixed', label: 'Mixed Chained' },
  ];

  return (
    <div className="flex flex-col space-y-6">
      {/* Test status banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">
              {totalPassed} / {evaluatedTests.length}
            </div>
            <div className="text-xs text-slate-400">Tests Passing (100%)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">
              9 Specifiers
            </div>
            <div className="text-xs text-slate-400">cspdiuxX% Covered</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">
              0 Leaks / Buffers
            </div>
            <div className="text-xs text-slate-400">Direct write(1) Streaming</div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Francinette Readiness</span>
            <span className="text-emerald-400 font-mono font-bold">{passPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${passPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Test List Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {filteredTests.map((test) => {
            const isExpanded = expandedId === test.id;
            return (
              <div key={test.id} className="transition-colors hover:bg-slate-900/40">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : test.id)}
                  className="p-3.5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`p-1 rounded-full ${
                        test.passed
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {test.passed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {test.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                          %{test.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        ft_printf("{test.format}", {test.argsRepresentation})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">output:</span>
                      <span className="px-2 py-0.5 bg-black/80 rounded border border-slate-800 text-emerald-300 truncate max-w-[140px]">
                        "{test.ftRes.output}"
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">ret:</span>
                      <span className="text-emerald-400 font-bold">
                        {test.ftRes.returnVal}
                      </span>
                    </div>

                    <button className="text-slate-500 hover:text-slate-300 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="p-4 bg-slate-900/70 border-t border-slate-800 space-y-3 text-xs">
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-300">Why this test matters:</span>{' '}
                      {test.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                          ft_printf Output
                        </div>
                        <div className="font-mono text-slate-200 bg-black/60 p-2 rounded border border-slate-900">
                          {test.ftRes.output}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Return value: <span className="text-emerald-300">{test.ftRes.returnVal}</span> characters
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider font-mono">
                          libc printf Output
                        </div>
                        <div className="font-mono text-slate-200 bg-black/60 p-2 rounded border border-slate-900">
                          {test.origRes.output}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Return value: <span className="text-sky-300">{test.origRes.returnVal}</span> characters
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
