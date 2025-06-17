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

    <!-- No Results -->
    <div v-else-if="showResults && results.length === 0" class="text-center py-4">
      <p class="text-muted">No financial data available for the selected sector.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EBITDA',
  props: {
    selectedSector: {
      type: String,
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
        { key: 'market_capitalization', label: 'Market Capitalization' },
        { key: 'total_debt', label: 'Total Debt' },
        { key: 'cash_and_cash_equivalent', label: 'Cash Equivalent' },
        { key: 'ev_ebitda', label: 'EV/EBITDA' },
        { key: 'recommendation', label: 'Recommendation' }
      ],
      ebitdaRatingRanges: {
        "Commercial Banks": {
            overvalued: 10.0,
            fairlyvalued: [6.0, 10.0],
            undervalued: 6.0
        },
        "Development Banks": {
            overvalued: 8.5,
            fairlyvalued: [5.0, 8.5],
            undervalued: 5.0
        },
        "Finance": {
            overvalued: 7.5,
            fairlyvalued: [4.5, 7.5],
            undervalued: 4.5
        },
        "Hydro Power": {
            overvalued: 15.0,
            fairlyvalued: [8.0, 15.0],
            undervalued: 8.0
        },
        "Non Life Insurance": {
            overvalued: 11.0,
            fairlyvalued: [6.0, 11.0],
            undervalued: 6.0
        },
        "Life Insurance": {
            overvalued: 12.0,
            fairlyvalued: [7.0, 12.0],
            undervalued: 7.0
        },
        "Microfinance": {
            overvalued: 9.5,
            fairlyvalued: [5.5, 9.5],
            undervalued: 5.5
        },
        "Manufacturing And Processing": {
            overvalued: 12.0,
            fairlyvalued: [6.5, 12.0],
            undervalued: 6.5
        },
        "Tradings": {
            overvalued: 7.0,
            fairlyvalued: [3.5, 7.0],
            undervalued: 3.5
        },
        "Hotels And Tourism": {
            overvalued: 15.0,
            fairlyvalued: [8.0, 15.0],
            undervalued: 8.0
        },
        "Investment": {
            overvalued: 9.0,
            fairlyvalued: [5.0, 9.0],
            undervalued: 5.0
        },
        "Others": {
            overvalued: 7.0,
            fairlyvalued: [3.5, 7.0],
            undervalued: 3.5
        }
    },
      recommendations: {
        'Best': {
          interpretation: 'Exceptional profitability. Industry leaders with strong competitive advantages.',
          class: 'recommendation-best'
        },
        'Better': {
          interpretation: 'Above-average profitability. Well-managed companies with growth potential.',
          class: 'recommendation-better'
        },
        'Good': {
          interpretation: 'Decent profitability. Stable but not outstanding performers.',
          class: 'recommendation-good'
        },
        'Neutral': {
          interpretation: 'Marginal profitability. Needs monitoring for improvement.',
          class: 'recommendation-neutral'
        },
        'Weak': {
          interpretation: 'Concerning profitability. May indicate operational challenges.',
          class: 'recommendation-weak'
        },
        'Worst': {
          interpretation: 'Dangerous zone. Often loss-making or near-zero profitability.',
          class: 'recommendation-worst'
        }
      }
    };
  },
  watch: {
    selectedSector: {
      handler() {
        if (this.selectedSector) this.getFinancialMetrics();
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
        const url = `https://pro.laganisutra.com/api/EvEbitda?sector=${encodeURIComponent(sector || 'all')}`;

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
      return isNaN(value) ? '-' : Number(value).toFixed(2);
    },

    isNumericField(key) {
      return ['market_capitalization', 'total_debt', 'cash_and_cash_equivalent', 'ev_ebitda'].includes(key);
    },

    getRecommendation(row) {
      const sector = String(this.selectedSector || "").trim();

        const ebitdaValue = parseFloat(row.ev_ebitda);
  
        let score = 0;

        // === EBITDA classification ===
        const ebitdaRanges = this.ebitdaRatingRanges[sector];
        let ebitdaRating = '';
        if (ebitdaRanges && !isNaN(ebitdaValue)) {
          if (ebitdaValue >= ebitdaRanges.overvalued) ebitdaRating = 'Best';
          else if (ebitdaValue >= ebitdaRanges.fairlyvalued[0]) ebitdaRating = 'Neutral';
          else if (ebitdaValue >= ebitdaRanges.undervalued[0]) ebitdaRating = 'Weak';
        }

        // Score EBITDA
        if (ebitdaRating === 'Best') score = 5;
        else if (ebitdaRating === 'Neutral') score += 2;
        else if (ebitdaRating === 'Weak') score += 1;
      
        // Final recommendation 
        if (score = 5) return 'Best';
        else if (score >= 2) return 'Neutral';
        else if (score >= 1) return 'Weak';
      },

    getRecommendationClass(recommendation) {
      return this.recommendations[recommendation]?.class || 'recommendation-neutral';
    },

    getRecommendationTooltip(recommendation) {
      return this.recommendations[recommendation]?.interpretation || '';
    },

    getRowClass(result) {
      return this.getRecommendationClass(this.getRecommendation(result));
    },

    getRowTooltip(result) {
      return this.getRecommendationTooltip(this.getRecommendation(result));
    }
  }
};
</script>

