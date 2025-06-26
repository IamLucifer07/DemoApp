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
    name: "Interest Coverage",
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
            { key: 'ebit', label: 'EBIT' },
            { key: 'interest_expenses', label: 'Interest Expenses' },
            { key: 'interest_coverage_ratio', label: 'Interest Coverage Ratio' },
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
            interestCoverageRanges : {
                "Commercial Banks": {
                    excellent: 4.0,
                    strong: [3.0, 4.0],
                    moderate: [2.0, 3.0],
                    weak: [1.5, 2.0],
                    critical: 1.5
                },
                "Development Banks": {
                    excellent: 3.5,
                    strong: [2.5, 3.5],
                    moderate: [1.8, 2.5],
                    weak: [1.2, 1.8],
                    critical: 1.2
                },
                "Finance": {
                    excellent: 5.0,
                    strong: [4.0, 5.0],
                    moderate: [3.0, 4.0],
                    weak: [2.0, 3.0],
                    critical: 2.0
                },
                "Life Insurance": {
                    excellent: 6.0,
                    strong: [4.5, 6.0],
                    moderate: [3.0, 4.5],
                    weak: [1.8, 3.0],
                    critical: 1.8
                },
                "Non Life Insurance": {
                    excellent: 5.0,
                    strong: [3.5, 5.0],
                    moderate: [2.2, 3.5],
                    weak: [1.5, 2.2],
                    critical: 1.5
                },
                "Hydro Power": {
                    excellent: 3.0,
                    strong: [2.2, 3.0],
                    moderate: [1.5, 2.2],
                    weak: [1.0, 1.5],
                    critical: 1.0
                },
                "Microfinance": {
                    excellent: 4.5,
                    strong: [3.5, 4.5],
                    moderate: [2.5, 3.5],
                    weak: [1.8, 2.5],
                    critical: 1.8
                },
                "Manufacturing And Processing": {
                    excellent: 4.0,
                    strong: [3.0, 4.0],
                    moderate: [2.0, 3.0],
                    weak: [1.3, 2.0],
                    critical: 1.3
                },
                "Tradings": {
                    excellent: 3.5,
                    strong: [2.8, 3.5],
                    moderate: [2.0, 2.8],
                    weak: [1.5, 2.0],
                    critical: 1.5
                },
                "Hotels And Tourism": {
                    excellent: 2.5,
                    strong: [2.0, 2.5],
                    moderate: [1.3, 2.0],
                    weak: [1.0, 1.3],
                    critical: 1.0
                }
            },
            recommendations: {
                'Best': {
                interpretation: ' Easily covers interest 4–6x, indicating top-tier financial health.',
                class: 'recommendation-best'
                },
                'Better': {
                interpretation: 'Solid earnings buffer ensures reliable debt servicing.',
                class: 'recommendation-better'
                },
                // 'Good': {
                // interpretation: 'Decent profitability. Stable but not outstanding performers.',
                // class: 'recommendation-good'
                // },
                'Neutral': {
                interpretation: 'Just meets interest obligations—vulnerable to earnings decline.',
                class: 'recommendation-neutral'
                },
                'Weak': {
                interpretation: 'Ongoing covenant pressures suggest rising financial stress.',
                class: 'recommendation-weak'
                },
                'Worst': {
                interpretation: 'Default risk is high—signals urgent financial instability.',
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

                const sector = (this.selectedSector ?? '').toString().trim() || 'all';
                const url = `https://laganisutra.com/api/interest-coverage-ratio?sector=${encodeURIComponent(sector || 'all')}`;
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
            const numericFields = ['interest_expenses', 'interest_coverage_ratio'];
            return numericFields.includes(key);
        },
        
        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
            const sector = this.sectorMap?.[sectorId];
            const value = parseFloat(row.interest_coverage_ratio);
            const interestRatioRanges = this.interestCoverageRanges[sector];


            let interestRatioRating = '';
            if (interestRatioRanges && !isNaN(value)) {
            if (value >= interestRatioRanges.excellent) interestRatioRating = 'Best';
            else if (value >= interestRatioRanges.strong[0]) interestRatioRating = 'Better';
            else if (value >= interestRatioRanges.moderate[0]) interestRatioRating = 'Neutral';
            else if (value >= interestRatioRanges.weak[0]) interestRatioRating = 'Weak';
            else if (value <= interestRatioRanges.critical) interestRatioRating = 'Worst';
            }

            return interestRatioRating || 'N/A';

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
