<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Summary', href: '/summary' },
];

const selectedSector = ref('37');
const selectedCategory = ref('Profitability');

const sectors = ref<{ sector_id: number; sector_description: string; symbols: string[]; companies: any[] }[]>([]);
const allCompanies = ref<any[]>([]);
const fundamentalData = ref<CompanyFundamentalData[]>([]);
const loading = ref(false);

interface CompanyFundamentalData {
  script_id: string;
  symbol: string;
  company_name: string;
  sector_id: number;
  sector_description: string;
  valuation_metrics: {
    pe_ratio: number | null;
    peg_ratio: number | null;
    p_s_ratio?: number | null;
    ev_ebitda?: number | null;
    price_to_cash_flow?: number | null;
  };
  profitability_metrics: {
    roe: number | null;
    roa: number | null;
    net_profit_margin: number | null;
    gross_profit_margin?: number | null;
    operating_margin?: number | null;
    ebitda_margin?: number | null;
  };
  liquidity_metrics: {
    current_ratio: number | null;
    quick_ratio?: number | null;
    cash_ratio?: number | null;
    cash_flow_ratio?: number | null;
    working_capital_ratio?: number | null;
  };
  leverage_metrics?: {
    debt_to_equity?: number | null;
    debt_to_assets?: number | null;
    interest_coverage_ratio?: number | null;
  };
}
interface Company {
  sector_id: number;
  sector_description: string;
  symbol: string;
  script_id: string;
  company_name?: string;
}

const fundamentalCategories = {
    'Profitability': ['ROE', 'ROA', 'Net Profit Margin', 'Gross Profit Margin', 'Operating Margin', 'EBITDA Margin'],
    'Liquidity': ['Current Ratio', 'Quick Ratio', 'Cash Ratio', 'Cash Flow Ratio', 'Working Capital Ratio'],
    'Leverage': ['Debt to Equity', 'Debt to Assets', 'Interest Coverage Ratio', 'Debt Service Coverage', 'Equity Multiplier'],
    'Valuation': ['P/E Ratio', 'P/B Ratio', 'P/S Ratio', 'EV/EBITDA', 'PEG Ratio', 'Price to Cash Flow'],
    'Dividends': ['Dividend Yield', 'Dividend Payout Ratio', 'Dividend Coverage Ratio', 'Dividend Growth Rate'],
    'Efficiency': ['Asset Turnover', 'Inventory Turnover', 'Receivables Turnover', 'Total Asset Turnover'],
    'Growth': ['Revenue Growth', 'Earnings Growth', 'Book Value Growth', 'Cash Flow Growth']
};

const getRecommendationRanges = (metric: string, sectorId: string) => {
    const ranges: Record<string, any> = {
        'ROE': { excellent: [15, 100], good: [10, 15], average: [5, 10], poor: [0, 5] },
        'ROA': { excellent: [8, 100], good: [5, 8], average: [2, 5], poor: [0, 2] },
        'Current Ratio': { excellent: [2, 3], good: [1.5, 2], average: [1, 1.5], poor: [0, 1] },
        'Debt to Equity': { excellent: [0, 0.3], good: [0.3, 0.6], average: [0.6, 1], poor: [1, 100] },
        'P/E Ratio': { excellent: [10, 15], good: [15, 20], average: [20, 25], poor: [25, 100] },
        'Dividend Yield': { excellent: [4, 8], good: [2, 4], average: [1, 2], poor: [0, 1] }
    };
    
    return ranges[metric] || { excellent: [0, 100], good: [0, 100], average: [0, 100], poor: [0, 100] };
};

const getRecommendation = (value: number | null, metric: string, sectorId: string) => {
    if (value === null) return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
    
    const ranges = getRecommendationRanges(metric, sectorId);
    
    if (value >= ranges.excellent[0] && value <= ranges.excellent[1]) {
        return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
    } else if (value >= ranges.good[0] && value <= ranges.good[1]) {
        return { text: 'Good', class: 'bg-blue-100 text-blue-800' };
    } else if (value >= ranges.average[0] && value <= ranges.average[1]) {
        return { text: 'Average', class: 'bg-yellow-100 text-yellow-800' };
    } else {
        return { text: 'Poor', class: 'bg-red-100 text-red-800' };
    }
};

