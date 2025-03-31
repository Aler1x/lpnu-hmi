import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transport, TransportItem, TransportStats } from '@/types/evacuate';

// New types for the advanced algorithm
interface TransportType {
  name: string;
  capacity: number;
  minUnits: number;
  maxUnits: number;
}

interface TransportResult {
  name: string;
  calculatedUnits: number;
}

interface CalculationResult {
  results: TransportResult[];
  totalCalculatedCapacity: number;
  partitionCoefficient_p: number;
  message?: string;
}

export const useEvacuateStore = defineStore('evacuate', () => {
  const peopleValue = ref(1090);
  const selectedIndex = ref(0);
  const result = ref(''); 

  const transportData: Transport[] = [
    { name: "Mercedes Sprinter", capacity: 12, Kmin: 5, Kmax: 20 },
    { name: "Рено Мастер", capacity: 12, Kmin: 5, Kmax: 18 },
    { name: "ГАЗ-66", capacity: 30, Kmin: 6, Kmax: 18 },
    { name: "ПАЗ-3205", capacity: 18, Kmin: 8, Kmax: 25 },
    { name: "БАЗ Волошка", capacity: 15, Kmin: 10, Kmax: 40 },
    { name: "МІ-8", capacity: 8, Kmin: 2, Kmax: 10 },
    { name: "Потяг Дніпро", capacity: 200, Kmin: 2, Kmax: 5 },
    { name: "Катер Юний Орел", capacity: 20, Kmin: 4, Kmax: 10 }
  ];

  // Advanced algorithm from test.ts
  function calculateTransportDistribution(
    fleet: TransportType[],
    peopleToEvacuate: number
  ): CalculationResult | { error: string } {
    if (!fleet || fleet.length === 0) {
      return { error: "Transport fleet data cannot be empty." };
    }
    if (peopleToEvacuate < 0) {
      return { error: "Number of people to evacuate cannot be negative." };
    }

    let sumMinCapacity = 0;
    let sumMaxCapacity = 0;
    const minUnitsFleet: TransportResult[] = [];

    for (const transport of fleet) {
      if (transport.minUnits < 0 || transport.maxUnits < transport.minUnits || transport.capacity <= 0) {
        return { error: `Invalid data for transport type "${transport.name}": minUnits (${transport.minUnits}), maxUnits (${transport.maxUnits}), capacity (${transport.capacity}). Ensure min >= 0, max >= min, capacity > 0.` };
      }
      sumMinCapacity += transport.capacity * transport.minUnits;
      sumMaxCapacity += transport.capacity * transport.maxUnits;
      minUnitsFleet.push({ name: transport.name, calculatedUnits: transport.minUnits });
    }

    if (peopleToEvacuate === 0) {
      return {
        results: minUnitsFleet,
        totalCalculatedCapacity: sumMinCapacity,
        partitionCoefficient_p: 1,
        message: "Target is 0 people; deploying minimum required units."
      };
    }

    const tolerance = 1e-9;
    if (peopleToEvacuate < sumMinCapacity - tolerance || peopleToEvacuate > sumMaxCapacity + tolerance) {
      return {
        error: `The required number of people (${peopleToEvacuate}) is outside the achievable capacity range [${sumMinCapacity}, ${sumMaxCapacity}]. Cannot proceed.`,
      };
    }

    const capacityRange = sumMaxCapacity - sumMinCapacity;
    let p: number;
    let one_minus_p: number;

    const output: CalculationResult = {
      results: [],
      totalCalculatedCapacity: 0,
      partitionCoefficient_p: NaN,
      message: ""
    };

    if (Math.abs(capacityRange) < tolerance) {
      p = NaN;
      one_minus_p = NaN;
      output.message = "Required capacity equals the fixed total capacity. Allocating min/max units for each type.";
      output.results = minUnitsFleet;
      output.totalCalculatedCapacity = sumMinCapacity;
      output.partitionCoefficient_p = p;
      return output;
    } else {
      p = (sumMaxCapacity - peopleToEvacuate) / capacityRange;
      p = Math.max(0, Math.min(1, p));
      one_minus_p = 1.0 - p;
      output.partitionCoefficient_p = p;
    }

    const calculatedUnits: number[] = [];
    const fractionalParts: { index: number, fractionalPart: number }[] = [];
    for (let i = 0; i < fleet.length; i++) {
      const transport = fleet[i];
      const Kt_fractional = transport.minUnits + (transport.maxUnits - transport.minUnits) * one_minus_p;
      calculatedUnits[i] = Math.floor(Kt_fractional);
      const fractionalPart = Kt_fractional - calculatedUnits[i];
      if (fractionalPart > tolerance) {
        fractionalParts.push({ index: i, fractionalPart });
      }
    }

    let currentTotalCapacity = 0;
    for (let i = 0; i < fleet.length; i++) {
      currentTotalCapacity += calculatedUnits[i] * fleet[i].capacity;
    }

    let capacityDeficit = peopleToEvacuate - currentTotalCapacity;

    fractionalParts.sort((a, b) => {
      const capacityA = fleet[a.index].capacity;
      const capacityB = fleet[b.index].capacity;
      if (capacityA !== capacityB) {
        return capacityA - capacityB; // Ascending by capacity
      }
      return b.fractionalPart - a.fractionalPart; // Descending by fractional part
    });

    for (const part of fractionalParts) {
      const index = part.index;
      while (capacityDeficit > 0 && calculatedUnits[index] < fleet[index].maxUnits) {
        calculatedUnits[index]++;
        capacityDeficit -= fleet[index].capacity;
      }
    }

    output.totalCalculatedCapacity = 0;
    output.results = [];
    for (let i = 0; i < fleet.length; i++) {
      output.results.push({ name: fleet[i].name, calculatedUnits: calculatedUnits[i] });
      output.totalCalculatedCapacity += calculatedUnits[i] * fleet[i].capacity;
    }

    if (output.totalCalculatedCapacity > peopleToEvacuate + tolerance) {
      const excessCapacity = output.totalCalculatedCapacity - peopleToEvacuate;
      const capacityMsg = `Total capacity (${output.totalCalculatedCapacity}) exceeds target (${peopleToEvacuate}) by ${excessCapacity.toFixed(0)} due to rounding up vehicle units.`;
      output.message = output.message ? output.message + "\n" + capacityMsg : capacityMsg;
    } else if (Math.abs(output.totalCalculatedCapacity - peopleToEvacuate) > 1e-6) {
      const warningMsg = `Warning: Final calculated capacity (${output.totalCalculatedCapacity.toFixed(3)}) differs from target (${peopleToEvacuate}) by more than rounding tolerance.`;
      output.message = output.message ? output.message + "\n" + warningMsg : warningMsg;
    }

    if (output.message?.trim() === "") {
      delete output.message;
    } else {
      output.message = output.message?.trim();
    }

    return output;
  }

  // Computed property for transport statistics
  const transportStats = computed((): TransportStats => {
    // If result is empty or has an error, return empty stats
    if (!result.value || result.value.includes('Помилка:')) {
      return {
        items: [],
        totalUnits: 0,
        totalCapacity: 0
      };
    }
    
    // Parse the result value based on the expected format from the new algorithm
    const items: TransportItem[] = [];
    let totalUnits = 0;
    let totalCapacity = 0;
    
    try {
      const resultObj = JSON.parse(result.value);
      if (resultObj.results) {
        // Create transport items from calculation results
        for (const item of resultObj.results) {
          const transportInfo = transportData.find(t => t.name === item.name);
          if (transportInfo && item.calculatedUnits > 0) {
            const itemCapacity = transportInfo.capacity * item.calculatedUnits;
            
            items.push({
              name: item.name,
              units: item.calculatedUnits,
              unitCapacity: transportInfo.capacity,
              totalCapacity: itemCapacity
            });
            
            totalUnits += item.calculatedUnits;
            totalCapacity += itemCapacity;
          }
        }
      }
    } catch (error) {
      // If parsing fails, fallback to the old parsing method
      const lines = result.value.split('\n');
      
      for (const line of lines) {
        const parts = line.split(': ');
        
        if (parts.length === 2) {
          const name = parts[0];
          const unitsPart = parts[1].split(' ');
          
          if (unitsPart.length >= 1) {
            const units = parseInt(unitsPart[0], 10);
            
            if (!isNaN(units)) {
              const transportInfo = transportData.find(t => t.name === name.replace('Додатково: ', ''));
              
              if (transportInfo) {
                const capacity = units * transportInfo.capacity;
                
                items.push({
                  name,
                  units,
                  unitCapacity: transportInfo.capacity,
                  totalCapacity: capacity
                });
                
                totalUnits += units;
                totalCapacity += capacity;
              }
            }
          }
        }
      }
    }
    
    return {
      items,
      totalUnits,
      totalCapacity
    };
  });

  // Computed property to check if all people are placed
  const allPeoplePlaced = computed((): boolean => {
    return transportStats.value.totalCapacity >= peopleValue.value;
  });

  function incrementPeople() {
    peopleValue.value += 20;
  }

  function decrementPeople() {
    peopleValue.value -= 20;
  }

  function updateSelectedIndex() {
    selectedIndex.value = (selectedIndex.value + 1) % 9;
  }

  function calculateTransport() {
    // Convert transportData to the format expected by the new algorithm
    const fleet: TransportType[] = transportData.map(transport => ({
      name: transport.name,
      capacity: transport.capacity,
      minUnits: transport.Kmin,
      maxUnits: transport.Kmax
    }));

    // Calculate transport distribution using the advanced algorithm
    const calculation = calculateTransportDistribution(fleet, peopleValue.value);
    
    if ('error' in calculation) {
      // If there was an error, display it
      result.value = `Помилка: ${calculation.error}`;
    } else {
      // Otherwise, store the result as JSON to keep all the information
      result.value = JSON.stringify(calculation);
    }
  }

  return {
    peopleValue,
    selectedIndex,
    result,
    transportData,
    transportStats,
    allPeoplePlaced,
    incrementPeople,
    decrementPeople,
    updateSelectedIndex,
    calculateTransport
  };
}); 