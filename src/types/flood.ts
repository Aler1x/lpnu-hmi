export type WaterLevel = 'high' | 'moderate' | null;
export type Temperature = 'high' | 'medium' | null;
export type Snow = 'large' | 'small' | null;
export type Rain = 'heavy' | 'moderate' | 'none' | null;

export type RiskLevel = 'evacuate' | 'heightened' | 'none' | null;

export interface FloodFactors {
  waterLevel: WaterLevel;
  temperature: Temperature;
  snow: Snow;
  rain: Rain;
}

export interface Rule {
  id: number;
  waterLevel: WaterLevel;
  temperature: Temperature;
  snow: Snow;
  rain: Rain;
  conclusion: RiskLevel;
}

export const floodRules: Rule[] = [
  // Rule 1: High water + Heavy rain = Evacuate
  { 
    id: 1, 
    waterLevel: 'high', 
    temperature: null, 
    snow: null, 
    rain: 'heavy', 
    conclusion: 'evacuate', 
  },
  
  // Rule 2: High water + High temp + Large snow + Moderate rain = Evacuate
  { 
    id: 2, 
    waterLevel: 'high', 
    temperature: 'high', 
    snow: 'large', 
    rain: 'moderate', 
    conclusion: 'evacuate' 
  },
  
  // Rule 3: High water + Medium temp + Large snow + Moderate rain = Heightened attention
  { 
    id: 3, 
    waterLevel: 'high', 
    temperature: 'medium', 
    snow: 'large', 
    rain: 'moderate', 
    conclusion: 'heightened' 
  },
  
  // Rule 4: High water + Medium temp + Large snow + None rain = None
  { 
    id: 4, 
    waterLevel: 'high', 
    temperature: 'medium', 
    snow: 'large', 
    rain: 'none', 
    conclusion: 'none' 
  },
  
  // Rule 5: High water + High temp + Small rain + None rain = None
  { 
    id: 5, 
    waterLevel: 'high', 
    temperature: 'high', 
    snow: 'small', 
    rain: 'none', 
    conclusion: 'none' 
  },
  
  // Rule 6: Moderate water + High temp + Large snow + Heavy rain = Heightened attention
  { 
    id: 6, 
    waterLevel: 'moderate', 
    temperature: 'high', 
    snow: 'large', 
    rain: 'heavy', 
    conclusion: 'heightened' 
  },
  
  // Rule 7: Moderate water + Medium temp + Large snow + Heavy rain = None
  { 
    id: 7, 
    waterLevel: 'moderate', 
    temperature: 'medium', 
    snow: 'large', 
    rain: 'heavy', 
    conclusion: 'none' 
  },
  
  // Rule 8: Moderate water + Small snow + Heavy rain = None
  { 
    id: 8, 
    waterLevel: 'moderate', 
    temperature: null, 
    snow: 'small', 
    rain: 'heavy', 
    conclusion: 'none' 
  },
  
  // Rule 9: High water + None rain = None
  { 
    id: 9, 
    waterLevel: 'high', 
    temperature: null, 
    snow: null, 
    rain: 'moderate', 
    conclusion: 'none' 
  }
]; 