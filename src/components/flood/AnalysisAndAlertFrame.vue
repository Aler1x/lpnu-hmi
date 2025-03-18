<script setup lang="ts">
import { useFloodStore } from '@/stores/floodStore';
import { computed } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import { floodRules } from '@/types/flood';

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

const iconStyle = computed(() => {
  const baseAnimation = 'animate-pulse';
  if (riskLevel.value === 'evacuate') return `${baseAnimation} text-red-600 animate-duration-500`;
  if (riskLevel.value === 'heightened') return `${baseAnimation} text-yellow-500 animate-duration-1000`;
  return 'text-green-500';
});
</script>

<template>
  <div class="p-2 bg-white rounded-lg shadow-md h-full flex flex-col">
    <!-- Analysis section - top -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2 text-center">Аналіз даних</h2>
      
      <!-- Current rule information -->
      <div class="mb-3 p-2 border rounded-lg bg-gray-50">
        <div class="text-center">
          <span class="font-medium">Правило №</span>
          <span v-if="activeRuleId" class="font-bold text-lg">{{ activeRuleId }}</span>
          <span v-else class="text-gray-500">Немає відповідного правила</span>
        </div>
        
        <div class="text-center mt-1">
          <span class="font-medium">Висновок: </span>
          <span :class="['font-bold', ruleColor]">{{ ruleDescription }}</span>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-2">
          <div :class="['p-2 rounded', getBgColor('waterLevel', factors.waterLevel)]">
            <h3 class="font-medium">Рівень води</h3>
            <p>{{ waterLevelLabel }}</p>
          </div>
          
          <div :class="['p-2 rounded', getBgColor('temperature', factors.temperature)]">
            <h3 class="font-medium">Температура</h3>
            <p>{{ temperatureLabel }}</p>
          </div>
          
          <div :class="['p-2 rounded', getBgColor('snow', factors.snow)]">
            <h3 class="font-medium">Сніг в горах</h3>
            <p>{{ snowLabel }}</p>
          </div>
          
          <div :class="['p-2 rounded', getBgColor('rain', factors.rain)]">
            <h3 class="font-medium">Дощ</h3>
            <p>{{ rainLabel }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Alert section - bottom -->
    <div class="mt-auto">
      <h2 class="text-xl font-bold mb-2 text-center">Сповіщення</h2>
      
      <div :class="['rounded-lg overflow-hidden', alertColor]">
        <div class="p-4 text-white">
          <div class="flex items-center gap-2 mb-2">
            <AlertCircle :class="iconStyle" :size="24" />
            <h2 class="text-xl font-bold">{{ alertTitle }}</h2>
          </div>
          <p class="text-sm mb-2">{{ alertMessage }}</p>
        </div>
        
        <div class="p-2 bg-white">
          <h3 class="font-medium mb-1">Інструкції:</h3>
          <ul class="list-disc pl-5 space-y-0.5 text-sm">
            <li v-if="riskLevel === 'evacuate'">Зберіть необхідні речі та документи</li>
            <li v-if="riskLevel === 'evacuate'">Закрийте газ та електрику</li>
            <li v-if="riskLevel === 'evacuate'">Прямуйте до найближчого пункту евакуації</li>
            
            <li v-if="riskLevel === 'heightened'">Слідкуйте за оновленнями інформації</li>
            <li v-if="riskLevel === 'heightened'">Підготуйте запас води та продуктів</li>
            <li v-if="riskLevel === 'heightened'">Тримайте документи в доступному місці</li>
            
            <li v-if="riskLevel === 'none'">Продовжуйте звичайну діяльність</li>
            <li v-if="riskLevel === 'none'">Немає потреби в спеціальних заходах</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>