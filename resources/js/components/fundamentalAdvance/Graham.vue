<template>
  <div class="graham-ratio-container">
    <!-- Sector Selection -->
    <div class="sector-selection">
      <div class="card">
        <div class="form-group">
          <label for="sector">Select Sector:</label>
          <v-select v-model="selectedSector" :options="sectors" @update:modelValue="fetchGrahamData"
            placeholder="Select a sector" :reduce="sector => sector.sector_description" label="sector_description"
            :style="{ width: '30%' }"></v-select>
        </div>

        <!-- Using the ResultTable component -->
        <ResultTable :columns="tableColumns" :results="results" :errors="errors" :isLoading="isLoading"
          :showResults="showResults" :formatNumber="formatNumber" />
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
  name: 'Graham',
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
        { key: 'fiscal_year', label: 'Fiscal Year' },
        { key: 'quarter', label: 'Quarter' },
        { key: 'eps', label: 'EPS', formatFn: this.formatNumber },
        { key: 'book_value', label: 'Book Value', formatFn: this.formatNumber },
        { key: 'graham_number', label: 'Graham Number', formatFn: this.formatNumber },
        { key: 'price_to_graham', label: 'Price to Graham', formatFn: this.formatNumber },
      ]
    };
  },
  async created() {
    await this.fetchSectors();
    // Set the first sector as selected after sectors are loaded
    if (this.sectors.length > 0) {
      this.selectedSector = this.sectors[0].sector_description;
      // Manually call fetchGrahamData after setting the initial sector
      await this.fetchGrahamData();
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
    async fetchGrahamData() {
      if (!this.selectedSector) return;

      this.isLoading = true;
      this.results = [];
      this.errors = [];
      this.showResults = true;

      try {
        const response = await axios.post('/api/calculate-graham', {
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
        console.error('Error calculating Graham number:', error);
        this.errors.push('Failed to calculate Graham number. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    formatNumber(value) {
      if (value === null || value === undefined) return 'N/A';
      const num = parseFloat(value);
      return isNaN(num) ? 'N/A' : num.toFixed(2);
    }
  }
};
</script>