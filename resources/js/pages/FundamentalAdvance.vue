<template>
    <div class="card market-stats mt-3">
        <div class="card-body p-0">
            <!-- Main Category Tabs -->
            <div class="main-tab-section">
                <div class="d-flex align-items-center gap-1 mb-1">
                    <h3 class="mb-0">Market Analysis</h3>
                    <div class="info-icon"></div>
                </div>

                <div class="main-tab-container">
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
                                    {{ getCategoryTooltip(category.name) }}
                                </p>
                            </template>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <!-- Sub-tabs for metrics within each category -->
            <div class="tab-content pt-1">
                <div class="tab-pane fade active show">
                    <div class="sub-tab-section mb-1">
                        <div class="sub-tab-container">
                            <div
                                v-for="metric in currentCategory.metrics"
                                :key="metric.name"
                                class="sub-tab"
                                :class="{
                                    active: currentMetric.name === metric.name,
                                }"
                                @click="currentMetric = metric"
                            >
                                {{ metric.name }}
                                <Tooltip
                                    position="bottom"
                                    size="medium"
                                    max-width="320px"
                                >
                                    <template #content>
                                        <p>
                                            {{ getMetricTooltip(metric.name) }}
                                        </p>
                                    </template>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="content-area">
                        <div class="tab-pane fade active show">
                            <component
                                :limit="limit"
                                :is="currentMetric.component"
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
// import Tooltip from "../plugins/Tooltip.vue";
// import CapeRatio from "../components/FundamentalAdvance/CapeRatio.vue";
// import CashFlow from "../components/FundamentalAdvance/CashFlow.vue";
// import CurrentRatio from "../components/FundamentalAdvance/CurrentRatio.vue";
// import DeRatio from "../components/FundamentalAdvance/DeRatio.vue";
// import DividendYield from "../components/FundamentalAdvance/DividendYield.vue";
// import EPS from "@components/EPS.vue";
// import Graham from "../components/FundamentalAdvance/Graham.vue";
// import MarketCap from "../components/FundamentalAdvance/MarketCap.vue";
// import PegRatio from "../components/FundamentalAdvance/PegRatio.vue";
// import TradeVolume from "../components/FundamentalAdvance/TradeVolume.vue";
// import TotalAssets from "../components/FundamentalAdvance/TotalAssets.vue";
// import CompanyClassification from "../components/FundamentalAdvance/CompanyClassification.vue";
// import Piotroski_F from "../components/FundamentalAdvance/Piotroski_F.vue";
// import BeneishM from "../components/FundamentalAdvance/BeneishM.vue";
// import PLFV from "../components/FundamentalAdvance/PLFV.vue";
// import PS from "../components/FundamentalAdvance/PS.vue";
// import RevenueGrowth from "../components/FundamentalAdvance/RevenueGrowth.vue";
// import CashRatio from "../components/FundamentalAdvance/CashRatio.vue";
// import CashFlowRatio from "../components/FundamentalAdvance/CashFlowRatio.vue";
// import InterestRatio from "../components/FundamentalAdvance/InterestRatio.vue";
// import TotalAssetTurnover from "../components/FundamentalAdvance/TotalAssetTurnover.vue";
// import CapitalIntensityRatio from "../components/FundamentalAdvance/CapitalIntensityRatio.vue";
// import CashToDebtRatio from "../components/FundamentalAdvance/CashToDebtRatio.vue";
// import EquityRatio from "../components/FundamentalAdvance/EquityRatio.vue";
// import CapitalRatio from "../components/FundamentalAdvance/CapitalRatio.vue";
// // import CashFlowPerShare from "@components/CashFlowPerShare.vue";
// import CashFlowPerShare from"@/components/CashFlowPerShare.vue";
// import AccuralRatio from "../components/FundamentalAdvance/AccuralRatio.vue";
// import OperatingMargin from "../components/FundamentalAdvance/OperatingMargin.vue";
// import FixedAsset from "../components/FundamentalAdvance/FixedAsset.vue";
// import DividendRatio from "../components/FundamentalAdvance/DividendRatio.vue";
// import WorkingCapital from "../components/FundamentalAdvance/WorkingCapital.vue";
// import ProfitMargin from "../components/FundamentalAdvance/ProfitMargin.vue";
// import SharpRatio from "../components/FundamentalAdvance/SharpRatio.vue";
// import AltmanZ from "../components/FundamentalAdvance/AltmanZ.vue";
// import EBITDA from "../components/FundamentalAdvance/EBITDA.vue";
// import PBRelative from "../components/FundamentalAdvance/PBRelative.vue";
// import MVA from "../components/FundamentalAdvance/MVA.vue";
// import EarningStability from "../components/FundamentalAdvance/EarningStability.vue";
// import EBITDAMargin from "../components/FundamentalAdvance/EBITDAMargin.vue";
// import ADV from "../components/FundamentalAdvance/ADV.vue";

