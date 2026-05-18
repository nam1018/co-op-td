import { useState, useMemo } from 'react';
import { Target, RefreshCcw, Database, TrendingUp, AlertCircle, Info, Calculator, Percent, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Cell
} from 'recharts';

export default function ConversionCalculator() {
  const [totalCharacters, setTotalCharacters] = useState<number>(11);
  const [baseStones, setBaseStones] = useState<number>(300);
  const [targetCount, setTargetCount] = useState<number>(3);

  // Core Math Logic
  const genericTotal = Math.floor(baseStones * 0.5);
  const poolSize = totalCharacters - 1;

  const stats = useMemo(() => {
    let currentProbOfReaching = 1;
    let expectedStones = 0;
    let cumul = 0;
    const steps = [];
    const maxSteps = poolSize - targetCount + 1;
    
    let currentStones = baseStones;

    for (let k = 1; k <= maxSteps; k++) {
      const currentPool = poolSize - k + 1;
      
      currentStones = Math.floor(currentStones * 0.9);
      
      const hitProbHere = targetCount / currentPool;
      const absoluteProb = currentProbOfReaching * hitProbHere;

      expectedStones += absoluteProb * currentStones;
      cumul += absoluteProb;

      steps.push({
        step: k,
        stones: currentStones,
        probHit: absoluteProb,
        probCumul: cumul,
        expectedContrib: absoluteProb * currentStones,
      });

      currentProbOfReaching *= (currentPool - targetCount) / currentPool;
    }

    const chanceToBeatGeneric = steps
      .filter((s) => s.stones >= genericTotal)
      .reduce((sum, s) => sum + s.probHit, 0);

    return { 
      steps, 
      expectedStones: Math.floor(expectedStones), 
      chanceToBeatGeneric 
    };
  }, [baseStones, targetCount, totalCharacters, poolSize, genericTotal]);

  const handleTotalCharactersChange = (val: number) => {
    setTotalCharacters(val);
    if (targetCount > val - 1) {
      setTargetCount(Math.max(1, val - 1));
    }
  };

  const getStrategyAdvice = () => {
    if (targetCount >= poolSize) return "💯 百分百命中：您接受除了原本角色外的所有角色，轉換第1次即可大賺！";
    if (stats.chanceToBeatGeneric === 1) return "💯 絕對優勢！由於扣減機制，即使運氣最差抽到最後，最終收益也必定大於通用兌換(1:0.5)，請大膽轉換！";
    if (stats.chanceToBeatGeneric >= 0.8) return `🔥 強烈建議轉換！高達 ${(stats.chanceToBeatGeneric * 100).toFixed(1)}% 的機率，能獲得比「直接兌換通用石」更高的總收益。`;
    if (stats.chanceToBeatGeneric >= 0.5) return `🎲 可以一搏：有超過一半機率(${((stats.chanceToBeatGeneric * 100).toFixed(1))}%)比換通用划算，適合願意承擔小風險的玩家。`;
    return `⚠️ 風險偏高：大於通用石收益的機率僅 ${(stats.chanceToBeatGeneric * 100).toFixed(1)}%。若非極度渴求這 ${targetCount} 個角色，建議考慮直接一鍵轉換為通用解放石(1:0.5)。`;
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-8 flex-wrap">
        <div className="flex-1 min-w-[200px] space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4 text-blue-500" />
              總角色數量
            </label>
            <span className="text-lg font-bold text-blue-600">{totalCharacters}</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="12" 
            value={totalCharacters}
            onChange={(e) => handleTotalCharactersChange(parseInt(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-400">目前遊戲中的總角色數量</p>
        </div>

        <div className="flex-1 min-w-[200px] space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Database className="w-4 h-4 text-indigo-500" />
              投入解放石數量
            </label>
            <span className="text-lg font-bold text-indigo-600">{baseStones}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="300" 
            value={baseStones}
            onChange={(e) => setBaseStones(parseInt(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-400">每次轉換上限為 300 粒</p>
        </div>

        <div className="flex-1 min-w-[200px] space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Target className="w-4 h-4 text-emerald-500" />
              目標專屬石數量
            </label>
            <span className="text-lg font-bold text-emerald-600">{targetCount} / {poolSize}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max={poolSize} 
            value={targetCount}
            onChange={(e) => setTargetCount(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-400">在剩下的 {poolSize} 隻角色中，有幾隻是您想要的？</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Calculator className="w-24 h-24" />
          </div>
          <p className="text-sm text-slate-500 font-semibold mb-1">預期獲得專屬石 (Expected)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800">{stats.expectedStones}</h2>
            <span className="text-sm font-medium text-slate-400">粒</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">根據所有機率分支的數學期望值</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <RefreshCcw className="w-24 h-24" />
          </div>
          <p className="text-sm text-slate-500 font-semibold mb-1">保底：直接換通用石 (1:0.5)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800">{genericTotal}</h2>
            <span className="text-sm font-medium text-slate-400">粒</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">零風險，將失去指定專屬的機會</p>
        </div>

        <div className="bg-indigo-600 rounded-2xl shadow-md border border-indigo-500 p-6 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <p className="text-sm text-indigo-200 font-semibold mb-1">大於保底收益機率 (Win Rate)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-white">{(stats.chanceToBeatGeneric * 100).toFixed(1)}</h2>
            <span className="text-sm font-medium text-indigo-200">%</span>
          </div>
          <p className="text-xs text-indigo-200 mt-2">抽中目標且顆數 {'>='} {genericTotal} 粒的機率</p>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="shrink-0 mt-0.5">
          <Info className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 text-lg mb-1">AI 最佳策略分析</h3>
          <p className="text-amber-800/90 leading-relaxed font-medium">
            {getStrategyAdvice()}
          </p>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          每次重刷之收益與命中機率分佈
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stats.steps} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="step" 
                tickFormatter={(val) => `第 ${val} 抽`} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `${val}%`}
                tick={{ fill: '#10B981', fontSize: 12 }} 
              />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => {
                  if (name === '獲取解放石數量') return [`${value} 粒`, name];
                  if (name === '該回合首中機率') return [`${value.toFixed(2)}%`, name];
                  return [value, name];
                }}
                labelFormatter={(label) => `第 ${label} 轉換回合`}
              />
              <ReferenceLine 
                y={genericTotal} 
                yAxisId="left" 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                label={{ position: 'top', value: '通用石保底線', fill: '#D97706', fontSize: 12, fontWeight: 600 }} 
              />
              <Bar yAxisId="left" dataKey="stones" name="獲取解放石數量" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {stats.steps.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.stones >= genericTotal ? '#6366F1' : '#CBD5E1'} />
                ))}
              </Bar>
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey={(d) => d.probHit * 100} 
                name="該回合首中機率" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">機率與收益對照表</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">轉換回合</th>
                <th className="px-6 py-4 font-semibold">產出石頭數量</th>
                <th className="px-6 py-4 font-semibold">該回合命中率</th>
                <th className="px-6 py-4 font-semibold">累積獲得機率</th>
                <th className="px-6 py-4 font-semibold">盈虧狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.steps.map((row) => (
                <tr key={row.step} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">第 {row.step} 次隨機</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{row.stones}</td>
                  <td className="px-6 py-4 text-emerald-600 font-medium">{(row.probHit * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{(row.probCumul * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4">
                    {row.stones >= genericTotal ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold ring-1 ring-inset ring-emerald-500/20">
                        賺 +{row.stones - genericTotal}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-50 text-rose-600 text-xs font-bold ring-1 ring-inset ring-rose-500/20">
                        虧 {row.stones - genericTotal}
                      </span>
                    )}
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
