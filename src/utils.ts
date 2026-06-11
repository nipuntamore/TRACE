import { Challenge, Achievement, LeaderboardUser, CommunityEvent, QuizProfile, CarbonLog } from './types';

// Carbon footprint calculation constants (kg CO2)
export const CO2_FACTORS = {
  transport: {
    alone: 0.25,  // kg per km
    carpool: 0.12,
    transit: 0.06,
    active: 0.00,
  },
  diet: {
    heavy_meat: 3.5, // kg per meal
    balanced: 1.8,
    poultry_fish: 1.4,
    veg_vegan: 0.5,
  },
  energy: {
    grid: 0.8, // kg per index unit (0-10 scale)
    partial: 0.4,
    solar: 0.05,
  },
  waste: {
    recyclingBenefit: -1.5, // kg saved by active waste management/composting
  }
};

export const GLOBAL_AVERAGES = {
  developedCountryDaily: 18.5, // kg CO2
  globalAverageDaily: 12.0,    // kg CO2
  sustainableTargetDaily: 6.0,  // kg CO2 (Target to limit warming to 1.5C)
};

// Compute daily emissions in kg CO2
export function calculateDailyCO2(
  commuteKm: number,
  meatMeals: number,
  energyRating: number, // 0 - 10 slider
  recycled: boolean,
  profile: QuizProfile
): number {
  const transFactor = CO2_FACTORS.transport[profile.commuteMode];
  const dietFactor = CO2_FACTORS.diet[profile.dietType];
  const energyFactor = CO2_FACTORS.energy[profile.homeEnergy];

  const transportCo2 = commuteKm * transFactor;
  const dietCo2 = meatMeals * dietFactor + (3 - meatMeals) * 0.5; // remaining meals of the day are light
  const energyCo2 = energyRating * energyFactor;
  const wasteSaving = recycled ? CO2_FACTORS.waste.recyclingBenefit : 0;

  const total = transportCo2 + dietCo2 + energyCo2 + wasteSaving;
  return Math.max(0.2, parseFloat(total.toFixed(2)));
}

// Convert abstract kg CO2 saved into highly relatable equivalent metrics ("Impact Modeling")
export function getRelatableEquivalents(kgCo2: number) {
  return [
    {
      label: "Smartphones Charged",
      value: Math.round(kgCo2 * 122), // ~122 charges per kg CO2
      icon: "smartphone",
      color: "text-blue-500",
    },
    {
      label: "Hours of Video Streaming",
      value: Math.round(kgCo2 * 10.5), // ~10.5 hrs per kg CO2
      icon: "play-circle",
      color: "text-rose-500",
    },
    {
      label: "Kilometers Driven in Average Car",
      value: parseFloat((kgCo2 * 4.0).toFixed(1)), // ~4.0 km of average driving
      icon: "car",
      color: "text-amber-500",
    },
    {
      label: "Seedling Growth Saved (Days)",
      value: Math.round(kgCo2 * 18), // ~18 days of young tree growth per kg CO2
      icon: "tree-pine",
      color: "text-emerald-500",
    },
  ];
}

// Initial stock challenges
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "meatless-monday",
    title: "Meatless Monday",
    description: "Eat purely vegan or vegetarian meals for the entire day to drastically slash agricultural emissions.",
    category: "food",
    effort: "low",
    impact: 4,
    co2Saved: 3.2,
    completed: false,
    active: false,
  },
  {
    id: "pedal-power",
    title: "Active Commute",
    description: "Replace a vehicular commute with walking, biking, or running today.",
    category: "transport",
    effort: "high",
    impact: 5,
    co2Saved: 4.8,
    completed: false,
    active: false,
  },
  {
    id: "plug-patrol",
    title: "Standby Phantom Check",
    description: "Unplug standby electronics, power strips, and unused chargers representing residual vampire load.",
    category: "energy",
    effort: "low",
    impact: 1,
    co2Saved: 0.8,
    completed: false,
    active: false,
  },
  {
    id: "cold-wash",
    title: "Eco Wash Cycle",
    description: "Wash your laundry clothes using cold water rather than hot water, saving heating appliance energy.",
    category: "energy",
    effort: "medium",
    impact: 3,
    co2Saved: 1.8,
    completed: false,
    active: false,
  },
  {
    id: "byo-bag",
    title: "Zero Single-Use Bags",
    description: "Bring your own reusable tote bags and say no to paper or plastic bags during grocery shopping.",
    category: "waste",
    effort: "low",
    impact: 2,
    co2Saved: 0.6,
    completed: false,
    active: false,
  },
  {
    id: "public-transit",
    title: "Transit Tuesday",
    description: "Leave the car keys behind and commute using local buses, light rails, or subways to cut commute footprint in half.",
    category: "transport",
    effort: "medium",
    impact: 4,
    co2Saved: 3.0,
    completed: false,
    active: false,
  },
  {
    id: "zero-waste-lunch",
    title: "Zero Waste Pack Lunch",
    description: "Prepare and pack a fully reusable lunch containers with compostable waste and zero disposable packaging.",
    category: "waste",
    effort: "medium",
    impact: 3,
    co2Saved: 1.2,
    completed: false,
    active: false,
  },
  {
    id: "thermostat-tune",
    title: "Appliance Offset",
    description: "Adjust your heater code down or AC up by 2°C for the day to minimize cooling/heating cycles.",
    category: "energy",
    effort: "low",
    impact: 3,
    co2Saved: 2.1,
    completed: false,
    active: false,
  }
];

