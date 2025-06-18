<template>
  <div class="market-cap-container">
    <!-- Sector Selection -->
    <div class="sector-selection">
      <div class="card">
        <div class="form-group">
          <label for="sector">Select Sector:</label>
          <v-select
            v-model="selectedSector"
            :options="sectors"
            @update:modelValue="fetchMarketCapData"
            placeholder="Select a sector"
            :reduce="sector => sector.sector_description"
            label="sector_description"
            :style="{ width: '30%' }"
          ></v-select>
        </div>

        <!-- Using the ResultTable component -->
        <ResultTable
          :columns="tableColumns"
          :results="results"
          :errors="errors"
          :isLoading="isLoading"
          :showResults="showResults"
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
  name: 'MarketCap',
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
        { key: 'market_price', label: 'Market Price' },
        { key: 'total_shares', label: 'Total Shares' },
        { key: 'market_cap', label: 'Market Cap' }
      ]
    };
  },
  async created() {
    await this.fetchSectors();
    if (this.sectors.length > 0) {
      this.selectedSector = this.sectors[0].sector_description;
      await this.fetchMarketCapData();
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
    async fetchMarketCapData() {
      if (!this.selectedSector) return;

      this.isLoading = true;
      this.results = [];
      this.errors = [];
      this.showResults = true;

      try {
        const response = await axios.post('/api/calculate-market-cap', {
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
        console.error('Error fetching market cap data:', error);
        this.errors.push('Failed to load market cap data. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>