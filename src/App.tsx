import { useState } from 'react';
import { ArrowUpCircle, RefreshCcw, Zap } from 'lucide-react';
import ConversionCalculator from './components/ConversionCalculator';
import UpgradeCalculator from './components/UpgradeCalculator';
import LiberationCalculator from './components/LiberationCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'conversion' | 'upgrade' | 'liberation'>('conversion');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl text-white shadow-md ${
              activeTab === 'conversion' ? 'bg-indigo-600' :
              activeTab === 'upgrade' ? 'bg-purple-600' : 'bg-sky-500'
            }`}>
              {activeTab === 'conversion' && <RefreshCcw className="w-6 h-6" />}
              {activeTab === 'upgrade' && <ArrowUpCircle className="w-6 h-6" />}
              {activeTab === 'liberation' && <Zap className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                {activeTab === 'conversion' ? '解放石轉換最優解計算器' : 
                 activeTab === 'upgrade' ? '魔神升級資源計算器' : '解放石升級預期計算器'}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {activeTab === 'conversion' 
                  ? '基於自訂角色的機率模型與無放回衰減算法' 
                  : activeTab === 'upgrade'
                  ? '計算不同等級段所需的精確升級資源'
                  : '包含失敗 +1% (最高 +5%) 成功率補底機制的真實預期消耗'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('conversion')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'conversion' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              轉換計算
            </button>
            <button
              onClick={() => setActiveTab('liberation')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'liberation' 
                  ? 'bg-white text-sky-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              解放升級
            </button>
            <button
              onClick={() => setActiveTab('upgrade')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'upgrade' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              魔神升級
            </button>
          </div>
        </header>

        {/* content */}
        <main className="animate-in fade-in duration-300">
          {activeTab === 'conversion' && <ConversionCalculator />}
          {activeTab === 'liberation' && <LiberationCalculator />}
          {activeTab === 'upgrade' && <UpgradeCalculator />}
        </main>

      </div>
    </div>
  );
}
