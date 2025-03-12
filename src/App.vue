<script setup lang="ts">
import Map from '@/components/Map.vue';
import { useStore } from '@/stores/store';
import AlertLog from '@/components/AlertLog.vue';
import RandomAlertToggle from '@/components/RandomAlertToggle.vue';
import { Button } from '@/components/ui/button';

const store = useStore();
const alerts = store.alerts;

const handleClearAlerts = () => {
  store.clearAlerts();
}

const nuclearAlert = () => {
  store.nuclearAlert();
}

</script>

<template>
  <div class="relative flex flex-row w-screen h-screen justify-between overflow-hidden">
    <AlertLog class="w-[400px] overflow-y-auto" />

    <div class="flex h-screen justify-center items-center">
      <Map />
    </div>

    <div class="flex flex-col gap-2 z-50 p-2">
      <div v-for="alert in alerts" :key="alert.id" class="flex flex-row gap-2 items-center">
        <div class="size-4" :style="{ backgroundColor: store.getAlertColor(alert.id) }" />
        <p> {{ alert.name }} </p>
      </div>
      <RandomAlertToggle />
      <Button variant="outline" @click="handleClearAlerts">Очистити всі тривоги</Button>
      <Button variant="destructive" @click="nuclearAlert">Ядерна атака</Button>
    </div>
  </div>
</template>
