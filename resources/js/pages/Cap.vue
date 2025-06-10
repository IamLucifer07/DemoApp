<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { onMounted } from 'vue';
import { useApiData } from '@/composables/useApiData';
import { Head } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types';



const { items, headers, loading, error, fetchData } = useApiData({
    url: "https://laganisutra.com/api/calculate-market-cap?sector=Commercial%20Banks",
    title: "Dataset",
    columns: ['symbol', 'market_price', 'total_shares', 'market_cap', 'promoter_shares', 'free_float_shares', 'free_float_market_cap', 'quantity_traded', 'turnover_value', 'liquidity_ratio', 'trade_date', 'market_cap_weight', 'liquidity_score', 'hybrid_score']
});

onMounted(() => {
    fetchData();
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
</script>

<template>
    <Head title="Data2" />
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
      <table class="w-full border-collapse text-s">
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
              class="p-2 border border-gray-300"
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