const availableSubcategories = computed(() => {
    return fundamentalCategories[selectedCategory.value as keyof typeof fundamentalCategories] || [];
});

const getMetricValue = (company: CompanyFundamentalData, metric: string): number | null => {
    const metricMap: Record<string, string> = {
        // Profitability
        'ROE': 'profitability_metrics.roe',
        'ROA': 'profitability_metrics.roa',
        'Net Profit Margin': 'profitability_metrics.net_profit_margin',
        // Liquidity
        'Current Ratio': 'liquidity_metrics.current_ratio',
        // Add all other metrics...
    };

    const path = metricMap[metric];
    if (!path) return null;

    const value = path.split('.').reduce((obj, key) => {
        return obj?.[key] ?? null;
    }, company as any);

    return typeof value === 'number' ? value : null;
};

const fetchSectors = async () => {
    try {
        const response = await axios.get<Company[]>('https://laganisutra.com/api/symbol-id-sector');
        allCompanies.value = response.data;
        
        const sectorMap = new Map<number, {
            sector_id: number;
            sector_description: string;
            symbols: string[];
            companies: Company[];
        }>();

        response.data.forEach((company: Company) => {
            if (!sectorMap.has(company.sector_id)) {
                sectorMap.set(company.sector_id, {
                    sector_id: company.sector_id,
                    sector_description: company.sector_description,
                    symbols: [],
                    companies: []
                });
            }
            
            const sector = sectorMap.get(company.sector_id);
            if (sector) {
                sector.symbols.push(company.symbol);
                sector.companies.push(company);
            }
        });
        
        sectors.value = Array.from(sectorMap.values());
    } catch (error) {
        console.error('Error fetching sectors:', error);
    }
};

const fetchFundamentalData = async () => {
    loading.value = true;
    try {
        let selectedCompanies = [];
        
        if (selectedSector.value === 'all') {
            selectedCompanies = allCompanies.value.slice(0, 10);
        } else {
            // Convert both to numbers for comparison
            const sector = sectors.value.find(s => 
                s.sector_id.toString() === selectedSector.value.toString()
            );
            selectedCompanies = sector ? sector.companies : [];
        }

        if (selectedCompanies.length === 0) {
            console.log('No companies found for selected sector', selectedSector.value);
            fundamentalData.value = [];
            return;
        }

        // Test with just one company first
        // const testCompany = selectedCompanies[0];
        // console.log('Testing with company:', testCompany);
        
        // try {
        //     const summaryRes = await axios.get(`https://laganisutra.com/api/fundamentals/company-summary/${testCompany.script_id}`);
        //     console.log('Test API response:', summaryRes.data);
        //     const companyData = Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data;
        //     console.log('Processed company data:', companyData);
        // } catch (testError) {
        //     console.error('Test API call failed:', testError);
        // }

        // Fetch fundamental data for selected companies (limited to 5 for now)
        const companyDataPromises = selectedCompanies.slice(0, 5).map(async (company) => {
            try {
                const summaryRes = await axios.get(`https://laganisutra.com/api/fundamentals/company-summary/${company.script_id}`);
                const apiData = Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data;
                
                // Transform the API data to our structure
                const result: CompanyFundamentalData = {
                script_id: company.script_id,
                symbol: company.symbol,
                company_name: company.company_name || company.symbol,
                sector_id: company.sector_id,
                sector_description: company.sector_description,
                valuation_metrics: {
                    pe_ratio: parseFloat(apiData.growth_metrics?.pe_ratio) || null,
                    peg_ratio: parseFloat(apiData.growth_metrics?.peg_ratio) || null,
                  //  book_value: parseFloat(apiData.valuation_metrics?.book_value) || null,
                    // ... other valuation metrics
                },
                profitability_metrics: {
                    roe: parseFloat(apiData.profitability_metrics?.roe) || null,
                    roa: parseFloat(apiData.leverage_metrics?.roa) || null,
                    net_profit_margin: parseFloat(apiData.profitability_metrics?.net_profit_margin) || null,
                    // ... other profitability metrics
                },
                liquidity_metrics: {
                    current_ratio: parseFloat(apiData.liquidity_metrics?.current_ratio) || null,
                    cash_ratio: parseFloat(apiData.liquidity_metrics?.cash_ratio) || null,
                    // quick_ratio: parseFloat(apiData.liquidity_metrics?.quick_ratio) || null,
                    // ... other liquidity metrics
                },
                // ... other categories
                };
                
                return result;
            } catch (error) {
                console.error(`Error processing ${company.symbol}:`, error);
                return null;
            }
        });


        const results = await Promise.allSettled(companyDataPromises);
        const processedData = results
            .filter((result): result is PromiseFulfilledResult<CompanyFundamentalData> => 
                result.status === 'fulfilled' && result.value !== null
            )
            .map(result => result.value);
            
        // console.log('Final processed data:', processedData);
        fundamentalData.value = processedData;
            
    } catch (error) {
        console.error('Error fetching fundamental data:', error);
        fundamentalData.value = [];
    } finally {
        loading.value = false;
    }
};

