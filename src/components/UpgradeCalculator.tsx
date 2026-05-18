import { useState, useMemo } from 'react';
import { ArrowUpCircle, Database, Calculator, Layers, Crosshair } from 'lucide-react';

const LEVEL_COSTS = [
  0,     // Index 0 (not used)
  0,     // Level 1: 0 cost to reach
  30,    // 1 -> 2
  70,    // 2 -> 3
  130,   // 3 -> 4
  210,   // 4 -> 5
  320,   // 5 -> 6
  460,   // 6 -> 7
  620,   // 7 -> 8
  800,   // 8 -> 9
  1000,  // 9 -> 10
  1230,  // 10 -> 11
  1500,  // 11 -> 12
  1800,  // 12 -> 13
  2130,  // 13 -> 14
  2490,  // 14 -> 15
  2880,  // 15 -> 16
  3300,  // 16 -> 17
  3750,  // 17 -> 18
  4230,  // 18 -> 19
  4740,  // 19 -> 20
  5280   // 20 -> 21
];

export default function UpgradeCalculator() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [targetLevel, setTargetLevel] = useState<number>(21);

  // Math
  const { totalCost, steps } = useMemo(() => {
    let cost = 0;
    const stepsData = [];
    let cumulative = 0;
    
    for (let i = currentLevel + 1; i <= targetLevel; i++) {
      cost += LEVEL_COSTS[i];
      cumulative += LEVEL_COSTS[i];
      stepsData.push({
        levelFrom: i - 1,
        levelTo: i,
        cost: LEVEL_COSTS[i],
        cumulative: cumulative
      });
    }
    
    return { totalCost: cost, steps: stepsData };
  }, [currentLevel, targetLevel]);

  const MAX_LEVEL = LEVEL_COSTS.length - 1;

  const handleCurrentLevelChange = (val: number) => {
    setCurrentLevel(val);
    if (val >= targetLevel) setTargetLevel(Math.min(MAX_LEVEL, val + 1));
  };

  const handleTargetLevelChange = (val: number) => {
    setTargetLevel(val);
    if (val <= currentLevel) setCurrentLevel(Math.max(1, val - 1));
  };

  return (
    <div className="space-y-6">
      
      {/* Input Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Layers className="w-4 h-4 text-rose-500" />
              目前等級 (Current Level)
            </label>
            <span className="text-lg font-bold text-rose-600 font-mono">Lv. {currentLevel}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max={MAX_LEVEL - 1} 
            value={currentLevel}
            onChange={(e) => handleCurrentLevelChange(parseInt(e.target.value))}
            className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Crosshair className="w-4 h-4 text-purple-500" />
              目標等級 (Target Level)
            </label>
            <span className="text-lg font-bold text-purple-600 font-mono">Lv. {targetLevel}</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max={MAX_LEVEL} 
            value={targetLevel}
            onChange={(e) => handleTargetLevelChange(parseInt(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </section>

      {/* Result Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-200 p-8 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Database className="w-32 h-32 text-purple-900" />
        </div>
        <p className="text-sm text-slate-500 font-semibold mb-2 flex items-center justify-center gap-2">
          <ArrowUpCircle className="w-4 h-4 text-purple-500" />
          升級總共需要
        </p>
        <div className="flex items-baseline justify-center gap-2 mt-2">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            {totalCost.toLocaleString()}
          </h2>
          <span className="text-lg font-medium text-slate-400">資源</span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">Lv. {currentLevel}</span>
          <span>→</span>
          <span className="font-mono text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Lv. {targetLevel}</span>
          <span>(共升級 {targetLevel - currentLevel} 次)</span>
        </div>
      </section>

      {/* Detailed Breakdown */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">各級消耗明細</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">升級階段</th>
                <th className="px-6 py-4 font-semibold">該級消耗</th>
                <th className="px-6 py-4 font-semibold">該階段累計</th>
                <th className="px-6 py-4 font-semibold">距離目標還差</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {steps.map((row) => (
                <tr key={`${row.levelFrom}-${row.levelTo}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">
                    Lv. {row.levelFrom} → {row.levelTo}
                  </td>
                  <td className="px-6 py-4 font-bold text-rose-500">{row.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-purple-600 font-medium">{row.cumulative.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {(totalCost - row.cumulative).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
