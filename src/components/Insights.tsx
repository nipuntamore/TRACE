import React, { useState } from 'react';
import { calculateDailyCO2 } from '../utils';
import { QuizProfile, CarbonLog } from '../types';
import { 
  TrendingDown, 
  Settings2, 
  Flame, 
  HelpCircle, 
  Users, 
  Sparkles, 
  Calendar,
  Layers,
  Leaf,
  ChevronRight,
  Calculator,
  Clock,
  Activity,
  CheckCircle2,
  Trash2,
  Info
} from 'lucide-react';

interface InsightsProps {
  profile: QuizProfile;
  historicalLogs: CarbonLog[];
  onDeleteLog?: (id: string) => void;
}

export default function Insights({ profile, historicalLogs, onDeleteLog }: InsightsProps) {
  // Simulator input settings
  const [simCommuteKm, setSimCommuteKm] = useState(24);
  const [simCommuteMode, setSimCommuteMode] = useState<'alone' | 'carpool' | 'transit' | 'active'>('alone');
  const [simMeatMeals, setSimMeatMeals] = useState(2); // meat meals to swap out per week
  const [simDietSelect, setSimDietSelect] = useState<'heavy_meat' | 'balanced' | 'poultry_fish' | 'veg_vegan'>('heavy_meat');

  // Compute simulated baseline vs optimized savings
  const calculateSimulatedSavings = () => {
    // Standard weekly commute emissions (kilometers)
    const oldCommuteFactor = 0.25; // alone
    const newCommuteFactor = 
      simCommuteMode === 'alone' ? 0.25 :
      simCommuteMode === 'carpool' ? 0.12 :
      simCommuteMode === 'transit' ? 0.06 : 0.00;

    const oldCommuteWeeklyCO2 = simCommuteKm * 5 * oldCommuteFactor; // 5 days
    const newCommuteWeeklyCO2 = simCommuteKm * 5 * newCommuteFactor;
    const commuteWeeklySaved = oldCommuteWeeklyCO2 - newCommuteWeeklyCO2;

    // Diet meat meal emissions vs plant options swap
    const oldDietFactor = 3.5; // heavy meat
    const newDietFactor = 0.5; // veg_vegan
    const dietWeeklySaved = simMeatMeals * (oldDietFactor - newDietFactor);

    const weeklySaved = commuteWeeklySaved + dietWeeklySaved;
    const annualSaved = weeklySaved * 52;

    return {
      weeklySaved: parseFloat(weeklySaved.toFixed(1)),
      annualSaved: parseFloat(annualSaved.toFixed(1)),
      phonesChargedSavings: Math.round(annualSaved * 122), // 122 charges per kg
      treeSavings: parseFloat((annualSaved * 0.05).toFixed(1)),
      flightsEquivalent: parseFloat((annualSaved / 160.0).toFixed(2)), // 1 flight segment is ~160kg
    };
  };

  const stats = calculateSimulatedSavings();

  // Create a fully dynamic chronological dataset based on genuine user logs
  const sortedLogs = [...historicalLogs].sort((a, b) => a.date.localeCompare(b.date));
  const last7Logs = sortedLogs.slice(-7);

  const getDayLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }
    } catch (e) {
      // ignore parsing glitch
    }
    return dateStr;
  };

  const chartDays = last7Logs.map(log => ({
    label: getDayLabel(log.date),
    co2: Number(log.co2Total.toFixed(1)),
    fullDate: log.date,
    id: log.id
  }));

  // Guarantee at least one visual element if database is cleared
  if (chartDays.length === 0) {
    chartDays.push({ label: 'Today', co2: 6.0, fullDate: 'None', id: 'placeholder' });
  }

  // Calculate dynamic threshold ceiling matching scale
  const maxCo2Val = Math.max(16.0, ...chartDays.map(d => d.co2 + 2.0));

  // Compute live average daily footprint metric asynchronously
  const avgDaily = historicalLogs.length > 0 
    ? (historicalLogs.reduce((acc, log) => acc + log.co2Total, 0) / historicalLogs.length).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="insights-panel">
      
      {/* LEFT AREA: Historical trends chart */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-[#E1EAD8] rounded-[2rem] p-6 shadow-sm space-y-6 text-[#1B4332]">
          <div className="flex justify-between items-center pb-3 border-b border-[#E1EAD8]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D6A4F]" />
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Carbon Tracing History</h3>
                <p className="text-xs text-[#40916C] font-sans font-semibold">Weekly emission trends matching sustainable thresholds</p>
              </div>
            </div>
            <span className="text-xs bg-[#D8F3DC] font-mono px-2 py-0.5 rounded-lg text-[#1B4332] font-bold">Synchronously Logged</span>
          </div>
 
          {/* Fully Interactive Custom SVG Chart */}
          <div className="relative pt-4 space-y-4">
            <div className="flex justify-between text-xs text-[#40916C] font-mono font-bold">
              <span>(kg CO2e)</span>
              <span>Daily target budget = 6.0kg</span>
            </div>
 
            {/* Custom styled SVG graph representation */}
            <div className="w-full h-56 bg-[#F2F5F0] rounded-[1.5rem] border border-[#E1EAD8] p-4 relative flex items-end">
              
              {/* Target budget dotted threshold line */}
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-[#52B788] z-10 flex justify-end pr-3"
                style={{ bottom: `${(6.0 / maxCo2Val) * 100}%` }}
              >
                <span className="text-[11px] text-[#1B4332] bg-[#D8F3DC] border border-[#B7E4C7] px-1.5 py-0.5 rounded-md font-bold block transform -translate-y-1.5 font-sans">
                  Eco Goal Limit
                </span>
              </div>
 
              {/* Chart Grid Lines */}
              <div className="absolute inset-x-0 bottom-4 top-4 flex flex-col justify-between opacity-5 pointer-events-none">
                <div className="border-t border-[#1B4332] w-full" />
                <div className="border-t border-[#1B4332] w-full" />
                <div className="border-t border-[#1B4332] w-full" />
                <div className="border-t border-[#1B4332] w-full" />
              </div>
 
              {/* SVG lines and node connections */}
              {chartDays.length > 1 && (
                <svg className="absolute inset-x-8 bottom-12 top-8 w-[calc(100%-4rem)] h-[calc(100%-5rem)]" id="insights-svg-chart">
                  <polyline
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="3"
                    points={chartDays.map((d, idx) => {
                      const x = (idx / (chartDays.length - 1)) * 100;
                      // Invert y inside SVG: 100 is bottom, 0 is top
                      const y = 100 - (d.co2 / maxCo2Val) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    className="transition-all duration-500"
                    style={{ strokeDasharray: 'none' }}
                  />
                </svg>
              )}
 
              {/* Interactive Bars/Nodes overlay */}
              <div className="w-full flex justify-between px-4 z-10 relative h-full items-end pb-8">
                {chartDays.map((d, idx) => {
                  const percentHeight = Math.min(100, (d.co2 / maxCo2Val) * 100);
                  const isUnderTarget = d.co2 <= 6.0;
 
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 space-y-2">
                       <div className="relative group flex flex-col items-center justify-end w-full" style={{ height: '140px' }}>
                        {/* Interactive floating numerical tooltip */}
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B4332] text-white text-xs font-mono py-1 px-2 rounded shadow-lg -top-8 z-25 whitespace-nowrap pointer-events-none">
                          {d.co2} kg CO2
                          {d.fullDate !== 'None' && <span className="block text-[9px] opacity-75">{d.fullDate}</span>}
                        </div>
                        
                        {/* The interactive bar element */}
                        <div 
                          className={`w-3.5 rounded-full hover:scale-125 transition-all duration-300 cursor-pointer ${
                            isUnderTarget 
                              ? 'bg-[#2D6A4F] shadow-[0_0_10px_rgba(45,106,79,0.3)]' 
                              : 'bg-[#B7E4C7]'
                          }`}
                          style={{ height: `${percentHeight}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#40916C] block">{d.label}</span>
                     </div>
                  );
                })}
              </div>
 
            </div>
 
            <div className="flex justify-between items-center p-3 bg-[#F2F5F0] border border-[#E1EAD8] rounded-2xl text-xs text-[#40916C]" id="chart-legend-box">
              <span className="flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] block" /> Sustainable days (≤ 6kg)
              </span>
              <span className="flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7E4C7] block" /> Standard days (&gt; 6kg)
              </span>
              <span className="font-extrabold text-[#1B4332]">Average Daily: {avgDaily}kg CO2</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* RIGHT AREA: Commute Impact Simulator / Relatables ("Impact Modeling"!) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-[#E1EAD8] rounded-[2rem] p-6 shadow-sm space-y-6 text-[#1B4332]">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E1EAD8]">
            <Calculator className="w-5 h-5 text-[#2D6A4F]" />
            <div>
              <h3 className="text-lg font-black font-display text-[#1B4332]">Impact Modeling</h3>
              <p className="text-xs text-[#40916C] font-semibold">Play-test and simulate lifestyle alterations</p>
            </div>
          </div>
 
          <div className="space-y-4">
            
            {/* Sim input 1: Commuting Distance (km) */}
            <div className="space-y-1.5 p-3.5 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]">
              <div className="flex justify-between text-xs font-bold text-[#1B4332]">
                <span>🚘 Commuting Swap</span>
                <span className="font-mono text-[#1B4332] bg-[#D8F3DC] px-2.5 py-0.5 rounded-lg text-xs font-bold">
                  {simCommuteKm} km/day
                </span>
              </div>
              <input 
                type="range"
                min="3"
                max="64"
                value={simCommuteKm}
                onChange={(e) => setSimCommuteKm(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#D8F3DC] rounded-lg appearance-none cursor-pointer accent-[#2D6A4F] my-2"
              />
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[
                  { id: 'alone', label: 'Drive' },
                  { id: 'carpool', label: 'Ride EV' },
                  { id: 'transit', label: 'Transit' },
                  { id: 'active', label: 'Bicycle' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    id={`btn-sim-mode-${mode.id}`}
                    onClick={() => setSimCommuteMode(mode.id as any)}
                    className={`py-1 rounded-lg text-xs font-bold border cursor-pointer transition-colors duration-200 ${
                      simCommuteMode === mode.id 
                        ? 'bg-[#1B4332] text-white border-[#1B4332]' 
                        : 'bg-white text-[#40916C] border-[#E1EAD8] hover:border-[#B7E4C7]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
 
            {/* Sim input 2: Diet Meat meals to vegetarian */}
            <div className="space-y-1.5 p-3.5 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]">
              <div className="flex justify-between text-xs font-bold text-[#1B4332]">
                <span>🥩 Plant-Based Swaps</span>
                <span className="font-mono text-[#1B4332] bg-[#D8F3DC] px-2.5 py-0.5 rounded-lg text-xs font-bold">
                  {simMeatMeals} meat meals / week
                </span>
              </div>
              <p className="text-xs text-[#40916C] font-semibold">Swap these meat meals to vegetarian options</p>
              <input 
                type="range"
                min="0"
                max="7"
                value={simMeatMeals}
                onChange={(e) => setSimMeatMeals(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#D8F3DC] rounded-lg appearance-none cursor-pointer accent-[#2D6A4F] my-2"
              />
            </div>
 
            {/* Simulated Offset Output Results Panel */}
            <div className="p-5 bg-[#1B4332] text-white rounded-[2rem] space-y-4 shadow-sm border border-[#1B4332] relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#74C69D]/20 rounded-full opacity-25 filter blur-xl" />
              
              <div className="border-b border-white/10 pb-2 flex justify-between items-center">
                <span className="text-xs font-mono tracking-widest text-[#74C69D] font-bold uppercase block">
                  Simulated Annual Impact
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/25" />
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                {/* Annual Offset Volume */}
                <div className="space-y-0.5">
                  <span className="text-xs text-zinc-300 uppercase font-extrabold block leading-none font-sans">Annual Saved</span>
                  <span className="text-2xl font-black font-display leading-none text-[#74C69D] block tracking-tight">
                    {stats.annualSaved} kg CO2
                  </span>
                </div>
 
                {/* Pin Tree Offsets */}
                <div className="space-y-0.5">
                  <span className="text-xs text-zinc-300 uppercase font-extrabold block leading-none font-sans">Pine Seedlings</span>
                  <span className="text-2xl font-black font-display leading-none text-[#D8F3DC] block tracking-tight">
                    {stats.treeSavings} trees
                  </span>
                </div>
              </div>
 
              {/* Textual comparison equivalent builder */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 text-xs text-zinc-200 leading-relaxed font-sans font-medium">
                <Leaf className="w-4 h-4 text-[#74C69D] shrink-0" />
                <p>
                  This reduction avoids emissions equivalent to driving an average car <strong className="text-white font-bold">{Math.round(stats.annualSaved * 4.0)} km</strong> or charging <strong className="text-white font-bold">{stats.phonesChargedSavings} smartphones!</strong>
                </p>
              </div>
            </div>
 
          </div>
        </div>
      </div>

      {/* FULL WIDTH: Synchronous Logged Carbon Footprints timeline journal feed */}
      <div className="lg:col-span-12 font-sans" id="logged-carbon-timeline-section">
        <div className="bg-white border border-[#E1EAD8] rounded-[2rem] p-6 shadow-sm space-y-6 text-[#1B4332]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#E1EAD8] gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]">
                <Clock className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Journal Timeline Registry</h3>
                <p className="text-xs text-[#40916C]">Synchronized feed showing all historical and live footprint metrics logged by you</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] bg-[#D8F3DC] border border-[#B7E4C7] px-3.5 py-1.5 rounded-full select-none shrink-0 self-start sm:self-center">
              <Activity className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{historicalLogs.length} logged items synced</span>
            </div>
          </div>

          <div className="space-y-4">
            {historicalLogs.length === 0 ? (
              <div className="text-center py-10 px-4 bg-[#F2F5F0] rounded-[1.5rem] border border-dashed border-[#B7E4C7] space-y-2">
                <Leaf className="w-8 h-8 text-[#52B788] mx-auto opacity-60 animate-bounce" />
                <h4 className="font-bold text-[#1B4332]">No Active Carbon Logs found</h4>
                <p className="text-xs text-[#40916C] max-w-sm mx-auto">
                  Submit daily logs in the main dashboard tab and they will automatically show up as synchronous database journals here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...historicalLogs]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((log) => {
                    const isEco = log.co2Total <= 6.0;
                    return (
                      <div 
                        key={log.id} 
                        className="p-5 rounded-2xl border border-[#E1EAD8] hover:border-[#B7E4C7] hover:shadow-sm transition-all duration-300 relative group bg-[#F2F5F0]/50"
                      >
                        {onDeleteLog && (
                          <button
                            onClick={() => onDeleteLog(log.id)}
                            className="absolute top-4 right-4 p-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-rose-100"
                            title="Remove log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <div className="space-y-4">
                          {/* Log Header info */}
                          <div className="flex justify-between items-start pr-8">
                            <div className="space-y-0.5">
                              <span className="text-xs font-mono font-black text-[#2D6A4F] bg-[#D8F3DC] border border-[#B7E4C7] px-2 py-0.5 rounded-lg inline-block">
                                {getDayLabel(log.date)}
                              </span>
                              <p className="text-xs text-[#40916C] font-semibold">{log.date}</p>
                            </div>
                            
                            {/* Emissions value */}
                            <div className="text-right">
                              <span className={`text-base font-black font-display block whitespace-nowrap ${isEco ? 'text-[#2D6A4F]' : 'text-amber-800'}`}>
                                {log.co2Total.toFixed(1)} kg CO2e
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${isEco ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                {isEco ? 'Sustainable Day' : 'Above Target'}
                              </span>
                            </div>
                          </div>

                          {/* Specific activity footprint itemizations */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                            <div className="p-2 bg-white/70 rounded-xl border border-[#E1EAD8]/50 flex items-center justify-between">
                              <span className="text-[#40916C] font-medium">🚘 Commuting:</span>
                              <strong className="text-[#1B4332] font-semibold whitespace-nowrap">{log.commuteKm} km</strong>
                            </div>
                            <div className="p-2 bg-white/70 rounded-xl border border-[#E1EAD8]/50 flex items-center justify-between">
                              <span className="text-[#40916C] font-medium">🥩 Meat Meals:</span>
                              <strong className="text-[#1B4332] font-semibold whitespace-nowrap">{log.meatMeals} servings</strong>
                            </div>
                            <div className="p-2 bg-white/70 rounded-xl border border-[#E1EAD8]/50 flex items-center justify-between">
                              <span className="text-[#40916C] font-medium">⚡ Grid Rating:</span>
                              <strong className="text-[#1B4332] font-semibold whitespace-nowrap">Level {log.energyRating}/10</strong>
                            </div>
                            <div className="p-2 bg-white/70 rounded-xl border border-[#E1EAD8]/50 flex items-center justify-between">
                              <span className="text-[#40916C] font-medium">♻️ Recycled:</span>
                              <strong className="text-[#1B4332] font-semibold whitespace-nowrap">{log.wasteRecycled ? 'Yes 🌱' : 'No ❌'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
 
    </div>
  );
}
