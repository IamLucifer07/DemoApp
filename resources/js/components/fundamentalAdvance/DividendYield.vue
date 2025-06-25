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
    name: "DividendYield",
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
                {
                    key: "price_per_share",
                    label: "Price per Share",
                    formatFn: this.formatNumber,
                },
                {
                    key: "annual_dividends",
                    label: "Annual Dividends",
                    formatFn: this.formatNumber,
                },
                {
                    key: "dividend_yield",
                    label: "Dividend Yield",
                    formatFn: this.formatNumber,
                },
                {
                    key: "dividend_yield_percent",
                    label: "Yield Percentage",
                    formatFn: (value) => (value ? `${value}%` : "-"),
                },
                {
                    key: "recommendation",label: "Recommendation",
                },
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
        dividendYieldRanges : {
            "Commercial Banks": {
                high_yield: 6,
                attractive: [4.5, 6],
                moderate: [3, 4.5],
                low: [1.5, 3],
                negligible: 1.5
            },
            "Development Banks": {
                high_yield: 5.5,
                attractive: [4, 5.5],
                moderate: [2.8, 4],
                low: [1.2, 2.8],
                negligible: 1.2
            },
            "Finance": {
                high_yield: 7,
                attractive: [5, 7],
                moderate: [3.5, 5],
                low: [2, 3.5],
                negligible: 2
            },
            "Life Insurance": {
                high_yield: 4,
                attractive: [3, 4],
                moderate: [2, 3],
                low: [1, 2],
                negligible: 1
            },
            "Non Life Insurance": {
                high_yield: 5,
                attractive: [3.5, 5],
                moderate: [2.2, 3.5],
                low: [1, 2.2],
                negligible: 1
            },
            "Hydro Power": {
                high_yield: 8,
                attractive: [6, 8],
                moderate: [4, 6],
                low: [2, 4],
                negligible: 2
            },
            "Microfinance": {
                high_yield: 5,
                attractive: [3.8, 5],
                moderate: [2.5, 3.8],
                low: [1.2, 2.5],
                negligible: 1.2
            },
            "Manufacturing And Processing": {
                high_yield: 6.5,
                attractive: [5, 6.5],
                moderate: [3.5, 5],
                low: [2, 3.5],
                negligible: 2
            },
            "Tradings": {
                high_yield: 9,
                attractive: [7, 9],
                moderate: [5, 7],
                low: [3, 5],
                negligible: 3
            },
            "Hotels And Tourism": {
                high_yield: 4.5,
                attractive: [3.2, 4.5],
                moderate: [2, 3.2],
                low: [1, 2],
                negligible: 1
            }
        },
        recommendations: {
            'Best': {
            interpretation: 'Prioritizes steady income, ideal for income-seeking investors with a healthy (<70%) payout ratio.',
            class: 'recommendation-best'
            },
            'Better': {
            interpretation: 'Offers a balanced mix of dividends and growth, suited for total return investors.',
            class: 'recommendation-better'
            },
            'Good': {
            interpretation: 'Focuses on growth with some dividends, appealing to long-term investors eyeing future yield.',
            class: 'recommendation-good'
            },
            'Neutral': {
            interpretation: 'Focuses on growth with some dividends, appealing to long-term investors eyeing future yield.',
            class: 'recommendation-neutral'
            },
            'Weak': {
            interpretation: 'Retains earnings for expansion, favored by speculative growth investors; check how funds are reinvested.',
            class: 'recommendation-weak'
            },
            'Worst': {
            interpretation: 'Lacks a dividend policy, typically attracts traders and may indicate financial instability.',
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
                const url =  `https://laganisutra.com/api/calculate-dividend-yield?sector=${encodeURIComponent(sectorDescription || 'all')}`;
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
            return value !== null ? Number(value).toFixed(4) : "-";
        },
        isNumericField(key) {
            const numericFields = ['dividend_yield', 'dividend_yield_percent'];
            return numericFields.includes(key);
        },

        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
            const sector = this.sectorMap?.[sectorId] || this.selectedSector;
            const value = parseFloat(row.dividend_yield_percent);
            
            const ranges = this.dividendYieldRanges[sector];
            let dividendYieldRating = '';
            if (ranges && !isNaN(value)) {
                if (value >= ranges.high_yield) dividendYieldRating = "Best";
                else if (value >= ranges.attractive[0]) dividendYieldRating = "Better";
                else if (value >= ranges.moderate[0]) dividendYieldRating=  "Neutral";
                else if (value >= ranges.low[0]) dividendYieldRating=  "Weak";
                else if (value <= ranges.negligible) dividendYieldRating=  "Worst";
            }
            return dividendYieldRating || 'N/A';

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

