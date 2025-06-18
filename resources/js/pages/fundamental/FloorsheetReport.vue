<template>
    <div class="stock-container">
        <!-- Header Section with current date and time -->
        <div class="header-section">
            <h2>Floorsheet Summary</h2>
            <span>As of {{ displayTime }}</span>
        </div>

        <!-- Filters Section -->
        <div class="filter-section">
            <div class="date-filter">
                <label for="symbol">Symbol:</label>
                <input
                    id="symbol"
                    v-model="symbol"
                    @input="onSymbolInput"
                    class="p-inputtext"
                    placeholder="Search Symbol"
                />

                <!-- Show suggestions below the input -->
                <ul v-if="filteredSymbols.length > 0" class="suggestions-list">
                    <li
                        v-for="(sym, index) in filteredSymbols"
                        :key="index"
                        @click="selectSymbol(sym)"
                    >
                        {{ sym }}
                    </li>
                </ul>
            </div>

            <div class="date-filter">
                <label for="periodType">Period Type:</label>
                <select
                    id="periodType"
                    v-model="periodType"
                    @change="fetchData"
                    class="p-inputtext"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="threemonth">3 Months</option>
                    <option value="sixmonth">6 Months</option>
                </select>
            </div>

            <div class="date-filter">
                <label for="transactionType">Transaction Type:</label>
                <select
                    id="transactionType"
                    v-model="transactionType"
                    @change="fetchData"
                    class="p-inputtext"
                >
                    <option value="ALL">All</option>
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                </select>
            </div>

            <!-- Filter Button -->
            <button @click="fetchData" class="p-button">Filter</button>

            <div class="date-filter">
                <label for="itemsPerPage">Items per page:</label>
                <select
                    id="itemsPerPage"
                    v-model="itemsPerPage"
                    @change="fetchData"
                    class="p-inputtext"
                >
                    <option v-for="n in [10, 20, 30, 50]" :key="n" :value="n">
                        {{ n }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Stock Data Table -->
        <table class="table">
            <thead>
                <tr>
                    <th>SN</th>
                    <th>Symbol</th>
                    <th>Total Quantity</th>
                    <th>Total Amount</th>
                    <th>Avg Price</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Transaction Count</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, index) in data"
                    :key="index"
                    @click="navigateToScript(item.symbol)"
                    :class="{ 'cursor-pointer': true }"
                >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.symbol }}</td>
                    <td>{{ item.total_quantity }}</td>
                    <td>{{ item.total_amount }}</td>
                    <td>{{ item.avg_price }}</td>
                    <td>{{ item.min_price }}</td>
                    <td>{{ item.max_price }}</td>
                    <td>{{ item.transaction_count }}</td>
                </tr>
                <tr v-if="!loading && data.length === 0">
                    <td colspan="8" class="text-center">No data available</td>
                </tr>
            </tbody>
        </table>

        <!-- Loader for Data Fetching -->
        <div v-if="loading" class="loader text-center"></div>

        <!-- Pagination Section -->
        <div class="p-mt-3 p-d-flex p-jc-between p-ai-center">
            <span>Total Items: {{ totalItems }}</span>
            <Paginator
                :rows="itemsPerPage"
                :totalRecords="totalItems"
                :first="(currentPage - 1) * itemsPerPage"
                @page="onPageChanged"
            />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Paginator from "primevue/paginator";
import axios from "axios";

export default {
    components: {
        Paginator,
    },
    setup() {
        const data = ref([]);
        const symbols = ref([]);
        const filteredSymbols = ref([]);
        const symbol = ref("");
        const itemsPerPage = ref(20);
        const currentPage = ref(1);
        const totalItems = ref(0);
        const loading = ref(false);
        const displayTime = ref("");
        const periodType = ref("daily");
        const transactionType = ref("ALL");

        const constructUrl = (params) => {
            const baseUrl =
                "https://api.laganisutra.com/api/floorsheet-summary/";
            const queryParams = new URLSearchParams();

            queryParams.append("page_size", params.page_size);
            queryParams.append("page", params.page);
            queryParams.append("period_type", params.period_type);
            queryParams.append("transaction_type", params.transaction_type);

            if (params.symbol?.trim()) {
                queryParams.append("symbol", params.symbol);
            }

            return `${baseUrl}?${queryParams.toString()}`;
        };

        const fetchData = async () => {
            loading.value = true;

            try {
                const params = {
                    page_size: itemsPerPage.value,
                    page: currentPage.value,
                    period_type: periodType.value,
                    transaction_type: transactionType.value,
                    symbol: symbol.value,
                };

                const url = constructUrl(params);
                const response = await axios.get(url);

                if (response.data.results?.length > 0) {
                    data.value = response.data.results;
                    totalItems.value = response.data.count || 0;
                } else {
                    data.value = [];
                    totalItems.value = 0;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                data.value = [];
                totalItems.value = 0;
            }

            loading.value = false;
        };

        const onPageChanged = (event) => {
            currentPage.value = event.page + 1;
            fetchData();
        };

        const onSymbolInput = () => {
            if (symbol.value.length > 0) {
                filteredSymbols.value = symbols.value.filter((sym) =>
                    sym.toLowerCase().includes(symbol.value.toLowerCase())
                );
            } else {
                filteredSymbols.value = [];
            }
        };

        const selectSymbol = (sym) => {
            symbol.value = sym;
            filteredSymbols.value = [];
            fetchData();
        };

        onMounted(async () => {
            await fetchData();
        });

        return {
            data,
            symbols,
            filteredSymbols,
            symbol,
            itemsPerPage,
            currentPage,
            totalItems,
            loading,
            displayTime,
            periodType,
            transactionType,
            fetchData,
            onPageChanged,
            onSymbolInput,
            selectSymbol,
        };
    },

    methods: {
        navigateToScript(script) {
            this.$router.push({ name: "script", params: { script: script } });
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>

<style scoped>
.stock-container {
    max-width: 100%;
    margin: 2px 2px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header-section {
    margin-bottom: 20px;
}

.header-section h2 {
    font-weight: bold;
    font-size: 24px;
}

.filter-section {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-group {
    display: flex;
    flex-direction: column;
}

.filter-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.table th {
    background-color: #f0f0f0;
    font-weight: bold;
}

.table td {
    background-color: #fff;
}

.loader {
    text-align: center;
    margin-top: 20px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 5px 0;
    border: 1px solid #ccc;
    background: white;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    z-index: 1000;
}

.suggestions-list li {
    padding: 8px;
    cursor: pointer;
}

.suggestions-list li:hover {
    background-color: #f0f0f0;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
