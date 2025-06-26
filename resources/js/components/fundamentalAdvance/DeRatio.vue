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
    name: "DeRatio",
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
                { key: "fiscal_year", label: "Fiscal Year" },
                { key: "quarter", label: "Quarter" },
                { key: "debt", label: "Debt (Rs.)" },
                { key: "equity", label: "Equity (Rs.)" },
                { key: "total_assets", label: "Total Assets" },

                {
                    key: "de_ratio",
                    label: "D/E Ratio",
                    formatFn: this.formatNumber,
                },
                {
                    key: "debt_to_assets",
                    label: "D/A Ratio",
                    formatFn: this.formatNumber,
                },
                {
                    key: "financial_leverage_ratio",
                    label: "Financial Leverage Ratio",
                    formatFn: this.formatNumber,
                },
                { key: "recommendation", label: "Recommendation" }
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
            deRatioRanges : {
              "Commercial Banks": {
                  low : 0,
                  moderate: [6.0, 10.0],
                  high: 10.0
              },
              "Development Banks": {
                  low : 0,
                  moderate: [5.0, 9.0],
                  high: 9.0
              },
              "Finance": {
                  low: 5.0,
                  moderate: [5.0, 8.0],
                  high: 8.0
              },
              "Microfinance": {
                  low: 4.0,
                  moderate: [4.0, 7.0],
                  high: 7.0
              },
              "Non Life Insurance": {
                  low: 0.4,
                  moderate: [0.4, 0.8],
                  high: 0.8
              },
              "Life Insurance": {
                  low: 0.3,
                  moderate: [0.3, 0.6],
                  high: 0.6
              },
              "Hydro Power": {
                  low: 1.0,
                  moderate: [1.0, 2.0],
                  high: 2.0
              },
              "Manufacturing And Processing": {
                  low: 0.5,
                  moderate: [0.5, 1.2],
                  high: 1.2
              },
              "Hotels And Tourism": {
                  low: 0.5,
                  moderate: [0.5, 1.2],
                  high: 1.2
              },
              "Tradings": {
                  low: 0.5,
                  moderate: [0.5, 1.0],
                  high: 1.0
              },
              "Investment": {
                  low: 0.3,
                  moderate: [0.3, 0.5],
                  high: 0.5
              }
            },
            recommendations: {
                'Best': {
                interpretation: 'Low Leverage = Safer, financially conservative (low debt risk).',
                class: 'recommendation-best'
                },
                'Better': {
                interpretation: 'Better than average.',
                class: 'recommendation-better'
                },
                'Good': {
                interpretation: 'Decent.',
                class: 'recommendation-good'
                },
                'Neutral': {
                interpretation: 'Moderate Leverage = Acceptable; balance between growth & risk.',
                class: 'recommendation-neutral'
                },
                'Weak': {
                interpretation: 'High Leverage = Riskier, especially under earnings or interest rate pressure.',
                class: 'recommendation-weak'
                },
                'Worst': {
                interpretation: 'Very poor, Avoid.',
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
                const url = `https://pro.laganisutra.com/api/calculate-de-ratio?sector=${this.selectedSector}`;
                const response = await axios.get(url, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                });

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
            // if (typeof value === 'string') {
            //     value = value.replace(/,/g, '').trim();
            // }
            // const num = Number(value);
            // return isNaN(num) ? 'N/A' : num.toFixed(2);
             return Number(value).toFixed(2);
        },
        
        isNumericField(key) {
            const numericFields = ['de_ratio', 'debt_to_assets', 'financial_leverage_ratio'];
            return numericFields.includes(key);
        },
        
        getRecommendation(row) {
            const sectorId = this.selectedSector;
            const value = parseFloat(row.de_ratio);
            const ranges = this.deRatioRanges[sectorId];


            let Rating = '';
            if (ranges && !isNaN(value)) {
            if (value < ranges.low) Rating = 'Best';
            // else if (value >= ranges.strong[0]) Rating = 'Better';
            else if (value >= ranges.moderate[0]) Rating = 'Neutral';
            else if (value >= ranges.high[0]) Rating = 'Weak';
            // else if (value <= ranges.critical) Rating = 'Worst';
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