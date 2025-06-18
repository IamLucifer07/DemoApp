<template>
  <div class="results-section mt-4" v-if="showResults">
    <div class="table-responsive">
      <table class="table table-bordered table-striped text-center">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody v-if="isLoading">
          <tr>
            <td :colspan="columns.length" class="text-center">
              <div class="loader"></div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(result, index) in results" :key="index">
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              {{ formatValue(result[column.key], column.formatFn) }}
            </td>
          </tr>
          <tr v-if="results.length === 0">
            <td :colspan="columns.length" class="text-center text-muted">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Errors Section -->
    <div v-if="errors.length > 0" class="errors-section mt-4">
      <div class="card border-warning">
        <div class="card-header bg-warning text-dark">
          <h5>Processing Notices</h5>
        </div>
        <div class="card-body">
          <ul class="list-unstyled">
            <li v-for="(error, index) in errors" :key="index" class="mb-1">
              <i class="fas fa-exclamation-triangle text-warning"></i> {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultTable",
  props: {
    // Table columns configuration
    columns: {
      type: Array,
      required: true,
    },
    // Data results to display
    results: {
      type: Array,
      default: () => [],
    },
    // Error messages
    errors: {
      type: Array,
      default: () => [],
    },
    // Loading state
    isLoading: {
      type: Boolean,
      default: false,
    },
    // Whether to show the results section
    showResults: {
      type: Boolean,
      default: false,
    },
    // Default number formatter function
    formatNumber: {
      type: Function,
      default: (value) => {
        if (value === null || value === undefined || value === "")
          return "-";
        const num = Number(value);
        if (Number.isInteger(num)) return num;
        return num.toFixed(2);
      },
    },
  },
  methods: {
    formatValue(value, formatFn) {
      // If a custom format function is provided, use it
      if (value == null) {
        return "-";
      }
      if (formatFn) {
        return formatFn(value);
      }
      // Otherwise use the default number formatter
      if (typeof value === "number" || !isNaN(Number(value))) {
        return this.formatNumber(value);
      }
      // Return the original value if not a number
      return value;
    },
  },
};
</script>
