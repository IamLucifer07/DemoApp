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
    name: "Current Ratio",
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
                { key: "symbol", label: "Symbol" },
                { key: "total_current_assets", label: "Current Assets" },
                { key: "total_current_liabilities", label: "Current Liabilities"},
                { key: "current_ratio", label: "Current Ratio" },
                { key: "quick_ratio", label: "Quick Ratio" },
                { key: "recommendation", label: "Recommendation" },
            ],
            sectorMap: {
                "37": "Commercial Banks",
                "44": "Development Banks",
                "45": "Finance",
                "49": "Microfinance",
                "43": "Non Life Insurance",
                "50": "Life Insurance",
                "41": "Hydro Power",
                "39": "Hotels And Tourism",
                "38": "Manufacturing And Processing",
                "42": "Tradings",
                "67": "Investment",
                "40": "Others"
            },
            currentRatioRatingRanges: {
                "Commercial Banks": {
                high_growth: 0.25,steady_growth: [0.12, 0.25],stable: [0.05, 0.12],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Development Banks": {
                high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
                },
                "Finance": {
                high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
                },
                "Hydro Power": {
                 high_growth: 0.35,steady_growth: [0.20, 0.35],stable: [0.10, 0.20],declining: [0.0, 0.10],loss_making: 0.0
                },
                "Non Life Insurance": {
                high_growth: 0.40,steady_growth: [0.25, 0.40],stable: [0.15, 0.25],declining: [0.0, 0.15],loss_making: 0.0
                },
                "Life Insurance": {
                high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.05, 0.15],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Manufacturing And Processing": {
                high_growth: 0.25,steady_growth: [0.15, 0.25],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
                },
                "Tradings": {
                high_growth: 0.20,steady_growth: [0.12, 0.20],stable: [0.05, 0.12],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Hotels And Tourism": {
                high_growth: 0.25,steady_growth: [0.15, 0.25],stable: [0.05, 0.15],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Microfinance": {
                high_growth: 0.50,steady_growth: [0.20, 0.50],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Investment": {
                high_growth: 0.40,steady_growth: [0.20, 0.40],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
                },
                "Others": {
                high_growth: 0.35,steady_growth: [0.20, 0.35],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
                }
            },
            recommendations: {
                'Best': {
                interpretation: 'Excellent short-term financial health. The company has more than enough current assets to cover liabilities.',
                class: 'recommendation-best'
                },
                'Better': {
                interpretation: 'Strong liquidity position. Comfortably meets short-term obligations.',
                class: 'recommendation-better'
                },
                // 'Good': {
                // interpretation: 'Decent profitability. Stable but not outstanding performers.',
                // class: 'recommendation-good'
                // },
                'Neutral': {
                interpretation: 'Barely sufficient liquidity. The company can meet obligations but has little buffer.',
                class: 'recommendation-neutral'
                },
                'Weak': {
                interpretation: 'Potential liquidity risk. Struggles to cover short-term debts without additional cash flow.',
                class: 'recommendation-weak'
                },
                'Worst': {
                interpretation: 'High financial distress. Likely unable to pay short-term liabilities without restructuring or new financing.',
                class: 'recommendation-worst'
                }
            }
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
                const sectorDescription = this.sectorMap[this.selectedSector] || 'all';
                const url = `https://laganisutra.com/api/calculate-current-ratio?sector=${(sectorDescription)}`;

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
            return Number(value).toFixed(2);
        },
        
        isNumericField(key) {
            const numericFields = ['current_ratio', 'quick_ratio'];
            return numericFields.includes(key);
        },
        
        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
            const sector = this.sectorMap?.[sectorId];
            const currentRatioValue = parseFloat(row.current_ratio);
            const currentRatioRanges = this.currentRatioRatingRanges[sector];

            // === Current Ratio classification ===

            let currentRatioRating = '';
            if (currentRatioRanges && !isNaN(currentRatioValue)) {
            if (currentRatioValue >= currentRatioRanges.high_growth) currentRatioRating = 'Best';
            else if (currentRatioValue >= currentRatioRanges.steady_growth[0]) currentRatioRating = 'Better';
            else if (currentRatioValue >= currentRatioRanges.stable[0]) currentRatioRating = 'Neutral';
            else if (currentRatioValue >= currentRatioRanges.declining[0]) currentRatioRating = 'Weak';
            else currentRatioRating = 'Worst';
            }

            return currentRatioRating || 'N/A';

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
