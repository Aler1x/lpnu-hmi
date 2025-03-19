import type { Alert, AlertHistory, Infrastructure, Region } from '@/types/map';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { regions as regionsData } from '@/stores/regions';
import { alerts as alertsData } from '@/stores/alerts';
import { infrastructure as infrastructureData } from '@/stores/infrastructure';

export const useStore = defineStore('store', () => {
  const _regions = ref<Region[]>(regionsData);
  const _alerts = ref<Alert[]>(alertsData);
  const _infrastructure = ref<Infrastructure[]>(infrastructureData);

  const _alertHistory = ref<AlertHistory[]>([]);

  const findRegion = (id: string): Region | undefined => {
    return _regions.value?.find((region: Region) => region.id === id);
  }

  const findAlert = (id: string): Alert | undefined => {
    return _alerts.value?.find((alert: Alert) => alert.id === id);
  }

  const findInfrastructure = (id: string): Infrastructure | undefined => {
    return _infrastructure.value?.find((infrastructure: Infrastructure) => infrastructure.id === id);
  }

  const setAlertForRegion = (regionId: string, alertId: string) => {
    const region = findRegion(regionId);
    if (region) {
      region.alert_id = alertId;

      _alertHistory.value.push({
        id: Math.random().toString(36).substring(2, 15),
        region_id: regionId,
        alert_id: alertId,
        timestamp: new Date().toISOString(),
        status: 'тривога',
      });
    }
  }

  const removeAlertForRegion = (regionId: string, saveToHistory: boolean = true) => {
    const region = findRegion(regionId);
    if (region) {
      region.alert_id = undefined;

      if (saveToHistory) {
      _alertHistory.value.push({
        id: Math.random().toString(36).substring(2, 15),
        region_id: regionId,
        alert_id: undefined,
        timestamp: new Date().toISOString(),
          status: 'відбій',
        });
      }
    }
  }

  const getAlertColor = (alertId: string): string => {
    const alert = findAlert(alertId);
    if (alert) {
      return alert.color;
    }
    return 'red-600';
  }

  const regions = computed(() => {
    return _regions;
  });

  const alerts = computed(() => {
    return _alerts;
  });

  const infrastructure = computed(() => {
    return _infrastructure;
  });

  const alertHistory = computed(() => {
    return _alertHistory;
  });

  const freeRegion = (regionId: string) => {
    const region = findRegion(regionId);
    if (region) {
      region.is_occupied = false;

      _alertHistory.value.push({
        id: Math.random().toString(36).substring(2, 15),
        region_id: regionId,
        alert_id: undefined,
        timestamp: new Date().toISOString(),
        status: 'звільнено',
      });
    }
  }

  const clearAlerts = () => {
    _regions.value.forEach((region: Region) => {
      region.alert_id = undefined;
    });

    _alertHistory.value.push({
      id: Math.random().toString(36).substring(2, 15),
      region_id: 'all',
      alert_id: undefined,
      timestamp: new Date().toISOString(),
      status: 'відбій',
    });
  }

  const nuclearAlert = () => {
    _regions.value.forEach((region: Region) => {
      if (!region.is_occupied) {
        region.alert_id = 'nuclear';
      }
    });

    _alertHistory.value.push({
      id: Math.random().toString(36).substring(2, 15),
      region_id: 'all',
      alert_id: 'nuclear',
      timestamp: new Date().toISOString(),
      status: 'тривога',
    });
  }

  return {
    // for persist store
    _regions,
    _alerts,
    _infrastructure,
    _alertHistory,
    // for use
    regions,
    findRegion,
    alerts,
    infrastructure,
    findAlert,
    findInfrastructure,
    setAlertForRegion,
    removeAlertForRegion,
    getAlertColor,
    alertHistory,
    freeRegion,
    clearAlerts,
    nuclearAlert,
  };
}, {
  persist: false,
});