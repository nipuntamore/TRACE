import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizProfile } from '../types';
import { Leaf, Navigation, Utensils, Zap, Plane, Trash2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import TraceLogo from './TraceLogo';

interface QuizProps {
  onComplete: (profile: QuizProfile) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizProfile>>({
    commuteMode: 'alone',
    dietType: 'balanced',
    homeEnergy: 'grid',
    flyFrequency: 'occasional',
    wasteHabit: 'basic'
  });

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete(answers as QuizProfile);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSelect = (key: keyof QuizProfile, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Modern stepped questionnaire content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            id="quiz-step-1"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl">
                <Navigation className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Your Commute Profile</h3>
                <p className="text-xs text-[#40916C] font-semibold font-sans">How do you normally commute to work, study, or social events?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'alone', title: 'Drive Alone', desc: 'Standard single-occupant gasoline vehicle commute', factor: 'High CO2' },
                { id: 'carpool', title: 'Carpool / EV', desc: 'Sharing rides with family/colleagues or driving electric', factor: 'Medium CO2' },
                { id: 'transit', title: 'Public Transit', desc: 'Buses, passenger subways, light rails, or local trains', factor: 'Low CO2' },
                { id: 'active', title: 'Bike / Walk', desc: 'Using pure active muscle power, skateboards, or standard bikes', factor: 'Zero CO2' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-commute-${opt.id}`}
                  onClick={() => handleSelect('commuteMode', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    answers.commuteMode === opt.id
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-1 ring-[#2D6A4F]/25'
                      : 'border-[#E1EAD8] hover:border-[#B7E4C7] bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-[#1B4332] text-sm">{opt.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      opt.id === 'alone' ? 'bg-rose-50 text-rose-700' :
                      opt.id === 'carpool' ? 'bg-amber-50 text-amber-700' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {opt.factor}
                    </span>
                  </div>
                  <p className="text-xs text-[#40916C] font-semibold leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            id="quiz-step-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl">
                <Utensils className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Dietary Preferences</h3>
                <p className="text-xs text-[#40916C] font-semibold font-sans">Which option best describes your standard food and meal habits?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'heavy_meat', title: 'Meat Lovers', desc: 'Red meat or dairy integrated into almost every daily meal', factor: 'Highest CO2' },
                { id: 'balanced', title: 'Balanced Omnivore', desc: 'Mixed diet including occasional poultry, fish, and red meat', factor: 'Standard' },
                { id: 'poultry_fish', title: 'Pescatarian / Poultry', desc: 'No red meat. Diet centers around white meat, fish, and greens', factor: 'Lighter CO2' },
                { id: 'veg_vegan', title: 'Vegetarian / Vegan', desc: 'Purely plant-focused ingredients with absolutely zero animal meat', factor: 'Lowest CO2' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-diet-${opt.id}`}
                  onClick={() => handleSelect('dietType', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    answers.dietType === opt.id
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-1 ring-[#2D6A4F]/25'
                      : 'border-[#E1EAD8] hover:border-[#B7E4C7] bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-[#1B4332] text-sm">{opt.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      opt.id === 'heavy_meat' ? 'bg-rose-50 text-rose-700' :
                      opt.id === 'balanced' ? 'bg-amber-50 text-amber-700' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {opt.factor}
                    </span>
                  </div>
                  <p className="text-xs text-[#40916C] font-semibold leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            id="quiz-step-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl">
                <Zap className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Home Energy Source</h3>
                <p className="text-xs text-[#40916C] font-semibold font-sans">How is electrical energy and heating supplied for your residence?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'grid', title: 'Standard Grid', desc: 'Electricity from default regional utility mix (mostly coal or natural gas)', factor: 'Fossil Dominated' },
                { id: 'partial', title: 'Partial Clean', desc: 'Partially powered by heat pumps, local wind credits, or green contract', factor: 'Mixed Source' },
                { id: 'solar', title: 'Renewable / Solar', desc: 'Active home rooftop solar panels, local Tesla Wall, or 100% clean supplier', factor: '100% Sustainable' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-energy-${opt.id}`}
                  onClick={() => handleSelect('homeEnergy', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 flexible flex flex-col justify-between h-full cursor-pointer ${
                    answers.homeEnergy === opt.id
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-1 ring-[#2D6A4F]/25'
                      : 'border-[#E1EAD8] hover:border-[#B7E4C7] bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-[#1B4332] block text-sm">{opt.title}</span>
                    </div>
                    <p className="text-xs text-[#40916C] leading-relaxed font-semibold">{opt.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#E1EAD8] flex justify-end">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      opt.id === 'grid' ? 'bg-rose-50 text-rose-700' :
                      opt.id === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {opt.factor}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            id="quiz-step-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl">
                <Plane className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Aviation Habits</h3>
                <p className="text-xs text-[#40916C] font-semibold font-sans">How many times do you travel via commercial planes of any length in an average year?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'frequent', title: 'Frequent Flyer', desc: 'Take 5+ domestic or long-range international flights annually (high impact)', factor: 'Heavy Factor' },
                { id: 'occasional', title: 'Occasional Excursions', desc: 'Around 2 to 4 leisure, business, or family flights per year', factor: 'Moderate' },
                { id: 'rare', title: 'Rarely Fly', desc: 'At most 1 flight per year for critical travel only', factor: 'Minimal' },
                { id: 'never', title: 'Keep to Ground', desc: 'Fly zero times. Prefer trains, local drives, or eco coach commutes', factor: 'Excellent' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-fly-${opt.id}`}
                  onClick={() => handleSelect('flyFrequency', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    answers.flyFrequency === opt.id
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-1 ring-[#2D6A4F]/25'
                      : 'border-[#E1EAD8] hover:border-[#B7E4C7] bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-[#1B4332] text-sm">{opt.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      opt.id === 'frequent' ? 'bg-rose-50 text-rose-700' :
                      opt.id === 'occasional' ? 'bg-amber-50 text-amber-700' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {opt.factor}
                    </span>
                  </div>
                  <p className="text-xs text-[#40916C] font-semibold leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            id="quiz-step-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl">
                <Trash2 className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-[#1B4332]">Recycling & Composting</h3>
                <p className="text-xs text-[#40916C] font-semibold font-sans">What are your typical habits regarding rubbish division and composting?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'none', title: 'None / Minimal', desc: 'Place all items directly into municipal landfill refuse, zero cataloging', factor: 'Standard Landfill' },
                { id: 'basic', title: 'Basic Sorting', desc: 'Separate cardboard boxes, plastics, glass jars, and standard daily papers', factor: 'Standard Recycling' },
                { id: 'active', title: 'Dedicated Eco Sort', desc: 'Comprehensive plastic, metal sort, paired with active organic composting', factor: 'Zero-Waste Aim' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-waste-${opt.id}`}
                  onClick={() => handleSelect('wasteHabit', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 flexible flex flex-col justify-between h-full cursor-pointer ${
                    answers.wasteHabit === opt.id
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-1 ring-[#2D6A4F]/25'
                      : 'border-[#E1EAD8] hover:border-[#B7E4C7] bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="font-extrabold text-[#1B4332] block text-sm">{opt.title}</span>
                    <p className="text-xs text-[#40916C] leading-relaxed font-semibold">{opt.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#E1EAD8] flex justify-end">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      opt.id === 'none' ? 'bg-rose-50 text-rose-700' :
                      opt.id === 'basic' ? 'bg-amber-50 text-amber-700' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {opt.factor}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4" id="onboarding-quiz">
      <div className="flex flex-col items-center text-center mb-10">
        <TraceLogo size="lg" className="mb-6" />
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#D8F3DC] text-[#1B4332] text-xs font-black rounded-full mb-3 tracking-wide uppercase">
          <Leaf className="w-3 h-3 text-[#2D6A4F] fill-[#D8F3DC]" /> TRACE Eco-Onboarding
        </div>
        <h2 className="text-3xl font-black font-display text-[#1B4332] leading-tight">
          Initialize Your Carbon Profile
        </h2>
        <p className="text-[#40916C] mt-2 text-xs font-semibold max-w-sm mx-auto">
          Take a quick 1-minute diagnostic to calibrate TRACE. We'll set a personalized footprint goal based on your lifestyle context.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#E1EAD8] shadow-sm overflow-hidden p-6 md:p-8 space-y-8">
        {/* Step Indicator Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono font-bold text-[#40916C] mb-2">
            <span>DIAGNOSTIC {step} OF 5</span>
            <span className="text-[#2D6A4F]">{Math.round((step / 5) * 100)}% COMPLETED</span>
          </div>
          <div className="w-full h-1.5 bg-[#F2F5F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Panel */}
        <div className="min-h-[260px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <div className="flex justify-between items-center pt-6 border-t border-[#E1EAD8]">
          <button
            id="btn-quiz-prev"
            disabled={step === 1}
            onClick={prevStep}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              step === 1
                ? 'opacity-30 text-slate-400 cursor-not-allowed'
                : 'text-[#40916C] hover:bg-[#F2F5F0] hover:text-[#1B4332]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            id="btn-quiz-next"
            onClick={nextStep}
            className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {step === 5 ? (
              <>
                <Sparkles className="w-4 h-4 text-white" /> Calibrate TRACE
              </>
            ) : (
              <>
                Next Profile <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