<style scoped>
.financial-metrics-container {
  width: 100%;
}


.table-responsive {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  font-size: 14px;
  border: 1px solid rgb(216, 215, 215);
  border-radius: 8px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table th {
  border-top: none;
  font-weight: 500;
  color: #495057;
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.custom-table td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.custom-table tbody tr {
  transition: all 0.2s ease;
}

.custom-table tbody tr:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

/* Legend styling */
.legend-container {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 1rem;
}

.legend-title {
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
  font-size: 16px;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.legend-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  min-width: 60px;
  text-align: center;
}

.legend-badge.recommendation-best {
  background-color: #2e7d32;
  color: white;
}

.legend-badge.recommendation-better {
  background-color: #388e3c;
  color: white;
}

.legend-badge.recommendation-good {
  background-color: #689f38;
  color: white;
}

.legend-badge.recommendation-neutral {
  background-color: #f57c00;
  color: white;
}

.legend-badge.recommendation-weak {
  background-color: #d32f2f;
  color: white;
}

.legend-badge.recommendation-worst {
  background-color: #b71c1c;
  color: white;
}

.legend-description {
  font-size: 13px;
  color: #6c757d;
  line-height: 1.4;
  flex: 1;
}

.mb-3 {
  margin-bottom: 1rem;
}

/* Responsive legend adjustments */
@media (max-width: 768px) {
  .legend-items {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .legend-item {
    padding: 6px 10px;
  }
  
  .legend-badge {
    padding: 3px 6px;
    font-size: 10px;
    min-width: 50px;
  }
  
  .legend-description {
    font-size: 12px;
  }
}

/* Recommendation badge styling */
.recommendation-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: help;
  z-index: 99;
}

/* Recommendation badge styling */
.recommendation-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: help;
}

/* Recommendation row background colors */
.recommendation-best {
  background-color: #e8f5e8 !important;
}

.recommendation-best .recommendation-badge {
  background-color: #2e7d32 !important;
  color: white !important;
}

.recommendation-better {
  background-color: #e8f5e8 !important;
}

.recommendation-better .recommendation-badge {
  background-color: #388e3c !important;
  color: white !important;
}

.recommendation-good {
  background-color: #f1f8e9 !important;
}

.recommendation-good .recommendation-badge {
  background-color: #689f38 !important;
  color: white !important;
}

.recommendation-neutral {
  background-color: #f4f4f4 !important;
}

.recommendation-neutral .recommendation-badge {
  background-color: #7d7d7d !important;
  color: white !important;
}

.recommendation-weak {
  background-color: #ffebee !important;
}

.recommendation-weak .recommendation-badge {
  background-color: #d32f2f !important;
  color: white !important;
}

.recommendation-worst {
  background-color: #ffcdd2 !important;
}

.recommendation-worst .recommendation-badge {
  background-color: #b71c1c !important;
  color: white !important;
}


/* Loading spinner */
.spinner-border {
  width: 2rem;
  height: 2rem;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.text-primary {
  color: #007bff !important;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Alert styling */
.alert {
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert h5 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.alert ul {
  margin-bottom: 0;
  padding-left: 1.5rem;
}

.mb-0 {
  margin-bottom: 0;
}

.text-muted {
  color: #6c757d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-table {
    font-size: 12px;
  }
  
  .custom-table th,
  .custom-table td {
    padding: 8px 4px;
  }
  
  .recommendation-badge {
    padding: 3px 6px;
    font-size: 10px;
  }
}

/* Custom scrollbar for table */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>