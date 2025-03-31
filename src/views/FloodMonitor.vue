<script setup lang="ts">
import { useFloodStore } from '@/stores/flood';
import { computed, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
// import VisualizationFrame from '@/components/flood/VisualizationFrame.vue';
import AnalysisAndAlertFrame from '@/components/flood/AnalysisAndAlertFrame.vue';
import { LoaderCircle, ChevronLeft } from 'lucide-vue-next';

const store = useFloodStore();
const autoMode = computed(() => store.autoMode);
const currentScenario = computed(() => store.currentScenarioIndex);

// Toggle auto mode
const toggleAutoMode = () => {
  store.toggleAutoMode();
};

// Apply a specific rule
const applyRule = (ruleId: number) => {
  store.applyScenario(ruleId-1);
};

// Reset on component unmount
onUnmounted(() => {
  store.resetFactors();
});
</script>

<template>
  <div class="p-4 pt-8 bg-slate-100 min-h-screen">
    <div class="mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <router-link to="/"><ChevronLeft class="w-6 h-6" /></router-link>
          <h1 class="text-2xl font-bold">Система моніторингу повеней</h1>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Current rule in auto mode -->
          <div v-if="autoMode" class="flex items-center">
            <span class="text-sm font-medium mr-2">Поточне правило:</span>
            <span :class="['px-3 py-1 rounded-full font-bold']">{{ currentScenario + 1 }}</span>
          </div>
          
          <!-- Manual rule selection -->
          <div v-if="!autoMode" class="hidden md:grid grid-cols-5 gap-1">
            <Button 
              v-for="i in 9" 
              :key="i" 
              @click="applyRule(i)" 
              variant="outline" 
              size="sm" 
              :class="{ 'ring-2 ring-offset-1': currentScenario === i }"
            >
              Правило {{ i }}
            </Button>
          </div>
          
          <Button @click="toggleAutoMode" variant="outline" class="flex items-center whitespace-nowrap">
            {{ autoMode ? 'Зупинити цикл' : 'Запустити цикл' }}
            <LoaderCircle v-if="autoMode" class="ml-2 animate-spin" :size="16" />
          </Button>
        </div>
      </div>
      
      <!-- Mobile rule selection -->
      <div v-if="!autoMode" class="md:hidden grid grid-cols-3 gap-1 mb-4">
        <Button 
          v-for="i in 9" 
          :key="i" 
          @click="applyRule(i)" 
          variant="outline" 
          size="sm" 
          :class="{ 'ring-2 ring-offset-1': currentScenario === i }"
        >
          {{ i }}
        </Button>
      </div>

      <div class="fade-in transition-all rounded-lg overflow-hidden max-w-2xl mx-auto">
          <AnalysisAndAlertFrame />
      </div>
            
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="fade-in transition-all rounded-lg overflow-hidden">
          <AnalysisAndAlertFrame />
        </div>
        
        <div class="fade-in transition-all rounded-lg overflow-hidden">
          <VisualizationFrame />
        </div>
      </div> -->
    </div>
  </div>
</template> 