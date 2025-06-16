<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { ref } from 'vue';

import EPS from '@/components/EPS.vue';
import EBITDA from '@/components/EBITDA.vue';
import ProfitMargin from '@/components/ProfitMargin.vue';
import CashFlowPerShare from '@/components/CashFlowPerShare.vue';
import OperatingMargin from '@/components/OperatingMargin.vue';

import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { 
    title: 'fundamentals', 
    href: '/fundamentals' 
    },
];

const selectedSector = ref('all');

const activeTab = ref('EPS');

const tabs = [
  { name: 'EPS', component: EPS },
  { name: 'EBITDA', component: EBITDA },
  { name: 'Profit Margin', component: ProfitMargin },
  { name: 'Operating Margin', component: OperatingMargin },
  { name: 'Cash Flow/Share', component: CashFlowPerShare },
];
</script>

<template>
  <Head title="Fundamentals" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-6">
      <h1 class="mb-6 text-2xl font-bold">Profitability</h1>

      <!-- Sector Select -->
      <div class="mb-4">
        <label class="block mb-2 font-medium">Select Sector:</label>
        <select v-model="selectedSector" class="border rounded px-3 py-2">
          <option value="">All Sectors</option>
          <option value="Commercial Banks">Commercial Banks</option>
          <option value="Development Banks">Development Banks</option>
          <option value="Hotels And Tourism">Hotels And Tourism</option>
          <option value="Hydro Power">Hydropower</option>
          <option value="Tradings">Tradings</option>
          <option value="Microfinance">Microfinance</option>
          <option value="Non Life Insurance">Non Life Insurance</option>
          <option value="Life Insurance">Life Insurance</option>
          <option value="Finance">Finance</option>
          <option value="Manufacturing And Processing">Manufacturing And Processing</option>
          <option value="Investment">Investment</option>
          <option value="Others">Others</option>
          <option value="Mutual Fund">Mutual Fund</option>
          <option value="Debentures">Debentures</option>
        </select>
      </div>


      <div class="mb-2 flex gap-2 border-b pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="[
            'px-4 py-2 font-semibold rounded-t-lg',
            activeTab === tab.name ? 'bg-blue-500 text-white' : 'bg-gray-100'
          ]"
          @click="activeTab = tab.name"
        >
          {{ tab.name }}
        </button>
      </div>


      <component
        :is="tabs.find(tab => tab.name === activeTab)?.component"
        :selected-sector="selectedSector"
      />
    </div>
  </AppLayout>
</template>