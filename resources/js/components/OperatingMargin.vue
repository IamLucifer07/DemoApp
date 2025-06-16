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
  name: 'OperatingMargin',
  
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
        { key: 'operating_income', label: 'Operating Income' },
        { key: 'previous_year_operating_income', label: 'Previous Year Operating Income' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'operating_margin', label: 'Operating Margin (%)' },
        { key: 'operating_income_growth', label: 'Operating Income Growth (%)' },
        { key: 'recommendation', label: 'Recommendation' }
      ],
      recommendations: {
        'Best': {
          interpretation: 'Exceptional operating performance. Industry leaders with strong efficiency.',
          class: 'recommendation-best'
        },
        'Better': {
          interpretation: 'Above-average operating performance. Well-managed companies with good cost control.',
          class: 'recommendation-better'
        },
        'Good': {
          interpretation: 'Decent operating performance. Stable but not outstanding performers.',
          class: 'recommendation-good'
        },
        'Neutral': {
          interpretation: 'Marginal operating performance. Needs monitoring for improvement.',
          class: 'recommendation-neutral'
        },
        'Weak': {
          interpretation: 'Concerning operating performance. May indicate efficiency challenges.',
          class: 'recommendation-weak'
        },
        'Worst': {
          interpretation: 'Dangerous zone. Often loss-making or near-zero operating margins.',
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
        this.errors.push('Failed to load Operating Margin data. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    
    formatNumber(value) {
      return Number(value).toFixed(2);
    },
    
    isNumericField(key) {
      const numericFields = ['operating_income', 'previous_year_operating_income', 'revenue', 
                           'operating_margin', 'operating_income_growth'];
      return numericFields.includes(key);
    },
    
    getRecommendation(row) {
      // Logic to determine recommendation based on operating metrics
      const operatingMargin = parseFloat(row.operating_margin) || 0;
      const operatingGrowth = parseFloat(row.operating_income_growth) || 0;
      
      // Calculate a composite score
      let score = 0;
      
      // Operating Margin scoring
      if (operatingMargin > 20) score += 3;
      else if (operatingMargin > 15) score += 2;
      else if (operatingMargin > 10) score += 1;
      else if (operatingMargin < 5) score -= 1;
      else if (operatingMargin < 0) score -= 2;
      
      // Operating Income Growth scoring
      if (operatingGrowth > 25) score += 3;
      else if (operatingGrowth > 15) score += 2;
      else if (operatingGrowth > 5) score += 1;
      else if (operatingGrowth < 0) score -= 1;
      else if (operatingGrowth < -10) score -= 2;
      
      // Determine recommendation based on total score
      if (score >= 5) return 'Best';
      else if (score >= 3) return 'Better';
      else if (score >= 1) return 'Good';
      else if (score >= -1) return 'Neutral';
      else if (score >= -3) return 'Weak';
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