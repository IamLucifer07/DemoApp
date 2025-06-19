<template>
    <div class="beneish-m-container">
        <!-- Sector Selection -->
        <div class="sector-selection">
            <div class="card">
                <div class="form-group">
                    <label for="sector">Select Sector:</label>
                    <v-select v-model="selectedSector" :options="sectors" @update:modelValue="fetchBeneishMData"
                        placeholder="Select a sector" :reduce="(sector) => sector" label="sectorDescription"
                        :style="{ width: '30%' }"></v-select>
                </div>

                <!-- Using the ResultTable component -->
                <ResultTable :columns="tableColumns" :results="results" :errors="errors" :isLoading="isLoading"
                    :showResults="showResults" />
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
    name: "BeneishM",
    components: {
        vSelect,
        ResultTable,
    },
    data() {
        return {
            sectors: getSectors(),
            selectedSector: null,
            results: [],
            errors: [],
            isLoading: false,
            showResults: false,
            tableColumns: [
                { key: "symbol", label: "Symbol" },
                {
                    key: "dsri",
                    label: "DSRI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "gmi",
                    label: "GMI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "aqi",
                    label: "AQI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "depi",
                    label: "DEPI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "sgai",
                    label: "SGAI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "sgi",
                    label: "SGI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "lvgi",
                    label: "LVGI",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "tata",
                    label: "TATA",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "m_score",
                    label: "M-Score",
                    formatFn: (value) => parseFloat(value).toFixed(4),
                },
                {
                    key: "m_score_interpretation",
                    label: "Interpretation",
                    formatFn: (value) => value,
                },
            ],
        };
    },
    async created() {
        if (this.sectors.length > 0) {
            this.selectedSector = this.sectors[0];
            await this.fetchBeneishMData();
        }
    },
    methods: {
        async fetchBeneishMData() {
            if (!this.selectedSector) return;

            this.isLoading = true;
            this.results = [];
            this.errors = [];
            this.showResults = true;

            try {
                const response = await axios.get(`/api/fundamentals/beneish-mscore/${this.selectedSector.id}`);
                this.results = response.data;

                if (response.data && response.data.errors) {
                    this.errors = response.data.errors;
                }
            } catch (error) {
                console.error("Error fetching Beneish data:", error);
                this.errors.push(
                    "Failed to load Beneish data. Please try again later."
                );
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
