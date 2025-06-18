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
import axios from 'axios';

export default {
  name: 'EPS',
  
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
        { key: 'eps', label: 'EPS' },
        { key: 'roe', label: 'ROE (%)' },
        { key: 'pb_ratio', label: 'P/B Ratio' },
        { key: 'pe_ratio', label: 'P/E Ratio' },
        { key: 'net_income', label: 'Net Income' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'gross_profit', label: 'Gross Profit' },
        { key: 'recommendation', label: 'Recommendation' }
      ],
      epsRatingRanges: {
      "Commercial Banks": {
        best: 40, better: [25, 40], good: [15, 25], neutral: [10, 15], weak: [5, 10], worst: 5
      },
      "Hydro Power": {
        best: 30, better: [20, 30], good: [12, 20], neutral: [8, 12], weak: [4, 8], worst: 4
      },
      "Non Life Insurance": {
        best: 25, better: [15, 25], good: [10, 15], neutral: [6, 10], weak: [3, 6], worst: 3
      },
      "Life Insurance": {
        best: 20, better: [12, 20], good: [8, 12], neutral: [5, 8], weak: [2, 5], worst: 2
      },
      "Manufacturing And Processing": {
        best: 15, better: [10, 15], good: [7, 10], neutral: [4, 7], weak: [2, 4], worst: 2
      },
      "Tradings": { 
        best: 12, better: [8, 12], good: [5, 8], neutral: [3, 5], weak: [1, 3], worst: 1
      },
      "Hotels And Tourism": {
        best: 10, better: [6, 10], good: [4, 6], neutral: [2, 4], weak: [1, 2], worst: 1
      },
      "Development Banks": {
        best: 18, better: [12, 18], good: [8, 12], neutral: [5, 8], weak: [3, 5], worst: 3
      },
      "Microfinance": {
        best: 15, better: [10, 15], good: [6, 10], neutral: [4, 6], weak: [2, 4], worst: 2
      },
      "Finance": {
        best: 15, better: [10, 15], good: [6, 10], neutral: [4, 6], weak: [2, 4], worst: 2
      },
      "Others": {
        best: 10, better: [7, 10], good: [5, 7], neutral: [3, 5], weak: [1, 3], worst: 1
      }
    },
    roeRanges : {
        "Commercial Banks": {
            exceptional: 20,
            strong: [15, 20],
            moderate: [10, 15],
            weak: [5, 10],
            poor: 5
        },
        "Development Banks": {
            exceptional: 18,
            strong: [13, 18],
            moderate: [8, 13],
            weak: [4, 8],
            poor: 4
        },
        "Finance": {
            exceptional: 25,
            strong: [20, 25],
            moderate: [15, 20],
            weak: [10, 15],
            poor: 10
        },
        "Life Insurance": {
            exceptional: 22,
            strong: [17, 22],
            moderate: [12, 17],
            weak: [7, 12],
            poor: 7
        },
        "Non Life Insurance": {
            exceptional: 18,
            strong: [14, 18],
            moderate: [9, 14],
            weak: [5, 9],
            poor: 5
        },
        "Hydro Power": {
            exceptional: 30,
            strong: [25, 30],
            moderate: [20, 25],
            weak: [15, 20],
            poor: 15
        },
        "Microfinance": {
            exceptional: 28,
            strong: [22, 28],
            moderate: [16, 22],
            weak: [10, 16],
            poor: 10
        },
        "Manufacturing And Processing": {
            exceptional: 35,
            strong: [28, 35],
            moderate: [20, 28],
            weak: [12, 20],
            poor: 12
        },
        "Tradings": {
            exceptional: 40,
            strong: [32, 40],
            moderate: [24, 32],
            weak: [15, 24],
            poor: 15
        },
        "Hotels And Tourism": {
            exceptional: 25,
            strong: [20, 25],
            moderate: [15, 20],
            weak: [8, 15],
            poor: 8
        }
    },
    peRatingRanges: {
        "Commercial Banks": {
            overvalued: 20,
            fairlyvalued: [12, 20],
            undervalued: 12
        },
        "Development Banks": {
            overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        },
        "Finance": {
            overvalued: 18,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Hydro Power": {
            overvalued: 30,
            fairlyvalued: [18, 25],
            undervalued: 18
        },
        "Non Life Insurance": {
            overvalued: 22,
            fairlyvalued: [12, 18],
            undervalued: 12
        },
        "Life Insurance": {
            overvalued: 25,
            fairlyvalued: [15, 20],
            undervalued: 15
        },
        "Microfinance": {
            overvalued: 18,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Manufacturing And Processing": {
            overvalued: 25,
            fairlyvalued: [12, 20],
            undervalued: 12
        },
        "Tradings": {
           overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        },
        "Hotels And Tourism": {
            overvalued: 25,
            fairlyvalued: [15, 20],
            undervalued: 15
        },
        "Investment": {
            overvalued: 15,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Others": {
            overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        }
    },
    pbRatingRanges: {
        "Commercial Banks": {
            overvalued: 2.0,
            fairlyvalued: [1.2, 2.0],
            undervalued: 1.2
        },
        "Development Banks": {
            overvalued: 1.5,
            fairlyvalued: [0.8, 1.5],
            undervalued: 0.8
        },
        "Finance": {
            overvalued: 1.6,
            fairlyvalued: [0.9, 1.6],
            undervalued: 0.9
        },
        "Hydro Power": {
            overvalued: 2.8,
            fairlyvalued: [1.5, 2.8],
            undervalued: 1.5
        },
        "Non Life Insurance": {
            overvalued: 2.0,
            fairlyvalued: [1.1, 2.0],
            undervalued: 1.1
        },
        "Life Insurance": {
            overvalued: 2.2,
            fairlyvalued: [1.3, 2.2],
            undervalued: 1.3
        },
        "Microfinance": {
            overvalued: 1.7,
            fairlyvalued: [1.0, 1.7],
            undervalued: 1.0
        },
        "Manufacturing And Processing": {
            overvalued: 3.0,
            fairlyvalued: [2.0, 3.0],
            undervalued: 2.0
        },
        "Tradings": {
           overvalued: 1.5,
            fairlyvalued: [0.7, 1.5],
            undervalued: 0.7
        },
        "Hotels And Tourism": {
            overvalued: 2.0,
            fairlyvalued: [1.0, 2.0],
            undervalued: 1.0
        },
        "Investment": {
            overvalued: 1.8,
            fairlyvalued: [0.8, 1.8],
            undervalued: 0.8
        },
        "Others": {
            overvalued: 1.5,
            fairlyvalued: [0.7, 1.5],
            undervalued: 0.7
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
        const response = await axios.get('https://laganisutra.com/api/database-values?sector='+this.selectedSector || 'all');
        
        if (Array.isArray(response.data)) {
          this.results = response.data;
        } else if (response.data && response.data.errors) {
          this.errors = response.data.errors;
        }
      } catch (error) {
        console.error('Error fetching financial metrics:', error);
        this.errors.push('Failed to retrieve EPS data. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    
    formatNumber(value) {
      return Number(value).toFixed(2);
    },
    
    isNumericField(key) {
      const numericFields = ['eps', 'roe', 'pb_ratio', 'pe_ratio', 'net_income', 'revenue', 'gross_profit'];
      return numericFields.includes(key);
    },
    
     getRecommendation(row) {
        const sector = (this.selectedSector || '').trim();

        const epsValue = parseFloat(row.eps);
        const roeValue = parseFloat(row.roe);
        const pbValue = parseFloat(row.pb_ratio);
        const peValue = parseFloat(row.pe_ratio);

        let score = 0;

        // === EPS classification ===
        const epsRanges = this.epsRatingRanges[sector];
        let epsRating = '';
        if (epsRanges && !isNaN(epsValue)) {
          if (epsValue >= epsRanges.best) epsRating = 'Best';
          else if (epsValue >= epsRanges.better[0]) epsRating = 'Better';
          else if (epsValue >= epsRanges.good[0]) epsRating = 'Good';
          else if (epsValue >= epsRanges.neutral[0]) epsRating = 'Neutral';
          else if (epsValue >= epsRanges.weak[0]) epsRating = 'Weak';
          else epsRating = 'Worst';
        }

        // Score EPS
        if (epsRating === 'Best') score += 3;
        else if (epsRating === 'Better') score += 2;
        else if (epsRating === 'Good') score += 1;
        else if (epsRating === 'Neutral') score += 0;
        else if (epsRating === 'Weak') score -= 1;
        else if (epsRating === 'Worst') score -= 2;

        // === ROE classification ===
        const roeRanges = this.roeRanges[sector];
        let roeRating = '';
        if (roeRanges && !isNaN(roeValue)) {
          if (roeValue >= roeRanges.exceptional) roeRating = 'Exceptional';
          else if (roeValue >= roeRanges.strong[0]) roeRating = 'Strong';
          else if (roeValue >= roeRanges.moderate[0]) roeRating = 'Moderate';
          else if (roeValue >= roeRanges.weak[0]) roeRating = 'Weak';
          else roeRating = 'Poor';
        }

        // Score ROE
        if (roeRating === 'Exceptional') score += 3;
        else if (roeRating === 'Strong') score += 2;
        else if (roeRating === 'Moderate') score += 1;
        else if (roeRating === 'Weak') score += 0;
        else if (roeRating === 'Poor') score -= 2;

        // === PB classification ===
        const pbRanges = this.pbRatingRanges[sector];
        let pbRating = '';
        if (pbRanges && !isNaN(pbValue)) {
          if (pbValue >= pbRanges.overvalued) pbRating = 'Over Valued';
          else if (pbValue >= pbRanges.fairlyvalued[0]) pbRating = 'Fairly Valued';
          else pbRating = 'Under Valued';
        }

        // Score PB
        if (pbRating === 'Under Valued') score += 1;
        else if (pbRating === 'Fairly Valued') score += 2;
        else if (pbRating === 'Over Valued') score += 3;

        // === PE classification ===
        const peRanges = this.peRatingRanges[sector];
        let peRating = '';
        if (peRanges && !isNaN(peValue)) {
          if (peValue >= peRanges.overvalued) peRating = 'Over Valued';
          else if (peValue >= peRanges.fairlyvalued[0]) peRating = 'Fairly Valued';
          else peRating = 'Under Valued';
        }

        // Score PE
        if (peRating === 'Under Valued') score += 1;
        else if (peRating === 'Fairly Valued') score += 2;
        else if (peRating === 'Over Valued') score += 3;

        // === Final Recommendation ===
        if (score >= 9) return 'Best';
        else if (score >= 7) return 'Better';
        else if (score >= 5) return 'Good';
        else if (score >= 3) return 'Neutral';
        else if (score >= 1) return 'Weak';
        else return 'Worst';
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