<template>
  <div class="fundamental-report">
    <div class="container-card mb-6">
      <div class="card-header mb-4">
        <div class="header-title">
          <h3>Fundamental Analysis Report</h3>
          <div class="info-icon" data-tooltip="वित्तीय विश्लेषण प्रतिवेदन - कम्पनीको आधारभूत सूचकहरूको विस्तृत समीक्षा">
          </div>
        </div>
      </div>

      <!-- Overall Summary Section -->
      <div class="overall-summary-container mb-6">
        <h4 class="summary-title">Overall Summary</h4>
        <div class="summary-content">
          <p>{{ overallSummary }}</p>
        </div>
        <div class="summary-rating-container">
          <div class="summary-chart">
            <div class="chart-segment" v-for="(value, rating) in ratingDistribution" :key="rating">
              <div class="segment" :class="rating.toLowerCase()" :style="{ width: calculatePercentage(value) + '%' }"
                :data-tooltip="rating + ': ' + value + ' metrics'">
              </div>
            </div>
          </div>
          <div class="rating-legend">
            <div class="legend-item" v-for="(value, rating) in ratingDistribution" :key="rating">
              <div class="legend-color" :class="rating.toLowerCase()"></div>
              <div class="legend-text">{{ rating }}: {{ value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex gap-4 flex-wrap">
        <!-- 1. Profitability Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Profitability Indicators</h3>
              <div class="info-icon" data-tooltip="नाफामूलकता सूचकहरू - कम्पनीको नाफा कमाउने क्षमताको मूल्यांकन"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in profitabilityIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.profitabilityIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 2. Valuation Ratios -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Valuation Ratios</h3>
              <div class="info-icon"
                data-tooltip="मूल्यांकन अनुपातहरू - शेयरको मूल्य उचित छ वा छैन भनेर निर्धारण गर्ने मापदण्डहरू"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in valuationRatios" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.valuationRatios }}</p>
            </div>
          </div>
        </div>

        <!-- 3. Growth Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Growth Indicators</h3>
              <div class="info-icon"
                data-tooltip="वृद्धि सूचकहरू - कम्पनीको विस्तार र वृद्धिको गतिलाई मापन गर्ने तत्वहरू"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in growthIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>

                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.growthIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 4. Liquidity Ratios -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Liquidity Ratios</h3>
              <div class="info-icon" data-tooltip="तरलता अनुपातहरू - कम्पनीको अल्पकालीन दायित्वहरू पूरा गर्ने क्षमता">
              </div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in liquidityRatios" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.liquidityRatios }}</p>
            </div>
          </div>
        </div>

        <!-- 5. Leverage Ratios -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Leverage Ratios</h3>
              <div class="info-icon" data-tooltip="उत्तोलन अनुपातहरू - कम्पनीको ऋण र वित्तीय जोखिमको स्तर"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in leverageRatios" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.leverageRatios }}</p>
            </div>
          </div>
        </div>

        <!-- 6. Dividend Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Dividend Indicators</h3>
              <div class="info-icon" data-tooltip="लाभांश सूचकहरू - लगानीकर्तालाई प्रदान गरिएको आय र भुक्तानी"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in dividendIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.dividendIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 7. Efficiency Ratios -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Efficiency Ratios</h3>
              <div class="info-icon"
                data-tooltip="दक्षता अनुपातहरू - कम्पनीले कति कुशलतापूर्वक सम्पत्तिहरू प्रयोग गर्छ"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in efficiencyRatios" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                      <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.efficiencyRatios }}</p>
            </div>
          </div>
        </div>

        <!-- 8. Cash Flow Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Cash Flow Indicators</h3>
              <div class="info-icon" data-tooltip="नगद प्रवाह सूचकहरू - कम्पनीको नगद उत्पादन र प्रयोग"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in cashFlowIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.cashFlowIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 9. Market Performance Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Market Performance</h3>
              <div class="info-icon" data-tooltip="बजार प्रदर्शन - शेयर बजारमा कम्पनीको प्रदर्शन र मूल्यांकन"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in marketPerformanceMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.marketPerformanceMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 10. Asset Utilization Ratios -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Asset Utilization</h3>
              <div class="info-icon" data-tooltip="सम्पत्ति उपयोग - सम्पत्तिको प्रयोग र त्यसबाट प्राप्त आम्दानी"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in assetUtilizationRatios" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.assetUtilizationRatios }}</p>
            </div>
          </div>
        </div>

        <!-- 11. Risk Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Risk Metrics</h3>
              <div class="info-icon" data-tooltip="जोखिम मापनहरू - लगानीसँग सम्बन्धित जोखिमको मूल्यांकन"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in riskMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.riskMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 12. Revenue and Expense Breakdowns -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Revenue & Expense</h3>
              <div class="info-icon" data-tooltip="आम्दानी र खर्च - कम्पनीको आम्दानी र खर्चको विभाजन"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in revenueExpenseIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.revenueExpenseIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 13. Industry-Specific Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Industry-Specific</h3>
              <div class="info-icon"
                data-tooltip="उद्योग-विशिष्ट मापदण्डहरू - यस उद्योगको लागि विशेष महत्वपूर्ण सूचकहरू"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in industrySpecificMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.industrySpecificMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 14. Stock Activity Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Stock Activity</h3>
              <div class="info-icon" data-tooltip="शेयर गतिविधि - शेयर कारोबार र मूल्य परिवर्तनको विश्लेषण"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in stockActivityIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.stockActivityIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 15. ESG Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>ESG Metrics</h3>
              <div class="info-icon" data-tooltip="ESG मापदण्डहरू - वातावरणीय, सामाजिक र सुशासन प्रभावहरू"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in esgMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.esgMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 16. Peer Comparison Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Peer Comparison</h3>
              <div class="info-icon" data-tooltip="सहकर्मी तुलना - समान उद्योगका अन्य कम्पनीहरूसँगको तुलना"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in peerComparisonMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.peerComparisonMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 17. Shareholder Value Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Shareholder Value</h3>
              <div class="info-icon" data-tooltip="शेयरधारक मूल्य - शेयरधारकहरूका लागि सिर्जित मूल्य र प्रतिफल"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in shareholderValueMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.shareholderValueMetrics }}</p>
            </div>
          </div>
        </div>

        <!-- 18. Earnings Quality Indicators -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Earnings Quality</h3>
              <div class="info-icon" data-tooltip="आम्दानी गुणस्तर - आम्दानीको स्थिरता र विश्वसनीयता"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in earningsQualityIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.earningsQualityIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 19. Balance Sheet Health -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Balance Sheet Health</h3>
              <div class="info-icon" data-tooltip="बैलेन्स सिट स्वास्थ्य - कम्पनीको वित्तीय स्थिति र स्थिरता"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in balanceSheetHealthIndicators" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.balanceSheetHealthIndicators }}</p>
            </div>
          </div>
        </div>

        <!-- 20. Trend Analysis Metrics -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <h3>Trend Analysis</h3>
              <div class="info-icon" data-tooltip="प्रवृत्ति विश्लेषण - शेयर मूल्य र प्रदर्शनको प्रवृत्ति"></div>
            </div>
          </div>
          <div class="card-content">
            <table class="w-full">
              <tbody>
                <tr v-for="(item, index) in trendAnalysisMetrics" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.value }}</td>
                  <td class="text-right">
                        <span :class="getRatingPillClass(getRating(item))">{{ getRating(item) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ai-summary">
              <h4>AI Summary</h4>
              <p>{{ categorySummaries.trendAnalysisMetrics }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: "FundamentalReport",
  props: {
    companyId: {
      type: [String, Number],
      default: 135,
    },
  },
  data() {
    return {
      loading: true,
      error: null,
      sector: '',
      companySymbol: '',
      profitabilityIndicators: [],
      valuationRatios: [],
      growthIndicators: [],
      liquidityRatios: [],
      leverageRatios: [],
      dividendIndicators: [],
      efficiencyRatios: [],
      cashFlowIndicators: [],
      marketPerformanceMetrics: [ ],
      assetUtilizationRatios: [],
      riskMetrics: [],
      revenueExpenseIndicators: [],
      industrySpecificMetrics: [],
      stockActivityIndicators: [],
      esgMetrics: [],
      peerComparisonMetrics: [],
      shareholderValueMetrics: [],
      earningsQualityIndicators: [],
      balanceSheetHealthIndicators: [],
      trendAnalysisMetrics: [],
      categorySummaries: {
        profitabilityIndicators: 'Generated By AI',
        valuationRatios: 'Generated By AI',
        growthIndicators: 'Generated By AI',
        liquidityRatios: 'Generated By AI',
        leverageRatios: 'Generated By AI',
        dividendIndicators: 'Generated By AI',
        efficiencyRatios: 'Generated By AI',
        cashFlowIndicators: 'Generated By AI',
        marketPerformanceMetrics: 'Generated By AI',
        assetUtilizationRatios: 'Generated By AI',
        riskMetrics: 'Generated By AI',
        revenueExpenseBreakdowns: 'Generated By AI',
        industrySpecificMetrics: 'Generated By AI',
        stockActivityIndicators: 'Generated By AI',
        esgMetrics: 'Generated By AI',
        peerComparisonMetrics: 'Generated By AI',
        shareholderValueMetrics: 'Generated By AI',
        earningsQualityIndicators: 'Generated By AI',
        balanceSheetHealthIndicators: 'Generated By AI',
        trendAnalysisMetrics: 'Generated By AI',
      },
      RatingRanges: {
          // EPS Rating Ranges
      epsRatingRanges:{
        "Commercial Banks": {
          best: 40,
          better: [25, 40],
          good: [15, 25],
          neutral: [10, 15],
          weak: [5, 10],
          worst: 5
        },
        "Hydro Power": {
          best: 30,
          better: [20, 30],
          good: [12, 20],
          neutral: [8, 12],
          weak: [4, 8],
          worst: 4
        },
        "Non Life Insurance": {
          best: 25,
          better: [15, 25],
          good: [10, 15],
          neutral: [6, 10],
          weak: [3, 6],
          worst: 3
        },
        "Life Insurance": {
          best: 20,
          better: [12, 20],
          good: [8, 12],
          neutral: [5, 8],
          weak: [2, 5],
          worst: 2
        },
        "Manufacturing And Processing": {
          best: 15,
          better: [10, 15],
          good: [7, 10],
          neutral: [4, 7],
          weak: [2, 4],
          worst: 2
        },
        "Tradings": {
          best: 12,
          better: [8, 12],
          good: [5, 8],
          neutral: [3, 5],
          weak: [1, 3],
          worst: 1
        },
        "Hotels & Tourism": {
          best: 10,
          better: [6, 10],
          good: [4, 6],
          neutral: [2, 4],
          weak: [1, 2],
          worst: 1
        },
        "Development Banks": {
          best: 18,
          better: [12, 18],
          good: [8, 12],
          neutral: [5, 8],
          weak: [3, 5],
          worst: 3
        },
        "Microfinance": {
          best: 15,
          better: [10, 15],
          good: [6, 10],
          neutral: [4, 6],
          weak: [2, 4],
          worst: 2
        },
        "Others": {
          best: 10,
          better: [7, 10],
          good: [5, 7],
          neutral: [3, 5],
          weak: [1, 3],
          worst: 1
        }
    },
      // Net Profit Margin NPM Rating Ranges
      npmRatingRanges: {
        "Commercial Banks": {
          best: 25,
          better: [20, 25],
          good: [15, 20],
          neutral: [10, 15],
          weak: [5, 10],
          worst: 5
        },
        "HydroPower": {
          best: 40,
          better: [30, 40],
          good: [20, 30],
          neutral: [15, 20],
          weak: [10, 15],
          worst: 10
        },
        "Non Life Insurance": {
          best: 35,
          better: [25, 35],
          good: [20, 25],
          neutral: [15, 20],
          weak: [10, 15],
          worst: 10
        },
        "Life Insurance": {
          best: 25,
          better: [20, 25],
          good: [15, 20],
          neutral: [10, 15],
          weak: [5, 10],
          worst: 5
        },
        "Manufacturing And Processing": {
          best: 20,
          better: [15, 20],
          good: [10, 15],
          neutral: [8, 10],
          weak: [5, 8],
          worst: 5
        },
        "Tradings": {
          best: 15,
          better: [12, 15],
          good: [10, 12],
          neutral: [7, 10],
          weak: [5, 7],
          worst: 5
        },
        "Hotels And Tourism": {
          best: 20,
          better: [15, 20],
          good: [10, 15],
          neutral: [5, 10],
          weak: [3, 5],
          worst: 3
        },
        "Development Banks": {
          best: 22,
          better: [18, 22],
          good: [15, 18],
          neutral: [12, 15],
          weak: [8, 12],
          worst: 8
        },
        "Microfinance": {
          best: 25,
          better: [20, 25],
          good: [15, 20],
          neutral: [12, 15],
          weak: [8, 12],
          worst: 8
        },
        "Others": {
          best: 18,
          better: [15, 18],
          good: [12, 15],
          neutral: [8, 12],
          weak: [5, 8],
          worst: 5
        },
    },
        // Gross Profit Margin (GPM) Rating Ranges
      gpmRatingRanges: {
        "Commercial Banks": {
            excellent: 65,
            good: [60, 65],
            average: [55, 60],
            below_average: [50, 55],
            poor: [45, 50],
            critical: 45
        },
        "Development Banks": {
            excellent: 60,
            good: [55, 60],
            average: [50, 55],
            below_average: [45, 50],
            poor: [40, 45],
            critical: 40
        },
        "Finance": {
            excellent: 55,
            good: [50, 55],
            average: [45, 50],
            below_average: [40, 45],
            poor: [35, 40],
            critical: 35
        },
        "Hydro Power": {
            excellent: 85,
            good: [80, 85],
            average: [75, 80],
            below_average: [70, 75],
            poor: [65, 70],
            critical: 65
        },
        "Non Life Insurance": {
            excellent: 70,
            good: [65, 70],
            average: [60, 65],
            below_average: [55, 60],
            poor: [50, 55],
            critical: 50
        },
        "Life Insurance": {
            excellent: 60,
            good: [55, 60],
            average: [50, 55],
            below_average: [45, 50],
            poor: [40, 45],
            critical: 40
        },
        "Microfinance": {
            excellent: 75,
            good: [70, 75],
            average: [65, 70],
            below_average: [60, 65],
            poor: [55, 60],
            critical: 55
        },
        "Manufacturing And Processing": {
            excellent: 50,
            good: [45, 50],
            average: [40, 45],
            below_average: [35, 40],
            poor: [30, 35],
            critical: 30
        },
        "Tradings": {
            excellent: 35,
            good: [30, 35],
            average: [25, 30],
            below_average: [20, 25],
            poor: [15, 20],
            critical: 15
        },
        "Hotels And Tourism": {
            excellent: 55,
            good: [50, 55],
            average: [45, 50],
            below_average: [40, 45],
            poor: [35, 40],
            critical: 35
        },
        "Others": {
            excellent: 45,
            good: [40, 45],
            average: [35, 40],
            below_average: [30, 35],
            poor: [25, 30],
            critical: 25
        }
    },
     // Price-to-Earnings (P/E) Rating Ranges
      peRatingRanges: {
        "Commercial Banks": {
            overvalued: 20,
            fairlyvalued: [12, 20],
            undervalued: 12
        },
        "Development Banks": {
            overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        },
        "Finance": {
            overvalued: 18,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Hydro Power": {
            overvalued: 30,
            fairlyvalued: [18, 25],
            undervalued: 18
        },
        "Non Life Insurance": {
            overvalued: 22,
            fairlyvalued: [12, 18],
            undervalued: 12
        },
        "Life Insurance": {
            overvalued: 25,
            fairlyvalued: [15, 20],
            undervalued: 15
        },
        "Microfinance": {
            overvalued: 18,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Manufacturing And Processing": {
            overvalued: 25,
            fairlyvalued: [12, 20],
            undervalued: 12
        },
        "Tradings": {
           overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        },
        "Hotels And Tourism": {
            overvalued: 25,
            fairlyvalued: [15, 20],
            undervalued: 15
        },
        "Investment": {
            overvalued: 15,
            fairlyvalued: [10, 15],
            undervalued: 10
        },
        "Others": {
            overvalued: 15,
            fairlyvalued: [8, 12],
            undervalued: 8
        }
    },
    // Price-to-Book (P/B) Rating Ranges
      pbRatingRanges: {
        "Commercial Banks": {
            overvalued: 2.0,
            fairlyvalued: [1.2, 2.0],
            undervalued: 1.2
        },
        "Development Banks": {
            overvalued: 1.5,
            fairlyvalued: [0.8, 1.5],
            undervalued: 0.8
        },
        "Finance": {
            overvalued: 1.6,
            fairlyvalued: [0.9, 1.6],
            undervalued: 0.9
        },
        "Hydro Power": {
            overvalued: 2.8,
            fairlyvalued: [1.5, 2.8],
            undervalued: 1.5
        },
        "Non Life Insurance": {
            overvalued: 2.0,
            fairlyvalued: [1.1, 2.0],
            undervalued: 1.1
        },
        "Life Insurance": {
            overvalued: 2.2,
            fairlyvalued: [1.3, 2.2],
            undervalued: 1.3
        },
        "Microfinance": {
            overvalued: 1.7,
            fairlyvalued: [1.0, 1.7],
            undervalued: 1.0
        },
        "Manufacturing And Processing": {
            overvalued: 3.0,
            fairlyvalued: [2.0, 3.0],
            undervalued: 2.0
        },
        "Tradings": {
           overvalued: 1.5,
            fairlyvalued: [0.7, 1.5],
            undervalued: 0.7
        },
        "Hotels And Tourism": {
            overvalued: 2.0,
            fairlyvalued: [1.0, 2.0],
            undervalued: 1.0
        },
        "Investment": {
            overvalued: 1.8,
            fairlyvalued: [0.8, 1.8],
            undervalued: 0.8
        },
        "Others": {
            overvalued: 1.5,
            fairlyvalued: [0.7, 1.5],
            undervalued: 0.7
        }
    },
    // Price-to-Sales (P/S) Rating Ranges
      psRatingRanges: {
        "Commercial Banks": {
            overvalued: 3.5,
            fairlyvalued: [2.0, 3.5],
            undervalued: 2.0
        },
        "Development Banks": {
            overvalued: 3.0,
            fairlyvalued: [1.5, 3.0],
            undervalued: 1.5
        },
        "Finance": {
            overvalued: 2.8,
            fairlyvalued: [1.2, 2.8],
            undervalued: 1.2
        },
        "Hydro Power": {
            overvalued: 5.0,
            fairlyvalued: [2.5, 5.0],
            undervalued: 2.5
        },
        "Non Life Insurance": {
            overvalued: 3.5,
            fairlyvalued: [1.5, 3.5],
            undervalued: 1.5
        },
        "Life Insurance": {
            overvalued: 4.0,
            fairlyvalued: [1.8, 4.0],
            undervalued: 1.8
        },
        "Microfinance": {
            overvalued: 3.2,
            fairlyvalued: [1.5, 3.2],
            undervalued: 1.5
        },
        "Manufacturing And Processing": {
            overvalued: 3.5,
            fairlyvalued: [1.2, 3.5],
            undervalued: 1.2
        },
        "Tradings": {
            overvalued: 2.5,
            fairlyvalued: [0.8, 2.5],
            undervalued: 0.8
        },
        "Hotels And Tourism": {
            overvalued: 3.5,
            fairlyvalued: [1.5, 3.5],
            undervalued: 1.5
        },
        "Investment": {
            overvalued: 3.0,
            fairlyvalued: [1.0, 3.0],
            undervalued: 1.0
        },
        "Others": {
            overvalued: 2.5,
            fairlyvalued: [0.8, 2.5],
            undervalued: 0.8
        }
    },
    // EV/EBITDA  Rating Ranges
      ebitdaRatingRanges: {
        "Commercial Banks": {
            overvalued: 10.0,
            fairlyvalued: [6.0, 10.0],
            undervalued: 6.0
        },
        "Development Banks": {
            overvalued: 8.5,
            fairlyvalued: [5.0, 8.5],
            undervalued: 5.0
        },
        "Finance": {
            overvalued: 7.5,
            fairlyvalued: [4.5, 7.5],
            undervalued: 4.5
        },
        "Hydro Power": {
            overvalued: 15.0,
            fairlyvalued: [8.0, 15.0],
            undervalued: 8.0
        },
        "Non Life Insurance": {
            overvalued: 11.0,
            fairlyvalued: [6.0, 11.0],
            undervalued: 6.0
        },
        "Life Insurance": {
            overvalued: 12.0,
            fairlyvalued: [7.0, 12.0],
            undervalued: 7.0
        },
        "Microfinance": {
            overvalued: 9.5,
            fairlyvalued: [5.5, 9.5],
            undervalued: 5.5
        },
        "Manufacturing And Processing": {
            overvalued: 12.0,
            fairlyvalued: [6.5, 12.0],
            undervalued: 6.5
        },
        "Tradings": {
            overvalued: 7.0,
            fairlyvalued: [3.5, 7.0],
            undervalued: 3.5
        },
        "Hotels And Tourism": {
            overvalued: 15.0,
            fairlyvalued: [8.0, 15.0],
            undervalued: 8.0
        },
        "Investment": {
            overvalued: 9.0,
            fairlyvalued: [5.0, 9.0],
            undervalued: 5.0
        },
        "Others": {
            overvalued: 7.0,
            fairlyvalued: [3.5, 7.0],
            undervalued: 3.5
        }
    },
    // Revenue Growth Rating Ranges
      revenueGrowthRatingRanges: {
        "Commercial Banks": {
            high_growth: 15,
            moderate_growth: [8, 15],
            low_stable_growth: [3, 8],
            declining_revenue: 3
        },
        "Development Banks": {
            high_growth: 20,
            moderate_growth: [10, 20],
            low_stable_growth: [5, 10],
            declining_revenue: 5
        },
        "Finance": {
            high_growth: 25,
            moderate_growth: [15, 25],
            low_stable_growth: [5, 15],
            declining_revenue: 5
        },
        "Microfinance": {
            high_growth: 30,
            moderate_growth: [15, 30],
            low_stable_growth: [5, 15],
            declining_revenue: 5
        },
        "Hydro Power": {
            high_growth: 20,
            moderate_growth: [10, 20],
            low_stable_growth: [0, 10],
            declining_revenue: 0
        },
        "Life Insurance": {
            high_growth: 25,
            moderate_growth: [10, 25],
            low_stable_growth: [5, 10],
            declining_revenue: 5
        },
        "Non Life Insurance": {
            high_growth: 20,
            moderate_growth: [10, 20],
            low_stable_growth: [5, 10],
            declining_revenue: 5
        },
        "Manufacturing And Processing": {
            high_growth: 25,
            moderate_growth: [10, 25],
            low_stable_growth: [0, 10],
            declining_revenue: 0
        },
        "Hotels And Tourism": {
            high_growth: 40,
            moderate_growth: [15, 40],
            low_stable_growth: [0, 15],
            declining_revenue: 0
        },
        "Trading": {
            high_growth: 30,
            moderate_growth: [10, 30],
            low_stable_growth: [0, 10],
            declining_revenue: 0
        },
        "Investment": {
            high_growth: 35,
            moderate_growth: [15, 35],
            low_stable_growth: [0, 15],
            declining_revenue: 0
        },
        "Others": {
            high_growth: 30,
            moderate_growth: [10, 30],
            low_stable_growth: [0, 10],
            declining_revenue: 0
        }
    },
    // EPS Growth Rating Ranges
      epsGrowthRatingRanges: {
        "Commercial Banks": {
            high_growth: 25,
            steady_growth: [12, 25],
            stable: [5, 12],
            declining: [0, 5],
            loss_making: 0
        },
        "Development Banks": {
            high_growth: 30,
            steady_growth: [15, 30],
            stable: [8, 15],
            declining: [0, 8],
            loss_making: 0
        },
        "Finance": {
            high_growth: 35,
            steady_growth: [20, 35],
            stable: [10, 20],
            declining: [0, 10],
            loss_making: 0
        },
        "Microfinance": {
            high_growth: 40,
            steady_growth: [25, 40],
            stable: [15, 25],
            declining: [0, 15],
            loss_making: 0
        },
        "Hydro Power": {
            high_growth: 30,
            steady_growth: [15, 30],
            stable: [5, 15],
            declining: [0, 5],
            loss_making: 0
        },
        "Life Insurance": {
            high_growth: 25,
            steady_growth: [15, 25],
            stable: [8, 15],
            declining: [0, 8],
            loss_making: 0
        },
        "Non Life Insurance": {
            high_growth: 20,
            steady_growth: [12, 20],
            stable: [5, 12],
            declining: [0, 5],
            loss_making: 0
        },
        "Manufacturing And Processing": {
            high_growth: 25,
            steady_growth: [15, 25],
            stable: [5, 15],
            declining: [0, 5],
            loss_making: 0
        },
        "Hotels And Tourism": {
            high_growth: 50,
            steady_growth: [20, 50],
            stable: [5, 20],
            declining: [0, 5],
            loss_making: 0
        },
        "Tradings": {
            high_growth: 40,
            steady_growth: [20, 40],
            stable: [5, 20],
            declining: [0, 5],
            loss_making: 0
        },
        "Investment": {
            high_growth: 35,
            steady_growth: [20, 35],
            stable: [5, 20],
            declining: [0, 5],
            loss_making: 0
        },
        "Others": {
            high_growth: 40,
            steady_growth: [20, 40],
            stable: [5, 20],
            declining: [0, 5],
            loss_making: 0
        }
    },
    // Dividend Growth Rating Ranges
      dividendGrowthRatingRanges: {
        "Commercial Banks": {
            high_growth: 20,
            stable_growth: [12, 20],
            slow_growth: [5, 12],
            stagnant: [0, 5]
        },
        "Development Banks": {
            high_growth: 15,
            stable_growth: [8, 15],
            slow_growth: [3, 8],
            stagnant: [0, 3]
        },
        "Finance": {
            high_growth: 25,
            stable_growth: [15, 25],
            slow_growth: [8, 15],
            stagnant: [0, 8]
        },
        "Microfinance": {
            high_growth: 30,
            stable_growth: [15, 30],
            slow_growth: [5, 15],
            stagnant: [0, 5]
        },
        "Hydro Power": {
            high_growth: 20,
            stable_growth: [10, 20],
            slow_growth: [5, 10],
            stagnant: [0, 5]
        },
        "Life Insurance": {
            high_growth: 18,
            stable_growth: [10, 18],
            slow_growth: [5, 10],
            stagnant: [0, 5]
        },
        "Non Life Insurance": {
            high_growth: 15,
            stable_growth: [8, 15],
            slow_growth: [3, 8],
            stagnant: [0, 3]
        },
        "Manufacturing And Processing": {
            high_growth: 15,
            stable_growth: [8, 15],
            slow_growth: [3, 8],
            stagnant: [0, 3]
        },
        "Hotels And Tourism": {
            high_growth: 15,
            stable_growth: [5, 15],
            slow_growth: [3, 5],
            stagnant: [0, 3]
        },
        "Tradings": {
            high_growth: 15,
            stable_growth: [5, 15],
            slow_growth: [3, 5],
            stagnant: [0, 3]
        },
        "Investment": {
            high_growth: 20,
            stable_growth: [10, 20],
            slow_growth: [5, 10],
            stagnant: [0, 5]
        },
        "Others": {
            high_growth: 15,
            stable_growth: [5, 15],
            slow_growth: [3, 5],
            stagnant: [0, 3]
        }
    },
    // Operating Income Growth Rating Ranges
      operatingIncomeGrowthRatingRanges: {
        "Commercial Banks": {
            strong_growth: 30,
            healthy_growth: [18, 30],
            moderate_growth: [8, 18],
            stagnant: [0, 8],
            declining: 0
        },
        "Development Banks": {
            strong_growth: 35,
            healthy_growth: [20, 35],
            moderate_growth: [10, 20],
            stagnant: [0, 10],
            declining: 0
        },
        "Finance": {
            strong_growth: 40,
            healthy_growth: [25, 40],
            moderate_growth: [15, 25],
            stagnant: [0, 15],
            declining: 0
        },
        "Microfinance": {
            strong_growth: 45,
            healthy_growth: [30, 45],
            moderate_growth: [15, 30],
            stagnant: [0, 15],
            declining: 0
        },
        "Hydro Power": {
            strong_growth: 35,
            healthy_growth: [20, 35],
            moderate_growth: [10, 20],
            stagnant: [0, 10],
            declining: 0
        },
        "Life Insurance": {
            strong_growth: 30,
            healthy_growth: [20, 30],
            moderate_growth: [10, 20],
            stagnant: [0, 10],
            declining: 0
        },
        "Non Life Insurance": {
            strong_growth: 25,
            healthy_growth: [15, 25],
            moderate_growth: [8, 15],
            stagnant: [0, 8],
            declining: 0
        },
        "Manufacturing And Processing": {
            strong_growth: 30,
            healthy_growth: [20, 30],
            moderate_growth: [10, 20],
            stagnant: [0, 10],
            declining: 0
        },
        "Hotels And Tourism": {
            strong_growth: 60,
            healthy_growth: [30, 60],
            moderate_growth: [5, 30],
            stagnant: [0, 5],
            declining: 0
        },
        "Tradings": {
            strong_growth: 50,
            healthy_growth: [25, 50],
            moderate_growth: [5, 25],
            stagnant: [0, 5],
            declining: 0
        },
        "Investment": {
            strong_growth: 40,
            healthy_growth: [25, 40],
            moderate_growth: [10, 25],
            stagnant: [0, 10],
            declining: 0
        },
        "Others": {
            strong_growth: 50,
            healthy_growth: [25, 50],
            moderate_growth: [5, 25],
            stagnant: [0, 5],
            declining: 0
        }
    },
    // Current Ratio Rating Ranges
      currentRatioRatingRanges: {
        "Commercial Banks": {
            high_growth: 0.25,
            steady_growth: [0.12, 0.25],
            stable: [0.05, 0.12],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Development Banks": {
            high_growth: 0.30,
            steady_growth: [0.15, 0.30],
            stable: [0.08, 0.15],
            declining: [0.0, 0.08],
            loss_making: 0.0
        },
        "Finance": {
            high_growth: 0.30,
            steady_growth: [0.15, 0.30],
            stable: [0.08, 0.15],
            declining: [0.0, 0.08],
            loss_making: 0.0
        },
        "Hydro Power": {
            high_growth: 0.35,
            steady_growth: [0.20, 0.35],
            stable: [0.10, 0.20],
            declining: [0.0, 0.10],
            loss_making: 0.0
        },
        "Non Life Insurance": {
            high_growth: 0.40,
            steady_growth: [0.25, 0.40],
            stable: [0.15, 0.25],
            declining: [0.0, 0.15],
            loss_making: 0.0
        },
        "Life Insurance": {
            high_growth: 0.30,
            steady_growth: [0.15, 0.30],
            stable: [0.05, 0.15],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Manufacturing And Processing": {
            high_growth: 0.25,
            steady_growth: [0.15, 0.25],
            stable: [0.08, 0.15],
            declining: [0.0, 0.08],
            loss_making: 0.0
        },
        "Tradings": {
            high_growth: 0.20,
            steady_growth: [0.12, 0.20],
            stable: [0.05, 0.12],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Hotels And Tourism": {
            high_growth: 0.25,
            steady_growth: [0.15, 0.25],
            stable: [0.05, 0.15],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Microfinance": {
            high_growth: 0.50,
            steady_growth: [0.20, 0.50],
            stable: [0.05, 0.20],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Investment": {
            high_growth: 0.40,
            steady_growth: [0.20, 0.40],
            stable: [0.05, 0.20],
            declining: [0.0, 0.05],
            loss_making: 0.0
        },
        "Others": {
            high_growth: 0.35,
            steady_growth: [0.20, 0.35],
            stable: [0.05, 0.20],
            declining: [0.0, 0.05],
            loss_making: 0.0
        }
    },

    //Balance Sheet Health
    //Equity Ratio Rating Ranges
      equityRatioRatingRanges: {
      "Commercial Banks": {
          very_strong: 60,
          strong: [50, 60],
          moderate: [40, 50],
          weak: [30, 40],
          very_weak: 30
      },
      "Development Banks": {
          very_strong: 50,
          strong: [40, 50],
          moderate: [30, 40],
          weak: [20, 30],
          very_weak: 20
      },
      "Finance": {
          very_strong: 45,
          strong: [35, 45],
          moderate: [25, 35],
          weak: [15, 25],
          very_weak: 15
      },
      "Life Insurance": {
          very_strong: 70,
          strong: [60, 70],
          moderate: [50, 60],
          weak: [40, 50],
          very_weak: 40
      },
      "Non Life Insurance": {
          very_strong: 70,
          strong: [60, 70],
          moderate: [50, 60],
          weak: [40, 50],
          very_weak: 40
      },
      "Hydro Power": {
          very_strong: 55,
          strong: [45, 55],
          moderate: [35, 45],
          weak: [25, 35],
          very_weak: 25
      },
      "Microfinance": {
          very_strong: 40,
          strong: [30, 40],
          moderate: [20, 30],
          weak: [10, 20],
          very_weak: 10
      },
      "Manufacturing And Processing": {
          very_strong: 50,
          strong: [40, 50],
          moderate: [30, 40],
          weak: [20, 30],
          very_weak: 20
      },
      "Tradings": {
          very_strong: 35,
          strong: [25, 35],
          moderate: [15, 25],
          weak: [8, 15],
          very_weak: 8
      },
      "Investment": {
          very_strong: 35,
          strong: [25, 35],
          moderate: [15, 25],
          weak: [8, 15],
          very_weak: 8
      },
      "Others": {
          very_strong: 35,
          strong: [25, 35],
          moderate: [15, 25],
          weak: [8, 15],
          very_weak: 8
      },
      "Hotels And Tourism": {
          very_strong: 45,
          strong: [35, 45],
          moderate: [25, 35],
          weak: [15, 25],
          very_weak: 15
      }
    },
    //Tangible Asset Ratio Rating Ranges
      tangibleAssetRatioRatingRanges: {
        "Commercial Banks": {
            very_strong: 3.0,
            strong: [2.0, 3.0],
            moderate: [1.5, 2.0],
            weak: [1.0, 1.5],
            very_weak: 1.0
        },
        "Development Banks": {
            very_strong: 2.5,
            strong: [1.8, 2.5],
            moderate: [1.2, 1.8],
            weak: [0.8, 1.2],
            very_weak: 0.8
        },
        "Finance": {
            very_strong: 2.0,
            strong: [1.5, 2.0],
            moderate: [1.0, 1.5],
            weak: [0.6, 1.0],
            very_weak: 0.6
        },
        "Non Life Insurance": {
            very_strong: 4.0,
            strong: [3.0, 4.0],
            moderate: [2.0, 3.0],
            weak: [1.5, 2.0],
            very_weak: 1.5
        },
        "Life Insurance": {
            very_strong: 4.0,
            strong: [3.0, 4.0],
            moderate: [2.0, 3.0],
            weak: [1.5, 2.0],
            very_weak: 1.5
        },
        "Hydro Power": {
            very_strong: 2.2,
            strong: [1.7, 2.2],
            moderate: [1.2, 1.7],
            weak: [0.7, 1.2],
            very_weak: 0.7
        },
        "Microfinance": {
            very_strong: 1.8,
            strong: [1.3, 1.8],
            moderate: [0.9, 1.3],
            weak: [0.5, 0.9],
            very_weak: 0.5
        },
        "Manufacturing And Processing": {
            very_strong: 2.5,
            strong: [1.8, 2.5],
            moderate: [1.2, 1.8],
            weak: [0.7, 1.2],
            very_weak: 0.7
        },
        "Tradings": {
            very_strong: 1.5,
            strong: [1.0, 1.5],
            moderate: [0.7, 1.0],
            weak: [0.4, 0.7],
            very_weak: 0.4
        },
        "Hotels And Tourism": {
            very_strong: 2.0,
            strong: [1.4, 2.0],
            moderate: [0.9, 1.4],
            weak: [0.5, 0.9],
            very_weak: 0.5
        },
        "Investment": {
            very_strong: 1.5,
            strong: [1.0, 1.5],
            moderate: [0.7, 1.0],
            weak: [0.4, 0.7],
            very_weak: 0.4
        },
        "Others": {
            very_strong: 1.5,
            strong: [1.0, 1.5],
            moderate: [0.7, 1.0],
            weak: [0.4, 0.7],
            very_weak: 0.4
        },
    },
    // Working Capital Rating Ranges
      workingCapitalRatingRanges: {
        "Commercial Banks": {
            range: [15000, 25000],
            position: "Strong"
        },
        "Development Banks": {
            range: [2000, 5000],
            position: "Moderate"
        },
        "Finance": {
            range: [1500, 4000],
            position: "Moderate"
        },
        "Hydro Power": {
            range: [800, 3000],
            position: "Moderate to Weak"
        },
        "Non Life Insurance": {
            range: [1200, 3500],
            position: "Moderate"
        },
        "Life Insurance": {
            range: [2500, 6000],
            position: "Strong"
        },
        "Manufacturing And Processing": {
            range: [500, 2000],
            position: "Weak to Moderate"
        },
        "Hotels And Tourism": {
            range: [300, 1500],
            position: "Weak"
        },
        "Tradings": {
            range: [200, 1000],
            position: "Weak"
        },
        "Investment": {
            range: [200, 1000],
            position: "Weak"
        },
        "Microfinance": {
            range: [1000, 3000],
            position: "Moderate"
        },
        "Others": {
            range: [500, 2500],
            position: "Weak to Moderate"
        }
    },
    //Retained Earnings Rating Ranges
      retainedEarningsRatingRanges: {
        "Commercial Banks": {
            very_strong: 5000,
            strong: [2000, 5000],
            moderate: [500, 2000],
            weak: [100, 500],
            very_weak: 100
        },
        "Development Banks": {
            very_strong: 2000,
            strong: [1000, 2000],
            moderate: [300, 1000],
            weak: [50, 300],
            very_weak: 50
        },
        "Finance": {
            very_strong: 1000,
            strong: [500, 1000],
            moderate: [200, 500],
            weak: [30, 200],
            very_weak: 30
        },
        "Non Life Insurance": {
            very_strong: 3000,
            strong: [1500, 3000],
            moderate: [400, 1500],
            weak: [100, 400],
            very_weak: 100
        },
        "Life Insurance": {
            very_strong: 3000,
            strong: [1500, 3000],
            moderate: [400, 1500],
            weak: [100, 400],
            very_weak: 100
        },
        "Hydro Power": {
            very_strong: 1500,
            strong: [800, 1500],
            moderate: [200, 800],
            weak: [50, 200],
            very_weak: 50
        },
        "Microfinance": {
            very_strong: 300,
            strong: [150, 300],
            moderate: [50, 150],
            weak: [10, 50],
            very_weak: 10
        },
        "Manufacturing And Processing": {
            very_strong: 800,
            strong: [300, 800],
            moderate: [100, 300],
            weak: [20, 100],
            very_weak: 20
        },
        "Tradings": {
            very_strong: 500,
            strong: [200, 500],
            moderate: [50, 200],
            weak: [10, 50],
            very_weak: 10
        },
        "Hotels And Tourism": {
            very_strong: 400,
            strong: [150, 400],
            moderate: [40, 150],
            weak: [5, 40],
            very_weak: 5
        },
        "Investment": {
            very_strong: 500,
            strong: [200, 500],
            moderate: [50, 200],
            weak: [10, 50],
            very_weak: 10
        },
        "Others": {
            very_strong: 500,
            strong: [200, 500],
            moderate: [50, 200],
            weak: [10, 50],
            very_weak: 10
        },
    },

    //Earnings Quality
    // Accrual Ratio Rating Ranges
      accrualRatioRatingRanges: {
        "Commercial Banks": {
            very_strong: 0.05,
            strong: [0.05, 0.10],
            moderate: [0.10, 0.15],
            weak: [0.15, 0.20],
            very_weak: 0.20
        },
        "Development Banks": {
            very_strong: 0.06,
            strong: [0.06, 0.12],
            moderate: [0.12, 0.18],
            weak: [0.18, 0.24],
            very_weak: 0.24
        },
        "Finance Companies": {
            very_strong: 0.08,
            strong: [0.08, 0.14],
            moderate: [0.14, 0.20],
            weak: [0.20, 0.26],
            very_weak: 0.26
        },
        "Life Insurance": {
            very_strong: 0.08,
            strong: [0.08, 0.12],
            moderate: [0.12, 0.20],
            weak: [0.20, 0.30],
            very_weak: 0.30
        },
        "Non Life Insurance": {
            very_strong: 0.08,
            strong: [0.08, 0.12],
            moderate: [0.12, 0.20],
            weak: [0.20, 0.30],
            very_weak: 0.30
        },
        "Hydro Power": {
            very_strong: 0.20,
            strong: [0.20, 0.30],
            moderate: [0.30, 0.45],
            weak: [0.45, 0.60],
            very_weak: 0.60
        },
        "Microfinance": {
            very_strong: 0.18,
            strong: [0.18, 0.25],
            moderate: [0.25, 0.35],
            weak: [0.35, 0.50],
            very_weak: 0.50
        },
        "Manufacturing And Processing": {
            very_strong: 0.15,
            strong: [0.15, 0.22],
            moderate: [0.22, 0.35],
            weak: [0.35, 0.50],
            very_weak: 0.50
        },
        "Tradings": {
            very_strong: 0.25,
            strong: [0.25, 0.40],
            moderate: [0.40, 0.60],
            weak: [0.60, 0.80],
            very_weak: 0.80
        },
        "Hotels And Tourism": {
            very_strong: 0.30,
            strong: [0.30, 0.45],
            moderate: [0.45, 0.65],
            weak: [0.65, 0.85],
            very_weak: 0.85
        },
        "Investment": {
            very_strong: 0.25,
            strong: [0.25, 0.40],
            moderate: [0.40, 0.60],
            weak: [0.60, 0.80],
            very_weak: 0.80
        },
        "Others": {
            very_strong: 0.25,
            strong: [0.25, 0.40],
            moderate: [0.40, 0.60],
            weak: [0.60, 0.80],
            very_weak: 0.80
        }
    },
    //Earnings stability Rating Ranges
      earningsStabilityRatingRanges : {
        "Commercial Banks": {
            excellent: 10,
            good: [10, 15],
            moderate: [15, 25],
            volatile: [25, 35],
            highly_unstable: 35
        },
        "Development Banks": {
            excellent: 12,
            good: [12, 18],
            moderate: [18, 28],
            volatile: [28, 38],
            highly_unstable: 38
        },
        "Finance": {
            excellent: 15,
            good: [15, 22],
            moderate: [22, 32],
            volatile: [32, 42],
            highly_unstable: 42
        },
        "Life Insurance": {
            excellent: 8,
            good: [8, 12],
            moderate: [12, 20],
            volatile: [20, 30],
            highly_unstable: 30
        },
        "Non Life Insurance": {
            excellent: 8,
            good: [8, 12],
            moderate: [12, 20],
            volatile: [20, 30],
            highly_unstable: 30
        },
        "Hydro Power": {
            excellent: 20,
            good: [20, 30],
            moderate: [30, 45],
            volatile: [45, 60],
            highly_unstable: 60
        },
        "Microfinance": {
            excellent: 18,
            good: [18, 25],
            moderate: [25, 35],
            volatile: [35, 50],
            highly_unstable: 50
        },
        "Manufacturing And Processing": {
            excellent: 15,
            good: [15, 22],
            moderate: [22, 35],
            volatile: [35, 50],
            highly_unstable: 50
        },
        "Tradings": {
            excellent: 25,
            good: [25, 40],
            moderate: [40, 60],
            volatile: [60, 80],
            highly_unstable: 80
        },
        "Hotels And Tourism": {
            excellent: 30,
            good: [30, 45],
            moderate: [45, 65],
            volatile: [65, 85],
            highly_unstable: 85
        },
        "Investment": {
            excellent: 25,
            good: [25, 40],
            moderate: [40, 60],
            volatile: [60, 80],
            highly_unstable: 80
        },
        "Others": {
            excellent: 25,
            good: [25, 40],
            moderate: [40, 60],
            volatile: [60, 80],
            highly_unstable: 80
        }
    },
      //Revenue Recognition Rating Ranges
      revenueRecognitionRatingRanges : {
        "Commercial Banks": {
            very_strong: 5,
            strong: [5, 10],
            moderate: [10, 20],
            weak: [20, 30],
            very_weak: 30
        },
        "Development Banks": {
            very_strong: 7,
            strong: [7, 12],
            moderate: [12, 22],
            weak: [22, 32],
            very_weak: 32
        },
        "Finance": {
            very_strong: 8,
            strong: [8, 15],
            moderate: [15, 25],
            weak: [25, 35],
            very_weak: 35
        },
        "Non Life Insurance": {
            very_strong: 3,
            strong: [3, 8],
            moderate: [8, 15],
            weak: [15, 25],
            very_weak: 25
        },
        "Life Insurance": {
            very_strong: 3,
            strong: [3, 8],
            moderate: [8, 15],
            weak: [15, 25],
            very_weak: 25
        },
        "Hydro Power": {
            very_strong: 10,
            strong: [10, 20],
            moderate: [20, 35],
            weak: [35, 50],
            very_weak: 50
        },
        "Microfinance": {
            very_strong: 12,
            strong: [12, 18],
            moderate: [18, 28],
            weak: [28, 38],
            very_weak: 38
        },
        "Manufacturing And Processing": {
            very_strong: 7,
            strong: [7, 14],
            moderate: [14, 24],
            weak: [24, 34],
            very_weak: 34
        },
        "Tradings": {
            very_strong: 15,
            strong: [15, 25],
            moderate: [25, 40],
            weak: [40, 55],
            very_weak: 55
        },
        "Hotels And Tourism": {
            very_strong: 20,
            strong: [20, 30],
            moderate: [30, 45],
            weak: [45, 60],
            very_weak: 60
        }
    },
    //Deferred Revenue Rating Ranges
      deferredRevenueRatingRanges : {
        "Commercial Banks": {
            very_healthy: 5,
            healthy: [5, 10],
            moderate: [10, 15],
            concerning: [15, 20],
            high_risk: 20
        },
        "Development Banks": {
            very_healthy: 7,
            healthy: [7, 12],
            moderate: [12, 18],
            concerning: [18, 25],
            high_risk: 25
        },
        "Finance": {
            very_healthy: 8,
            healthy: [8, 15],
            moderate: [15, 22],
            concerning: [22, 30],
            high_risk: 30
        },
        "Life Insurance": {
            very_healthy: 10,
            healthy: [10, 15],
            moderate: [15, 20],
            concerning: [20, 30],
            high_risk: 30
        },
        "Non Life Insurance": {
            very_healthy: 10,
            healthy: [10, 15],
            moderate: [15, 20],
            concerning: [20, 30],
            high_risk: 30
        },
        "Hydro Power": {
            very_healthy: 12,
            healthy: [12, 20],
            moderate: [20, 30],
            concerning: [30, 40],
            high_risk: 40
        },
        "Microfinance": {
            very_healthy: 15,
            healthy: [15, 22],
            moderate: [22, 32],
            concerning: [32, 45],
            high_risk: 45
        },
        "Manufacturing And Processing": {
            very_healthy: 10,
            healthy: [10, 17],
            moderate: [17, 25],
            concerning: [25, 35],
            high_risk: 35
        },
        "Tradings": {
            very_healthy: 20,
            healthy: [20, 30],
            moderate: [30, 45],
            concerning: [45, 60],
            high_risk: 60
        },
        "Hotels And Tourism": {
            very_healthy: 25,
            healthy: [25, 35],
            moderate: [35, 50],
            concerning: [50, 70],
            high_risk: 70
        }
    },

    //Shareholder Value
    //EVA Rating Ranges
      evaRatingRanges : {
        "Commercial Banks": {
            outstanding: 1500,
            strong: [750, 1500],
            moderate: [250, 750],
            weak: [50, 250],
            destroying_value: 50
        },
        "Development Banks": {
            outstanding: 800,
            strong: [400, 800],
            moderate: [150, 400],
            weak: [30, 150],
            destroying_value: 30
        },
        "Finance": {
            outstanding: 600,
            strong: [300, 600],
            moderate: [100, 300],
            weak: [20, 100],
            destroying_value: 20
        },
        "Life Insurance": {
            outstanding: 1200,
            strong: [600, 1200],
            moderate: [200, 600],
            weak: [40, 200],
            destroying_value: 40
        },
        "Non Life Insurance": {
            outstanding: 1200,
            strong: [600, 1200],
            moderate: [200, 600],
            weak: [40, 200],
            destroying_value: 40
        },
        "Hydro Power": {
            outstanding: 2000,
            strong: [1000, 2000],
            moderate: [300, 1000],
            weak: [50, 300],
            destroying_value: 50
        },
        "Microfinance": {
            outstanding: 200,
            strong: [100, 200],
            moderate: [30, 100],
            weak: [5, 30],
            destroying_value: 5
        },
        "Manufacturing And Processing": {
            outstanding: 900,
            strong: [450, 900],
            moderate: [150, 450],
            weak: [25, 150],
            destroying_value: 25
        },
        "Tradings": {
            outstanding: 400,
            strong: [200, 400],
            moderate: [50, 200],
            weak: [10, 50],
            destroying_value: 10
        },
        "Hotels And Tourism": {
            outstanding: 300,
            strong: [150, 300],
            moderate: [40, 150],
            weak: [5, 40],
            destroying_value: 5
        }
    },
    //MVA Rating Ranges
      mvaRatingRanges : {
        "Commercial Banks": {
            exceptional: 25,
            strong: [10, 25],
            moderate: [3, 10],
            weak: [0.5, 3],
            value_erosion: 0.5
        },
        "Development Banks": {
            exceptional: 12,
            strong: [5, 12],
            moderate: [1.5, 5],
            weak: [0.3, 1.5],
            value_erosion: 0.3
        },
        "Finance": {
            exceptional: 8,
            strong: [3, 8],
            moderate: [1, 3],
            weak: [0.2, 1],
            value_erosion: 0.2
        },
        "Life Insurance": {
            exceptional: 15,
            strong: [6, 15],
            moderate: [2, 6],
            weak: [0.4, 2],
            value_erosion: 0.4
        },
        "Non Life Insurance": {
            exceptional: 15,
            strong: [6, 15],
            moderate: [2, 6],
            weak: [0.4, 2],
            value_erosion: 0.4
        },
        "Hydro Power": {
            exceptional: 30,
            strong: [12, 30],
            moderate: [4, 12],
            weak: [0.8, 4],
            value_erosion: 0.8
        },
        "Microfinance": {
            exceptional: 3,
            strong: [1.2, 3],
            moderate: [0.4, 1.2],
            weak: [0.1, 0.4],
            value_erosion: 0.1
        },
        "Manufacturing And Processing": {
            exceptional: 10,
            strong: [4, 10],
            moderate: [1.2, 4],
            weak: [0.25, 1.2],
            value_erosion: 0.25
        },
        "Tradings": {
            exceptional: 5,
            strong: [2, 5],
            moderate: [0.6, 2],
            weak: [0.15, 0.6],
            value_erosion: 0.15
        },
        "Hotels And Tourism": {
            exceptional: 4,
            strong: [1.5, 4],
            moderate: [0.5, 1.5],
            weak: [0.1, 0.5],
            value_erosion: 0.1
        }
    },
    //TSR 1 year Rating Ranges
      tsr1YrRatingRanges : {
        "Commercial Banks": {
            outstanding: 35,
            strong: [20, 35],
            moderate: [8, 20],
            weak: [-5, 8],
            destroying_value: -5
        },
        "Development Banks": {
            outstanding: 30,
            strong: [15, 30],
            moderate: [5, 15],
            weak: [-8, 5],
            destroying_value: -8
        },
        "Finance": {
            outstanding: 40,
            strong: [25, 40],
            moderate: [10, 25],
            weak: [-3, 10],
            destroying_value: -3
        },
        "Life Insurance": {
            outstanding: 45,
            strong: [30, 45],
            moderate: [12, 30],
            weak: [-5, 12],
            destroying_value: -5
        },
        "Non Life Insurance": {
            outstanding: 45,
            strong: [30, 45],
            moderate: [12, 30],
            weak: [-5, 12],
            destroying_value: -5
        },
        "Hydro Power": {
            outstanding: 50,
            strong: [35, 50],
            moderate: [15, 35],
            weak: [0, 15],
            destroying_value: 0
        },
        "Microfinance": {
            outstanding: 25,
            strong: [12, 25],
            moderate: [0, 12],
            weak: [-10, 0],
            destroying_value: -10
        },
        "Manufacturing And Processing": {
            outstanding: 30,
            strong: [18, 30],
            moderate: [5, 18],
            weak: [-7, 5],
            destroying_value: -7
        },
        "Tradings": {
            outstanding: 60,
            strong: [40, 60],
            moderate: [20, 40],
            weak: [5, 20],
            destroying_value: 5
        },
        "Hotels And Tourism": {
            outstanding: 55,
            strong: [35, 55],
            moderate: [10, 35],
            weak: [-15, 10],
            destroying_value: -15
        }
    },
    //Buyback Yield Rating Ranges
      buybackYieldRatingRanges : {
        "Commercial Banks": {
            outstanding: 5,
            strong: [3, 5],
            moderate: [1.5, 3],
            weak: [0.5, 1.5],
            destroying_value: 0.5
        },
        "Development Banks": {
            outstanding: 4,
            strong: [2.5, 4],
            moderate: [1, 2.5],
            weak: [0.3, 1],
            destroying_value: 0.3
        },
        "Finance": {
            outstanding: 6,
            strong: [4, 6],
            moderate: [2, 4],
            weak: [0.8, 2],
            destroying_value: 0.8
        },
        "Life Insurance": {
            outstanding: 3,
            strong: [2, 3],
            moderate: [1, 2],
            weak: [0.4, 1],
            destroying_value: 0.4
        },
        "Non Life Insurance": {
            outstanding: 3,
            strong: [2, 3],
            moderate: [1, 2],
            weak: [0.4, 1],
            destroying_value: 0.4
        },
        "Hydro Power": {
            outstanding: 7,
            strong: [5, 7],
            moderate: [3, 5],
            weak: [1, 3],
            destroying_value: 1
        },
        "Microfinance": {
            outstanding: 2,
            strong: [1.2, 2],
            moderate: [0.5, 1.2],
            weak: [0.2, 0.5],
            destroying_value: 0.2
        },
        "Manufacturing And Proccesing": {
            outstanding: 4,
            strong: [2.5, 4],
            moderate: [1.2, 2.5],
            weak: [0.6, 1.2],
            destroying_value: 0.6
        },
        "Tradings": {
            outstanding: 8,
            strong: [6, 8],
            moderate: [3, 6],
            weak: [1.5, 3],
            destroying_value: 1.5
        },
        "Hotels And Tourism": {
            outstanding: 3,
            strong: [2, 3],
            moderate: [1, 2],
            weak: [0.5, 1],
            destroying_value: 0.5
        }
    },

    //Peer Comparison
    //P/E vs Sector Rating Ranges
      peRatioRanges : {
        "Commercial Banks": {
            very_cheap: 12,
            undervalued: [12, 16],
            fair_value: [16, 20],
            overvalued: [20, 25],
            very_expensive: 25
        },
        "Development Banks": {
            very_cheap: 10,
            undervalued: [10, 14],
            fair_value: [14, 18],
            overvalued: [18, 22],
            very_expensive: 22
        },
        "Finance": {
            very_cheap: 8,
            undervalued: [8, 12],
            fair_value: [12, 15],
            overvalued: [15, 20],
            very_expensive: 20
        },
        "Life Insurance": {
            very_cheap: 15,
            undervalued: [15, 20],
            fair_value: [20, 25],
            overvalued: [25, 30],
            very_expensive: 30
        },
        "Non Life Insurance": {
            very_cheap: 15,
            undervalued: [15, 20],
            fair_value: [20, 25],
            overvalued: [25, 30],
            very_expensive: 30
        },
        "Hydro Power": {
            very_cheap: 14,
            undervalued: [14, 18],
            fair_value: [18, 22],
            overvalued: [22, 28],
            very_expensive: 28
        },
        "Microfinance": {
            very_cheap: 10,
            undervalued: [10, 14],
            fair_value: [14, 18],
            overvalued: [18, 22],
            very_expensive: 22
        },
        "Manufacturing And Processing": {
            very_cheap: 12,
            undervalued: [12, 16],
            fair_value: [16, 20],
            overvalued: [20, 25],
            very_expensive: 25
        },
        "Tradings": {
            very_cheap: 8,
            undervalued: [8, 12],
            fair_value: [12, 15],
            overvalued: [15, 20],
            very_expensive: 20
        },
        "Hotels And Tourism": {
            very_cheap: 10,
            undervalued: [10, 15],
            fair_value: [15, 20],
            overvalued: [20, 25],
            very_expensive: 25
        },
        "Investment": {
            very_cheap: 8,
            undervalued: [8, 12],
            fair_value: [12, 15],
            overvalued: [15, 20],
            very_expensive: 20
        },
        "Others": {
            very_cheap: 8,
            undervalued: [8, 12],
            fair_value: [12, 15],
            overvalued: [15, 20],
            very_expensive: 20
        }
    },
    //Market Share Ranges
      marketShareRanges : {
        "Commercial Banks": {
            dominant: 15,
            strong: [10, 15],
            moderate: [5, 10],
            small: [2, 5],
            marginal: 2
        },
        "Development Banks": {
            dominant: 12,
            strong: [8, 12],
            moderate: [4, 8],
            small: [1.5, 4],
            marginal: 1.5
        },
        "Finance": {
            dominant: 10,
            strong: [6, 10],
            moderate: [3, 6],
            small: [1, 3],
            marginal: 1
        },
        "Life Insurance": {
            dominant: 20,
            strong: [12, 20],
            moderate: [6, 12],
            small: [2, 6],
            marginal: 2
        },
        "Non Life Insurance": {
            dominant: 20,
            strong: [12, 20],
            moderate: [6, 12],
            small: [2, 6],
            marginal: 2
        },
        "Hydro Power": {
            dominant: 25,
            strong: [15, 25],
            moderate: [8, 15],
            small: [3, 8],
            marginal: 3
        },
        "Microfinance": {
            dominant: 8,
            strong: [5, 8],
            moderate: [2, 5],
            small: [1, 2],
            marginal: 1
        },
        "Manufacturing And Processing": {
            dominant: 30,
            strong: [20, 30],
            moderate: [10, 20],
            small: [5, 10],
            marginal: 5
        },
        "Tradings": {
            dominant: 15,
            strong: [8, 15],
            moderate: [4, 8],
            small: [1, 4],
            marginal: 1
        },
        "Hotels And Tourism": {
            dominant: 20,
            strong: [12, 20],
            moderate: [6, 12],
            small: [2, 6],
            marginal: 2
        },
        "Investment": {
            dominant: 15,
            strong: [8, 15],
            moderate: [4, 8],
            small: [1, 4],
            marginal: 1
        },
        "Others": {
            dominant: 15,
            strong: [8, 15],
            moderate: [4, 8],
            small: [1, 4],
            marginal: 1
        },
        //ebitda margin rating ranges
      ebitdaMarginRanges : {
        "Commercial Banks": {
            excellent: 55,
            good: [45, 55],
            average: [35, 45],
            weak: [25, 35],
            poor: 25
        },
        "Development Banks": {
            excellent: 50,
            good: [40, 50],
            average: [30, 40],
            weak: [20, 30],
            poor: 20
        },
        "Finance": {
            excellent: 45,
            good: [35, 45],
            average: [25, 35],
            weak: [15, 25],
            poor: 15
        },
        "Life Insurance": {
            excellent: 60,
            good: [50, 60],
            average: [40, 50],
            weak: [30, 40],
            poor: 30
        },
        "Non Life Insurance": {
            excellent: 60,
            good: [50, 60],
            average: [40, 50],
            weak: [30, 40],
            poor: 30
        },
        "Hydro Power": {
            excellent: 70,
            good: [60, 70],
            average: [50, 60],
            weak: [40, 50],
            poor: 40
        },
        "Microfinance": {
            excellent: 50,
            good: [40, 50],
            average: [30, 40],
            weak: [20, 30],
            poor: 20
        },
        "Manufacturing And Processing": {
            excellent: 35,
            good: [25, 35],
            average: [15, 25],
            weak: [10, 15],
            poor: 10
        },
        "Tradings": {
            excellent: 30,
            good: [20, 30],
            average: [15, 20],
            weak: [10, 15],
            poor: 10
        },
        "Hotels And Tourism": {
            excellent: 40,
            good: [30, 40],
            average: [20, 30],
            weak: [15, 20],
            poor: 15
        },
        "Investment": {
            excellent: 30,
            good: [20, 30],
            average: [15, 20],
            weak: [10, 15],
            poor: 10
        },
        "Others": {
            excellent: 30,
            good: [20, 30],
            average: [15, 20],
            weak: [10, 15],
            poor: 10
        },
      },
      //P/B ratio vs Sector rating ranges
      pbRatioRanges : {
        "Commercial Banks": {
            undervalued: 1.2,
            fairvalued: [1.2, 1.8],
            overvalued: [1.8, 2.5],
            highlyOvervalued: 2.5
        },
        "Development Banks": {
            undervalued: 1.0,
            fairvalued: [1.0, 1.5],
            overvalued: [1.5, 2.0],
            highlyOvervalued: 2.0
        },
        "Finance": {
            undervalued: 0.8,
            fairvalued: [0.8, 1.2],
            overvalued: [1.2, 1.6],
            highlyOvervalued: 1.6
        },
        "Life Insurance": {
            undervalued: 1.5,
            fairvalued: [1.5, 2.5],
            overvalued: [2.5, 3.5],
            highlyOvervalued: 3.5
        },
        "Non Life Insurance": {
            undervalued: 1.2,
            fairvalued: [1.2, 1.8],
            overvalued: [1.8, 2.4],
            highlyOvervalued: 2.4
        },
        "Hydro Power": {
            undervalued: 1.3,
            fairvalued: [1.3, 2.0],
            overvalued: [2.0, 3.0],
            highlyOvervalued: 3.0
        },
        "Microfinance": {
            undervalued: 1.0,
            fairvalued: [1.0, 1.5],
            overvalued: [1.5, 2.0],
            highlyOvervalued: 2.0
        },
        "Manufacturing And Processing": {
            undervalued: 0.9,
            fairvalued: [0.9, 1.4],
            overvalued: [1.4, 2.0],
            highlyOvervalued: 2.0
        },
        "Tradings": {
            undervalued: 0.7,
            fairvalued: [0.7, 1.1],
            overvalued: [1.1, 1.6],
            highlyOvervalued: 1.6
        },
        "Investment": {
            undervalued: 0.7,
            fairValue: [0.7, 1.1],
            overvalued: [1.1, 1.6],
            highlyOvervalued: 1.6
        },
        "Hotels And Tourism": {
            undervalued: 0.8,
            fairvalued: [0.8, 1.3],
            overvalued: [1.3, 2.0],
            highlyOvervalued: 2.0
        }
    },

    },
    //Ebitda Margin Rating Ranges
      ebitdaMarginRanges : {
        "Commercial Banks": {
            excellent: 55,
            good: [45, 55],
            average: [35, 45],
            weak: [25, 35],
            poor: 25
        },
        "Development Banks": {
            excellent: 50,
            good: [40, 50],
            average: [30, 40],
            weak: [20, 30],
            poor: 20
        },
        "Finance Companies": {
            excellent: 45,
            good: [35, 45],
            average: [25, 35],
            weak: [15, 25],
            poor: 15
        },
        "Insurance (Life/Non-Life)": {
            excellent: 60,
            good: [50, 60],
            average: [40, 50],
            weak: [30, 40],
            poor: 30
        },
        "Hydro/Energy Projects": {
            excellent: 70,
            good: [60, 70],
            average: [50, 60],
            weak: [40, 50],
            poor: 40
        },
        "Microfinance (MFIs)": {
            excellent: 50,
            good: [40, 50],
            average: [30, 40],
            weak: [20, 30],
            poor: 20
        },
        "Manufacturing": {
            excellent: 35,
            good: [25, 35],
            average: [15, 25],
            weak: [10, 15],
            poor: 10
        },
        "Trading/Other/Investment": {
            excellent: 30,
            good: [20, 30],
            average: [15, 20],
            weak: [10, 15],
            poor: 10
        },
        "Hotels & Tourism": {
            excellent: 40,
            good: [30, 40],
            average: [20, 30],
            weak: [15, 20],
            poor: 15
        },
    },
    //P/B Ratio vs Sector Rating Ranges
      pbRatioRanges : {
        "Commercial Banks": {
            undervalued: 1.2,
            fairValue: [1.2, 1.8],
            overvalued: [1.8, 2.5],
            highlyOvervalued: 2.5
        },
        "Development Banks": {
            undervalued: 1.0,
            fairValue: [1.0, 1.5],
            overvalued: [1.5, 2.0],
            highlyOvervalued: 2.0
        },
        "Finance": {
            undervalued: 0.8,
            fairValue: [0.8, 1.2],
            overvalued: [1.2, 1.6],
            highlyOvervalued: 1.6
        },
        "Life Insurance": {
            undervalued: 1.5,
            fairValue: [1.5, 2.5],
            overvalued: [2.5, 3.5],
            highlyOvervalued: 3.5
        },
        "Non Life Insurance": {
            undervalued: 1.2,
            fairValue: [1.2, 1.8],
            overvalued: [1.8, 2.4],
            highlyOvervalued: 2.4
        },
        "Hydro Power": {
            undervalued: 1.3,
            fairValue: [1.3, 2.0],
            overvalued: [2.0, 3.0],
            highlyOvervalued: 3.0
        },
        "Microfinance": {
            undervalued: 1.0,
            fairValue: [1.0, 1.5],
            overvalued: [1.5, 2.0],
            highlyOvervalued: 2.0
        },
        "Manufacturing And Processing": {
            undervalued: 0.9,
            fairValue: [0.9, 1.4],
            overvalued: [1.4, 2.0],
            highlyOvervalued: 2.0
        },
        "Investment": {
            undervalued: 0.7,
            fairValue: [0.7, 1.1],
            overvalued: [1.1, 1.6],
            highlyOvervalued: 1.6
        },
        "Tradings": {
            undervalued: 0.7,
            fairValue: [0.7, 1.1],
            overvalued: [1.1, 1.6],
            highlyOvervalued: 1.6
        },
        "Hotels And Tourism": {
            undervalued: 0.8,
            fairValue: [0.8, 1.3],
            overvalued: [1.3, 2.0],
            highlyOvervalued: 2.0
        }
    },

    //Stock Activity 
    // Daily Average Volume Ranges
      avgDailyVolumeRanges : {
        "Commercial Banks": {
            highlyLiquid: 50000,
            liquid: [20000, 50000],
            moderate: [5000, 20000],
            low: [1000, 5000],
            illiquid: 1000
        },
        "Development Banks": {
            highlyLiquid: 30000,
            liquid: [10000, 30000],
            moderate: [3000, 10000],
            low: [500, 3000],
            illiquid: 500
        },
        "Finance": {
            highlyLiquid: 20000,
            liquid: [5000, 20000],
            moderate: [1000, 5000],
            low: [200, 1000],
            illiquid: 200
        },
        "Life Insurance": {
            highlyLiquid: 15000,
            liquid: [5000, 15000],
            moderate: [1000, 5000],
            low: [300, 1000],
            illiquid: 300
        },
        "Non Life Insurance": {
            highlyLiquid: 10000,
            liquid: [3000, 10000],
            moderate: [500, 3000],
            low: [100, 500],
            illiquid: 100
        },
        "Hydro Power": {
            highlyLiquid: 25000,
            liquid: [10000, 25000],
            moderate: [2000, 10000],
            low: [500, 2000],
            illiquid: 500
        },
        "Microfinance": {
            highlyLiquid: 8000,
            liquid: [3000, 8000],
            moderate: [1000, 3000],
            low: [200, 1000],
            illiquid: 200
        },
        "Manufacturing And Processing": {
            highlyLiquid: 5000,
            liquid: [2000, 5000],
            moderate: [500, 2000],
            low: [100, 500],
            illiquid: 100
        },
        "Tradings": {
            highlyLiquid: 3000,
            liquid: [1000, 3000],
            moderate: [300, 1000],
            low: [50, 300],
            illiquid: 50
        },
        "Investment": {
            highlyLiquid: 3000,
            liquid: [1000, 3000],
            moderate: [300, 1000],
            low: [50, 300],
            illiquid: 50
        },
        "Hotels And Tourism": {
            highlyLiquid: 4000,
            liquid: [1500, 4000],
            moderate: [500, 1500],
            low: [100, 500],
            illiquid: 100
        }
    },
    //Short Interest Ratio Ranges --> N/A

    //Float Ranges
      floatRanges : {
        "Commercial Banks": {
            veryHigh: 40,
            high: [30, 40],
            moderate: [20, 30],
            low: [10, 20],
            veryLow: 10
        },
        "Development Banks": {
            veryHigh: 35,
            high: [25, 35],
            moderate: [15, 25],
            low: [8, 15],
            veryLow: 8
        },
        "Finance": {
            veryHigh: 30,
            high: [20, 30],
            moderate: [12, 20],
            low: [5, 12],
            veryLow: 5
        },
        "Life Insurance": {
            veryHigh: 25,
            high: [18, 25],
            moderate: [10, 18],
            low: [5, 10],
            veryLow: 5
        },
        "Non Life Insurance": {
            veryHigh: 25,
            high: [18, 25],
            moderate: [10, 18],
            low: [5, 10],
            veryLow: 5
        },
        "Hydro Power": {
            veryHigh: 20,
            high: [15, 20],
            moderate: [10, 15],
            low: [5, 10],
            veryLow: 5
        },
        "Microfinance": {
            veryHigh: 15,
            high: [10, 15],
            moderate: [7, 10],
            low: [3, 7],
            veryLow: 3
        },
        "Manufacturing And Processing": {
            veryHigh: 20,
            high: [15, 20],
            moderate: [10, 15],
            low: [5, 10],
            veryLow: 5
        },
        "Tradings": {
            veryHigh: 12,
            high: [8, 12],
            moderate: [5, 8],
            low: [2, 5],
            veryLow: 2
        },
        "Hotels And Tourism": {
            veryHigh: 15,
            high: [10, 15],
            moderate: [7, 10],
            low: [3, 7],
            veryLow: 3
        },
        "Investment": {
            veryHigh: 12,
            high: [8, 12],
            moderate: [5, 8],
            low: [2, 5],
            veryLow: 2
        },
        "Others": {
            veryHigh: 12,
            high: [8, 12],
            moderate: [5, 8],
            low: [2, 5],
            veryLow: 2
        },
    },
    //Insider Ownership Ranges
      insiderOwnershipRanges : {
        "Commercial Banks": {
            veryLow: 30,
            low: [30, 45],
            moderate: [45, 60],
            high: [60, 75],
            veryHigh: 75
        },
        "Development Banks": {
            veryLow: 40,
            low: [40, 55],
            moderate: [55, 70],
            high: [70, 85],
            veryHigh: 85
        },
        "Finance": {
            veryLow: 50,
            low: [50, 65],
            moderate: [65, 80],
            high: [80, 90],
            veryHigh: 90
        },
        "Life Insurance": {
            veryLow: 35,
            low: [35, 50],
            moderate: [50, 65],
            high: [65, 80],
            veryHigh: 80
        },
        "Non Life Insurance": {
            veryLow: 35,
            low: [35, 50],
            moderate: [50, 65],
            high: [65, 80],
            veryHigh: 80
        },
        "Hydro Power": {
            veryLow: 25,
            low: [25, 40],
            moderate: [40, 55],
            high: [55, 70],
            veryHigh: 70
        },
        "Microfinance": {
            veryLow: 60,
            low: [60, 75],
            moderate: [75, 85],
            high: [85, 95],
            veryHigh: 95
        },
        "Manufacturing And Processing": {
            veryLow: 45,
            low: [45, 60],
            moderate: [60, 75],
            high: [75, 85],
            veryHigh: 85
        },
        "Tradings": {
            veryLow: 65,
            low: [65, 80],
            moderate: [80, 90],
            high: [90, 95],
            veryHigh: 95
        },
        "Hotels And Tourism": {
            veryLow: 55,
            low: [55, 70],
            moderate: [70, 80],
            high: [80, 90],
            veryHigh: 90
        },
        "Investment": {
            veryLow: 65,
            low: [65, 80],
            moderate: [80, 90],
            high: [90, 95],
            veryHigh: 95
        },
        "Others": {
            veryLow: 65,
            low: [65, 80],
            moderate: [80, 90],
            high: [90, 95],
            veryHigh: 95
        }
    },

    //Revenue & Expense 
    //Revenue By Segment Ranges  --> N/A

    // COGS Ranges:
      cogsRanges : {
        "Commercial Banks": {
            veryHigh: 50000,
            high: [30000, 50000],
            moderate: [15000, 30000],
            low: [5000, 15000],
            veryLow: 5000
        },
        "Development Banks": {
            veryHigh: 25000,
            high: [15000, 25000],
            moderate: [8000, 15000],
            low: [2000, 8000],
            veryLow: 2000
        },
        "Finance": {
            veryHigh: 10000,
            high: [6000, 10000],
            moderate: [3000, 6000],
            low: [1000, 3000],
            veryLow: 1000
        },
        "Life Insurance": {
            veryHigh: 10000,
            high: [5000, 10000],
            moderate: [2000, 5000],
            low: [500, 2000],
            veryLow: 500
        },
        "Non Life Insurance": {
            veryHigh: 6000,
            high: [3000, 6000],
            moderate: [1500, 3000],
            low: [300, 1500],
            veryLow: 300
        },
        "Hydro Power": {
            veryHigh: 5000,
            high: [2000, 5000],
            moderate: [800, 2000],
            low: [200, 800],
            veryLow: 200
        },
        "Microfinance": {
            veryHigh: 2000,
            high: [1000, 2000],
            moderate: [400, 1000],
            low: [100, 400],
            veryLow: 100
        },
        "Manufacturing And Processing": {
            veryHigh: 8000,
            high: [3000, 8000],
            moderate: [1000, 3000],
            low: [300, 1000],
            veryLow: 300
        },
        "Tradings": {
            veryHigh: 3000,
            high: [1500, 3000],
            moderate: [600, 1500],
            low: [200, 600],
            veryLow: 200
        },
        "Hotels And Tourism": {
            veryHigh: 3000,
            high: [1200, 3000],
            moderate: [500, 1200],
            low: [150, 500],
            veryLow: 150
        }
    },
    // SG&A Ranges
      sgaRanes:{
        "Commercial Banks": {
            veryEfficient: 1500,
            efficient: [1500, 3000],
            average: [3000, 5000],
            high: [5000, 8000],
            veryHigh: 8000
        },
        "Development Banks": {
            veryEfficient: 800,
            efficient: [800, 1800],
            average: [1800, 3000],
            high: [3000, 5000],
            veryHigh: 5000
        },
        "Finance": {
            veryEfficient: 500,
            efficient: [500, 1200],
            average: [1200, 2500],
            high: [2500, 4000],
            veryHigh: 4000
        },
        "Life Insurance": {
            veryEfficient: 300,
            efficient: [300, 800],
            average: [800, 1500],
            high: [1500, 3000],
            veryHigh: 3000
        },
        "Non Life Insurance": {
            veryEfficient: 200,
            efficient: [200, 600],
            average: [600, 1200],
            high: [1200, 2500],
            veryHigh: 2500
        },
        "Hydro Power": {
            veryEfficient: 150,
            efficient: [150, 400],
            average: [400, 800],
            high: [800, 1500],
            veryHigh: 1500
        },
        "Microfinance": {
            veryEfficient: 100,
            efficient: [100, 300],
            average: [300, 600],
            high: [600, 1000],
            veryHigh: 1000
        },
        "Manufacturing And Processing": {
            veryEfficient: 200,
            efficient: [200, 500],
            average: [500, 1000],
            high: [1000, 2000],
            veryHigh: 2000
        },
        "Tradings": {
            veryEfficient: 150,
            efficient: [150, 400],
            average: [400, 800],
            high: [800, 1500],
            veryHigh: 1500
        },
        "Hotels And Tourism": {
            veryEfficient: 250,
            efficient: [250, 600],
            average: [600, 1200],
            high: [1200, 2500],
            veryHigh: 2500
        } 
      },
      // R&D Ranges --> N/A


      //Risk Metrics
      //Sharpe Ratio Ranges
      sharpeRatioRanges : {
        "Commercial Banks": {
            exceptional: 1.5,
            strong: [1.0, 1.5],
            average: [0.5, 1.0],
            weak: [0.2, 0.5],
            poor: 0.2
        },
        "Development Banks": {
            exceptional: 1.3,
            strong: [0.9, 1.3],
            average: [0.4, 0.9],
            weak: [0.1, 0.4],
            poor: 0.1
        },
        "Finance": {
            exceptional: 1.2,
            strong: [0.8, 1.2],
            average: [0.3, 0.8],
            weak: [0.0, 0.3],
            poor: 0.0
        },
        "Life Insurance": {
            exceptional: 1.6,
            strong: [1.1, 1.6],
            average: [0.6, 1.1],
            weak: [0.3, 0.6],
            poor: 0.3
        },
        "Non Life Insurance": {
            exceptional: 1.4,
            strong: [0.9, 1.4],
            average: [0.4, 0.9],
            weak: [0.1, 0.4],
            poor: 0.1
        },
        "Hydro Power": {
            exceptional: 1.8,
            strong: [1.3, 1.8],
            average: [0.8, 1.3],
            weak: [0.4, 0.8],
            poor: 0.4
        },
        "Microfinance": {
            exceptional: 1.0,
            strong: [0.6, 1.0],
            average: [0.2, 0.6],
            weak: [0.0, 0.2],
            poor: 0.0
        },
        "Manufacturing And Processing": {
            exceptional: 1.1,
            strong: [0.7, 1.1],
            average: [0.3, 0.7],
            weak: [0.0, 0.3],
            poor: 0.0
        },
        "Tradings": {
            exceptional: 0.9,
            strong: [0.5, 0.9],
            average: [0.1, 0.5],
            weak: [-0.1, 0.1],
            poor: -0.1
        },
        "Hotels And Tourism": {
            exceptional: 1.0,
            strong: [0.6, 1.0],
            average: [0.2, 0.6],
            weak: [-0.1, 0.2],
            poor: -0.1
        }
    },
    // Sortino Ratio Ranges
      sortinoRatioRanges : {
        "Commercial Banks": {
            exceptional: 2.5,
            strong: [1.8, 2.5],
            average: [1.2, 1.8],
            weak: [0.6, 1.2],
            poor: 0.6
        },
        "Development Banks": {
            exceptional: 2.2,
            strong: [1.6, 2.2],
            average: [1.0, 1.6],
            weak: [0.4, 1.0],
            poor: 0.4
        },
        "Finance": {
            exceptional: 2.0,
            strong: [1.4, 2.0],
            average: [0.8, 1.4],
            weak: [0.2, 0.8],
            poor: 0.2
        },
        "Life Insurance": {
            exceptional: 2.8,
            strong: [2.0, 2.8],
            average: [1.4, 2.0],
            weak: [0.8, 1.4],
            poor: 0.8
        },
        "Non Life Insurance": {
            exceptional: 2.4,
            strong: [1.8, 2.4],
            average: [1.2, 1.8],
            weak: [0.6, 1.2],
            poor: 0.6
        },
        "Hydro Power": {
            exceptional: 3.0,
            strong: [2.2, 3.0],
            average: [1.6, 2.2],
            weak: [1.0, 1.6],
            poor: 1.0
        },
        "Microfinance": {
            exceptional: 1.8,
            strong: [1.2, 1.8],
            average: [0.6, 1.2],
            weak: [0.2, 0.6],
            poor: 0.2
        },
        "Manufacturing And Processing": {
            exceptional: 2.0,
            strong: [1.4, 2.0],
            average: [0.8, 1.4],
            weak: [0.2, 0.8],
            poor: 0.2
        },
        "Tradings": {
            exceptional: 1.5,
            strong: [1.0, 1.5],
            average: [0.4, 1.0],
            weak: [0.0, 0.4],
            poor: 0.0
        },
        "Hotels And Tourism": {
            exceptional: 1.8,
            strong: [1.2, 1.8],
            average: [0.6, 1.2],
            weak: [0.0, 0.6],
            poor: 0.0
        }
    },
      varRanges : {
        "Commercial Banks": {
            veryLowRisk: 2.0,
            lowRisk: [2.0, 3.0],
            moderateRisk: [3.0, 4.0],
            highRisk: [4.0, 5.0],
            veryHighRisk: 5.0
        },
        "Development Banks": {
            veryLowRisk: 2.5,
            lowRisk: [2.5, 3.5],
            moderateRisk: [3.5, 4.5],
            highRisk: [4.5, 6.0],
            veryHighRisk: 6.0
        },
        "Finance": {
            veryLowRisk: 3.0,
            lowRisk: [3.0, 4.0],
            moderateRisk: [4.0, 5.0],
            highRisk: [5.0, 7.0],
            veryHighRisk: 7.0
        },
        "Life Insurance": {
            veryLowRisk: 2.2,
            lowRisk: [2.2, 3.2],
            moderateRisk: [3.2, 4.2],
            highRisk: [4.2, 5.5],
            veryHighRisk: 5.5
        },
        "Non Life Insurance": {
            veryLowRisk: 2.8,
            lowRisk: [2.8, 3.8],
            moderateRisk: [3.8, 5.0],
            highRisk: [5.0, 6.5],
            veryHighRisk: 6.5
        },
        "Hydro Power": {
            veryLowRisk: 1.8,
            lowRisk: [1.8, 2.8],
            moderateRisk: [2.8, 3.8],
            highRisk: [3.8, 5.0],
            veryHighRisk: 5.0
        },
        "Microfinance": {
            veryLowRisk: 3.5,
            lowRisk: [3.5, 5.0],
            moderateRisk: [5.0, 6.5],
            highRisk: [6.5, 8.0],
            veryHighRisk: 8.0
        },
        "Manufacturing And Processing": {
            veryLowRisk: 3.2,
            lowRisk: [3.2, 4.5],
            moderateRisk: [4.5, 6.0],
            highRisk: [6.0, 8.0],
            veryHighRisk: 8.0
        },
        "Tradings": {
            veryLowRisk: 4.0,
            lowRisk: [4.0, 6.0],
            moderateRisk: [6.0, 8.0],
            highRisk: [8.0, 10.0],
            veryHighRisk: 10.0
        },
        "Hotels And Tourism": {
            veryLowRisk: 3.8,
            lowRisk: [3.8, 5.5],
            moderateRisk: [5.5, 7.0],
            highRisk: [7.0, 9.0],
            veryHighRisk: 9.0
        }
    },
    //Maximum Drawdown Ranges
      maxDrawdownRanges : {
        "Commercial Banks": {
            veryResilient: 15,
            resilient: [15, 25],
            moderate: [25, 35],
            fragile: [35, 50],
            veryFragile: 50
        },
        "Development Banks": {
            veryResilient: 20,
            resilient: [20, 30],
            moderate: [30, 40],
            fragile: [40, 55],
            veryFragile: 55
        },
        "Finance": {
            veryResilient: 25,
            resilient: [25, 35],
            moderate: [35, 45],
            fragile: [45, 60],
            veryFragile: 60
        },
        "Life Insurance": {
            veryResilient: 18,
            resilient: [18, 28],
            moderate: [28, 38],
            fragile: [38, 50],
            veryFragile: 50
        },
        "Non Life Insurance": {
            veryResilient: 22,
            resilient: [22, 32],
            moderate: [32, 42],
            fragile: [42, 55],
            veryFragile: 55
        },
        "Hydro Power": {
            veryResilient: 12,
            resilient: [12, 20],
            moderate: [20, 30],
            fragile: [30, 40],
            veryFragile: 40
        },
        "Microfinance": {
            veryResilient: 30,
            resilient: [30, 40],
            moderate: [40, 50],
            fragile: [50, 65],
            veryFragile: 65
        },
        "Manufacturing And Processing": {
            veryResilient: 25,
            resilient: [25, 35],
            moderate: [35, 45],
            fragile: [45, 60],
            veryFragile: 60
        },
        "Trading": {
            veryResilient: 35,
            resilient: [35, 45],
            moderate: [45, 55],
            fragile: [55, 70],
            veryFragile: 70
        },
        "Hotels And Tourism": {
            veryResilient: 28,
            resilient: [28, 38],
            moderate: [38, 48],
            fragile: [48, 65],
            veryFragile: 65
        }
    },
  }
}
   },
  async created() {
    await this.fetchMetrics();
  },
  methods: {
    async fetchMetrics() {
      this.loading = true;
      try {

        const summaryRes = await axios.get(`https://laganisutra.com/api/fundamentals/company-summary/${this.companyId}`);
        const companyData = Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data;

        const sectorRes = await axios.get(`https://laganisutra.com/api/symbol-id-sector?script_id=${this.companyId}`);
        const companySectorData = sectorRes.data.find(item => item.script_id == this.companyId);
        
        if (!companySectorData) {
          throw new Error(`No sector data found for company ID ${this.companyId}`);
        }
        
        this.sector = sectorRes.data.sector_description;

        this.mapMetricsToUI(companyData, companySectorData);

        
      } catch (error) {
        console.error("Error loading data:", error);
        this.error = "Failed to load company data";
      } finally {
        this.loading = false;
      }
    },
    mapMetricsToUI(apiData, sectorInfo) {
      if (!apiData) {
        console.error("No API data received");
        return;
      }
        if (!sectorInfo) {
            console.error("No sector information received");
            return;
        }
      this.profitabilityIndicators = [
        { 
          name: "EPS", 
          value: apiData.valuation_metrics?.current_eps || "N/A", 
          sector: sectorInfo.sector_description
        },
        { 
          name: "Net Profit Margin", 
          value: apiData.profitability_metrics?.net_profit_margin ? 
                `${apiData.profitability_metrics.net_profit_margin}%` : "N/A", 
          sector: sectorInfo.sector_description
        },
        { 
          name: "Gross Profit Margin", 
          value: apiData.profitability_metrics?.gross_profit_margin ? 
                `${apiData.profitability_metrics.gross_profit_margin}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Operating Margin", 
          value: apiData.profitability_metrics?.operating_margin ? 
                `${apiData.profitability_metrics.operating_margin}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "ROA", 
          value: apiData.leverage_metrics?.roa ? 
                `${apiData.leverage_metrics.roa}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "ROE", 
          value: apiData.growth_metrics?.roe ? 
                `${apiData.growth_metrics.roe}%` : "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.valuationRatios = [
        { 
          name: "P/E", 
          value: apiData.valuation_metrics?.pe_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "P/B", 
          value: apiData.valuation_metrics?.price_to_graham || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "P/S", 
          value: apiData.growth_metrics?.ps_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "EV/EBITDA", 
          value: apiData.valuation_metrics?.ev_ebitda || "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.growthIndicators = [
        { 
          name: "Revenue Growth", 
          value: apiData.growth_metrics?.revenue_growth ? 
                `${apiData.growth_metrics.revenue_growth}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "EPS Growth", 
          value: apiData.growth_metrics?.earnings_growth_rate ? 
                `${apiData.growth_metrics.earnings_growth_rate}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Dividend Growth Rate", 
          value: apiData.dividend_metrics?.dividend_growth_rate ? 
                `${apiData.dividend_metrics.dividend_growth_rate}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Operating Income Growth", 
          value: apiData.profitability_metrics?.operating_income_growth ? 
                `${apiData.profitability_metrics.operating_income_growth}%` : "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.liquidityRatios = [
        { 
          name: "Current Ratio", 
          value: apiData.liquidity_metrics?.current_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Quick Ratio", 
          value: apiData.liquidity_metrics?.quick_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Cash Ratio", 
          value: apiData.liquidity_metrics?.cash_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Operating Cash Flow Ratio", 
          value: apiData.liquidity_metrics?.cash_flow_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.leverageRatios = [
        { 
          name: "Debt-to-Equity", 
          value: apiData.leverage_metrics?.debt_to_equity || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Debt-to-Assets", 
          value: apiData.leverage_metrics?.debt_to_assets || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Interest Coverage", 
          value: apiData.leverage_metrics?.interest_coverage_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Financial Leverage", 
          value: apiData.leverage_metrics?.financial_leverage_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.dividendIndicators = [
        { 
          name: "Dividend Yield", 
          value: apiData.dividend_metrics?.dividend_yield ? 
                `${apiData.dividend_metrics.dividend_yield}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Dividend Payout", 
          value: apiData.dividend_metrics?.dividend_payout_ratio ? 
                `${apiData.dividend_metrics.dividend_payout_ratio}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Retention Ratio", 
          value: apiData.dividend_metrics?.retention_ratio ? 
          `${apiData.dividend_metrics.retention_ratio}%` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
            name: "Dividend Coverage", 
            value: apiData.dividend_metrics?.dividend_coverage_ratio || "N/A", 
            sector: sectorInfo.sector_description 
        }
    ];
    
    this.efficiencyRatios = [
      { 
      name: "Asset Turnover", 
      value: apiData.profitability_metrics?.asset_turnover_ratio, 
      sector: sectorInfo.sector_description 
      },
      { 
        name: "Inventory Turnover", 
        value: apiData.profitability_metrics?.inventory_turnover_ratio, 
        sector: sectorInfo.sector_description 
      },
      { 
        name: "Receivables Turnover", 
        value: apiData.profitability_metrics?.receivables_turnover_ratio, 
        sector: sectorInfo.sector_description 
      },
      { 
        name: "Payables Turnover", 
        value: apiData.profitability_metrics?.payables_turnover_ratio, 
        sector: sectorInfo.sector_description 
      }
    ];

    this.cashFlowIndicators = [
        { 
            name: "Operating Cash Flow", 
          value: apiData.profitability_metrics?.operating_cash_flow ? 
                `Rs. ${apiData.profitability_metrics.operating_cash_flow}` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Free Cash Flow", 
          value: apiData.profitability_metrics?.free_cash_flow ? 
                `Rs. ${apiData.profitability_metrics.free_cash_flow}` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Cash Flow to Debt", 
          value: apiData.liquidity_metrics?.cash_flow_to_debt_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Cash Flow per Share", 
          value: apiData.profitability_metrics?.cash_flow_per_share ? 
                `Rs. ${apiData.profitability_metrics.cash_flow_per_share}` : "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];

      this.marketPerformanceMetrics = [
        { 
          name: "Market Cap", 
          value: apiData.other_metrics?.market_cap ? 
                `Rs. ${apiData.other_metrics.market_cap}` : "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "Beta", 
          value: apiData.market_metrics?.beta || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "PEG Ratio", 
          value: apiData.valuation_metrics?.peg_ratio || "N/A", 
          sector: sectorInfo.sector_description 
        },
        { 
          name: "52-Week Range", 
          value: apiData.market_metrics?.fifty_two_week_range || "N/A", 
          sector: sectorInfo.sector_description 
        }
      ];
      this.assetUtilizationRatios= [
        { 
        name: "Fixed Asset Turnover", 
        value: apiData.efficiency_metrics?.fixed_asset_turnover || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Working Capital Turnover", 
        value: apiData.liquidity_metrics?.working_capital_turnover || "N/A", 
        sector: sectorInfo.sector_description 
        },
        { 
        name: "Total Asset Turnover", 
        value: apiData.efficiency_metrics?.total_asset_turnover || "N/A",
        sector: sectorInfo.sector_description
        },
        { 
        name: "Capital Intensity", 
        value: apiData.profitability_metrics?.capital_intense_ratio || "N/A", 
        sector: sectorInfo.sector_description
        }
      ];
      this.riskMetrics= [
        { 
        name: "Sharpe Ratio", 
        value: apiData.other_metrics?.sharp_ratio || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Sortino Ratio", 
        value: apiData.other_metrics?.sortino_ratio || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Value at Risk (95%)", 
        value: apiData.other_metrics?.var ?
            `${apiData.other_metrics.var}%` : "N/A",
        sector: sectorInfo.sector_description
        },
        { 
        name: "Maximum Drawdown", 
        value: apiData.other_metrics?.drawdown ?
            `${apiData.other_metrics.drawdown}%` : "N/A",
        sector: sectorInfo.sector_description
        }
      ];
      this.revenueExpenseIndicators= [
        { 
        name: "Revenue by Segment", 
        value: apiData.other_metrics?.segment || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "COGS",
        value: apiData.other_metrics?.cogs || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "SG&A", 
        value: apiData.other_metrics?.sga || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "R&D", 
        value: apiData.other_metrics?.rd || "N/A", 
        sector: sectorInfo.sector_description
        }
      ];

      this.industrySpecificMetrics= [
        { 
        name: "Same-Store Sales", 
        value: apiData.other_metrics?.same_store || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "ARPU", 
        value: apiData.other_metrics?.arpu || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Occupancy Rate", 
        value: apiData.other_metrics?.occupancy_rate || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Load Factor", 
        value: apiData.other_metrics?.load_factor || "N/A", 
        sector: sectorInfo.sector_description
        }
      ];

      this.stockActivityIndicators= [
        { 
        name: "Avg Daily Volume", 
        value: apiData.other_metrics?.daily_volume || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Short Interest Ratio", 
        value: apiData.other_metrics?.interest_ratio || "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Float", 
        value: apiData.valuation_metrics?.float ?
            `${apiData.valuation_metrics.float}%` : "N/A", 
        sector: sectorInfo.sector_description
        },
        { 
        name: "Insider Ownership",
        value: apiData.other_metrics?.insider_ownership ?
            `${apiData.other_metrics.insider_ownership}%` : "N/A", 
        sector: sectorInfo.sector_description
        }
      ];

      this.esgMetrics = [
        { 
            name: "Carbon Footprint", 
            value: apiData.esg_metrics?.carbon_footprint || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Diversity Ratio", 
            value: apiData.esg_metrics?.diversity_ratio || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Board Independence", 
            value: apiData.esg_metrics?.board_independence || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Sustainability", 
            value: apiData.esg_metrics?.sustainability || "N/A", 
            sector: sectorInfo.sector_description 
        }
      ];

      this.peerComparisonMetrics = [
        { 
            name: "P/E vs Sector", 
            value: apiData.valuation_metrics?.pe_vs_sector || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Market Share", 
            value: apiData.valuation_metrics?.total_shares ?
            `${apiData.valuation_metrics.total_shares}%` : "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "EBITDA Margin", 
            value: apiData.other_metrics?.ebitda_margin ?
            `${apiData.other_metrics.ebitda_margin}%` : "N/A",
            sector: sectorInfo.sector_description 
        },
        { 
            name: "P/B vs Sector", 
            value: apiData.peer_comparison?.pb_vs_sector || "N/A", 
            sector: sectorInfo.sector_description 
        }
      ];
      this.shareholderValueMetrics = [
        { 
            name: "EVA", 
            value: apiData.other_metrics?.eva 
            ? ((apiData.other_metrics.eva) / 1_000_000).toFixed(2) + "M NPR"
            : "N/A",             
            sector: sectorInfo.sector_description 
        },
        { 
            name: "MVA", 
            value: apiData.other_metrics?.MVA 
            ? ((apiData.other_metrics.MVA) / 1_000_000_000).toFixed(2) + "B NPR"
            : "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "TSR (1 Year)", 
            value: apiData.other_metrics?.tsr_1y ? 
            `${apiData.other_metrics.tsr_1y}%` : "N/A",
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Buyback Yield", 
            value: apiData.shareholder_value?.buyback_yield ?
            `${apiData.shareholder_value.buyback_yield}%` : "N/A", 
            sector: sectorInfo.sector_description 
        }
      ];
      this.earningsQualityIndicators = [
        { 
            name: "Accrual Ratio", 
            value: apiData.cashflow_metrics?.accrual_ratio || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Earnings Stability", 
            value: apiData.earnings_quality?.earnings_stability ? 
            `${apiData.earnings_quality.earnings_stability}%` : "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Revenue Recognition", 
            value: apiData.earnings_quality?.revenue_recognition ?
            `${apiData.earnings_quality.revenue_recognition}%` : "N/A",
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Deferred Revenue", 
            value: apiData.earnings_quality?.deferred_revenue ?
            `${apiData.earnings_quality.deferred_revenue}%` : "N/A",
            sector: sectorInfo.sector_description 
        }
      ];
      this.balanceSheetHealthIndicators = [
        { 
            name: "Equity Ratio", 
            value: apiData.leverage_metrics?.equity_ratio ?
                `${apiData.leverage_metrics.equity_ratio}%` : "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Tangible Asset Ratio", 
            value: apiData.balance_sheet_health?.tangible_asset_ratio || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Working Capital", 
            value: apiData.liquidity_metrics?.working_capital 
        ? ((apiData.liquidity_metrics.working_capital) / 1_000_000).toFixed(2) + "M NPR"
            : "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "Retained Earnings", 
            value: apiData.balance_sheet_health?.retained_earnings
        ? ((apiData.balance_sheet_health.retained_earnings) / 1_000_000).toFixed(2) + "M NPR"
        : "N/A",
            sector: sectorInfo.sector_description 
        }
      ];
      this.trendAnalysisMetrics = [
        { 
            name: "50-Day MA", 
            value: apiData.trend_analysis?.ma_50_day || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "200-Day MA", 
            value: apiData.trend_analysis?.ma_200_day || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "MACD", 
            value: apiData.trend_analysis?.macd || "N/A", 
            sector: sectorInfo.sector_description 
        },
        { 
            name: "RSI", 
            value: apiData.trend_analysis?.rsi || "N/A", 
            sector: sectorInfo.sector_description 
        }
      ];
      this.rating = this.getRating(apiData.rating);

    },

        getRatingPillClass(rating) {
            if (!rating) return 'pill n-a';
            rating = rating.toLowerCase();
            
            switch (rating) {
                case 'best':
                case 'excellent':
                case 'outstanding':
                case 'exceptional':
                case 'over valued':
                case 'high growth':
                case 'very high':
                case 'very expensive':
                case 'very efficient':
                case 'Strong growth':
                case 'very strong':
                case 'highly liquid':
                    return 'pill excellent';

                case 'better':
                case 'good':
                case 'strong':
                case 'liquid':
                case 'high':
                case 'efficient':
                case 'moderate growth':
                case 'stable growth':
                case 'Healthy growth':
                case 'Highly Over valued':
                case 'steady growth':
                    return 'pill good';

                case 'neutral':
                case 'fairly valued':
                case 'fair':
                case 'average':
                case 'low stable growth':
                case 'stable':
                case 'moderate to weak':
                case 'moderate':
                case 'Moderate growth':
                case 'Moderately liquid':
                case 'slow growth':
                    return 'pill fair';

                case 'weak':
                case 'under valued':
                case 'poor':
                case 'low':
                case 'Small':
                case 'Very cheap':
                case 'weak to moderate':
                case 'below average':
                case 'low liquid':
                    return 'pill poor';

                case 'worst':
                case 'declining revenue':
                case 'loss making':
                case 'critical':
                case 'very weak':
                case 'declining':
                case 'stagnant':
                case 'under performing':
                case 'destroying value':
                case 'value erosion':
                case 'very low':
                case 'negligible':
                case 'Marginal':
                case 'Illiquid':
                    return 'pill worst';

                case 'n/a':
                default:
                    return 'pill n-a';
            }
        },
   
        getRating(item) {
        if (!item || item.value === "N/A" || item.value === undefined) return "N/A";
        const value = typeof item.value === 'string' ? 
                   parseFloat(item.value.replace("%", "")) : 
                   parseFloat(item.value);
        const sector = (item.sector || '').trim();
        if (isNaN(value)) return "N/A";
        
        // Profitability Indicators
        if (item.name === "EPS") {

            const ranges = this.RatingRanges.epsRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.best) return "Best";
            else if (value >= ranges.better[0]) return "Better";
            else if (value >= ranges.good[0]) return "Good";
            else if (value >= ranges.neutral[0]) return "Neutral";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Worst";
        }
        if(item.name === "Net Profit Margin") {
            const ranges = this.RatingRanges.npmRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.best) return "Best";
            else if (value >= ranges.better[0]) return "Better";
            else if (value >= ranges.good[0]) return "Good";
            else if (value >= ranges.neutral[0]) return "Neutral";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Worst";
        }
        if(item.name === "Gross Profit Margin") {
            const ranges = this.RatingRanges.gpmRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.excellent) return "Excellent";
            else if (value >= ranges.good[0]) return "Good";
            else if (value >= ranges.average[0]) return "Average";
            else if (value >= ranges.below_average[0]) return "Below Average";
            else if (value >= ranges.poor[0]) return "Poor";
            else return "Critical";
        }
        //Valuation Ratios 
        if(item.name === "P/E") {
            const ranges = this.RatingRanges.peRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.overvalued) return "Over Valued";
            else if (value >= ranges.fairlyvalued[0]) return "Fairly Valued";
            else return "Under Valued";
        }
        if(item.name === "P/B") {
            const ranges = this.RatingRanges.pbRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.overvalued) return "Over Valued";
            else if (value >= ranges.fairlyvalued[0]) return "Fairly Valued";
            else return "Under Valued";
        }
        if(item.name === "P/S") {
            const ranges = this.RatingRanges.psRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.overvalued) return "Overvalued";
            else if (value >= ranges.fairlyvalued[0]) return "Fairly Valued";
            else return "Under Valued";
        }
        if(item.name === "EV/EBITDA") {
            const ranges = this.RatingRanges.ebitdaRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.overvalued) return "Over Valued";
            else if (value >= ranges.fairlyvalued[0]) return "Fairly Valued";
            else return "Under Valued";
        }

        //Growth Indicators
        if(item.name === "Revenue Growth") {
            const ranges = this.RatingRanges.revenueGrowthRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.high_growth) return "High Growth";
            else if (value >= ranges.moderate_growth[0]) return "Moderate Growth";
            else if (value >= ranges.low_stable_growth[0]) return "Low Stable Growth";
            else return "Declining Revenue";
        }
        if(item.name === "EPS Growth") {
            const ranges = this.RatingRanges.epsGrowthRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.high_growth) return "High Growth";
            else if (value >= ranges.steady_growth[0]) return "Steady Growth";
            else if (value >= ranges.stable[0]) return "Stable";
            else if (value >= ranges.declining[0]) return "Declining";
            else return "Loss Making";
        }
        if(item.name === "Dividend Growth Rate") {
            const ranges = this.RatingRanges.epsGrowthRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.high_growth) return "High Growth";
            else if (value >= ranges.steady_growth[0]) return "Stable Growth";
            else if (value >= ranges.stable[0]) return "Slow Growth";
            else return "Stagnant";
        }
        if(item.name === "Operating Income Growth") {
            const oigValue = parseFloat(item.value.toString().replace("%", ""));
            const sector = (item.sector || '').trim();
            const ranges = this.RatingRanges.operatingIncomeGrowthRatingRanges[sector];
            
            if (!ranges || isNaN(oigValue)) return "N/A";
            
            if (oigValue >= ranges.strong_growth) return "Strong Growth";
            else if (oigValue >= ranges.healthy_growth[0]) return "Healthy Growth";
            else if (oigValue >= ranges.moderate_growth[0]) return "Moderate Growth";
            else if (oigValue >= ranges.stagnant[0]) return "Stagnant";
            else return "Declining";
        }
        if(item.name==="Current Ratio"){
            const ranges = this.RatingRanges.currentRatioRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.high_growth) return "High Growth";
            else if (value >= ranges.steady_growth[0]) return "Stable Growth";
            else if (value >= ranges.stable[0]) return "Slow Growth";
            else if (value >= ranges.declining[0]) return "Declining";
            else return "Loss Making";
        }

        // Balance Sheet Health Indicators
        if(item.name === "Equity Ratio") {
            const ranges = this.RatingRanges.equityRatioRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.very_strong) return "Very Strong";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Very Weak";
        }
        if(item.name === "Tangible Asset Ratio") {
            const ranges = this.RatingRanges.tangibleAssetRatioRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.very_strong) return "Very Strong";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Very Weak";
        }
        if (item.name === "Working Capital") {
            const wcValue = parseFloat(item.value.toString().replace("M NPR", "").trim());
            const sectorRangeData = this.RatingRanges.workingCapitalRatingRanges[sector];

            if (!sectorRangeData || isNaN(wcValue)) return "N/A";

            const [min, max] = sectorRangeData.range;

            if (wcValue >= min && wcValue <= max) {
                return sectorRangeData.position;
            } else if (wcValue > max) {
                return `${sectorRangeData.position}`;
            } else {
                return `${sectorRangeData.position}`;
            }
        }
        if(item.name === "Retained Earnings") {
            const reValue = parseFloat(item.value.toString().replace("M NPR", ""));
            const ranges = this.RatingRanges.retainedEarningsRatingRanges[sector];
            
            if (!ranges || isNaN(reValue)) return "N/A";
            
            if (reValue >= ranges.very_strong) return "Very Strong";
            else if (reValue >= ranges.strong[0]) return "Strong";
            else if (reValue >= ranges.moderate[0]) return "Moderate";
            else if (reValue >= ranges.weak[0]) return "Weak";
            else return "Very Weak";
        }

        //Earnings Quality Indicators
        if(item.name === "Accrual Ratio") {
            const ranges = this.RatingRanges.accrualRatioRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.very_strong) return "Very Strong";
            else if (value <= ranges.strong[0]) return "Strong";
            else if (value <= ranges.moderate[0]) return "Moderate";
            else if (value <= ranges.weak[0]) return "Weak";
            else return "Very Weak";
        }
        if(item.name === "Earnings Stability") {
            const ranges = this.RatingRanges.earningsStabilityRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.excellent) return "Excellent";
            else if (value <= ranges.good[0]) return "Good";
            else if (value <= ranges.moderate[0]) return "Moderate";
            else if (value <= ranges.volatile[0]) return "Volatile";
            else return "Highly Unstable";
        }
        if(item.name === "Revenue Recognition") {
            const ranges = this.RatingRanges.revenueRecognitionRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.very_strong) return "Very Strong";
            else if (value <= ranges.strong[0]) return "Strong";
            else if (value <= ranges.moderate[0]) return "Moderate";
            else if (value <= ranges.weak[0]) return "Weak";
            else return "Very Weak";
        }
        if(item.name === "Deferred Revenue") {
            const ranges = this.RatingRanges.deferredRevenueRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.very_healthy) return "Very Healthy";
            else if (value <= ranges.healthy[0]) return "Healthy";
            else if (value <= ranges.moderate[0]) return "Moderate";
            else if (value <= ranges.concerning[0]) return "Concerning";
            else return "High Risk";
        }

        //Shareholder Value Indicators
        if(item.name === "EVA") {
            const ranges = this.RatingRanges.evaRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.outstanding) return "Outstaning";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Destroying Value";
        }
        if(item.name === "MVA") {
            const ranges = this.RatingRanges.mvaRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.exceptional) return "Exceptional";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Value Erosion";
        }
        if(item.name === "TSR (1 Year)") {
            const ranges = this.RatingRanges.tsrRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.outstanding) return "Outstanding";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Underperforming";
        }
        if(item.name === "Buyback Yield") {
            const ranges = this.RatingRanges.buybackYieldRatingRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.exceptional) return "Exceptional";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Negligible";
        }

        //Peer Comparison Metrics
        if(item.name === "P/E vs Sector") {
            const ranges = this.RatingRanges.peRatioRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.very_expensive) return "Very Expensive";
            else if (value >= ranges.overvalued[0]) return "Over Valued";
            else if (value >= ranges.fair_value[0]) return "Fairly Valued";
            else if (value >= ranges.undervalued[0]) return "Under Valued";
            else return "Very Cheap";
        }
        if(item.name === "Market Share") {
            const ranges = this.RatingRanges.marketShareRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.dominant) return "Dominant";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.small[0]) return "Small";
            else return "Marginal";
        }
        if(item.name === "EBITDA Margin") {
            const ranges = this.RatingRanges.ebitdaMarginRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.excellent) return "Excellent";
            else if (value >= ranges.good[0]) return "Good";
            else if (value >= ranges.average[0]) return "Average";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Poor";
        }
        if(item.name === "P/B vs Sector") {
            const ranges = this.RatingRanges.pbRatioRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.highlyOvervalued) return "Highly Over Valued";
            else if (value >= ranges.overvalued[0]) return "Over Valued";
            else if (value >= ranges.fairlyvalued[0]) return "Fairly Valued";
            else return "Under Valued";
        }

        //Stock Activity Indicators
        if(item.name === "Avg Daily Volume") {
            const ranges = this.RatingRanges.avgDailyVolumeRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.highlyLiquid) return "Highly Liquid";
            else if (value >= ranges.liquid[0]) return "Very Liquid";
            else if (value >= ranges.moderately[0]) return "Moderately Liquid";
            else if (value >= ranges.low[0]) return "Low Liquid";
            else return "Illiquid";
        }
        if(item.name === "Short Interest Ratio") {
            const ranges = this.RatingRanges.shortInterestRatioRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }
        if(item.name === "Float") {
            const ranges = this.RatingRanges.floatRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }
        if(item.name === "Insider Ownership") {
            const ranges = this.RatingRanges.insiderOwnershipRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }

        //Revenue Expense Indicators
        if(item.name === "Revenue by Segment") {
            const ranges = this.RatingRanges.revenueBySegmentRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }
        if(item.name === "COGS") {
            const ranges = this.RatingRanges.cogsRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }
        if(item.name === "SG&A") {
            const ranges = this.RatingRanges.sgaRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.veryEfficient) return "Very Efficient";
            else if (value <= ranges.efficient[0]) return "Efficient";
            else if (value <= ranges.average[0]) return "Average";
            else if (value <= ranges.high[0]) return "High";
            else return "Very High";
        }
        if(item.name === "R&D") {
            const ranges = this.RatingRanges.rdRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.veryHigh) return "Very High";
            else if (value >= ranges.high[0]) return "High";
            else if (value >= ranges.moderate[0]) return "Moderate";
            else if (value >= ranges.low[0]) return "Low";
            else return "Very Low";
        }

        //Risk Metrics
        if(item.name === "Sharpe Ratio") {
            const ranges = this.RatingRanges.sharpeRatioRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.exceptional) return "Exceptional";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.average[0]) return "Average";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Poor";
        }
        if(item.name === "Sortino Ratio") {
            const ranges = this.RatingRanges.sortinoRatioRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value >= ranges.exceptional) return "Exceptional";
            else if (value >= ranges.strong[0]) return "Strong";
            else if (value >= ranges.average[0]) return "Average";
            else if (value >= ranges.weak[0]) return "Weak";
            else return "Poor";
        }
        if(item.name=== "Value at Risk (VaR)") {
            const ranges = this.RatingRanges.varRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.veryLowRisk) return "Very Low Lisk";
            else if (value <= ranges.lowRisk[0]) return "Low Risk";
            else if (value <= ranges.moderateRisk[0]) return "Moderate Risk";
            else if (value <= ranges.highRisk[0]) return "High Risk";
            else return "Very High Risk";
        }
        if(item.name==="Maximum Drawdown") {
            const ranges = this.RatingRanges.maxDrawdownRanges[sector];
            
            if (!ranges || isNaN(value)) return "N/A";
            
            if (value <= ranges.veryResilient) return "Very Resilient";
            else if (value <= ranges.resilient[0]) return "Resilient";
            else if (value <= ranges.moderate[0]) return "Moderate";
            else if (value <= ranges.fragile[0]) return "fragile";
            else return "Very Fragile";
        }
        return item.rating || "N/A";
    },
  },
}
</script>

