import { useState, useMemo } from 'react';
import { Target, Zap, Waves, Sparkles, Layers, List } from 'lucide-react';

const STAGES = [
  "未解放 (Base)",
  "Lv 0", "Lv 1", "Lv 2", "Lv 3", "Lv 4", "Lv 5", "Lv 6", "Lv 7", "Lv 8", "Lv 9", "Lv 10",
  "Lv 11", "Lv 12", "Lv 13", "Lv 14", "Lv 15", "Lv 16", "Lv 17", "Lv 18", "Lv 19", "Lv 20"
];

const LIBERATION_RATES = [
  { baseRate: 100, cost: 300 }, // Base -> 0
  { baseRate: 50, cost: 30 },   // 0 -> 1
  { baseRate: 40, cost: 30 },   // 1 -> 2
  { baseRate: 30, cost: 30 },   // 2 -> 3
  { baseRate: 20, cost: 30 },   // 3 -> 4
  { baseRate: 15, cost: 30 },   // 4 -> 5
  { baseRate: 15, cost: 30 },   // 5 -> 6
  { baseRate: 10, cost: 30 },   // 6 -> 7
  { baseRate: 10, cost: 30 },   // 7 -> 8
  { baseRate: 5, cost: 30 },    // 8 -> 9
  { baseRate: 5, cost: 30 },    // 9 -> 10
  { baseRate: 100, cost: 500 }, // 10 -> 11
  { baseRate: 40, cost: 50 },   // 11 -> 12
  { baseRate: 30, cost: 50 },   // 12 -> 13
  { baseRate: 20, cost: 50 },   // 13 -> 14
  { baseRate: 15, cost: 50 },   // 14 -> 15
  { baseRate: 15, cost: 50 },   // 15 -> 16
  { baseRate: 10, cost: 50 },   // 16 -> 17
  { baseRate: 10, cost: 50 },   // 17 -> 18
  { baseRate: 5, cost: 50 },    // 18 -> 19
  { baseRate: 5, cost: 50 },    // 19 -> 20
];

