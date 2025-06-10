<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';

import { onMounted, ref, computed } from 'vue';
import { useApiData } from '@/composables/useApiData';
import { Head } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types';

const { items, headers, loading, error, fetchData } = useApiData({
    url: "https://laganisutra.com/api/symbol-sector",
    title: "Dataset",
    columns: ["sector_description","instrument","symbol"]
});


const selectedSector = ref<string>('');

// Computed property to get unique sectors
const uniqueSectors = computed(() => {
    if (!items.value || items.value.length === 0) return [];
    
    const sectors = [...new Set(items.value.map(item => item.sector_description))];
    return sectors.filter(sector => sector && sector.trim() !== '').sort();
});

// Computed property to filter items based on selected sector
const filteredItems = computed(() => {
    if (!selectedSector.value || selectedSector.value === '') {
        return items.value;
    }
    
    return items.value.filter(item => 
        item.sector_description === selectedSector.value
    );
});

const handleSectorChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    selectedSector.value = target.value;
};

const clearFilter = () => {
    selectedSector.value = '';
};

onMounted(() => {
    fetchData();
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sectors',
        href: '/sectorrs',
    },
];
</script>

<template>
    <Head title="Sectors" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <h1 class="mb-6 text-2xl font-bold">Sectors</h1>
            
            <div v-if="loading" class="p-8 text-center text-gray-500">
                Loading data...
            </div>
            
            <div v-if="error" class="p-4 mb-6 text-red-600 bg-red-100 rounded">
                {{ error }}
            </div>
            
            <!-- Filter Section -->
            <div v-if="!loading && !error && items.length > 0" class="mb-6">
                <div class="flex items-center gap-4">
                    <label for="sector-filter" class="font-medium text-gray-700">
                        Filter by Sector:
                    </label>
                    <select 
                        id="sector-filter"
                        :value="selectedSector"
                        @change="handleSectorChange"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Sectors</option>
                        <option 
                            v-for="sector in uniqueSectors" 
                            :key="sector" 
                            :value="sector"
                        >
                            {{ sector }}
                        </option>
                    </select>
                    
                    <button 
                        v-if="selectedSector"
                        @click="clearFilter"
                        class="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                        Clear Filter
                    </button>
                </div>
                
                <!-- Results count -->
                <div class="mt-2 text-sm text-gray-600">
                    Showing {{ filteredItems.length }} of {{ items.length }} records
                    <span v-if="selectedSector" class="font-medium">
                        (filtered by: {{ selectedSector }})
                    </span>
                </div>
            </div>
            
            <!-- Table -->
            <div v-if="!loading && !error && items.length > 0" class="overflow-x-auto">
                <table class="w-full border-collapse even:bg-white-50">
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
                            v-for="item in filteredItems"
                            :key="item.id"
                            class="hover:bg-lime-100 odd:bg-gray-100"
                        >
                            <td
                                v-for="header in headers"
                                :key="header"
                                class="p-1 border border-gray-300"
                            >
                                {{ item[header] || '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- No results message -->
                <div v-if="filteredItems.length === 0" class="p-8 text-center text-gray-500">
                    No records found for the selected sector.
                </div>
            </div>
        </div>
    </AppLayout>
</template>