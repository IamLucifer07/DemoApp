<template>
  <div class="financial-metrics-container">
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading financial data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errors.length > 0" class="alert alert-danger">
      <h5>Errors occurred:</h5>
      <ul class="mb-0">
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <!-- Results Table -->
    <div v-if="showResults && results.length > 0" class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th v-for="column in tableColumns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(result, index) in results" 
            :key="index"
            :class="getRowClass(result)"
            :title="getRowTooltip(result)"
          >
            <td v-for="column in tableColumns" :key="column.key">
              <template v-if="column.key === 'recommendation'">
                <span 
                  class="recommendation-badge"
                  :class="getRecommendationClass(getRecommendation(result))"
                  :title="getRecommendationTooltip(getRecommendation(result))"
                >
                  {{ getRecommendation(result) }}
                </span>
              </template>
              <template v-else-if="isNumericField(column.key)">
                {{ formatNumber(result[column.key]) }}
              </template>
              <template v-else>
                {{ result[column.key] || '-' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Results State -->
    <div v-else-if="showResults && results.length === 0" class="text-center py-4">
      <p class="text-muted">No financial data available for the selected sector.</p>
    </div>
  
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: "EquityRatio",
    props: {
    selectedSector: {
      type: [String, Number],
      default: null
    }
  },
    data() {
        return {
            results: [],
            errors: [],
            isLoading: false,
            showResults: false,
           tableColumns: [
            { key: 'symbol', label: 'Symbol' },
            { key: 'fiscal_year', label: 'Fiscal Year' },
            { key: 'quarter', label: 'Quarter' },
            { key: 'shareholders_equity', label: 'Shareholders Equity' },
            { key: 'total_asset', label: 'Total Asset' },
            { key: 'equity_ratio', label: 'Equity Ratio' },
            { key: 'recommendation', label: 'Recommendation' },
          ],
          sectorMap: {
                "37": "Commercial Banks",
                "38": "Manufacturing And Processing",
                "39": "Hotels And Tourism",
                "40": "Others",
                "41": "Hydro Power",
                "42": "Tradings",
                "43": "Non Life Insurance",
                "44": "Development Banks",
                "45": "Finance",
                "49": "Microfinance",
                "50": "Life Insurance",
                "67": "Investment",
            },
            equityRatioRanges: {
              "37": { very_strong: 60, strong: [50, 60], moderate: [40, 50], weak: [30, 40], very_weak: 30 },
              "44": { very_strong: 50, strong: [40, 50], moderate: [30, 40], weak: [20, 30], very_weak: 20 },
              "45": { very_strong: 45, strong: [35, 45], moderate: [25, 35], weak: [15, 25], very_weak: 15 },
              "50": { very_strong: 70, strong: [60, 70], moderate: [50, 60], weak: [40, 50], very_weak: 40 },
              "43": { very_strong: 70, strong: [60, 70], moderate: [50, 60], weak: [40, 50], very_weak: 40 },
              "41": { very_strong: 55, strong: [45, 55], moderate: [35, 45], weak: [25, 35], very_weak: 25 },
              "49": { very_strong: 40, strong: [30, 40], moderate: [20, 30], weak: [10, 20], very_weak: 10 },
              "38": { very_strong: 50, strong: [40, 50], moderate: [30, 40], weak: [20, 30], very_weak: 20 },
              "42": { very_strong: 35, strong: [25, 35], moderate: [15, 25], weak: [8, 15], very_weak: 8 },
              "67": { very_strong: 35, strong: [25, 35], moderate: [15, 25], weak: [8, 15], very_weak: 8 },
              "40": { very_strong: 35, strong: [25, 35], moderate: [15, 25], weak: [8, 15], very_weak: 8 },
              "39": { very_strong: 45, strong: [35, 45], moderate: [25, 35], weak: [15, 25], very_weak: 15 }
            },
            recommendations: {
                'Best': {
                interpretation: 'Exceptionally conservative capital structure with minimal debt reliance.',
                class: 'recommendation-best'
                },
                'Better': {
                interpretation: 'Comfortable equity cushion with balanced debt-equity mix.',
                class: 'recommendation-better'
                },
                'Good': {
                interpretation: 'Comfortable equity cushion with balanced debt-equity mix.',
                class: 'recommendation-good'
                },
                'Neutral': {
                interpretation: 'Manageable leverage but vulnerable to financial stress.',
                class: 'recommendation-neutral'
                },
                'Weak': {
                interpretation: 'Heavy debt dependence with limited financial flexibility.',
                class: 'recommendation-weak'
                },
                'Worst': {
                interpretation: 'Critically over-leveraged with high insolvency risk.',
                class: 'recommendation-worst'
                }
            },
        };
    },
    watch: {
    selectedSector: {
      handler() {
        if (this.selectedSector) {
          this.getFinancialMetrics();
        }
      },
      immediate: true
    }
},
    methods: {
        async getFinancialMetrics() {
            this.isLoading = true;
            this.results = [];
            this.errors = [];
            this.showResults = true;

            try {
                const sectorId = this.selectedSector?.toString().trim() || 'all';
                const url = `https://laganisutra.com/api/equity-ratio?sector=${encodeURIComponent(sectorId)}`;
                const response = await axios.get(url);

                if (Array.isArray(response.data)) {
                    this.results = response.data;
                } else if (response.data && response.data.errors) {
                    this.errors = response.data.errors;
                } else {
                    this.errors.push('Unexpected response format.');
                }
            } catch (error) {
                if (error.response) {
                    this.errors.push(`API error: ${error.response.data.message || 'Unknown error.'}`);
                } else {
                    this.errors.push('Network or CORS error. Check the console for more info.');
                }
            } finally {
                this.isLoading = false;
            }
        },
        formatNumber(value) {
            if (typeof value === 'string') {
                value = value.replace(/,/g, '').trim();
            }
            const num = Number(value);
            return isNaN(num) ? 'N/A' : num.toFixed(2);
        },
        
        isNumericField(key) {
            const numericFields = ['equity_ratio'];
            return numericFields.includes(key);
        },
        
        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
          
            const value = parseFloat(row.equity_ratio);
            const ranges = this.equityRatioRanges[sectorId]; 


            let Rating = '';
            if (ranges && !isNaN(value)) {
            if (value >= ranges.very_strong) Rating = 'Best';
            else if (value >= ranges.strong[0]) Rating = 'Better';
            else if (value >= ranges.moderate[0]) Rating = 'Neutral';
            else if (value >= ranges.weak[0]) Rating = 'Weak';
            else if (value <= ranges.very_weak) Rating = 'Worst';
            }

            return Rating || 'N/A';

        },

        getRecommendationClass(recommendation) {
        return this.recommendations[recommendation]?.class || 'recommendation-neutral';
        },
        
        getRecommendationTooltip(recommendation) {
        return this.recommendations[recommendation]?.interpretation || '';
        },

        getRowClass(result) {
        const recommendation = this.getRecommendation(result);
        return this.getRecommendationClass(recommendation);
        },
        
        getRowTooltip(result) {
        const recommendation = this.getRecommendation(result);
        return this.getRecommendationTooltip(recommendation);
        }
  },
};
</script>
<style scoped src="resources/css/fundamental.css"></style>