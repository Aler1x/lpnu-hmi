<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Button } from '@/components/ui/button';
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold mb-6">Система моніторингу</h1>
    <div class="flex flex-col gap-4">
      <RouterLink to="/map">
        <Button class="w-full">Відкрити карту</Button>
      </RouterLink>
      <RouterLink to="/flood-monitor">
        <Button class="w-full">Моніторинг повеней</Button>
      </RouterLink>
      <RouterLink to="/evacuate">
        <Button class="w-full">Евакуація</Button>
      </RouterLink>
    </div>
  </div>
</template> 