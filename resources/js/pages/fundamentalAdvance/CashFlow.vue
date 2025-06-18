<template>
  <div class="cash-flow-container">
    <!-- Sector Selection -->
    <div class="sector-selection">
      <div class="card">
          <div class="form-group">
            <label for="sector">Select Sector:</label>
            <v-select
              v-model="selectedSector"
              :options="sectors"
              @update:modelValue="fetchCashFlowData"
              placeholder="Select a sector"
              :reduce="sector => sector.sector_description"
              label="sector_description"
              :style="{ width: '30%' }"
            ></v-select>
          </div>

      <!-- Results Section -->
      <div class="results-section" style="max-height: 500px; overflow-y: auto">
        <ResultTable
          :columns="tableColumns"
          :results="results"
          :errors="errors"
          :isLoading="isLoading"
          :showResults="showResults"
          :formatNumber="formatNumber"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import ResultTable from './ResultTable.vue';

export default {
  name: 'CashFlowAnalysis',
  components: { 
    vSelect,
    ResultTable
  },
  data() {
    return {
      sectors: [],
      selectedSector: null,
      results: [],
      errors: [],
      isLoading: false,
      showResults: false,
      tableColumns: [
        { key: 'symbol', label: 'Symbol' },
        { key: 'net_profit', label: 'Net Profit', formatFn: this.formatNumber },
        { key: 'non_cash_expenses', label: 'Non-Cash Exp', formatFn: this.formatNumber },
        { key: 'current_working_capital', label: 'Curr WC', formatFn: this.formatNumber },
        { key: 'previous_working_capital', label: 'Prev WC', formatFn: this.formatNumber },
        { key: 'working_capital_changes', label: 'WC Changes', formatFn: this.formatNumber },
        // { key: 'working_capital_calculation', label: 'WC Calc' },
        { key: 'cfo', label: 'CFO', formatFn: this.formatNumber },
        { key: 'cfo_calculation', label: 'CFO Calc' }
      ]
    };
  },
  async created() {
    await this.fetchSectors();
    if (this.sectors.length > 0) {
      this.selectedSector = this.sectors[0].sector_description;
      await this.fetchCashFlowData(); // This line ensures data loads for first sector
    }
  },
  methods: {
    async fetchSectors() {
      try {
        const response = await axios.get('/api/symbol-sector');
        this.sectors = response.data;
      } catch (error) {
        console.error('Error fetching sectors:', error);
        this.errors.push('Failed to load sectors. Please try again later.');
      }
    },
    async fetchCashFlowData() {
      if (!this.selectedSector) return;

      this.isLoading = true;
      this.results = [];
      this.errors = [];
      this.showResults = true;

      try {
        const response = await axios.post('/api/calculate-cash-flow', {
          sector: this.selectedSector
        });
        
        if (Array.isArray(response.data)) {
          this.results = response.data;
        } else if (response.data && response.data.data) {
          this.results = response.data.data;
        }
        
        if (response.data && response.data.errors) {
          this.errors = response.data.errors;
        }
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
        this.errors.push('Failed to load cash flow data. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    formatNumber(value) {
      if (value === 'N/A' || value === null || value === undefined) return '0';
      if (typeof value === 'string') {
        const num = parseFloat(value.replace(/,/g, ''));
        return isNaN(num) ? '0' : num.toLocaleString();
      }
      return value.toLocaleString();
    }
  }
};
</script>
