<script setup lang="ts">
import { useEvacuateStore } from '@/stores/evacuate';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const store = useEvacuateStore();

// Helper function to extract and display algorithm details
function getAlgorithmDetails() {
  try {
    const resultObj = JSON.parse(store.result);
    return {
      coefficient: resultObj.partitionCoefficient_p,
      message: resultObj.message || null
    };
  } catch (error) {
    return { coefficient: null, message: null };
  }
}
</script>

<template>
  <div class="min-h-screen bg-background p-4">
    <div class="mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Card class="p-4">
            <CardHeader>
              <CardTitle class="text-center text-xl">Кількість людей:</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-center gap-4">
                <Button variant="destructive" size="lg" @click="store.decrementPeople"
                  :disabled="store.peopleValue <= 1090">
                  -
                </Button>
                <span class="text-3xl font-bold min-w-[100px] text-center">
                  {{ store.peopleValue }}
                </span>
                <Button variant="default" size="lg" @click="store.incrementPeople">
                  +
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" class="px-8 py-6 text-lg w-full" @click="store.calculateTransport">
            Розрахувати
          </Button>
        </div>

        <Card class="md:row-span-2 p-2 h-full">
          <CardHeader>
            <CardTitle class="text-center text-xl">Результат розрахунку:</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="store.result && !store.result.includes('Помилка')" class="h-full">
              <div class="bg-muted p-4 rounded-lg overflow-auto">
                <h3 class="font-medium text-center">Розподіл транспорту</h3>
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b">
                      <th class="py-2 px-2 text-left">Транспорт</th>
                      <th class="py-2 px-2 text-center">Одиниць</th>
                      <th class="py-2 px-2 text-center">Місткість</th>
                      <th class="py-2 px-2 text-center">Всього місць</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in store.transportStats.items" :key="item.name" class="border-b">
                      <td class="py-2 px-2">{{ item.name }}</td>
                      <td class="py-2 px-2 text-center">{{ item.units }}</td>
                      <td class="py-2 px-2 text-center">{{ item.unitCapacity }}</td>
                      <td class="py-2 px-2 text-center">{{ item.totalCapacity }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="font-semibold border-t-2">
                      <td class="py-2 px-2">Всього:</td>
                      <td class="py-2 px-2 text-center">{{ store.transportStats.totalUnits }}</td>
                      <td class="py-2 px-2 text-center">-</td>
                      <td class="py-2 px-2 text-center">{{ store.transportStats.totalCapacity }}</td>
                    </tr>
                  </tfoot>
                </table>

                <div class="bg-muted/50 p-2 rounded-lg space-y-2">
                  <p class="text-center font-medium">
                    Загальна кількість людей: {{ store.peopleValue }}
                  </p>
                  <p class="text-center font-medium">
                    Загальна кількість місць: {{ store.transportStats.totalCapacity }}
                  </p>
                  <p v-if="getAlgorithmDetails().coefficient !== null" class="text-center font-medium">
                    Коефіцієнт розподілу (p): {{ getAlgorithmDetails().coefficient.toFixed(4) }}
                  </p>
                  <p class="text-center font-medium" :class="{
                    'text-green-600': store.allPeoplePlaced,
                    'text-red-600': !store.allPeoplePlaced,
                  }">
                    {{ store.allPeoplePlaced ?
                      'Всі люди успішно розміщені' :
                      'Недостатньо місць! Потрібно більше транспорту.' }}
                  </p>
                </div>

                <!-- Algorithm Messages -->
                <div v-if="getAlgorithmDetails().message" class="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <h4 class="font-medium text-center mb-2">Додаткова інформація:</h4>
                  <p class="text-sm whitespace-pre-wrap">{{ getAlgorithmDetails().message }}</p>
                </div>
              </div>
            </div>
            <pre v-else-if="store.result"
              class="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap h-full overflow-auto text-red-600">{{ store.result }}</pre>
            <div v-else class="flex items-center justify-center h-full text-muted-foreground">
              Результат з'явиться тут після розрахунку
            </div>
          </CardContent>
        </Card>

        <Card class="p-6">
          <CardHeader>
            <CardTitle class="text-center text-xl">Доступний транспорт</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b">
                    <th class="py-2 px-4 text-left">Назва</th>
                    <th class="py-2 px-4 text-left">Місткість</th>
                    <th class="py-2 px-4 text-left">Kmin</th>
                    <th class="py-2 px-4 text-left">Kmax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transport in store.transportData" :key="transport.name" class="border-b hover:bg-muted">
                    <td class="py-2 px-4">{{ transport.name }}</td>
                    <td class="py-2 px-4">{{ transport.capacity }}</td>
                    <td class="py-2 px-4">{{ transport.Kmin }}</td>
                    <td class="py-2 px-4">{{ transport.Kmax }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
