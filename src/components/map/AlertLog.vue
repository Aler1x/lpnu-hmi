<script setup lang="ts">
import { useStore } from '@/stores/store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const store = useStore();
const history = store.alertHistory;
</script>

<template>
  <div class="flex flex-col gap-2 p-2 bg-slate-50">
    <Alert v-for="alert in history" :key="alert.id" class="flex flex-row gap-2">
      <img src="https://cdn.alerts.in.ua/assets/icons/air-raid.png?v=2" class="size-8"
        :class="{ 'grayscale': alert.status === 'відбій' }" v-if="alert.status !== 'звільнено'" />

      <div class="flex flex-col gap-1">
        <AlertTitle v-if="alert.region_id === 'all'">
          Усі регіони
        </AlertTitle>
        <AlertTitle v-else>{{ store.findRegion(alert.region_id)?.name }}</AlertTitle>

        <AlertDescription v-if="alert.status === 'тривога' && alert.alert_id">
          Тривога: {{ store.findAlert(alert.alert_id)?.name }}
        </AlertDescription>
        <AlertDescription v-else-if="alert.status === 'відбій'">
          Відбій тривоги
        </AlertDescription>
        <AlertDescription v-else-if="alert.status === 'звільнено'">
          {{ store.findRegion(alert.region_id)?.name }} звільнено
        </AlertDescription>
      </div>
    </Alert>
  </div>
</template>