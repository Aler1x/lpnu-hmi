<script setup lang="ts">
import Map from '@/components/map/Map.vue';
import { useStore } from '@/stores/store';
import AlertLog from '@/components/map/AlertLog.vue';
import RandomAlertToggle from '@/components/map/RandomAlertToggle.vue';
import RandomAlertUserToggle from '@/components/map/RandomAlertUserToggle.vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-vue-next';
import { ref } from 'vue';

const store = useStore();
const alerts = store.alerts;
const showAlertLog = ref(false);

const handleClearAlerts = () => {
  store.clearAlerts();
}

const nuclearAlert = () => {
  store.nuclearAlert();
}
</script>

<template>
  <div class="flex flex-row w-screen h-screen justify-between overflow-hidden">
    <div class="flex flex-col gap-2 p-4">
      <div class="flex gap-2 flex-row">
        <router-link to="/" class="flex items-center gap-2">
          <ChevronLeft class="w-6 h-6" />
        </router-link>
        <p class="text-2xl font-bold">Карта тривог</p>
      </div>
      <AlertLog v-if="showAlertLog" class="w-[400px] overflow-y-auto" />
    </div>

    <div class="flex h-screen justify-center items-center">
      <Map/>
    </div>

    <div class="flex flex-col gap-2 z-50 p-2">
      <div v-for="alert in alerts" :key="alert.id" class="flex flex-row gap-2 items-center">
        <div class="size-4" :style="{ backgroundColor: store.getAlertColor(alert.id) }" />
        <p> {{ alert.name }} </p>
      </div>
      <RandomAlertToggle />
      <RandomAlertUserToggle />
      <Button variant="outline" @click="handleClearAlerts">Очистити всі тривоги</Button>
      <Button variant="destructive" @click="nuclearAlert">Ядерна атака</Button>
      <Button variant="outline" @click="showAlertLog = !showAlertLog">Журнал тривог</Button>
    </div>
  </div>
</template> 