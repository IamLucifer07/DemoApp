
<template>
  <div class="plfv-container">
    <div class="sector-selection">
      <div class="card">
        <div class="form-group">
          <label for="sector">Select Sector:</label>
          <v-select
            v-model="selectedSector"
            :options="sectors"
            @update:modelValue="fetchPLFVData"
            placeholder="Select a sector"
            :reduce="sector => sector.sector_description"
            label="sector_description"
            :style="{ width: '30%' }"
          ></v-select>
        </div>

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
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import ResultTable from './ResultTable.vue';

export default {
  name: 'PLFV',
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
        // { key: 'fiscal_year', label: 'Fiscal Year' },
        // { key: 'quarter', label: 'Quarter' },
        { key: 'eps_ttm', label: 'EPS TTM', formatFn: this.formatNumber },
        { key: 'current_eps', label: 'Current EPS', formatFn: this.formatNumber },
        { key: 'five_year_ago_eps', label: 'EPS 5 Years Ago', formatFn: this.formatNumber },
        { key: 'earnings_growth_rate', label: 'Earnings Growth Rate'},
        { key: 'pe_ratio', label: 'P/E Ratio', formatFn: this.formatNumber },
        { key: 'adjustment_factor', label: 'Adjustment Factor', formatFn: this.formatNumber },
        { key: 'plfv', label: 'PLFV', formatFn: this.formatNumber },
        // { key: 'sector', label: 'Sector' }
      ]
    };
  },
  async created() {
    await this.fetchSectors();
    if (this.sectors.length > 0) {
      this.selectedSector = this.sectors[0].sector_description;
      await this.fetchPLFVData();
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
    async fetchPLFVData() {
      if (!this.selectedSector) return;

      this.isLoading = true;
      this.results = [];
      this.errors = [];
      this.showResults = true;

      try {
        const response = await axios.get('/api/PLFV', {
          params: {
            sector: this.selectedSector
          }
        });

        if (Array.isArray(response.data)) {
          this.results = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          this.results = response.data.results;
          if (response.data.errors) {
            this.errors = response.data.errors;
          }
        }

      } catch (error) {
        console.error('Error fetching PLFV data:', error);
        this.errors.push('Failed to calculate PLFV. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    formatNumber(value) {
      return value !== null ? Number(value).toFixed(2) : '-';
    }
  }
};
</script>
