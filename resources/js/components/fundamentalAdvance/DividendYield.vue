<template>
    <div class="dividend-yield-container">
        <!-- Sector Selection -->
        <div class="sector-selection">
            <div class="card">
                <div class="form-group">
                    <label for="sector">Select Sector:</label>
                    <v-select
                        v-model="selectedSector"
                        :options="sectors"
                        @update:modelValue="calculateDividendYield"
                        placeholder="Select a sector"
                        :reduce="(sector) => sector.sector_description"
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
                    :formatNumber="formatNumber"
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
    name: "DividendYield",
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
                { key: "symbol", label: "Symbol" },
                {
                    key: "price_per_share",
                    label: "Price per Share",
                    formatFn: this.formatNumber,
                },
                {
                    key: "annual_dividends",
                    label: "Annual Dividends",
                    formatFn: this.formatNumber,
                },
                {
                    key: "dividend_yield",
                    label: "Dividend Yield",
                    formatFn: this.formatNumber,
                },
                {
                    key: "dividend_yield_percent",
                    label: "Yield Percentage",
                    formatFn: (value) => (value ? `${value}%` : "-"),
                },
            ],
        };
    },
    async created() {
        await this.fetchSectors();
        if (this.sectors.length > 0) {
            this.selectedSector = this.sectors[0].sector_description;
            await this.calculateDividendYield();
        }
    },
    methods: {
        async fetchSectors() {
            try {
                const response = await axios.get("/api/symbol-sector");
                this.sectors = response.data;
            } catch (error) {
                console.error("Error fetching sectors:", error);
                this.errors.push(
                    "Failed to load sectors. Please try again later."
                );
            }
        },
        async calculateDividendYield() {
            if (!this.selectedSector) return;

            this.isLoading = true;
            this.results = [];
            this.errors = [];
            this.showResults = true;

            try {
                const response = await axios.post(
                    "/api/calculate-dividend-yield",
                    {
                        sector: this.selectedSector,
                    }
                );

                if (Array.isArray(response.data)) {
                    this.results = response.data;
                } else if (
                    response.data &&
                    Array.isArray(response.data.results)
                ) {
                    this.results = response.data.results;
                    if (response.data.errors) {
                        this.errors = response.data.errors;
                    }
                }
            } catch (error) {
                console.error("Error calculating Dividend Yield:", error);
                this.errors.push(
                    "Failed to calculate Dividend Yield. Please try again later."
                );
            } finally {
                this.isLoading = false;
            }
        },
        formatNumber(value) {
            return value !== null ? Number(value).toFixed(4) : "-";
        },
    },
};
</script>
