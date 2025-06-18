<template>
    <div class="container">
        <div class="card market-stats mt-3">
            <div class="card-body p-0">
                <!-- Main Category Tabs -->
                <div class="main-tab-section">
                    <div class="d-flex align-items-center gap-1 mb-1">
                        <h3 class="mb-0">Cash Flow</h3>
                        <Tooltip position="bottom" size="medium" max-width="280px">
                            <template #content>
                                <p>{{ description }}</p>
                            </template>
                        </Tooltip>
                    </div>

                    <div class="main-tab-container mt-4">
                        <div v-for="category in categories" :key="category.name" class="main-tab" :class="{
                            active: currentCategory.name === category.name,
                        }" @click="currentCategory = category">
                            {{ category.name }}
                            <Tooltip position="bottom" size="medium" max-width="280px">
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
                            <component :limit="limit" :is="currentCategory.component" class="tab-component"></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tooltip from '../../plugins/Tooltip.vue';
import CashFlow from '../../components/FundamentalAdvance/CashFlow.vue';
import AccuralRatio from '../../components/FundamentalAdvance/AccuralRatio.vue';

const categories = [
    { name: "Operating Cash Flow", component: CashFlow },
    { name: "Free Cash Flow", component: CashFlow },
    { name: "Accrual Ratio", component: AccuralRatio },
]

export default {
    name: "CashFlow",
    components: {
        Tooltip,
        CashFlow,
        AccuralRatio,
    },
    data() {
        return {
            description: "नगद प्रवाह खण्डले कम्पनीको वास्तविक नगद आयको स्थिति देखाउँछ। नाफा कागजमा भए पनि नगद प्रवाह नकारात्मक हुन सक्छ।",
            categories: categories,
            currentCategory: categories[0],
            limit: 10,
        };
    },
    methods: {
        getMetricTooltip(metricName) {
            const tooltips = {
                "Operating Cash Flow":
                    "परिचालन नगद प्रवाहले मुख्य व्यवसायिक गतिविधिबाट आउने वास्तविक नगद देखाउँछ।",
                "Free Cash Flow":
                    "मुक्त नगद प्रवाहले पुँजीगत खर्च घटाएपछि बाँकी रहने नगद देखाउँछ।",
                "Accrual Ratio":
                    "एक्रुअल अनुपातले नाफा र नगद प्रवाहबीचको भिन्नता मापन गर्छ। शून्यको नजिक राम्रो मानिन्छ।",
            };
            return (
                tooltips[metricName] ||
                "यो मेट्रिकले कम्पनीको वित्तीय स्वास्थ्यको एक पक्ष मापन गर्छ।"
            );
        }
    }
}
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
    padding-bottom: 16px;
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

    .sub-tab-container {
        overflow-x: auto;
        padding-bottom: 8px;
        flex-wrap: nowrap;
    }

    .sub-tab {
        white-space: nowrap;
        padding: 8px 12px;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .main-tab {
        padding: 8px 12px;
        font-size: 12px;
    }

    .sub-tab {
        padding: 6px 10px;
        font-size: 11px;
    }
}

/* Focus states for accessibility */
.main-tab:focus,
.sub-tab:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

/* Smooth transitions */
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
