<script lang="ts" setup>
import { useStore } from '@/stores/store';
import { ref, onMounted, onUnmounted } from 'vue';
import type { Region } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Bell, BellOff } from 'lucide-vue-next';

const store = useStore();
const regions = store.regions;
const alerts = store.alerts;

const alertRiskDialog = ref(false);
const pendingAlertRegion = ref<Region | undefined>();
const pendingAlertId = ref<string | undefined>();
const randomModeEnabled = ref(false);

const alertFrequency = ref(1);
let alertTimer: number | undefined;

// Random alert generation functions
const generateRandomAlert = () => {
  // Get only non-occupied regions
  const availableRegions = regions.value.filter(r => !r.is_occupied);
  if (availableRegions.length === 0) return;
  
  // Select random region
  const randomRegion = availableRegions[Math.floor(Math.random() * availableRegions.length)];
  
  // Select random alert
  const randomAlert = alerts.value[Math.floor(Math.random() * alerts.value.length)];
  
  // Log the potential risk
  pendingAlertRegion.value = randomRegion;
  pendingAlertId.value = randomAlert.id;
  
  // Open dialog to confirm the alert
  alertRiskDialog.value = true;
}

const applyPendingAlert = () => {
  if (pendingAlertRegion.value && pendingAlertId.value) {
    store.setAlertForRegion(pendingAlertRegion.value.id, pendingAlertId.value);
    alertRiskDialog.value = false;
    pendingAlertRegion.value = undefined;
    pendingAlertId.value = undefined;
  }
}

const rejectPendingAlert = () => {
  // Add to history that alert was rejected
  if (pendingAlertRegion.value) {
    store.removeAlertForRegion(pendingAlertRegion.value.id, false);
  }
  
  alertRiskDialog.value = false;
  pendingAlertRegion.value = undefined;
  pendingAlertId.value = undefined;
}

const startRandomAlertGeneration = () => {
  if (alertTimer) clearInterval(alertTimer);
  
  // Calculate interval based on alertFrequency (5-30 seconds)
  // Higher frequency value = longer interval between alerts
  const baseInterval = 5000; // 5 seconds base
  const interval = baseInterval + (alertFrequency.value * 500); // 5-30 seconds
  
  alertTimer = setInterval(generateRandomAlert, interval);
}

const stopRandomAlertGeneration = () => {
  if (alertTimer) {
    clearInterval(alertTimer);
    alertTimer = undefined;
  }
}

// Watch for changes to random mode
const toggleRandomMode = (enabled: boolean) => {
  randomModeEnabled.value = enabled;
  if (enabled) {
    startRandomAlertGeneration();
  } else {
    stopRandomAlertGeneration();
  }
}

// Clean up on component unmount
onMounted(() => {
  if (randomModeEnabled.value) {
    startRandomAlertGeneration();
  }
});

onUnmounted(() => {
  stopRandomAlertGeneration();
});
</script>

<template>
    <div class="flex flex-col gap-2 items-center">
        <input type="range" v-model="alertFrequency" min="1" max="100" step="1" />
        <p>Інтервал: {{ alertFrequency }} секунд</p>
    </div>
    <Button variant="default" @click="toggleRandomMode(!randomModeEnabled)">
        <BellOff v-if="randomModeEnabled" class="h-4 w-4" />
        <Bell v-else class="h-4 w-4" />
        Випадкові тривоги
    </Button>

    <Dialog v-model:open="alertRiskDialog">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Виявлено потенційну загрозу!</DialogTitle>
        <DialogDescription>
          {{ pendingAlertRegion?.name }} - виявлено загрозу: {{ store.findAlert(pendingAlertId || '')?.name }}
        </DialogDescription>
      </DialogHeader>

      <p>Підтвердити тривогу для цього регіону?</p>
      <p class="text-sm text-slate-500">
        Запис про цю подію буде додано до журналу тривог.
      </p>

      <DialogFooter class="flex gap-5">
        <Button variant="default" @click="applyPendingAlert">Підтвердити тривогу</Button>
        <Button variant="outline" @click="rejectPendingAlert">Відхилити</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
