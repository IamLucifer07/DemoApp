<template>
  <div class="financial-metrics-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading cash flow data...</p>
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
      <p class="text-muted">No Cash Flow/Share data available for the selected sector.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CashFlowPerShare",

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
        { key: 'operating_cash_flow', label: 'Operating Cash Flow' },
        { key: 'number_of_shares', label: 'Number of Shares' },
        { key: 'cash_flow_per_share', label: 'Cash Flow Per Share' },
        { key: 'capital_expenditure', label: 'Capital Expenditure' },
        { key: 'free_cash_flow', label: 'Free Cash Flow' },
        { key: 'recommendation', label: 'Recommendation' }
      ],
      cashFlowPerShareRanges : {
        "37": {
            exceptional: 45,strong: [30, 45],moderate: [18, 30],weak: [8, 18],critical: 8
          },
        "44": {
            exceptional: 35,strong: [25, 35],moderate: [15, 25],weak: [6, 15],critical: 6
          },
        "45": {
            exceptional: 50,strong: [40, 50],moderate: [25, 40],weak: [12, 25],critical: 12
          },
        "50": {
            exceptional: 55,strong: [45, 55],moderate: [30, 45],weak: [15, 30],critical: 15
          },
        "43": {
            exceptional: 40,strong: [30, 40],moderate: [20, 30],weak: [10, 20],critical: 10
          },
        "41": {
            exceptional: 60,strong: [45, 60],moderate: [30, 45], weak: [15, 30], critical: 15
          },
        "49": {
            exceptional: 30,strong: [22, 30],moderate: [14, 22],weak: [6, 14],critical: 6
          },
        "38": {
            exceptional: 38,strong: [28, 38],moderate: [18, 28],weak: [8, 18],critical: 8
          },
        "42": {
            exceptional: 42,strong: [32, 42],moderate: [20, 32],weak: [10, 20],critical: 10
          },
        "39": {
            exceptional: 28,strong: [20, 28],moderate: [12, 20],weak: [5, 12],critical: 5
          }
    },
      recommendations: {
        'Best': {
          interpretation: 'Excellent cash flow health. Strong financial position.',
          class: 'recommendation-best'
        },
        'Better': {
          interpretation: 'Healthy cash flow generation. Positive outlook.',
          class: 'recommendation-better'
        },
        'Good': {
          interpretation: 'Adequate cash flow. Stable operations.',
          class: 'recommendation-good'
        },
        'Neutral': {
          interpretation: 'Average performance. No major concern.',
          class: 'recommendation-neutral'
        },
        'Weak': {
          interpretation: 'Low cash flow. Monitor financials closely.',
          class: 'recommendation-weak'
        },
        'Worst': {
          interpretation: 'Negative or critical cash flow. Financial distress possible.',
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
        const url = `https://pro.laganisutra.com/api/cash-flow-pershare?sector=${encodeURIComponent(sector || 'all')}`;

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
      const numericFields = [
        'operating_cash_flow',
        'number_of_shares',
        'cash_flow_per_share',
        'capital_expenditure',
        'free_cash_flow'
      ];
      return numericFields.includes(key);
    },

    getRecommendation(row) {
        const sector = String(this.selectedSector || "").trim();

        const cfpsValue = parseFloat(row.cash_flow_per_share);

        
        // === Cash Flow Per Share classification ===
        const cfpsRanges = this.cashFlowPerShareRanges[sector];
        let cfpsRating = '';
        if (cfpsRanges && !isNaN(cfpsValue)) {
          if (cfpsValue >= cfpsRanges.exceptional) {
            cfpsRating = 'Best';
          } else if (cfpsValue >= cfpsRanges.strong[0]) {
            cfpsRating = 'Better';
          } else if (cfpsValue >= cfpsRanges.moderate[0]) {
            cfpsRating = 'Neutral';
          } else if (cfpsValue >= cfpsRanges.weak[0]) {
            cfpsRating = 'Weak';
          } else {
            cfpsRating = 'Worst';
          }
        } 
        
        return cfpsRating || 'N/A';
        
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
  }
};
</script>
<style scoped src="resources/css/fundamental.css"></style>
