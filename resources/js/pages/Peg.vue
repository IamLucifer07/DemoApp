<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';

import { onMounted } from 'vue';
import { useApiData } from '@/composables/useApiData';
import { Head } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types';



const { items, headers, loading, error, fetchData } = useApiData({
    url: "https://laganisutra.com/api/calculate-peg-ratio/?sector=Commercial%20Banks",
    title: "Dataset",
    columns: ['symbol', 'fiscal_year', 'quarter', 'pe_ratio', 'earnings_growth_rate', 'peg_ratio', 'current_eps', 'five_years_ago_eps', 'interpretation']
});

onMounted(() => {
    fetchData();
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data1',
        href: '/peg',
    },
];

</script>

<template>
    <Head title="Data1" />
    <AppLayout :breadcrumbs="breadcrumbs">
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">API Dataset</h1>
    
    <div v-if="loading" class="p-8 text-center text-gray-500">
      Loading data...
    </div>
    
    <div v-if="error" class="p-4 mb-6 text-red-600 bg-red-100 rounded">
      {{ error }}
    </div>
    
    <div v-if="!loading && !error && items.length > 0" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-white-100 uppercase">
            <th
              v-for="header in headers"
              :key="header"
              class="p-1 text-left border border-gray-300"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-lime-100 odd:bg-gray-100"
          >
            <td
              v-for="header in headers"
              :key="header"
              class="p-1 border border-gray-300"
              :class="{
        'text-red-600': isNegative(item[header]),
        'text-green-600': isPositive(item[header])
      }"
            >
              {{ item[header] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </AppLayout>
</template>

<script lang="ts">

const isNegative = (value: number | string): boolean => {
  if (typeof value === 'number') {
    return value < 0;
  }
  

  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^\d.-]/g, ''));
    return !isNaN(num) && num < 0;
  }
  
  return false;
};

const isPositive = (value: number | string): boolean => {
  if (typeof value === 'number') {
    return value > 0;
  }
  
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^\d.-]/g, ''));
    return !isNaN(num) && num > 0;
  }
  
  return false;
};
</script>