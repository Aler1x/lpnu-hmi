<!-- src/components/RandomAlertToggle.vue -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-vue-next';
import { useStore } from '@/stores/store';

const store = useStore();
const isActive = ref(false);

// Store intervals and timers
let rocketAlertInterval: number | null = null;
let artilleryAlertInterval: number | null = null;
let nationwideAlertCheck: number | null = null;
const activeTimers = new Map<string, number>(); // Track active alert timers by region ID

// Eastern regions (east of the Dnipro River)
const easternRegions = [
  'kharkiv', 'donetsk', 'luhansk', 'sumy', 'poltava', 
  'dnipropetrovsk', 'zaporizhzhia', 'kherson', 'crimea', 
  'sevastopol', 'kyiv', 'kyiv_city', 'chernihiv', 'kirovograd', 'cherkasy', 'mykolaiv'
];

// Helper to check if a region is adjacent to occupied territory
function isNearOccupied(regionId: string): boolean {
  const region = store.findRegion(regionId);
  if (!region) return false;

  // Check if any neighbor is occupied
  return region.neighbors.some(neighborId => {
    const neighbor = store.findRegion(neighborId);
    return neighbor?.is_occupied;
  });
}

// Generate rocket alerts for eastern regions
function generateRocketAlerts() {
  // For regions east of the Dnipro River (eastern regions)
  easternRegions.forEach(regionId => {
    const region = store.findRegion(regionId);
    if (!region || region.is_occupied) return;

    // Skip if region already has an active alert
    if (activeTimers.has(regionId)) return;

    const alertType = Math.random() <= 0.9 ? 'missile' : 'aircraft';
    // Set a rocket alert
    if (Math.random() < Math.random() + 0.3) {
      store.setAlertForRegion(regionId, alertType);
    }

    // Automatically clear after 10-20 seconds
    const duration = 5000 + Math.random() * 10000; // 10-20 seconds
    const timerId = window.setTimeout(() => {
      store.removeAlertForRegion(regionId);
      activeTimers.delete(regionId);
    }, duration);

    activeTimers.set(regionId, timerId);
  });
}

// Generate artillery alerts for regions near occupied territories
function generateArtilleryAlerts() {
  store.regions.value.forEach(region => {
    if (region.is_occupied || !isNearOccupied(region.id)) return;
    if (activeTimers.has(region.id)) return;

    // 30% chance for artillery alert
    if (Math.random() < 0.5) {
      store.setAlertForRegion(region.id, 'artillery');

      // Clear after 10-15 seconds
      const duration = 5000 + Math.random() * 5000;
      const timerId = window.setTimeout(() => {
        store.removeAlertForRegion(region.id);
        activeTimers.delete(region.id);
      }, duration);

      activeTimers.set(region.id, timerId);
    }
  });
}

// Generate nationwide alert wave (east to west)
function generateNationwideAlert() {  
  // Get all non-occupied regions
  const regions = store.regions.value.filter(r => !r.is_occupied);
  
  // Sort regions by x-position (approximate east-west ordering)
  // This is a simple approximation - might need adjustment based on your map
  regions.sort((a, b) => {
    const aIsEastern = a.is_eastern ? 1 : 0;
    const bIsEastern = b.is_eastern ? 1 : 0;
    return bIsEastern - aIsEastern;
  });

  // Activate alerts from east to west with delays
  let delay = 0;
  regions.forEach((region) => {
    // Clear any existing timer for this region
    if (activeTimers.has(region.id)) {
      clearTimeout(activeTimers.get(region.id)!);
      activeTimers.delete(region.id);
    }

    // Set alert with delay
    setTimeout(() => {
      store.setAlertForRegion(region.id, 'missile');
    }, delay);

    // Schedule alert removal after ~30 seconds
    const clearDelay = delay + 30000 + Math.random() * 5000;
    const timerId = window.setTimeout(() => {
      store.removeAlertForRegion(region.id);
      activeTimers.delete(region.id);
    }, clearDelay);

    activeTimers.set(region.id, timerId);
    delay += 500; // Add 500ms between each region
  });
}

// Start generating random alerts
function startRandomAlerts() {
  // Rocket alerts for eastern regions every 15 seconds
  rocketAlertInterval = window.setInterval(() => {
    generateRocketAlerts();
  }, 15000);

  // Artillery alerts for regions near occupied territories
  artilleryAlertInterval = window.setInterval(() => {
    generateArtilleryAlerts();
  }, 15000);

  // Check for nationwide alerts every 30 seconds (10% chance)
  nationwideAlertCheck = window.setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance
      generateNationwideAlert();
    }
  }, 30000);

  // Initial alerts on start
  generateRocketAlerts();
  generateArtilleryAlerts();
}

// Stop generating random alerts
function stopRandomAlerts() {
  // Clear all intervals
  if (rocketAlertInterval) {
    clearInterval(rocketAlertInterval);
    rocketAlertInterval = null;
  }

  if (artilleryAlertInterval) {
    clearInterval(artilleryAlertInterval);
    artilleryAlertInterval = null;
  }

  if (nationwideAlertCheck) {
    clearInterval(nationwideAlertCheck);
    nationwideAlertCheck = null;
  }

  // Clear all active timers
  activeTimers.forEach((timerId, regionId) => {
    clearTimeout(timerId);
    store.removeAlertForRegion(regionId);
  });
  activeTimers.clear();

  // Remove all alerts
  store.clearAlerts();
}

// Toggle random alerts
function toggleRandomAlerts() {
  if (isActive.value) {
    stopRandomAlerts();
    isActive.value = false;
  } else {
    startRandomAlerts();
    isActive.value = true;
  }
}

// Clean up on component unmount
onUnmounted(() => {
  if (isActive.value) {
    stopRandomAlerts();
  }
});
</script>

<template>
  <div class="mb-4">
    <Button
      :variant="isActive ? 'destructive' : 'default'"
      @click="toggleRandomAlerts"
      class="flex items-center gap-2"
    >
      <BellOff v-if="isActive" class="h-4 w-4" />
      <Bell v-else class="h-4 w-4" />
      {{ isActive ? 'Вимкнути довільні тривоги' : 'Увімкнути довільні тривоги' }}
    </Button>
  </div>
</template>