<style scoped>
/* Base styles */
.fundamental-report {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  color: #333;
  line-height: 1.5;
  max-width: 1440px;
  margin: 0 auto;
}

/* Container Card */
.container-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  width: 100%;
  margin-bottom: 24px;
}

/* Dashboard Cards */
.dashboard-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 400px;
  flex: 1 1 calc(33.333% - 16px);
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

/* Info Icon */
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
}

/* Tooltips */
.info-icon[data-tooltip] {
  position: relative;
}

.info-icon[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 10;
  width: max-content;
  max-width: 250px;
}

.info-icon:hover[data-tooltip]::before {
  opacity: 1;
  visibility: visible;
}

/* Card Content */
.card-content {
  padding: 0;
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

tr:last-child td {
  border-bottom: none;
}

td.text-right {
  text-align: right;
}

.w-full {
  width: 100%;
}

/* Rating Pills */
span.pill {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

span.excellent {
  background-color: #10b981;
  color: white;
}

span.good {
  background-color: #60a5fa;
  color: white;
}

span.fair{
  background-color: #f59e0b;
  color: white;
}

span.poor {
  background-color: #ef4444;
  color: white;
}
span.worst {
  background-color: #ef4444;
  color: white;
}

span.n-a {
  background-color: #9ca3af;
  color: white;
}

/* Layout utilities */
.d-flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-4 {
  gap: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

/* Overall Summary Section */
.overall-summary-container {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: #2d3748;
}

.summary-content {
  margin-bottom: 20px;
  line-height: 1.6;
}

.summary-rating-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-chart {
  display: flex;
  height: 16px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.chart-segment {
  height: 100%;
  display: flex;
}

.segment {
  height: 100%;
  transition: width 0.3s ease;
  position: relative;
}

.segment:hover {
  opacity: 0.9;
}

.segment.excellent {
  background-color: #10b981;
}

.segment.good {
  background-color: #60a5fa;
}

.segment.fair {
  background-color: #f59e0b;
}

.segment.poor {
  background-color: #ef4444;
}

.segment.n-a {
  background-color: #9ca3af;
}

.segment[data-tooltip] {
  position: relative;
}

.segment[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 10;
}

.segment:hover[data-tooltip]::after {
  opacity: 1;
  visibility: visible;
}

.rating-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.excellent {
  background-color: #10b981;
}

.legend-color.good {
  background-color: #60a5fa;
}

.legend-color.fair {
  background-color: #f59e0b;
}

.legend-color.poor {
  background-color: #ef4444;
}

.legend-color.n-a {
  background-color: #9ca3af;
}

/* AI Summary Section */
.ai-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.ai-summary h4 {
  font-size: 16px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 8px;
  color: #2d3748;
}

.ai-summary p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: #4a5568;
}

/* Media Queries */
@media (max-width: 1200px) {
  .dashboard-card {
    flex: 1 1 calc(50% - 16px);
  }
}

@media (max-width: 768px) {
  .dashboard-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .rating-legend {
    flex-direction: column;
    gap: 8px;
  }

  .info-icon[data-tooltip]::before {
    max-width: 200px;
    white-space: normal;
  }
}
</style>