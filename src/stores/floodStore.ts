import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RiskLevel, Rule } from '@/types/flood';
import { floodRules } from '@/types/flood';

export const useFloodStore = defineStore('flood', () => {
  const factors = ref<Rule>({
    id: 0,
    waterLevel: null,
    temperature: null,
    snow: null,
    rain: null,
    conclusion: null
  });

  const autoMode = ref(false);
  const currentScenarioIndex = ref(0);
  const riskLevel = computed<RiskLevel>(() => {
    return factors.value.conclusion;
  });

  // Get all rules as scenarios
  const scenarios = floodRules;

  // Calculate risk level based on current factors
  const risk = computed<RiskLevel>(() => {
    // If any factor is not set, return 'none'
    if (!factors.value.waterLevel || !factors.value.temperature ||
      !factors.value.snow || !factors.value.rain) {
      return 'none';
    }

    // Check against each rule
    for (const rule of floodRules) {
      let match = true;

      // Check water level
      if (rule.waterLevel !== null && rule.waterLevel !== factors.value.waterLevel) {
        match = false;
      }

      // Check temperature
      if (rule.temperature !== null && rule.temperature !== factors.value.temperature) {
        match = false;
      }

      // Check snow
      if (rule.snow !== null && rule.snow !== factors.value.snow) {
        match = false;
      }

      // Check rain
      if (rule.rain !== null && rule.rain !== factors.value.rain) {
        match = false;
      }

      // If all factors match the rule, return the conclusion
      if (match) {
        return rule.conclusion;
      }
    }

    // Default return if no rule matches
    return 'none';
  });

  // Set a specific factor
  function setFactor<T extends keyof Rule>(factor: T, value: Rule[T]) {
    factors.value[factor] = value;
  }

  // Reset all factors
  function resetFactors() {
    factors.value = {
      id: 0,
      waterLevel: null,
      temperature: null,
      snow: null,
      rain: null,
      conclusion: null
    };
  }

  // Toggle auto mode
  function toggleAutoMode() {
    autoMode.value = !autoMode.value;
    if (autoMode.value) {
      // Start with the first scenario
      applyScenario(0);
      startAutoMode();
    }
  }

  // Apply current scenario
  function applyScenario(index: number) {
    const scenario = scenarios[index];
    factors.value.id = scenario.id;
    factors.value.waterLevel = scenario.waterLevel;
    factors.value.temperature = scenario.temperature;
    factors.value.snow = scenario.snow;
    factors.value.rain = scenario.rain;
    factors.value.conclusion = scenario.conclusion;
  }

  // Start auto mode cycling
  function startAutoMode() {
    if (!autoMode.value) return;

    // Cycle through frames
    const interval = setInterval(() => {
      if (!autoMode.value) {
        clearInterval(interval);
        return;
      }

      currentScenarioIndex.value = (currentScenarioIndex.value + 1) % scenarios.length;
      applyScenario(currentScenarioIndex.value);

    }, 2000); // 2 seconds between frames
  }

  return {
    factors,
    riskLevel,
    autoMode, 
    currentScenarioIndex,
    setFactor,
    resetFactors,
    toggleAutoMode,
    applyScenario,
    floodRules
  };
}); 