watch(selectedCategory, () => {
    fetchFundamentalData();
}, { immediate: false });

watch(selectedSector, () => {
    fetchFundamentalData();
}, { immediate: false });

onMounted(async() => {
   await fetchSectors();
   await fetchFundamentalData();
});
</script>

<template>
    <Head title="Summary" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <h1 class="mb-6 text-2xl font-bold">Fundamental Analysis Summary</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Category Select -->
                <div>
                    <label class="block mb-2 font-medium">Select Category:</label>
                    <select 
                        v-model="selectedCategory" 
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option 
                            v-for="(subcategories, category) in fundamentalCategories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                    </select>
                </div>

                <!-- Sector Select -->
                <div>
                    <label class="block mb-2 font-medium">Select Sector:</label>
                    <select 
                        v-model="selectedSector" 
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Sectors</option>
                        <option
                            v-for="sector in sectors"
                            :key="sector.sector_id"
                            :value="sector.sector_id"
                        >
                            {{ sector.sector_description }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Data Table -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b">
                    <h2 class="text-lg font-semibold text-gray-800">
                        {{ selectedCategory }} Analysis
                    </h2>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-100 z-10">
                                    Company
                                </th>
                                <th 
                                    v-for="subcategory in availableSubcategories"
                                    :key="subcategory"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {{ subcategory }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="loading">
                            <!-- Loading state -->
                            </tr>
                            <tr v-else-if="fundamentalData.length === 0">
                            <!-- No data state -->
                            </tr>
                            <tr 
                            v-else
                            v-for="company in fundamentalData"
                            :key="company.symbol"
                            class="hover:bg-gray-50"
                            >
                            <td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r">
                                <div>
                                <div class="text-sm font-medium text-gray-900">{{ company.symbol }}</div>
                                <!-- <div class="text-sm text-gray-500">{{ company.company_name }}</div> -->
                                </div>
                            </td>
                            <td 
                                v-for="subcategory in availableSubcategories"
                                :key="subcategory"
                                class="px-6 py-4 whitespace-nowrap"
                            >
                                <div class="flex flex-col items-center">
                                <div class="text-sm font-medium text-gray-900 mb-1">
                                    {{ getMetricValue(company, subcategory)?.toFixed(2) ?? 'N/A' }}
                                </div>
                                <span 
                                    :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    getRecommendation(getMetricValue(company, subcategory), subcategory, selectedSector).class
                                    ]"
                                >
                                    {{ getRecommendation(getMetricValue(company, subcategory), subcategory, selectedSector).text }}
                                </span>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Legend -->
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Recommendation Legend:</h4>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            Excellent
                        </span>
                        <span class="text-sm text-gray-600">Strong performance</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            Good
                        </span>
                        <span class="text-sm text-gray-600">Above average</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                            Average
                        </span>
                        <span class="text-sm text-gray-600">Market average</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            Poor
                        </span>
                        <span class="text-sm text-gray-600">Below expectations</span>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>