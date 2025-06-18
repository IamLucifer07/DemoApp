<template>
    <div class="total-assets-container">
        <!-- Sector Selection -->
        <div class="sector-selection">
            <div class="card">
                <div class="form-group">
                    <label for="sector">Select Sector:</label>
                    <v-select
                        v-model="selectedSector"
                        :options="sectors"
                        @update:modelValue="fetchTotalAssetsData"
                        placeholder="Select a sector"
                        :reduce="(sector) => sector.id"
                        label="sectorDescription"
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
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ResultTable from "./ResultTable.vue";

export default {
    name: "PBRelative",
    components: {
        vSelect,
        ResultTable,
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
            { key: 'book_value', label: 'Book Value' },
            { key: 'market_price', label: 'LTP' },
            { key: 'pb_relative', label: 'PB Relative' },
          ],
        };
    },
    async created() {
        await this.fetchSectors();
        if (this.sectors.length > 0) {
            this.selectedSector = this.sectors[0].id;
            await this.fetchTotalAssetsData();
        }
    },
    methods: {
        async fetchSectors() {
            try {
                const allSectors = getSectors(); // assuming this returns array
                this.sectors = allSectors;
                // console.log("sectors", allSectors);
            } catch (error) {
                console.error("Error fetching sectors:", error);
                this.errors.push(
                    "Failed to load sectors. Please try again later."
                );
            }
        },

        async fetchTotalAssetsData() {
            if (!this.selectedSector) return;

            this.isLoading = true;
            this.results = [];
            this.errors = [];
            this.showResults = true;

            try {
                const response = await axios.get("/api/peer-comparison", {
                    params: {
                        sector: this.selectedSector,
                    },
                });

                if (Array.isArray(response.data)) {
                    this.results = response.data;
                } else if (response.data && response.data.data) {
                    this.results = response.data.data;
                    this.errors = response.data.errors || [];
                }
            } catch (error) {
                console.error("Error fetching total assets data:", error);
                this.errors.push(
                    "Failed to load total assets data. Please try again later."
                );
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>