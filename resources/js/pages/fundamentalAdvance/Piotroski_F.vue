<template>
    <div class="piotroski-f-container">
        <!-- Sector Selection -->
        <div class="sector-selection">
            <div class="card">
                <div class="form-group">
                    <label for="sector">Select Sector:</label>
                    <v-select
                        v-model="selectedSector"
                        :options="sectors"
                        @update:modelValue="fetchPiotroskiFData"
                        placeholder="Select a sector"
                        :reduce="(sector) => sector"
                        label="sectorDescription"
                        :style="{ width: '30%' }"
                    />
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
    name: "Piotroski-F",
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
                    key: "ROA_score",
                    label: "ROA Score",
                    formatFn: (value) => value,
                },
                {
                    key: "debt_score",
                    label: "Debt Score",
                    formatFn: (value) => value,
                },
                {
                    key: "gross_margin_score",
                    label: "Gross Margin Score",
                    formatFn: (value) => value,
                },
                {
                    key: "asset_score",
                    label: "Asset Score",
                    formatFn: (value) => value,
                },
                {
                    key: "current_ratio_score",
                    label: "Current Ratio Score",
                    formatFn: (value) => value,
                },
                {
                    key: "cfo_score",
                    label: "CFO Score",
                    formatFn: (value) => value,
                },
                {
                    key: "net_profit_score",
                    label: "Net Profit Score",
                    formatFn: (value) => value,
                },
                {
                    key: "cfo_net_score",
                    label: "CFO > Net Score",
                    formatFn: (value) => value,
                },
                {
                    key: "no_new_shares_issued_score",
                    label: "No New Shares Score",
                    formatFn: (value) => value,
                },
                {
                    key: "F_Score",
                    label: "F-Score",
                    formatFn: (value) => value,
                },
            ],
        };
    },
    async created() {
        await this.fetchSectors();
        if (this.sectors.length > 0) {
            this.selectedSector = this.sectors[0]; // Use full object instead of just description
            await this.fetchPiotroskiFData();
        }
    },

    methods: {
        async fetchSectors() {
            try {
                const response = await axios.get("/api/sectors");
                this.sectors = response.data;
            } catch (error) {
                console.error("Error fetching sectors:", error);
                this.errors.push(
                    "Failed to load sectors. Please try again later."
                );
            }
        },
        async fetchPiotroskiFData() {
            if (!this.selectedSector || !this.selectedSector.id) return;

            this.isLoading = true;
            this.results = [];
            this.errors = [];
            this.showResults = true;

            try {
                const response = await axios.get(
                    `/api/fundamentals/market-analysis/${this.selectedSector.id}`
                );

                if (response.data && typeof response.data === "object") {
                    // Filter and map only symbols that have risk_metrics data
                    this.results = Object.entries(response.data)
                        .filter(([symbol, data]) => data.risk_metrics) // Only include entries with risk_metrics
                        .map(([symbol, data]) => ({
                            symbol,
                            ...data.risk_metrics, // Use risk_metrics instead of risk
                        }));
                } else {
                    this.errors.push("Unexpected API response format.");
                }
            } catch (error) {
                console.error("Error fetching Piotroski data:", error);
                this.errors.push(
                    "Failed to load Piotroski data. Please try again later."
                );
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
