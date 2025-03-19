<script setup lang="ts">
import { useStore } from '@/stores/store';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { computed, ref } from 'vue';
import type { Region } from '@/types/map';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const store = useStore();
const regions = store.regions;
const alerts = store.alerts;

const isDialogOpen = ref(false);
const selectedRegion = ref<Region | undefined>();

const handleRegionClick = (region: Region) => {
  selectedRegion.value = region;
  isDialogOpen.value = true;
}

const handleFreeRegion = () => {
  if (selectedRegion.value) {
    store.freeRegion(selectedRegion.value.id);
    isDialogOpen.value = false;
  }
}

const selectedRegionAlertId = computed<string | undefined>({
  get() {
    return selectedRegion.value?.alert_id;
  },
  set(newAlertId: string | undefined) {
    if (selectedRegion.value && newAlertId) {
      handleAlertSet(newAlertId);
    }
  }
});

const handleAlertSet = (alert_id: string) => {
  if (selectedRegion.value) {
    store.setAlertForRegion(selectedRegion.value.id, alert_id);
    isDialogOpen.value = false;
  }
}

const handleAlertRemove = () => {
  if (selectedRegion.value) {
    store.removeAlertForRegion(selectedRegion.value.id);
    isDialogOpen.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">    
    <svg xmlns:mapsvg="http://mapsvg.com" xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg" mapsvg:geoViewBox="22.138577 52.380834 40.220623 44.387017" width="612.47321"
      height="408.0199" class="scale-125" fill="#FFF" stroke="#000" stroke-width="0.5" stroke-linecap="round">
      <g v-for="region in regions" :key="region.ua_id">
        <path :d="region.path" :title="region.name"
          :class="[region.is_occupied ? 'fill-red-600' : 'cursor-pointer hover:fill-slate-200']"
          :style="region.alert_id && !region.is_occupied ? { fill: store.getAlertColor(region.alert_id) } : {}"
          @click="handleRegionClick(region)" />
      </g>
    </svg>
  </div>

  <!-- Region dialog -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ selectedRegion?.name }}</DialogTitle>
        <DialogDescription v-if="selectedRegion?.alert_id && !selectedRegion?.is_occupied">
          Цей регіон має тривогу: {{ store.findAlert(selectedRegion?.alert_id)?.name }}
        </DialogDescription>
        <DialogDescription v-else-if="!selectedRegion?.is_occupied">
          Цей регіон спокійний. Ви можете встановити тривогу, якщо це потрібно.
        </DialogDescription>
        <DialogDescription v-else>
          Цей регіон окупований. Звільнити його?
        </DialogDescription>
      </DialogHeader>

      <div v-if="selectedRegion?.alert_id && !selectedRegion?.is_occupied">
        <p>Ви хочете відбити поточну тривогу або змінити її?</p>
        <p class="font-medium mb-2">Змінити тривогу на:</p>
        <Select v-model="selectedRegionAlertId">
          <SelectTrigger>
            <SelectValue placeholder="Виберіть тривогу" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="alert in alerts" :key="alert.id" :value="alert.id">
                {{ alert.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div v-else-if="!selectedRegion?.is_occupied">
        <p class="font-medium mb-2">Встановити тривогу:</p>
        <Select v-model="selectedRegionAlertId">
          <SelectTrigger>
            <SelectValue placeholder="Виберіть тривогу" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="alert in alerts" :key="alert.id" :value="alert.id">
                {{ alert.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter class="flex gap-5">
        <Button v-if="selectedRegion?.alert_id && !selectedRegion?.is_occupied" variant="outline" @click="handleAlertRemove">
          Відбити тривогу
        </Button>
        <Button v-else-if="selectedRegion?.is_occupied" variant="outline" @click="handleFreeRegion">
          Звільнити
        </Button>
        <Button variant="outline" @click="isDialogOpen = false">Скасувати</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
