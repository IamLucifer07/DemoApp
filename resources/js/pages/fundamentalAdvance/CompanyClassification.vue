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
  name: 'CompanyClassification',
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
        { key: 'market_cap', label: 'Market Cap' },
        { key: 'free_float_market_cap', label: 'Free-Float Market Cap' },
        { key: 'classification', label: 'Market Cap Classification' },
        { key: 'free_float_classification', label: 'Free-Float Classification' },
        { key: 'turnover_value', label: 'Turnover Value' },
        { key: 'liquidity_classification', label: 'Liquidity Classification' },
        { key: 'hybrid_score', label: 'Hybrid Score' },
        { key: 'hybrid_classification', label: 'Hybrid Classification' }
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
    parseNumber(value) {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        return parseFloat(value.replace(/,/g, ''));
      }
      return 0;
    },

    // Method to determine market cap classification
    getMarketCapClassification(marketCap) {
      const capValue = this.parseNumber(marketCap);
      
      if (capValue < 5000000000) { // Below 5 Arba (500 Crore)
        return 'Ultra Low Cap';
      } else if (capValue >= 5000000000 && capValue < 10000000000) { // 5-10 Arba
        return 'Low Cap';
      } else if (capValue >= 10000000000 && capValue < 50000000000) { // 10-50 Arba
        return 'Medium Cap';
      } else { // Above 50 Arba
        return 'High Cap (Large Cap)';
      }
    },

    // Method to determine free-float market cap classification
    getFreeFloatClassification(freeFloatMarketCap) {
      const capValue = this.parseNumber(freeFloatMarketCap);
      
      if (capValue < 1000000000) { // Below 1 Arba (100 Crore)
        return 'Ultra Low Cap';
      } else if (capValue >= 1000000000 && capValue < 5000000000) { // 1-5 Arba
        return 'Low Cap';
      } else if (capValue >= 5000000000 && capValue < 20000000000) { // 5-20 Arba
        return 'Medium Cap';
      } else { // Above 20 Arba
        return 'High Cap (Large Cap)';
      }
    },

    // Method to determine liquidity classification based on turnover value
    getLiquidityClassification(turnoverValue) {
      const turnover = this.parseNumber(turnoverValue);
      const TWO_CRORE = 20000000; // 2 Crore in rupees
      const TEN_CRORE = 100000000; // 10 Crore in rupees

      if (turnover < TWO_CRORE) {
        return 'Small / Ultra Low Cap';
      } else if (turnover >= TWO_CRORE && turnover < TEN_CRORE) {
        return 'Medium Cap';
      } else {
        return 'High Cap (Large Cap)';
      }
    },

    // Method to determine hybrid classification based on score
    getHybridClassification(hybridScore) {
      const score = this.parseNumber(hybridScore);
      
      if (score >= 0 && score <= 0.24) {
        return 'Ultra Low Cap';
      } else if (score > 0.24 && score <= 0.49) {
        return 'Low Cap';
      } else if (score > 0.49 && score <= 0.74) {
        return 'Medium Cap';
      } else if (score > 0.74 && score <= 1.0) {
        return 'High Cap';
      } else {
        return 'N/A';
      }
    },
    
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
        
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && response.data.data) {
          data = response.data.data;
        }
        
        // Process each result
        this.results = data.map(item => {
          const marketCap = this.parseNumber(item.market_cap);
          const freeFloatMarketCap = this.parseNumber(item.free_float_market_cap);
          const turnoverValue = this.parseNumber(item.turnover_value || 0);
          const hybridScore = this.parseNumber(item.hybrid_score || 0);
          
          return {
            ...item,
            market_cap: marketCap.toLocaleString('en-IN'),
            free_float_market_cap: freeFloatMarketCap.toLocaleString('en-IN'),
            turnover_value: turnoverValue.toLocaleString('en-IN'),
            hybrid_score: hybridScore.toFixed(2),
            classification: this.getMarketCapClassification(marketCap),
            free_float_classification: this.getFreeFloatClassification(freeFloatMarketCap),
            liquidity_classification: this.getLiquidityClassification(turnoverValue),
            hybrid_classification: this.getHybridClassification(hybridScore)
          };
        });
        
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