export default function LiberationCalculator() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [targetStage, setTargetStage] = useState<number>(21);

  const { expectedTotalCost, actualTotalCost, steps } = useMemo(() => {
    let cost = 0;
    let actualCost = 0;
    const stepsData = [];
    let cumulative = 0;
    let actualCumulative = 0;
    let cumulativeActualTries = 0;
    
    for (let i = currentStage; i < targetStage; i++) {
      const rate = LIBERATION_RATES[i];
      let expectedCostForLevel = 0;
      let actualExpectedCostForLevel = 0;
      let expectedTries = 1;
      let actualExpectedTries = 1;
      
      if (rate.baseRate === 100) {
        expectedCostForLevel = rate.cost;
        actualExpectedCostForLevel = rate.cost;
      } else {
        const p = (k: number) => Math.min(rate.baseRate + k, rate.baseRate + 5) / 100;
        let e5 = 1 / p(5);
        let e4 = 1 + (1 - p(4)) * e5;
        let e3 = 1 + (1 - p(3)) * e4;
        let e2 = 1 + (1 - p(2)) * e3;
        let e1 = 1 + (1 - p(1)) * e2;
        let e0 = 1 + (1 - p(0)) * e1;
        
        expectedTries = e0;
        actualExpectedTries = Math.ceil(e0);
        expectedCostForLevel = e0 * rate.cost;
        actualExpectedCostForLevel = actualExpectedTries * rate.cost;
      }
      
      cost += expectedCostForLevel;
      cumulative += expectedCostForLevel;
      actualCost += actualExpectedCostForLevel;
      actualCumulative += actualExpectedCostForLevel;
      cumulativeActualTries += actualExpectedTries;
      
      stepsData.push({
        fromStage: STAGES[i],
        toStage: STAGES[i + 1],
        baseRate: rate.baseRate,
        costPerTry: rate.cost,
        expectedTries,
        actualExpectedTries,
        expectedCost: expectedCostForLevel,
        actualExpectedCost: actualExpectedCostForLevel,
        cumulative,
        actualCumulative,
        cumulativeActualTries
      });
    }
    
    return { expectedTotalCost: cost, actualTotalCost: actualCost, steps: stepsData };
  }, [currentStage, targetStage]);

  const MAX_STAGE = STAGES.length - 1;

  const handleCurrentStageChange = (val: number) => {
    setCurrentStage(val);
    if (val >= targetStage) setTargetStage(Math.min(MAX_STAGE, val + 1));
  };

  const handleTargetStageChange = (val: number) => {
    setTargetStage(val);
    if (val <= currentStage) setCurrentStage(Math.max(0, val - 1));
  };

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm mb-6">
        <Sparkles className="w-6 h-6 text-sky-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sky-900 text-lg mb-1">保底與期望值計算說明</h3>
          <p className="text-sky-800/90 leading-relaxed font-medium text-sm">
            本工具將每次失敗提升 1%（最多提升 5%）的保底機制納入數學模型，確保計算的最優期望值完全符合遊戲內的機率增量設定。例如 5% 基礎機率的真實期望次數約為 11.39 次。
          </p>
        </div>
      </div>

      {/* Input Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Layers className="w-4 h-4 text-sky-500" />
              目前解放階段
            </label>
            <span className="text-lg font-bold text-sky-600 font-mono">{STAGES[currentStage]}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={MAX_STAGE - 1} 
            value={currentStage}
            onChange={(e) => handleCurrentStageChange(parseInt(e.target.value))}
            className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Target className="w-4 h-4 text-indigo-500" />
              目標解放階段
            </label>
            <span className="text-lg font-bold text-indigo-600 font-mono">{STAGES[targetStage]}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max={MAX_STAGE} 
            value={targetStage}
            onChange={(e) => handleTargetStageChange(parseInt(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </section>

      {/* Result Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-sky-200 p-8 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Zap className="w-32 h-32 text-sky-900" />
        </div>
        <p className="text-sm text-slate-500 font-semibold mb-2 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          實際預期所需解放石總量 (無條件進位)
        </p>
        <div className="flex items-baseline justify-center gap-2 mt-2">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            {actualTotalCost.toLocaleString()}
          </h2>
          <span className="text-lg font-medium text-slate-400">粒</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          純數學期望值為 {Math.round(expectedTotalCost).toLocaleString()} 粒
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{STAGES[currentStage]}</span>
          <span>→</span>
          <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{STAGES[targetStage]}</span>
        </div>
      </section>

      {/* Detailed Breakdown */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <List className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-800">各級解放預期消耗明細</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3 py-4 font-semibold text-left">升級階段</th>
                <th className="px-3 py-4 font-semibold">基礎成功率</th>
                <th className="px-3 py-4 font-semibold">單次消耗</th>
                <th className="px-3 py-4 font-semibold border-l border-slate-200 bg-slate-100/50 rounded-tl-lg" colSpan={3}>
                  期望挑戰次數
                </th>
                <th className="px-3 py-4 font-semibold border-l border-slate-200 bg-sky-50/50 rounded-tl-lg" colSpan={2}>
                  該階段期望消耗
                </th>
                <th className="px-3 py-4 font-semibold border-l border-slate-200 bg-indigo-50/50 rounded-tl-lg" colSpan={2}>
                  累計資源
                </th>
              </tr>
              <tr className="text-xs text-slate-400">
                <th className="px-3 py-2 text-left bg-slate-50"></th>
                <th className="px-3 py-2 bg-slate-50"></th>
                <th className="px-3 py-2 bg-slate-50"></th>
                <th className="px-3 py-2 border-l border-slate-200 bg-slate-100/50">純數學</th>
                <th className="px-3 py-2 bg-slate-100/50">實際</th>
                <th className="px-3 py-2 bg-slate-100/50 text-slate-600 font-bold">累計實際</th>
                <th className="px-3 py-2 border-l border-slate-200 bg-sky-50/50">純數學</th>
                <th className="px-3 py-2 bg-sky-50/50 text-sky-600 font-bold">實際準備</th>
                <th className="px-3 py-2 border-l border-slate-200 bg-indigo-50/50">純數學</th>
                <th className="px-3 py-2 bg-indigo-50/50 text-indigo-600 font-bold">實際準備</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {steps.map((row) => (
                <tr key={`${row.fromStage}-${row.toStage}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-4 font-mono font-medium text-slate-700 text-left">
                    {row.fromStage} <span className="text-slate-300">→</span> {row.toStage.replace('Lv ', '')}
                  </td>
                  <td className="px-3 py-4 font-medium text-amber-600">{row.baseRate}%</td>
                  <td className="px-3 py-4 text-slate-600 font-mono">{row.costPerTry}</td>
                  
                  {/* 期望挑戰次數 */}
                  <td className="px-3 py-4 font-mono text-slate-500 border-l border-slate-100 bg-slate-50/20">{row.expectedTries.toFixed(2)}</td>
                  <td className="px-3 py-4 font-mono font-medium text-slate-700 bg-slate-50/20">{row.actualExpectedTries}</td>
                  <td className="px-3 py-4 font-mono font-bold text-slate-800 bg-slate-50/20">{row.cumulativeActualTries}</td>
                  
                  {/* 該階段預期消耗 */}
                  <td className="px-3 py-4 font-mono text-slate-500 border-l border-slate-100 bg-sky-50/20">{Math.round(row.expectedCost).toLocaleString()}</td>
                  <td className="px-3 py-4 font-mono font-bold text-sky-600 bg-sky-50/20">{row.actualExpectedCost.toLocaleString()}</td>
                  
                  {/* 累計預期消耗 */}
                  <td className="px-3 py-4 font-mono text-slate-500 border-l border-slate-100 bg-indigo-50/20">{Math.round(row.cumulative).toLocaleString()}</td>
                  <td className="px-3 py-4 font-mono font-bold text-indigo-600 bg-indigo-50/20">{row.actualCumulative.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