// var categories = [
//     {
//         name: "Valuation",
//         metrics: [
//             { name: "Peter Lynch FV", component: PLFV },
//             { name: "EV/EBITDA", component: EBITDA },
//             { name: "EBITDA Margin", component: EBITDAMargin },
//             { name: "Graham Number", component: Graham },
//         ],
//     },
//     {
//         name: "Profitability",
//         metrics: [{ name: "Cash Flow/Share", component: CashFlowPerShare }],
//     },
//     {
//         name: "Liquidity",
//         metrics: [
//             { name: "Working Capital", component: WorkingCapital },
//             { name: "Cash Flow Ratio", component: CashFlowRatio },
//         ],
//     },
//     {
//         name: "Leverage",
//         metrics: [
//             { name: "Interest Coverage", component: InterestRatio },
//             { name: "Cash/Debt Ratio", component: CashToDebtRatio },
//             { name: "Capital Ratio", component: CapitalRatio },
//             { name: "Altman Z-Score", component: AltmanZ },
//         ],
//     },
//     {
//         name: "Efficiency",
//         metrics: [{ name: "Fixed Asset Turnover", component: FixedAsset }],
//     },
//     {
//         name: "Dividends",
//         metrics: [{ name: "Cash Flow/Share", component: CashFlowPerShare }],
//     },
//     {
//         name: "Cash Flow",
//         metrics: [
//             { name: "Operating Cash Flow", component: CashFlow },
//             { name: "Free Cash Flow", component: CashFlow },
//             { name: "Accrual Ratio", component: AccuralRatio },
//         ],
//     },
//     {
//         name: "Growth",
//         metrics: [
//             { name: "Revenue Growth", component: RevenueGrowth },
//             { name: "PEG Ratio", component: PegRatio },
//         ],
//     },
//     {
//         name: "Risk Detection",
//         metrics: [{ name: "Beneish M-Score", component: BeneishM }],
//     },
//     {
//         name: "Earnings Quality",
//         metrics: [
//             { name: "Piotroski F-Score", component: Piotroski_F },
//             { name: "Earning Stability", component: EarningStability },
//         ],
//     },
//     {
//         name: "Market Performance",
//         metrics: [
//             { name: "Sharpe Ratio", component: SharpRatio },
//             { name: "P/B Relative", component: PBRelative },
//             { name: "MVA", component: MVA },
//             { name: "ADV", component: ADV },
//         ],
//     },
// ];