// Initial achievements
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "pioneer",
    title: "TRACE Eco Pioneer",
    description: "Set up your personalized lifestyle profile with the carbon onboarding quiz.",
    category: "onboarding",
    icon: "user-check",
    unlocked: false,
    requirementDesc: "Complete onboarding quiz",
  },
  {
    id: "habit-builder",
    title: "Footprint Scout",
    description: "Log your daily activities and carbon footprint for the first time.",
    category: "log",
    icon: "calendar-days",
    unlocked: false,
    requirementDesc: "Log carbon for 1 day",
  },
  {
    id: "action-hero",
    title: "First Carbon Cut",
    description: "Successfully complete your first sustainability action card challenge.",
    category: "challenge",
    icon: "zap",
    unlocked: false,
    requirementDesc: "Complete any challenge",
  },
  {
    id: "earth-guardian",
    title: "Planet Custodian",
    description: "Unchain major carbon cuts and save more than 20kg of CO2 aggregated offset.",
    category: "overall",
    icon: "shield-alert", // will map to local Lucide Earth / Leaf indicator safely
    unlocked: false,
    requirementDesc: "Acquire 20kg of carbon offsets",
  },
  {
    id: "streak-champion",
    title: "Eco Guardian streak",
    description: "Consistently track or log carbon while keeping an active lifestyle daily streak.",
    category: "overall",
    icon: "flame",
    unlocked: false,
    requirementDesc: "Reach a 3-day active tracking streak",
  },
  {
    id: "social-allstar",
    title: "AI Climate Apprentice",
    description: "Consult the TRACE Gemini Eco-Coach for customized advice on optimizing your daily utilities.",
    category: "overall",
    icon: "sparkles",
    unlocked: false,
    requirementDesc: "Ask the Gemini Eco-Coach a question",
  },
  {
    id: "transit-trailblazer",
    title: "Transit Trailblazer",
    description: "Successfully complete both major transport category challenges to master zero-emission mobility.",
    category: "challenge",
    icon: "bus",
    unlocked: false,
    requirementDesc: "Complete 2 transport challenges",
  },
  {
    id: "vampire-slayer",
    title: "Vampire Slayer",
    description: "Eliminate standby loads and optimize appliance profiles to stop electric grid bleed.",
    category: "challenge",
    icon: "zap",
    unlocked: false,
    requirementDesc: "Complete 2 energy-saving challenges",
  },
  {
    id: "zero-waste-champion",
    title: "Zero-Waste Champion",
    description: "Ditch single-use carriers and use reusable meal packs to divert plastic from landfills.",
    category: "challenge",
    icon: "trash-2",
    unlocked: false,
    requirementDesc: "Complete 2 waste-reduction challenges",
  },
  {
    id: "green-gourmand",
    title: "Green Gourmand",
    description: "Ditch heavy greenhouse agricultural ingredients with a veggie or vegan culinary alternative.",
    category: "challenge",
    icon: "leaf",
    unlocked: false,
    requirementDesc: "Complete a food-reduction challenge",
  },
  {
    id: "triple-threat",
    title: "Triple Threat Eco Warrior",
    description: "Complete at least three separate action card challenges in the hub.",
    category: "challenge",
    icon: "award",
    unlocked: false,
    requirementDesc: "Complete 3 distinct action challenges",
  },
  {
    id: "decarbon-titan",
    title: "Decarbonization Titan",
    description: "Go above and beyond by complete five separate action card challenges in the hub.",
    category: "challenge",
    icon: "trophy",
    unlocked: false,
    requirementDesc: "Complete 5 distinct action challenges",
  }
];

// Seed initial leaderboard with friends
export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: "bud-1", name: "Elena Rostova", avatar: "👩‍🌾", level: 14, streak: 8, totalSavedCo2: 45.2 },
  { id: "bud-2", name: "David Chen", avatar: "👨‍💻", level: 11, streak: 4, totalSavedCo2: 32.5 },
  { id: "cur-user", name: "You (Eco-Explorer)", avatar: "🌲", level: 1, streak: 0, totalSavedCo2: 0, isCurrentUser: true },
  { id: "bud-3", name: "Marcus Miller", avatar: "🚴", level: 16, streak: 12, totalSavedCo2: 58.0 },
  { id: "bud-4", name: "Sofia Alvarez", avatar: "👩‍💼", level: 8, streak: 3, totalSavedCo2: 19.8 },
];

export const MOCK_FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Sophia", "Lucas", "Isabella", "Mia", "Leo", "Amelie",
  "Hans", "Yuki", "Chloe", "Mateo", "Zara", "Viktor", "Lars", "Aria"
];

export const MOCK_CHALLENGE_ACTIONS = [
  { action: "swapped to public transit", co2Saved: 3.0 },
  { action: "completed Meatless Monday", co2Saved: 3.2 },
  { action: "did an Eco Wash laundry cycle", co2Saved: 1.8 },
  { action: "unplugged parasite standby chargers", co2Saved: 0.8 },
  { action: "brought shopping bags to supermarket", co2Saved: 0.6 },
  { action: "biked to the office", co2Saved: 4.8 },
  { action: "adjusted the home smart thermostat", co2Saved: 2.1 },
  { action: "made a Zero-Waste packed lunch", co2Saved: 1.2 }
];

export function generateMockEvent(): CommunityEvent {
  const name = MOCK_FIRST_NAMES[Math.floor(Math.random() * MOCK_FIRST_NAMES.length)];
  const item = MOCK_CHALLENGE_ACTIONS[Math.floor(Math.random() * MOCK_CHALLENGE_ACTIONS.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    user: name,
    action: item.action,
    co2Saved: item.co2Saved,
    timeString: "Just now",
  };
}
