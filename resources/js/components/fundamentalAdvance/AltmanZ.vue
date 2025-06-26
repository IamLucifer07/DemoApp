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
    name: "AltmanZ",
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
            { key: 'altman_z_score', label: 'Altman Z Score' },
            { key: 'recommendation', label: 'Recommendation' },
          ],
          sectorMap: {
                "Commercial Banks": "37",
                "Development Banks": "44",
                "Finance": "45",
                "Microfinance": "49",
                "Non Life Insurance": "43",
                "Life Insurance": "50",
                "Hydro Power": "41",
                "Hotels And Tourism": "39",
                "Manufacturing And Processing": "38",
                "Tradings": "42",
                "Investment": "67",
                "Others": "40"
            },
            recommendations: {
                'Best': {
                interpretation: 'Company is financially sound, low bankruptcy risk.',
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
                interpretation: 'Warning zone; financial caution needed.',
                class: 'recommendation-neutral'
                },
                'Weak': {
                interpretation: 'High risk of bankruptcy or severe financial trouble within 1–2 years.',
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
                const sectorName = this.selectedSector?.toString().trim() || 'all';
                const sectorId = this.sectorMap[sectorName] || sectorName;
                const url = `https://laganisutra.com/api/altman-z?sector=${encodeURIComponent(sectorId)}`;
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
            // if (typeof value === 'string') {
            //     value = value.replace(/,/g, '').trim();
            // }
            // const num = Number(value);
            // return isNaN(num) ? 'N/A' : num.toFixed(2);
            return Number(value).toFixed(2);
        },
        
        isNumericField(key) {
            const numericFields = ['altman_z_score'];
            return numericFields.includes(key);
        },
        
        getRecommendation(row) {

            const value = parseFloat(row.altman_z_score);

            let Rating = '';
            if ( !isNaN(value)) {
            if (value >=  2.99) Rating = 'Best';
            else if (value > 1.89 && value <= 2.99 ) Rating = 'Neutral';
            // else if (value > 20 && value <= 25 ) Rating = 'Neutral';
            // else if (value > 25 && value < 30 ) Rating = 'Weak';
            else if (value <= 1.89) Rating = 'Weak';
            // else Rating = 'Worst';
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