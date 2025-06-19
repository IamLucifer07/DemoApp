<template>
    <div class="container">
        <div class="card market-stats mt-3">
            <div class="card-body p-0">
                <!-- Main Category Tabs -->
                <div class="main-tab-section">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <div class="d-flex align-items-center gap-1">
                            <h3 class="mb-0">Profitability</h3>
                            <Tooltip
                                position="bottom"
                                size="medium"
                                max-width="280px"
                            >
                                <template #content>
                                    <p>{{ description }}</p>
                                </template>
                            </Tooltip>
                        </div>
                        
                        <!-- Sector Selection -->
                        <div class="sector-selection-container">
                            <div class="form-group d-flex align-items-center gap-2">
                                <label for="sector" class="mb-0 text-nowrap">Select Sector:</label>
                                <v-select
                                    v-model="selectedSector"
                                    :options="sectors"
                                    @update:modelValue="onSectorChange"
                                    placeholder="Select a sector"
                                    :reduce="sector => sector.sectorDescription"
                                    label="sectorDescription"
                                    class="sector-select"
                                ></v-select>
                            </div>
                        </div>
                    </div>

                    <div class="main-tab-container mt-1">
                        <div
                            v-for="category in categories"
                            :key="category.name"
                            class="main-tab"
                            :class="{
                                active: currentCategory.name === category.name,
                            }"
                            @click="currentCategory = category"
                        >
                            {{ category.name }}
                            <Tooltip
                                position="bottom"
                                size="medium"
                                max-width="280px"
                            >
                                <template #content>
                                    <p>
                                        {{ getMetricTooltip(category.name) }}
                                    </p>
                                </template>
                            </Tooltip>
                        </div>
                    </div>

                    <div class="content-area">
                        <div class="tab-pane fade active show">
                            <component
                                :limit="limit"
                                :selectedSector="selectedSector"
                                :is="currentCategory.component"
                                class="tab-component"
                            ></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import Tooltip from "../../plugins/Tooltip.vue";
import CashFlowPerShare from "../../components/FundamentalAdvance/CashFlowPerShare.vue";
import EBITDA from "../../components/FundamentalAdvance/EBITDA.vue";
import EPS from "../../components/FundamentalAdvance/EPS.vue";
import ProfitMargin from "../../components/FundamentalAdvance/ProfitMargin.vue";
import OperatingMargin from "../../components/FundamentalAdvance/OperatingMargin.vue";

const categories = [
    { name: "Cash Flow/Share", component: CashFlowPerShare },
    { name: "EPS", component: EPS },
    { name: "Profit Margin", component: ProfitMargin },
    { name: "Operating Margin", component: OperatingMargin },
    { name: "EBITDA", component: EBITDA },
];

export default {
    name: "Profitability",
    components: {
        Tooltip,
        vSelect,
        CashFlowPerShare,
        EPS,
        ProfitMargin,
        OperatingMargin,
        EBITDA,
    },
    data() {
        return {
            description:
                "नाफा खण्डले कम्पनीले आफ्ना स्रोतहरू प्रयोग गरेर कति प्रभावकारी रूपमा नाफा कमाउन सक्छ भन्ने मापन गर्छ। उच्च नाफामार्जिन भएका कम्पनीहरू बलियो हुन्छन्।",
            categories: categories,
            currentCategory: categories[0],
            limit: 10,
            sectors: getSectors(),
            selectedSector: "Commercial Banks",
        };
    },
    methods: {
        onSectorChange() {
            // This will trigger updates in child components
            this.$forceUpdate();
        },
        getMetricTooltip(metricName) {
            const tooltips = {
                "Cash Flow/Share":
                    "प्रति शेयर नगद प्रवाहले वास्तविक नगद आयलाई शेयर संख्याले भाग गरेर निकालिन्छ।",
            };
            return (
                tooltips[metricName] ||
                "यो मेट्रिकले कम्पनीको वित्तीय स्वास्थ्यको एक पक्ष मापन गर्छ।"
            );
        },
    },
};
</script>

<style scoped>
.market-stats {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;
}

.card-body {
    padding: 24px;
}

/* Header Styling */
h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

/* Sector Selection Styling */
.sector-selection-container {
    min-width: 300px;
}

.sector-select {
    min-width: 200px;
}

.sector-select .vs__dropdown-toggle {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    min-height: 38px;
}

.sector-select .vs__selected {
    font-size: 14px;
    color: #333;
}

.info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 16v-4'/%3E%3Cpath d='M12 8h.01'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 16px 16px;
    opacity: 0.6;
    transition: opacity 0.2s ease;
}

.info-icon:hover {
    opacity: 1;
    color: #4caf50;
}

/* Main Tab Styling */
.main-tab-section {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 0px;
    margin-bottom: 0;
}

.main-tab-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    margin-top: 6px;
}

.main-tab {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.25s ease;
    border-radius: 8px 8px 0 0;
    background-color: #fafafa;
    color: #666;
    position: relative;
}

.main-tab:hover:not(.active) {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
    color: #333;
}

.main-tab.active {
    background-color: #fff;
    border-bottom-color: #fff;
    color: #4caf50;
    font-weight: 600;
    z-index: 1;
}

.main-tab.active::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #4caf50;
}

/* Content Area */
.content-area {
    background-color: #fff;
    border-radius: 8px;
}

.tab-component {
    min-height: 200px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .card-body {
        padding: 16px;
    }

    h3 {
        font-size: 18px;
    }

    .d-flex.justify-content-between {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 16px;
    }

    .sector-selection-container {
        min-width: 100%;
    }

    .main-tab-container {
        overflow-x: auto;
        padding-bottom: 8px;
        scrollbar-width: thin;
        scrollbar-color: #cbd5e0 #f7fafc;
    }

    .main-tab-container::-webkit-scrollbar {
        height: 4px;
    }

    .main-tab-container::-webkit-scrollbar-track {
        background: #f7fafc;
        border-radius: 2px;
    }

    .main-tab-container::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 2px;
    }

    .main-tab {
        white-space: nowrap;
        padding: 10px 16px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .main-tab {
        padding: 8px 12px;
        font-size: 12px;
    }
}

/* Focus states for accessibility */
.main-tab:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

/* Smooth transitions */
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>