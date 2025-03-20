<script setup lang="ts">
import { useFloodStore } from '@/stores/floodStore';
import { computed } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import { floodRules } from '@/types/flood';

// Import images directly
import waterHigh from '@/assets/flood/water-high.png';
import waterModerate from '@/assets/flood/water-moderate.png';
import tempHigh from '@/assets/flood/temp-high.png';
import tempModerate from '@/assets/flood/temp-moderate.png';
import snowHigh from '@/assets/flood/snow-high.png';
import snowModerate from '@/assets/flood/snp-moderate.png';
import rainHeavy from '@/assets/flood/rain-heavy.png';
import rainModerate from '@/assets/flood/rain-moderate.png';

const store = useFloodStore();
const factors = computed(() => store.factors);
const riskLevel = computed(() => store.riskLevel);

// Analysis section
const waterLevelLabel = computed(() => {
  if (factors.value.waterLevel === 'high') return 'Високий';
  if (factors.value.waterLevel === 'moderate') return 'Помірний';
  return 'Не вказано';
});

const temperatureLabel = computed(() => {
  if (factors.value.temperature === 'high') return 'Висока';
  if (factors.value.temperature === 'medium') return 'Середня';
  return 'Не вказано';
});

const snowLabel = computed(() => {
  if (factors.value.snow === 'large') return 'Багато';
  if (factors.value.snow === 'small') return 'Мало';
  return 'Не вказано';
});

const rainLabel = computed(() => {
  if (factors.value.rain === 'heavy') return 'Сильний';
  if (factors.value.rain === 'moderate') return 'Помірний';
  if (factors.value.rain === 'none') return 'Немає';
  return 'Не вказано';
});

// Rule conclusion text
const ruleDescription = computed(() => {
  switch (riskLevel.value) {
    case 'evacuate':
      return 'Евакуювати місто';
    case 'heightened':
      return 'Посилити увагу';
    default:
      return 'Не турбуватись';
  }
});

// Get active rule ID
const activeRuleId = computed(() => {
  // Check each rule against current factors
  for (let i = 0; i < floodRules.length; i++) {
    const rule = floodRules[i];
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
    
    // If all match, return the rule
    if (match) {
      return rule.id;
    }
  }
  
  return null;
});

// Rule text color
const ruleColor = computed(() => {
  switch (riskLevel.value) {
    case 'evacuate':
      return 'text-red-600';
    case 'heightened':
      return 'text-yellow-600';
    default:
      return 'text-green-600';
  }
});

const getBgColor = (factor: string, value: string | null) => {
  if (!value) return 'bg-gray-200';
  
  // Highlight critical factors based on risk level
  if (riskLevel.value === 'evacuate') {
    if (
      (factor === 'waterLevel' && value === 'high') ||
      (factor === 'rain' && value === 'heavy') ||
      (factor === 'snow' && value === 'large' && factors.value.temperature === 'high')
    ) {
      return 'bg-red-200';
    }
  } else if (riskLevel.value === 'heightened') {
    if (
      (factor === 'waterLevel' && value === 'high' && factors.value.temperature === 'medium') ||
      (factor === 'waterLevel' && value === 'moderate' && factors.value.temperature === 'high')
    ) {
      return 'bg-yellow-200';
    }
  }
  
  return 'bg-gray-100';
};

// Alert section
const alertTitle = computed(() => {
  if (riskLevel.value === 'evacuate') return 'ЕКСТРЕНА ЕВАКУАЦІЯ!';
  if (riskLevel.value === 'heightened') return 'ПІДВИЩЕНА ГОТОВНІСТЬ';
  return 'СИТУАЦІЯ В НОРМІ';
});

const alertMessage = computed(() => {
  if (riskLevel.value === 'evacuate') {
    return 'Існує високий ризик повені. Необхідно негайно евакуювати місто. Дотримуйтесь інструкцій рятувальних служб.';
  }
  if (riskLevel.value === 'heightened') {
    return 'Існує підвищена вірогідність повені. Посилюємо спостереження. Підготуйтесь до можливої евакуації.';
  }
  return 'Ризику повені немає. Продовжуйте звичайну діяльність.';
});

const alertColor = computed(() => {
  if (riskLevel.value === 'evacuate') return 'bg-red-600';
  if (riskLevel.value === 'heightened') return 'bg-yellow-500';
  return 'bg-green-500';
});
</script>

