import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QuizProfile, CarbonLog } from '../types';
import { calculateDailyCO2, GLOBAL_AVERAGES, getRelatableEquivalents } from '../utils';
import { 
  Flame, 
  HelpCircle, 
  Check, 
  Zap, 
  Leaf, 
  Smartphone, 
  PlayCircle, 
  Car, 
  TreePine, 
  Calendar,
  Sparkles,
  Award,
  RotateCcw,
  LogOut,
  BellRing
} from 'lucide-react';

interface DashboardProps {
  profile: QuizProfile;
  streak: number;
  onLogSubmit: (log: Omit<CarbonLog, 'id' | 'co2Total'>) => void;
  lastLog?: CarbonLog;
  achievements: any[];
  confirmAction: 'reset_logs' | 'reset_profile' | null;
  setConfirmAction: (action: 'reset_logs' | 'reset_profile' | null) => void;
  handleResetLogsOnly: () => void;
  handleResetApplicationState: () => void;
  notificationHistory: { id: string; msg: string; type: string; timestamp: string }[];
  onClearNotifications: () => void;
}

export default function Dashboard({ 
  profile, 
  streak, 
  onLogSubmit, 
  lastLog,
  achievements,
  confirmAction,
  setConfirmAction,
  handleResetLogsOnly,
  handleResetApplicationState,
  notificationHistory = [],
  onClearNotifications
}: DashboardProps) {
  // Setup standard state for logging
  const [commuteKm, setCommuteKm] = useState(lastLog?.commuteKm ?? 20);
  const [meatMeals, setMeatMeals] = useState(lastLog?.meatMeals ?? 1);
  const [energyRating, setEnergyRating] = useState(lastLog?.energyRating ?? 4);
  const [recycled, setRecycled] = useState(lastLog?.wasteRecycled ?? true);
  
  // Active dynamic real-time calculations
  const [currentCo2, setCurrentCo2] = useState(6.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const computed = calculateDailyCO2(commuteKm, meatMeals, energyRating, recycled, profile);
    setCurrentCo2(computed);
  }, [commuteKm, meatMeals, energyRating, recycled, profile]);

  // Handle immediate form logging submit
  const handleLogAction = () => {
    onLogSubmit({
      date: new Date().toISOString().split('T')[0],
      commuteKm,
      meatMeals,
      energyRating,
      wasteRecycled: recycled
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Determine pulse status, size, and glowing colour
  let pulseClass = 'animate-pulse-green';
  let orbColor = 'from-[#74C69D] to-[#1B4332]';
  let feedbackText = 'Excellent! You are within the sustainable carbon thresholds. Planet Earth thanks you!';
  let feedbackBadge = 'bg-[#D8F3DC] text-[#1B4332] border-[#B7E4C7]';

  if (currentCo2 > GLOBAL_AVERAGES.sustainableTargetDaily && currentCo2 <= GLOBAL_AVERAGES.globalAverageDaily) {
    pulseClass = 'animate-pulse-amber';
    orbColor = 'from-amber-400 to-amber-600';
    feedbackText = 'Moderate footprint. You are above the sustainable limit, but well below typical Western averages.';
    feedbackBadge = 'bg-amber-50 text-amber-700 border-amber-100';
  } else if (currentCo2 > GLOBAL_AVERAGES.globalAverageDaily) {
    pulseClass = 'animate-pulse-red';
    orbColor = 'from-rose-400 to-red-600';
    feedbackText = 'High carbon weight. Try lowering your driving kilometers or meat meals to reduce your impact!';
    feedbackBadge = 'bg-rose-50 text-rose-700 border-rose-100';
  }

  // Dynamic sizing factor: standard footprint size maps between scale 0.8 to 1.35
  const baseSizeFactor = 0.8 + Math.min(0.55, (currentCo2 / 24.0));

  // Extract relational indicators
  const equivalents = getRelatableEquivalents(currentCo2);

  // Helper mapping for icon render safely
  const renderEquivalentIcon = (iconName: string) => {
    switch (iconName) {
      case 'smartphone': return <Smartphone className="w-5 h-5 text-[#2D6A4F]" />;
      case 'play-circle': return <PlayCircle className="w-5 h-5 text-rose-500" />;
      case 'car': return <Car className="w-5 h-5 text-amber-500" />;
      case 'tree-pine': return <TreePine className="w-5 h-5 text-emerald-500" />;
      default: return <Leaf className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8" id="dashboard-hub">
      
      {/* Top Active Streak Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#1B4332] text-white rounded-[2rem] shadow-sm border border-[#1B4332] gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="p-3 bg-white/10 text-white rounded-2xl animate-float shrink-0">
            <Flame className="w-6 h-6 fill-[#74C69D] text-[#74C69D]" />
          </div>
          <div>
            <h4 className="text-base font-black font-display tracking-wider uppercase">TRACE Climate Pulse Dashboard</h4>
            <p className="text-xs text-slate-300 font-sans">Active daily tracking • Welcome back, Climate Hero</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 bg-white/10 rounded-2xl border border-white/20 shrink-0">
          <span className="text-xs font-extrabold text-slate-300 font-mono tracking-wider uppercase">Log Streak:</span>
          <span className="text-3xl font-black font-display text-[#74C69D] leading-none">{streak}</span>
          <span className="text-xs font-bold text-slate-300 font-mono">DAYS</span>
        </div>
      </div>

      {/* STEP 1: INPUT CONTROLS FIRST (Premium high-fidelity grid panel) */}
      <div className="bento-grid-card border border-[#D0E1C1] bg-gradient-to-br from-white to-[#FAFCF9] p-8 rounded-[2.5rem] shadow-[0_10px_35px_-10px_rgba(45,106,79,0.08)] space-y-7" id="emissions-input-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E1EAD8] gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black font-mono text-[#2D6A4F] uppercase tracking-widest bg-[#E8F5E9] px-2.5 py-1 rounded-full inline-block">
              ⚡ STEP 1 OF 2
            </span>
            <h3 className="text-2xl font-black font-display text-[#1B4332] tracking-tight">Enter Your Activities & Choices For Today</h3>
            <p className="text-xs text-[#40916C] font-semibold tracking-wide">Tweak resources consumed, transport, and recycling habits below to trace immediate footprint changes.</p>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D8F3DC] border border-[#B7E4C7] rounded-xl self-start sm:self-auto shadow-sm">
            <Calendar className="w-4 h-4 text-[#2D6A4F]" />
            <span className="text-xs font-mono font-black text-[#1B4332] tracking-wider uppercase">Today's Entry</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Commuting Distance */}
          <div className="p-4 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]/60 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#1B4332]">
              <span className="flex items-center gap-1.5">🚘 Commuting Distance</span>
              <span className="font-mono text-[#1B4332] bg-[#D8F3DC] px-2.5 py-0.5 rounded-lg text-xs font-bold">
                {commuteKm} km
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={commuteKm}
              onChange={(e) => setCommuteKm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#D8E2D1] rounded-lg appearance-none cursor-pointer accent-[#2D6A4F] my-2"
            />
            <div className="relative h-5">
              <span className="absolute left-0 text-[11px] text-[#40916C] font-mono font-semibold">
                0 (WFH/Bike)
              </span>
              <span className="absolute left-[50%] -translate-x-[50%] text-[11px] text-[#40916C] font-mono font-semibold whitespace-nowrap">
                40 km
              </span>
              <span className="absolute right-0 text-[11px] text-[#40916C] font-mono font-semibold">
                80 km
              </span>
            </div>
          </div>

          {/* Slider 2: Meat & Dairy meals */}
          <div className="p-4 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]/60 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#1B4332]">
              <span className="flex items-center gap-1.5">🥩 Red Meat/Dairy Meals</span>
              <span className="font-mono text-[#1B4332] bg-[#D8F3DC] px-2.5 py-0.5 rounded-lg text-xs font-bold">
                {meatMeals} meals
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={meatMeals}
              onChange={(e) => setMeatMeals(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#D8E2D1] rounded-lg appearance-none cursor-pointer accent-[#2D6A4F] my-2"
            />
            <div className="relative h-5">
              <span className="absolute left-0 text-[11px] text-[#40916C] font-mono font-semibold">
                0 (Plant-based)
              </span>
              <span className="absolute left-[33.33%] -translate-x-[50%] text-[11px] text-[#40916C] font-mono font-semibold whitespace-nowrap">
                1 meal
              </span>
              <span className="absolute left-[66.66%] -translate-x-[50%] text-[11px] text-[#40916C] font-mono font-semibold whitespace-nowrap">
                2 meals
              </span>
              <span className="absolute right-0 text-[11px] text-[#40916C] font-mono font-semibold">
                3+ meals
              </span>
            </div>
          </div>

          {/* Slider 3: Electricity use */}
          <div className="p-4 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]/60 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#1B4332]">
              <span className="flex items-center gap-1.5">🔌 Domestic Energy Usage</span>
              <span className="font-mono text-[#1B4332] bg-[#D8F3DC] px-2.5 py-0.5 rounded-lg text-xs font-bold">
                Level {energyRating}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={energyRating}
              onChange={(e) => setEnergyRating(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#D8E2D1] rounded-lg appearance-none cursor-pointer accent-[#2D6A4F] my-2"
            />
            <div className="relative h-5">
              <span className="absolute left-0 text-[11px] text-[#40916C] font-mono font-semibold font-medium">
                0 (Zero power)
              </span>
              <span className="absolute left-[50%] -translate-x-[50%] text-[11px] text-[#40916C] font-mono font-semibold whitespace-nowrap">
                5 (Standard)
              </span>
              <span className="absolute right-0 text-[11px] text-[#40916C] font-mono font-semibold font-medium">
                10 (Heavy AC)
              </span>
            </div>
          </div>

          {/* Toggle Recycled status */}
          <div className="p-4 bg-[#F2F5F0] rounded-2xl border border-[#E1EAD8]/60 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[70%]">
              <span className="text-xs font-bold text-[#1B4332] block">Separated Recycling Actions</span>
              <span className="text-xs text-[#40916C] font-semibold leading-relaxed block">Subtracts 1.5kg of daily landfill emissions waste</span>
            </div>
            <button
              id="btn-toggle-recycled"
              onClick={() => setRecycled(!recycled)}
              className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                recycled ? 'bg-[#2D6A4F]' : 'bg-slate-350'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  recycled ? 'translate-x-[22px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Button: Submission */}
        <div className="pt-2 flex justify-center">
          <button
            id="btn-submit-carbon-log"
            onClick={handleLogAction}
            className={`w-full max-w-md py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] ${
              savedSuccess 
                ? 'bg-[#2D6A4F] text-white' 
                : 'bg-[#74C69D] text-[#1B4332] hover:bg-[#1B4332] hover:text-white'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5 animate-bounce" /> Saved Log & Synced Milestones!
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" /> Save Activities & Log Today's Footprint
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP 2: CALCULATED CLIMATE IMPACT & PERFORMANCE (Shown beautifully below inputs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="emissions-impact-section">
        
        {/* Left Column: Visual Carbon Pulse Gauge & Threshold Gauge (Taking 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bento-grid-card border border-[#E1EAD8] bg-white p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[440px]">
            {/* Bento grid elegant background circles */}
            <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-[#D8F3DC] opacity-40 pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-[#E1EAD8] opacity-35 pointer-events-none" />

            <div className="relative text-center z-10 space-y-1.5">
              <span className="text-xs font-black font-mono text-[#2D6A4F] uppercase tracking-widest block mb-0.5">
                STEP 2 OF 2
              </span>
              <h3 className="text-xl font-black font-display text-[#1B4332]">The Carbon Pulse Representation</h3>
              <p className="text-xs text-[#40916C] max-w-sm mx-auto leading-relaxed">
                A responsive biological orb that dynamically resizes and glows based on your activities above.
              </p>
            </div>

            {/* Glowing Orb container */}
            <div className="my-8 relative flex items-center justify-center h-52 w-52 z-10">
              <motion.div
                style={{ scale: baseSizeFactor }}
                transition={{ type: 'spring', stiffness: 85, damping: 15 }}
                className={`h-38 w-38 rounded-full bg-gradient-to-tr ${orbColor} opacity-95 flex flex-col items-center justify-center text-white ${pulseClass} relative shadow-xl`}
              >
                <div className="absolute inset-1.5 rounded-full border border-white/20" />
                <div className="text-center p-4">
                  <span className="block text-xs font-mono tracking-widest uppercase text-white/90">Footprint</span>
                  <span className="block text-5xl font-black font-display leading-none my-1 tracking-tight">
                    {currentCo2}
                  </span>
                  <span className="block text-xs font-mono lowercase text-white/90 font-bold">kg CO2e</span>
                </div>
              </motion.div>
            </div>

            {/* Micro Feedback Badge */}
            <div className="z-10 text-center w-full max-w-md px-2">
              <div className={`p-4 rounded-2xl border text-xs font-extrabold leading-relaxed font-sans ${feedbackBadge}`}>
                {feedbackText}
              </div>
            </div>
          </div>

          {/* Sustainable comparison gauge card */}
          <div className="bento-grid-card border border-[#E1EAD8] bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black font-display text-[#1B4332] uppercase tracking-wider">Sustainable Budget Progress Bar</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#D8F3DC] text-[#1B4332] rounded-lg">Budget Limit</span>
            </div>

            <div className="space-y-2">
              <div className="relative h-3 bg-[#F2F5F0] rounded-full overflow-hidden border border-[#E1EAD8]">
                {/* Sustainable zone (0 to 6 kg) */}
                <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-[#74C69D]/20 border-r border-dashed border-[#52B788]" />
                {/* Global Avg flag mark */}
                <div className="absolute left-[60%] top-0 bottom-0 w-[1.5px] bg-amber-500 z-10" />
                
                {/* User actual value pointer indicator */}
                <div 
                  className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ${
                    currentCo2 < 6 ? 'bg-[#2D6A4F]' : currentCo2 < 12 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentCo2 / 20.0) * 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-[#40916C] font-mono pt-1">
                <span className="text-[#2D6A4F] font-black flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> Eco Target: 6.0kg
                </span>
                <span className="text-amber-800 font-bold">Global Avg: 12.0kg</span>
                <span className="text-slate-500">Western Peak: 18.5kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Everyday Equivalents translation list (Taking 5 columns) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bento-grid-card border border-[#B7E4C7] bg-[#F2FBF5] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#B7E4C7]">
                <Zap className="w-5 h-5 text-[#2D6A4F]" />
                <h3 className="text-sm font-black font-display text-[#1B4332] uppercase tracking-wider">Resource Equivalents</h3>
              </div>

              <p className="text-xs text-[#2D6A4F] font-semibold leading-relaxed">
                Your current daily emissions footprint translates to this equivalent physical waste or depletion. Lower your scores to offset these values:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {equivalents.map((eq, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-[#B7E4C7]/80 space-y-2 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#40916C] uppercase tracking-wider block font-sans">
                        {eq.label}
                      </span>
                      <div className="text-[#2D6A4F]">
                        {renderEquivalentIcon(eq.icon)}
                      </div>
                    </div>
                    <span className="text-2xl font-mono font-black text-[#1B4332] block leading-none">
                      {eq.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white/60 border border-[#B7E4C7] rounded-xl text-[11px] text-[#2D6A4F] font-medium leading-normal mt-3">
              🌲 Logging daily choices feeds into TRACE global reduction challenges. Complete items in the <strong className="text-[#1B4332]">Action Cards</strong> tab!
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: MILESTONES & ACHIEVEMENTS LAYOUT (Beautiful Fixed Grid, Large and Legible!) */}
      <div className="bento-grid-card border border-[#E1EAD8] bg-white p-7 rounded-[2rem] shadow-sm space-y-5" id="achievements-section-dashboard">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1EAD8]">
          <Award className="w-6 h-6 text-[#2D6A4F]" />
          <div>
            <h3 className="text-lg font-black font-display text-[#1B4332]">TRACE Achievements & Milestones</h3>
            <p className="text-xs text-[#40916C] font-semibold">Track your permanent badges earned during daily sandbox logging and live challenges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((item) => {
            return (
              <div 
                key={item.id}
                id={`dashboard-badge-${item.id}`}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 hover:shadow-md ${
                  item.unlocked 
                    ? 'bg-[#D8F3DC] border-[#B7E4C7]^ shadow-inner scale-[1.01]' 
                    : 'bg-[#F9FAF8] border-[#E1EAD8]/60 opacity-70'
                }`}
              >
                {/* Badge Star indicator icon styled perfectly */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border text-xl shadow-sm transition-all ${
                  item.unlocked 
                    ? 'bg-white border-[#95D5B2] text-amber-500 scale-105' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {item.unlocked ? '🏆' : '🔒'}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-sm font-black truncate block ${item.unlocked ? 'text-[#1B4332]' : 'text-slate-600'}`}>
                      {item.title}
                    </span>
                    {item.unlocked && (
                      <span className="bg-[#2D6A4F] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md shrink-0">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#40916C] leading-snug font-semibold">
                    {item.requirementDesc}
                  </p>
                  {item.unlocked && item.unlockedAt && (
                    <span className="text-[10px] font-mono font-bold text-white bg-[#1B4332] px-2 py-0.5 rounded-lg inline-block">
                      Achieved: {item.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 4: INTEGRATED SANDBOX CONTROLS PANEL (Centered at target bottom) */}
      <div className="bento-grid-card border border-[#E1EAD8] bg-white p-6 rounded-[2rem] shadow-sm max-w-3xl mx-auto text-center space-y-4" id="sandbox-card">
        {confirmAction === null ? (
          <>
            <div className="pb-2 border-b border-[#E1EAD8]">
              <span className="text-sm font-black font-display text-[#1B4332] block uppercase tracking-wider">
                🛠️ Sandbox Control Panel
              </span>
              <p className="text-xs text-[#40916C] font-semibold leading-relaxed mt-1">
                Need to restart or adjust logs? Manage transient state log configurations below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              <button
                id="btn-reset-logs"
                onClick={() => setConfirmAction('reset_logs')}
                className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-black shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear / Reset Carbon Logs
              </button>

              <button
                id="btn-re-onboard"
                onClick={() => setConfirmAction('reset_profile')}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D8E2D1] text-[#40916C] hover:text-[#1B4332] hover:bg-[#F2F5F0] text-xs font-bold focus:outline-none transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Discard Entire Profile
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in space-y-3 p-2 max-w-xl mx-auto">
            <div className="pb-2 border-b border-rose-100">
              <span className="text-sm font-black font-display text-rose-800 block uppercase tracking-wider">
                ⚠️ Confirm Action
              </span>
              <p className="text-xs text-rose-700 font-semibold leading-relaxed mt-1">
                {confirmAction === 'reset_logs' 
                  ? "Are you sure you want to clear your local carbon tracking history? Keep onboarding preferences, start fresh log!"
                  : "Are you sure? This completely wipes profile data and launches back to onboarding setup."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1 max-w-md mx-auto">
              <button
                onClick={confirmAction === 'reset_logs' ? handleResetLogsOnly : handleResetApplicationState}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all duration-300 cursor-pointer"
              >
                Yes, Confirm Reset
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Cancel / Keep Data
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