export default {
    name: "FundamentalAdvance",
    components: {
        Tooltip,
    },
    data() {
        return {
            categories: categories,
            currentCategory: categories[0],
            currentMetric: categories[0].metrics[0],
            limit: 10,
        };
    },
    watch: {
        currentCategory: {
            handler(newCategory) {
                this.currentMetric = newCategory.metrics[0];
            },
            immediate: true,
        },
    },
    methods: {
        getCategoryTooltip(categoryName) {
            const tooltips = {
                Valuation:
                    "मूल्याङ्कन खण्डले कम्पनीको बजार मूल्य र यसको वास्तविक मूल्यको तुलना गर्न मद्दत गर्छ। यसले शेयर महँगो छ वा सस्तो भन्ने कुरा निर्धारण गर्छ।",
                Profitability:
                    "नाफा खण्डले कम्पनीले आफ्ना स्रोतहरू प्रयोग गरेर कति प्रभावकारी रूपमा नाफा कमाउन सक्छ भन्ने मापन गर्छ। उच्च नाफामार्जिन भएका कम्पनीहरू बलियो हुन्छन्।",
                Liquidity:
                    "तरलता खण्डले कम्पनीको छोटो अवधिका दायित्वहरू तिर्ने क्षमता मापन गर्छ। राम्रो तरलता भएको कम्पनी वित्तीय संकटमा पर्दैन।",
                Leverage:
                    "लिभरेज खण्डले कम्पनीले कति ऋण प्रयोग गरेको छ र त्यसको जोखिम मापन गर्छ। बढी ऋण भएका कम्पनीहरूमा उच्च जोखिम हुन्छ।",
                Efficiency:
                    "दक्षता खण्डले कम्पनीले आफ्ना सम्पत्तिहरू कति प्रभावकारी रूपमा प्रयोग गरेर बिक्री र नाफा उत्पादन गर्छ भन्ने मापन गर्छ।",
                Dividends:
                    "लाभांश खण्डले कम्पनीले शेयरधारकहरूलाई दिने लाभांशको विश्लेषण गर्छ। नियमित लाभांश दिने कम्पनीहरू स्थिर आय प्रदान गर्छन्।",
                "Cash Flow":
                    "नगद प्रवाह खण्डले कम्पनीको वास्तविक नगद आयको स्थिति देखाउँछ। नाफा कागजमा भए पनि नगद प्रवाह नकारात्मक हुन सक्छ।",
                Growth: "बृद्धि खण्डले कम्पनीको भविष्यको विस्तार क्षमता र बिक्री बृद्धिको दर मापन गर्छ। उच्च बृद्धि दर भएका कम्पनीहरू आकर्षक लगानी बन्छन्।",
                "Risk Detection":
                    "जोखिम पहिचान खण्डले कम्पनीमा लुकेका वित्तीय समस्याहरू र धोखाधडीको सम्भावना पत्ता लगाउन मद्दत गर्छ।",
                "Market Activity":
                    "बजार गतिविधि खण्डले शेयरको कारोबार मात्रा र जोखिम-समायोजित प्रतिफल मापन गर्छ। उच्च कारोबार मात्रा तरलताको संकेत हो।",
            };
            return (
                tooltips[categoryName] ||
                "यो खण्डले सम्बन्धित वित्तीय मेट्रिक्सको विश्लेषण प्रदान गर्छ।"
            );
        },

        getMetricTooltip(metricName) {
            const tooltips = {
                "P/E Ratio":
                    "मूल्य-आम्दानी अनुपातले शेयरको मूल्य र प्रति शेयर आम्दानीको अनुपात देखाउँछ। कम P/E अनुपात सस्तो शेयरको संकेत हो।",
                "PEG Ratio":
                    "PEG अनुपातले P/E अनुपातलाई बृद्धि दरसँग तुलना गर्छ। १ भन्दा कम PEG राम्रो मानिन्छ।",
                "Price/Sales":
                    "मूल्य-बिक्री अनुपातले कम्पनीको बजार मूल्य र बार्षिक बिक्रीको तुलना गर्छ। कम अनुपात सस्तो शेयरको संकेत हो।",
                "Peter Lynch FV":
                    "पिटर लिन्च फेयर भ्यालुले कम्पनीको उचित मूल्य गणना गर्छ। यो PEG र लाभांश उपजको आधारमा निकालिन्छ।",
                "EV/EBITDA":
                    "एन्टरप्राइज भ्यालु र EBITDA को अनुपातले कम्पनीको सम्पूर्ण मूल्यांकन गर्छ। कम अनुपात आकर्षक लगानी हो।",
                "Graham Number":
                    "ग्राहम नम्बरले बेन्जामिन ग्राहमको सूत्र अनुसार शेयरको अधिकतम उचित मूल्य गणना गर्छ।",
                "Market Cap":
                    "बजार पुँजीकरणले कम्पनीको कुल बजार मूल्य देखाउँछ। यसले कम्पनीको आकार निर्धारण गर्छ।",
                EPS: "प्रति शेयर आम्दानीले कम्पनीको नाफालाई कुल शेयर संख्याले भाग गरेर निकालिन्छ। उच्च EPS राम्रो मानिन्छ।",
                "Profit Margin":
                    "नाफा मार्जिनले कुल बिक्रीमध्ये कति प्रतिशत नाफा छ भन्ने देखाउँछ। उच्च मार्जिन कम्पनीको दक्षताको संकेत हो।",
                "Operating Margin":
                    "परिचालन मार्जिनले मुख्य व्यवसायबाट हुने नाफाको प्रतिशत देखाउँछ। यो कम्पनीको मुख्य व्यवसायको क्षमता मापन गर्छ।",
                "Revenue Growth":
                    "आम्दानी बृद्धिले कम्पनीको बिक्री वृद्धि दर देखाउँछ। निरन्तर वृद्धि भएका कम्पनीहरू आकर्षक हुन्छन्।",
                "Asset Turnover":
                    "सम्पत्ति टर्नओभरले कम्पनीले आफ्ना सम्पत्तिहरू प्रयोग गरेर कति बिक्री गर्छ भन्ने मापन गर्छ।",
                "Cash Flow/Share":
                    "प्रति शेयर नगद प्रवाहले वास्तविक नगद आयलाई शेयर संख्याले भाग गरेर निकालिन्छ।",
                "Current Ratio":
                    "वर्तमान अनुपातले छोटो अवधिका सम्पत्ति र दायित्वको तुलना गर्छ। २:१ को अनुपात राम्रो मानिन्छ।",
                "Quick Ratio":
                    "द्रुत अनुपातले तत्काल तरल हुन सक्ने सम्पत्ति र छोटो अवधिका दायित्वको तुलना गर्छ।",
                "Cash Ratio":
                    "नगद अनुपातले नगद र नगद समकक्षले छोटो अवधिका दायित्व तिर्न सक्ने क्षमता मापन गर्छ।",
                "Working Capital":
                    "कार्यशील पुँजीले वर्तमान सम्पत्तिबाट वर्तमान दायित्व घटाएर निकालिन्छ।",
                "Cash Flow Ratio":
                    "नगद प्रवाह अनुपातले परिचालन नगद प्रवाह र वर्तमान दायित्वको तुलना गर्छ।",
                "D/E Ratio":
                    "ऋण-इक्विटी अनुपातले कुल ऋण र शेयरधारकको इक्विटीको तुलना गर्छ। कम अनुपात सुरक्षित मानिन्छ।",
                "Equity Ratio":
                    "इक्विटी अनुपातले कुल सम्पत्तिमा शेयरधारकको अंशको प्रतिशत देखाउँछ।",
                "Interest Coverage":
                    "ब्याज कभरेजले कम्पनीको ब्याज तिर्ने क्षमता मापन गर्छ। उच्च अनुपात सुरक्षित मानिन्छ।",
                "Cash/Debt Ratio":
                    "नगद-ऋण अनुपातले कम्पनीको नगदले कुल ऋण तिर्न सक्ने क्षमता देखाउँछ।",
                "Capital Ratio":
                    "पुँजी अनुपातले कम्पनीको पुँजी संरचनाको बलियोपन मापन गर्छ।",
                "Altman Z-Score":
                    "अल्टम्यान Z-स्कोरले कम्पनीको दिवालियापनको जोखिम पूर्वानुमान गर्छ। ३ भन्दा माथि सुरक्षित मानिन्छ।",
                "Capital Intensity":
                    "पुँजी तीव्रताले कम्पनीको व्यवसायमा कति स्थिर सम्पत्तिको आवश्यकता छ भन्ने देखाउँछ।",
                "Fixed Asset Turnover":
                    "स्थिर सम्पत्ति टर्नओभरले स्थिर सम्पत्तिको प्रयोगबाट कति बिक्री उत्पादन हुन्छ भन्ने मापन गर्छ।",
                "Dividend Yield":
                    "लाभांश उपजले शेयरको मूल्यको तुलनामा वार्षिक लाभांशको प्रतिशत देखाउँछ।",
                "Dividend Ratio":
                    "लाभांश अनुपातले कुल नाफामध्ये कति प्रतिशत लाभांश वितरण गरिन्छ भन्ने देखाउँछ।",
                "Operating Cash Flow":
                    "परिचालन नगद प्रवाहले मुख्य व्यवसायिक गतिविधिबाट आउने वास्तविक नगद देखाउँछ।",
                "Free Cash Flow":
                    "मुक्त नगद प्रवाहले पुँजीगत खर्च घटाएपछि बाँकी रहने नगद देखाउँछ।",
                "Accrual Ratio":
                    "एक्रुअल अनुपातले नाफा र नगद प्रवाहबीचको भिन्नता मापन गर्छ। शून्यको नजिक राम्रो मानिन्छ।",
                "EPS Growth":
                    "EPS वृद्धिले प्रति शेयर आम्दानीको वार्षिक वृद्धि दर देखाउँछ।",
                "Piotroski F-Score":
                    "पियोट्रोस्की F-स्कोरले कम्पनीको वित्तीय बलियोपन ०-९ स्केलमा मापन गर्छ। ७+ राम्रो मानिन्छ।",
                "Beneish M-Score":
                    "बेनिश M-स्कोरले वित्तीय विवरणमा हेरफेरको सम्भावना पत्ता लगाउँछ। -२.२२ भन्दा माथि खतरनाक मानिन्छ।",
                "Trade Volume":
                    "कारोबार मात्राले दैनिक शेयर कारोबारको संख्या देखाउँछ। उच्च मात्रा तरलताको संकेत हो।",
                "Sharpe Ratio":
                    "शार्प अनुपातले जोखिम-समायोजित प्रतिफल मापन गर्छ। १ भन्दा माथि राम्रो मानिन्छ।",
            };
            return (
                tooltips[metricName] ||
                "यो मेट्रिकले कम्पनीको वित्तीय स्वास्थ्यको एक पक्ष मापन गर्छ।"
            );
        },

        getContentAreaTooltip(metricName) {
            const contentTooltips = {
                "P/E Ratio":
                    "यो तालिकाले विभिन्न कम्पनीहरूको P/E अनुपात तुलना गर्न मद्दत गर्छ। उद्योग औसतसँग तुलना गरेर सस्तो शेयर पहिचान गर्न सकिन्छ।",
                "PEG Ratio":
                    "यहाँ देखाइएको PEG डेटाले कुन कम्पनीको वृद्धि दरको तुलनामा मूल्य उचित छ भन्ने निर्धारण गर्न मद्दत गर्छ।",
                EPS: "यो EPS तालिकाले कम्पनीहरूको नाफा कमाउने क्षमताको तुलना गर्न मद्दत गर्छ। उच्च र स्थिर EPS भएका कम्पनीहरू राम्रा हुन्छन्।",
                "Current Ratio":
                    "यो तरलता तालिकाले कुन कम्पनीले छोटो अवधिका दायित्वहरू सजिलै तिर्न सक्छ भन्ने देखाउँछ।",
                "D/E Ratio":
                    "यो ऋण तालिकाले कुन कम्पनीमा कम वित्तीय जोखिम छ भन्ने पहिचान गर्न मद्दत गर्छ।",
                "Revenue Growth":
                    "यो वृद्धि डेटाले कुन कम्पनीको भविष्य उज्ज्वल छ भन्ने संकेत दिन्छ। निरन्तर वृद्धि भएका कम्पनीहरू आकर्षक हुन्छन्।",
                "Dividend Yield":
                    "यो लाभांश तालिकाले नियमित आय चाहने लगानीकर्ताहरूलाई उपयुक्त शेयरहरू पहिचान गर्न मद्दत गर्छ।",
                "Operating Cash Flow":
                    "यो नगद प्रवाह डेटाले कम्पनीको वास्तविक नगद उत्पादन क्षमता देखाउँछ। कागजी नाफा भन्दा यो बढी महत्वपूर्ण हुन्छ।",
                "Piotroski F-Score":
                    "यो स्कोर तालिकाले वित्तीय रूपमा बलियो कम्पनीहरू छान्न मद्दत गर्छ। उच्च स्कोर भएका कम्पनीहरू सुरक्षित हुन्छन्।",
                "Trade Volume":
                    "यो कारोबार डेटाले कुन शेयरहरू सजिलै किन्न र बेच्न सकिन्छ भन्ने देखाउँछ। उच्च कारोबार तरलताको संकेत हो।",
            };
            return (
                contentTooltips[metricName] ||
                `यो ${metricName} को विस्तृत तथ्याङ्कले कम्पनीहरूको तुलनात्मक विश्लेषण गर्न मद्दत गर्छ। उच्च र निम्न मानहरूको तुलना गरेर राम्रो लगानी निर्णय लिन सकिन्छ।`
            );
        },
    },
};
</script>

<style scoped>
/* Base Card Styling */
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

/* Sub Tab Styling */
.sub-tab-section {
    padding: 4px 0;
}

.sub-tab-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 6px 4px;
    background-color: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

.sub-tab {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    background-color: transparent;
    color: #6b7280;
    border: 1px solid transparent;
}

.sub-tab:hover:not(.active) {
    background-color: #f1f5f9;
    color: #374151;
}

.sub-tab.active {
    background-color: #fff;
    color: #4caf50;
    border-color: #e2e8f0;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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