<template>
  <div class="p-2 bg-white rounded-lg shadow-md">

    <div class="flex flex-col items-center gap-4">
      <h2 class="text-xl font-bold text-center">Аналіз даних</h2>
      <div class="flex items-center">
        <span class="font-medium mr-2">Активне правило:</span>
        <span :class="['px-2 py-1 rounded font-bold', ruleColor]">
          {{ activeRuleId !== null ? `#${activeRuleId}` : 'Немає' }}
        </span>
      </div>

      <!-- Data Visualization with Images -->
      <div class="space-y-4">
        <!-- Images for factors -->
        <div class="flex flex-col items-center mb-4">
          <div class="grid grid-cols-2 gap-4 md:gap-8 md:grid-cols-4 mb-4">
            <!-- Water Level Image -->
            <div class="flex flex-col items-center p-4 border rounded-lg"
              :class="getBgColor('waterLevel', factors.waterLevel)">
              <div class="font-medium mb-2">Рівень води</div>
              <img v-if="factors.waterLevel === 'high'" :src="waterHigh" alt="High Water Level" 
                class="w-24 h-24 object-contain rounded-lg" />
              <img v-else-if="factors.waterLevel === 'moderate'" :src="waterModerate" alt="Moderate Water Level" 
                class="w-24 h-24 object-contain rounded-lg" />
              <div v-else class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                <span class="text-gray-500">Немає</span>
              </div>
              <div class="mt-2">{{ waterLevelLabel }}</div>
            </div>

            <!-- Temperature Image -->
            <div class="flex flex-col items-center p-4 border rounded-lg"
              :class="getBgColor('temperature', factors.temperature)">
              <div class="font-medium mb-2">Температура</div>
              <img v-if="factors.temperature === 'high'" :src="tempHigh" alt="High Temperature" 
                class="w-24 h-24 object-contain rounded-lg" />
              <img v-else-if="factors.temperature === 'medium'" :src="tempModerate" alt="Medium Temperature" 
                class="w-24 h-24 object-contain rounded-lg" />
              <div v-else class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                <span class="text-gray-500">Немає</span>
              </div>
              <div class="mt-2">{{ temperatureLabel }}</div>
            </div>

            <!-- Snow Image -->
            <div class="flex flex-col items-center p-4 border rounded-lg" :class="getBgColor('snow', factors.snow)">
              <div class="font-medium mb-2">Сніг в горах</div>
              <img v-if="factors.snow === 'large'" :src="snowHigh" alt="Large Snow" 
                class="w-24 h-24 object-contain rounded-lg" />
              <img v-else-if="factors.snow === 'small'" :src="snowModerate" alt="Small Snow" 
                class="w-24 h-24 object-contain rounded-lg" />
              <div v-else class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                <span class="text-gray-500">Немає</span>
              </div>
              <div class="mt-2">{{ snowLabel }}</div>
            </div>

            <!-- Rain Image -->
            <div class="flex flex-col items-center p-4 border rounded-lg" :class="getBgColor('rain', factors.rain)">
              <div class="font-medium mb-2">Дощ</div>
              <img v-if="factors.rain === 'heavy'" :src="rainHeavy" alt="Heavy Rain" 
                class="w-24 h-24 object-contain rounded-lg" />
              <img v-else-if="factors.rain === 'moderate'" :src="rainModerate" alt="Moderate Rain" 
                class="w-24 h-24 object-contain rounded-lg" />
              <div v-else class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                <span class="text-gray-500">Немає</span>
              </div>
              <div class="mt-2">{{ rainLabel }}</div>
            </div>
          </div>

          <!-- Conclusion Display -->
          <div class="w-full mt-4 p-4 border-t pt-6">
            <div class="text-center font-bold text-lg mb-2">Висновок:</div>
            <div class="text-center text-xl font-bold" :class="ruleColor">
              {{ ruleDescription }}
            </div>
          </div>

          <!-- Alert section - bottom -->
          <div :class="['p-4 rounded-lg text-white w-full mt-4', alertColor]">
            <div class="flex items-center">
              <AlertCircle class="mr-2" :size="24" />
              <h3 class="font-bold text-lg">{{ alertTitle }}</h3>
            </div>
            <p>{{ alertMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>