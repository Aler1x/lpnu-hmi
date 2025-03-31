<script setup lang="ts">
import { useFloodStore } from '@/stores/flood';
import { computed } from 'vue';
import { CloudRain, Thermometer, Droplets, MountainSnow } from 'lucide-vue-next';

const store = useFloodStore();
const factors = computed(() => store.factors);
const riskLevel = computed(() => store.riskLevel);

const waterLevelHeight = computed(() => {
  if (factors.value.waterLevel === 'high') return 'h-4/5';
  if (factors.value.waterLevel === 'moderate') return 'h-2/5';
  return 'h-1/5';
});

const waterLevelColor = computed(() => {
  if (riskLevel.value === 'evacuate' && factors.value.waterLevel === 'high') return 'bg-blue-600';
  return 'bg-blue-400';
});

const snowAmount = computed(() => {
  if (factors.value.snow === 'large') return 'scale-100 opacity-100';
  if (factors.value.snow === 'small') return 'scale-75 opacity-75';
  return 'scale-50 opacity-50';
});

const rainAnimation = computed(() => {
  if (factors.value.rain === 'heavy') return 'animate-bounce animate-duration-500 animate-infinite';
  if (factors.value.rain === 'moderate') return 'animate-bounce animate-duration-1000 animate-infinite';
  return '';
});

const temperatureBrightness = computed(() => {
  if (factors.value.temperature === 'high') return 'text-yellow-500';
  if (factors.value.temperature === 'medium') return 'text-yellow-300';
  return 'text-gray-300';
});
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4 text-center">Візуалізація</h2>
    
    <div class="h-64 flex items-end justify-between bg-gradient-to-b from-sky-200 to-white rounded-lg overflow-hidden relative">
      <!-- Water level visualization -->
      <div class="absolute bottom-0 left-0 w-full transition-all duration-1000" 
           :class="[waterLevelHeight, waterLevelColor]">
      </div>
      
      <!-- Rain visualization -->
      <div class="absolute top-4 right-4 flex flex-col items-center">
        <CloudRain :class="['mb-2', rainAnimation]" :size="32" />
        <div class="text-center">
          <span class="text-sm">Дощ</span>
          <p class="font-semibold">
            {{ factors.rain === 'heavy' ? 'Сильний' : factors.rain === 'moderate' ? 'Помірний' : 'Немає' }}
          </p>
        </div>
      </div>
      
      <!-- Temperature visualization -->
      <div class="absolute top-4 left-4 flex flex-col items-center">
        <Thermometer :class="[temperatureBrightness]" :size="32" />
        <div class="text-center">
          <span class="text-sm">Температура</span>
          <p class="font-semibold">
            {{ factors.temperature === 'high' ? 'Висока' : factors.temperature === 'medium' ? 'Середня' : 'Не вказано' }}
          </p>
        </div>
      </div>
      
      <!-- Snow visualization -->
      <div class="absolute bottom-4 left-1/3 flex flex-col items-center">
        <MountainSnow :class="[snowAmount, 'transition-all duration-1000']" :size="40" />
        <div class="text-center">
          <span class="text-sm">Сніг</span>
          <p class="font-semibold">
            {{ factors.snow === 'large' ? 'Багато' : factors.snow === 'small' ? 'Мало' : 'Не вказано' }}
          </p>
        </div>
      </div>
      
      <!-- Water level indicator -->
      <div class="absolute bottom-4 right-4">
        <Droplets :size="32" />
        <div class="text-center">
          <span class="text-sm">Рівень води</span>
          <p class="font-semibold">
            {{ factors.waterLevel === 'high' ? 'Високий' : factors.waterLevel === 'moderate' ? 'Помірний' : 'Не вказано' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 