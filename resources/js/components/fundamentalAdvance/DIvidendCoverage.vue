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
    name: "Dividend Coverage",
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
            { key: 'eps', label: 'EPS' },
            { key: 'total_listed_share', label: 'No of Shares' },
            { key: 'dividend_per_share', label: 'Dividend Per Share' },
            { key: 'dividend_coverage_ratio', label: 'Dividend Coverage Ratio' },
            { key: 'recommendation', label: 'Recommendation' },
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
        dividendCoverageRanges : {
            "Commercial Banks": {
                ultra_safe: 3.5,
                strong: [2.5, 3.5],
                moderate: [1.8, 2.5],
                weak: [1.2, 1.8],
                dangerous: 1.2
            },
            "Development Banks": {
                ultra_safe: 4.0,
                strong: [3.0, 4.0],
                moderate: [2.2, 3.0],
                weak: [1.5, 2.2],
                dangerous: 1.5
            },
            "Finance": {
                ultra_safe: 3.0,
                strong: [2.2, 3.0],
                moderate: [1.5, 2.2],
                weak: [1.0, 1.5],
                dangerous: 1.0
            },
            "Life Insurance": {
                ultra_safe: 5.0,
                strong: [3.5, 5.0],
                moderate: [2.5, 3.5],
                weak: [1.8, 2.5],
                dangerous: 1.8
            },
            "Non LifeInsurance": {
                ultra_safe: 4.0,
                strong: [3.0, 4.0],
                moderate: [2.0, 3.0],
                weak: [1.3, 2.0],
                dangerous: 1.3
            },
            "Hydro Power": {
                ultra_safe: 2.5,
                strong: [2.0, 2.5],
                moderate: [1.5, 2.0],
                weak: [1.1, 1.5],
                dangerous: 1.1
            },
            "Microfinance": {
                ultra_safe: 4.5,
                strong: [3.5, 4.5],
                moderate: [2.5, 3.5],
                weak: [1.8, 2.5],
                dangerous: 1.8
            },
            "Manufacturing And Processing": {
                ultra_safe: 3.5,
                strong: [2.8, 3.5],
                moderate: [2.0, 2.8],
                weak: [1.3, 2.0],
                dangerous: 1.3
            },
            "Tradings": {
                ultra_safe: 2.0,
                strong: [1.6, 2.0],
                moderate: [1.2, 1.6],
                weak: [0.8, 1.2],
                dangerous: 0.8
            },
            "Hotels And Tourism": {
                ultra_safe: 3.0,
                strong: [2.2, 3.0],
                moderate: [1.5, 2.2],
                weak: [1.0, 1.5],
                dangerous: 1.0
            }
        },
        recommendations: {
            'Best': {
            interpretation: 'Dividends well-covered by earnings (3–5x+), offering top-tier security for income investors.',
            class: 'recommendation-best'
            },
            'Better': {
            interpretation: 'Solid 2–3x coverage ensures reliable payouts—ideal for long-term holdings.',
            class: 'recommendation-better'
            },
            'Good': {
            interpretation: 'Just enough coverage, but sensitive to earnings dips—requires regular monitoring.',
            class: 'recommendation-good'
            },
            'Neutral': {
            interpretation: 'Just enough coverage, but sensitive to earnings dips—requires regular monitoring.',
            class: 'recommendation-neutral'
            },
            'Weak': {
            interpretation: 'Reliant on reserves or debt—dividend cut risk is rising, reduce exposure.',
            class: 'recommendation-weak'
            },
            'Worst': {
            interpretation: 'Unsustainable payouts exceeding earnings—signals crisis, exit immediately.',
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
                const sector = (this.selectedSector ?? '').toString().trim() || 'all';
                const url = `https://laganisutra.com/api/dividend-payout-ratio?sector=${encodeURIComponent(sector || 'all')}`;
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
                value = value.replace(',', '').trim();
            }
            const num = Number(value);
            return isNaN(num) ? 'N/A' : num.toFixed(2);
        },
        isNumericField(key) {
            const numericFields = ['eps', 'dividend_per_share', 'dividend_coverage_ratio', 'total_listed_share'];
            return numericFields.includes(key);
        },

        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
            const sector = this.sectorMap?.[sectorId] || this.selectedSector;
            const value = parseFloat(row.dividend_coverage_ratio);
            const ranges = this.dividendCoverageRanges[sector];

            let dividendCoverageRating = '';
            if (ranges && !isNaN(value)) {
            if (value >= ranges.ultra_safe) dividendCoverageRating = "Best";
            else if (value >= ranges.strong[0]) dividendCoverageRating = "Better";
            else if (value >= ranges.moderate[0]) dividendCoverageRating = "Good";
            else if (value >= ranges.weak[0]) dividendCoverageRating = "Neutral";
            else if (value >= ranges.dangerous) dividendCoverageRating = "Weak";    
            }

            return dividendCoverageRating || 'N/A';

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
