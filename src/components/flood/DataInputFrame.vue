<script setup lang="ts">
import { useFloodStore } from '@/stores/flood';
import { computed } from 'vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const store = useFloodStore();
const factors = computed(() => store.factors);

const waterLevelOptions = [
  { value: 'high', label: 'Високий' },
  { value: 'moderate', label: 'Помірний' }
];

const temperatureOptions = [
  { value: 'high', label: 'Висока' },
  { value: 'medium', label: 'Середня' }
];

const snowOptions = [
  { value: 'large', label: 'Багато' },
  { value: 'small', label: 'Мало' }
];

const rainOptions = [
  { value: 'heavy', label: 'Сильний' },
  { value: 'moderate', label: 'Помірний' },
  { value: 'none', label: 'Немає' }
];

const resetData = () => {
  store.resetFactors();
};

const applyScenario = (index: number) => {
  store.applyScenario(index);
};
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4 text-center">Введення даних</h2>
    
    <div class="grid grid-cols-1 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">Рівень води</label>
        <Select v-model="factors.waterLevel">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Оберіть рівень води" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in waterLevelOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Температура</label>
        <Select v-model="factors.temperature">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Оберіть температуру" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in temperatureOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Сніг в горах</label>
        <Select v-model="factors.snow">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Оберіть кількість снігу" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in snowOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Дощ</label>
        <Select v-model="factors.rain">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Оберіть інтенсивність дощу" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in rainOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <div class="flex flex-col gap-2">
      <Button @click="resetData" variant="outline">Скинути дані</Button>
      <div class="grid grid-cols-3 gap-2">
        <Button @click="applyScenario(0)" variant="secondary">Нормальний</Button>
        <Button @click="applyScenario(1)" variant="outline">Увага</Button>
        <Button @click="applyScenario(2)" variant="destructive">Екстрений</Button>
      </div>
    </div>
  </div>
</template> 