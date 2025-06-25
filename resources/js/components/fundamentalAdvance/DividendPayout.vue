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
    name: "Dividend Ratio",
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
            { key: 'paid_up_capital', label: 'Paid Up Capital' },
            { key: 'dividend', label: 'Cash Dividend' },
            { key: 'net_income', label: 'Net Income' },
            { key: 'dividend_paid', label: 'Dividend Paid' },
            { key: 'dividend_payout_ratio', label: 'Payout Ratio' },
            { key: 'retention_ratio', label: 'Retention Ratio' },
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
        dividendPayoutRanges : {
            "Commercial Banks": {
                sustainable: 40,
                moderate: [40, 55],
                high: [55, 70],
                excessive: [70, 85],
                unsustainable: 85
            },
            "Development Banks": {
                sustainable: 35,
                moderate: [35, 50],
                high: [50, 65],
                excessive: [65, 80],
                unsustainable: 80
            },
            "Finance": {
                sustainable: 45,
                moderate: [45, 60],
                high: [60, 75],
                excessive: [75, 90],
                unsustainable: 90
            },
            "Life Insurance": {
                sustainable: 50,
                moderate: [50, 65],
                high: [65, 80],
                excessive: [80, 95],
                unsustainable: 95
            },
            "Non Life Insurance": {
                sustainable: 40,
                moderate: [40, 55],
                high: [55, 70],
                excessive: [70, 85],
                unsustainable: 85
            },
            "Hydro Power": {
                sustainable: 60,
                moderate: [60, 75],
                high: [75, 90],
                excessive: [90, 110],
                unsustainable: 110
            },
            "Microfinance": {
                sustainable: 30,
                moderate: [30, 45],
                high: [45, 60],
                excessive: [60, 75],
                unsustainable: 75
            },
            "Manufacturing And Processing": {
                sustainable: 50,
                moderate: [50, 65],
                high: [65, 80],
                excessive: [80, 95],
                unsustainable: 95
            },
            "Tradings": {
                sustainable: 70,
                moderate: [70, 85],
                high: [85, 100],
                excessive: [100, 120],
                unsustainable: 120
            },
            "Hotels And Tourism": {
                sustainable: 55,
                moderate: [55, 70],
                high: [70, 85],
                excessive: [85, 100],
                unsustainable: 100
            }
        },
        recommendations: {
            'Best': {
            interpretation: 'Strong retained earnings support long-term growth, ideal for patient investors.',
            class: 'recommendation-best'
            },
            'Better': {
            interpretation: 'Balanced payout strategy remains stable under normal conditions, suitable for income-focused portfolios.',
            class: 'recommendation-better'
            },
            'Good': {
            interpretation: 'Balanced payout strategy remains stable under normal conditions, suitable for income-focused portfolios.',
            class: 'recommendation-good'
            },
            'Neutral': {
            interpretation: 'Limited reinvestment signals risk in downturns—monitor dividend sustainability.',
            class: 'recommendation-neutral'
            },
            'Weak': {
            interpretation: 'Dividends funded by debt or reserves signal looming crisis—avoid or exit immediately.',
            class: 'recommendation-weak'
            },
            'Worst': {
            interpretation: 'Dividends funded by debt or reserves signal looming crisis—avoid or exit immediately.',
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
            return Number(value).toFixed(2);
        },
        isNumericField(key) {
            const numericFields = ['dividend_payout_ratio', 'retention_ratio', 'eps', 'dividend_per_share', 'dividend_coverage_ratio'];
            return numericFields.includes(key);
        },

        getRecommendation(row) {
            const sectorId = String(this.selectedSector || "").trim();
            const sector = this.sectorMap?.[sectorId] || this.selectedSector;
            const value = parseFloat(row.dividend_payout_ratio);

            const ranges = this.dividendPayoutRanges[sector];
            let dividendPayoutRating = '';
            if (ranges && !isNaN(value)) {
            if (value <= ranges.sustainable) dividendPayoutRating = "Weak";
            else if (value <= ranges.moderate[0]) dividendPayoutRating = "Neutral";
            else if (value <= ranges.high[0]) dividendPayoutRating = "Good";
            else if (value <= ranges.excessive[0]) dividendPayoutRating = "Better";
            else if (value <= ranges.unsustainable) dividendPayoutRating = "Best";    
            }

            return dividendPayoutRating || 'N/A';

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
