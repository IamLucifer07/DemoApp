<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Summary', href: '/summary' },
];

const selectedSector = ref('37');
const selectedCategory = ref('Profitability');

const sectors = ref<{ sector_id: number; sector_description: string; symbols: string[]; companies: any[] }[]>([]);
const allCompanies = ref<any[]>([]);
const fundamentalData = ref<CompanyFundamentalData[]>([]);
const loading = ref(false);

interface CompanyFundamentalData {
  script_id: string;
  symbol: string;
  company_name: string;
  sector_id: number;
  sector_description: string;
  profitability_metrics: {
    eps?: number | null;
    cashflow_per_share?: number | null;
    profit_margin?: number | null;
    operating_margin?: number | null;
    ebitda?: number | null;
    roa?: number | null;
  };

  liquidity_metrics: {
    current_ratio?: number | null;
    quick_ratio?: number | null;
    cash_ratio?: number | null;
    cash_flow_ratio?: number | null;
    working_capital?: number | null;
  };

  leverage_metrics: {
    cash_debt_ratio?: number | null;
    capital_ratio?: number | null;
    interest_coverage?: number | null;
    altman_z_score?: number | null;
    debt_equity_ratio?: number | null;
    equity_ratio?: number | null;
    capital_intensity?: number | null;
  };

  valuation_metrics: {
    plfv?: number | null;
    ev_ebitda?: number | null;
    graham_number?: number | null;
    ps_ratio?: number | null;
    ebitda_margin?: number | null;
    cape_ratio?: number | null;
    market_capitalization?: number | null;
  };

  dividends_metrics: {
    dividend_yield?: number | null;
    dividend_payout?: number | null;
    dividend_coverage_ratio?: number | null;
    cashflow_per_share?: number | null;
    retention_ratio?: number | null;
  };

  efficiency_metrics: {
    fixed_asset_turnover?: number | null;
    total_asset_turnover?: number | null;
  };

  growth_metrics: {
    revenue_growth?: number | null;
    peg_ratio?: number | null;
    eps_growth?: number | null;
  };

  cash_flow_metrics: {
    operating_cash_flow?: number | null;
    free_cash_flow?: number | null;
    accrual_ratio?: number | null;
  };

  risk_detection_metrics: {
    beneish_m_score?: number | null;
  };

  earning_quality_metrics: {
    earning_stability?: number | null;
    piotroski_f_score?: number | null;
  };

  market_performance_metrics: {
    sharpe_ratio?: number | null;
    pb_relative?: number | null;
    mva?: number | null;
    adv?: number | null;
  };
}
interface Company {
  sector_id: number;
  sector_description: string;
  symbol: string;
  script_id: string;
  company_name?: string;
}

const fundamentalCategories = {
    'Profitability': ['EPS', 'Cashflow per Share', 'Profit Margin', 'Operating Margin', 'EBITDA','ROA',],
    'Liquidity': ['Current Ratio', 'Quick Ratio', 'Cash Ratio', 'Cash Flow Ratio', 'Working Capital'],
    'Leverage': ['Cash/Debt Ratio', 'Capital Ratio', 'Interest Coverage', 'Altman Z-Score', 'D/E Ratio', 'Equity Ratio', 'Capital Intensity'],
    'Valuation': ['PLFV','EV/EBITDA', 'Graham Number', 'P/S Ratio', 'EBITDA Margin', 'Cape Ratio','Market Capitalization'],
    'Dividends': ['Dividend Yield', 'Dividend Payout', 'Dividend Coverage Ratio', 'Cashflow per Share', 'Retention Ratio'],
    'Efficiency': ['Fixed Asset Turnover', 'Total Asset Turnover'],
    'Growth': ['Revenue Growth', 'PEG Ratio', 'EPS Growth'],
    'Cash Flow': ['Operating Cash Flow', 'Free Cash Flow', 'Accrual Ratio'],
    'Risk Detection':['Beneish M-Score'],
    'Earning Quality':['Earning Stability', 'Piotroski F-Score'],
    'Market Performance':['Sharpe Ratio', 'P/B Relative', 'MVA', 'ADV']
};

const getRecommendationRanges = (metric: string, sectorId: string) => {
    const RatingRanges: Record<string, any> = {
        epsRatingRanges:{
            "Commercial Banks": 
            {best: 40,better: [25, 40],good: [15, 25],neutral: [10, 15],weak: [5, 10],worst: 5},
            "Hydro Power": 
            {best: 30,better: [20, 30],good: [12, 20],neutral: [8, 12],weak: [4, 8],worst: 4},
            "Non Life Insurance": 
            {best: 25,better: [15, 25],good: [10, 15],neutral: [6, 10],weak: [3, 6],worst: 3},
            "Life Insurance": 
            {best: 20,better: [12, 20],good: [8, 12],neutral: [5, 8],weak: [2, 5],worst: 2},
            "Manufacturing And Processing": 
            {best: 15,better: [10, 15],good: [7, 10],neutral: [4, 7],weak: [2, 4],worst: 2},
            "Tradings": 
            {best: 12,better: [8, 12],good: [5, 8],neutral: [3, 5],weak: [1, 3],worst: 1},
            "Hotels And Tourism": 
            {best: 10,better: [6, 10],good: [4, 6],neutral: [2, 4],weak: [1, 2],worst: 1},
            "Development Banks": 
            {best: 18,better: [12, 18],good: [8, 12],neutral: [5, 8],weak: [3, 5],worst: 3},
            "Microfinance": 
            {best: 15,better: [10, 15],good: [6, 10],neutral: [4, 6],weak: [2, 4],worst: 2},
            "Others": 
            {best: 10,better: [7, 10],good: [5, 7],neutral: [3, 5],weak: [1, 3],worst: 1}
        },
        operatingMarginRanges : {
            "Commercial Banks": 
            {excellent: 45,strong: [35, 45],average: [25, 35],weak: [15, 25],critical: 15},
            "Development Banks": 
            {excellent: 40,strong: [30, 40],average: [20, 30],weak: [10, 20],critical: 10},
            "Finance": 
            {excellent: 50,strong: [40, 50],average: [30, 40],weak: [20, 30],critical: 20},
            "Life Insurance": 
            {excellent: 35,strong: [25, 35],average: [15, 25],weak: [8, 15],critical: 8},
            "Non Life Insurance": 
            {excellent: 25,strong: [18, 25],average: [10, 18],weak: [5, 10],critical: 5},
            "Hydro Power": 
            {excellent: 60,strong: [50, 60],average: [40, 50],weak: [30, 40],critical: 30},
            "Microfinance": 
            {excellent: 30,strong: [22, 30],average: [15, 22],weak: [8, 15],critical: 8},
            "Manufacturing And Processing": 
            {excellent: 28,strong: [20, 28],average: [12, 20],weak: [5, 12],critical: 5},
            "Tradings": 
            {excellent: 20,strong: [15, 20],average: [8, 15],weak: [3, 8],critical: 3},
            "Hotels And Tourism": 
            {excellent: 25,strong: [18, 25],average: [10, 18],weak: [5, 10],critical: 5}
        },
        currentRatioRatingRanges: {
            "Commercial Banks": {
            high_growth: 0.25,steady_growth: [0.12, 0.25],stable: [0.05, 0.12],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Development Banks": {
            high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
            },
            "Finance": {
            high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
            },
            "Hydro Power": {
                high_growth: 0.35,steady_growth: [0.20, 0.35],stable: [0.10, 0.20],declining: [0.0, 0.10],loss_making: 0.0
            },
            "Non Life Insurance": {
            high_growth: 0.40,steady_growth: [0.25, 0.40],stable: [0.15, 0.25],declining: [0.0, 0.15],loss_making: 0.0
            },
            "Life Insurance": {
            high_growth: 0.30,steady_growth: [0.15, 0.30],stable: [0.05, 0.15],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Manufacturing And Processing": {
            high_growth: 0.25,steady_growth: [0.15, 0.25],stable: [0.08, 0.15],declining: [0.0, 0.08],loss_making: 0.0
            },
            "Tradings": {
            high_growth: 0.20,steady_growth: [0.12, 0.20],stable: [0.05, 0.12],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Hotels And Tourism": {
            high_growth: 0.25,steady_growth: [0.15, 0.25],stable: [0.05, 0.15],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Microfinance": {
            high_growth: 0.50,steady_growth: [0.20, 0.50],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Investment": {
            high_growth: 0.40,steady_growth: [0.20, 0.40],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
            },
            "Others": {
            high_growth: 0.35,steady_growth: [0.20, 0.35],stable: [0.05, 0.20],declining: [0.0, 0.05],loss_making: 0.0
            }
        },
        cashRatioRanges : {
            "Commercial Banks": {
            best: 0.5,better: [0.3, 0.5],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
            },
            "Development Banks": {
            best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
            },
            "Finance": {
            best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
            },
            "Hydro Power": {
            best: 0.8,better: [0.6, 0.8],good: [0.4, 0.6],neutral: [0.2, 0.4],weak: [0.1, 0.2],worst: 0.1
            },
            "Non Life Insurance": {
            best: 1.2,better: [0.9, 1.2],good: [0.6, 0.9],neutral: [0.4, 0.6],weak: [0.2, 0.4],worst: 0.2
            },
            "Life Insurance": {
            best: 0.9,better: [0.7, 0.9],good: [0.5, 0.7],neutral: [0.3, 0.5],weak: [0.1, 0.3],worst: 0.1
            },
            "Manufacturing And Processing": {
            best: 0.6,better: [0.4, 0.6],good: [0.3, 0.4],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
            },
            "Tradings": {
            best: 0.5,better: [0.3, 0.5],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
            },
            "Hotels And Tourism": {
            best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
            },
            "Microfinance": {
            best: 0.4,better: [0.3, 0.4],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
            },
            "Investment": {
            best: 1.5,better: [1.0, 1.5],good: [0.7, 1.0],neutral: [0.5, 0.7],weak: [0.3, 0.5],worst: 0.3
            },
            "Others": {
            best: 0.6,better: [0.4, 0.6],good: [0.3, 0.4],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
            }
        },
    };
    
    return RatingRanges;
};

const getRecommendation = (value: number | null, metric: string, sectorId: string): { text: string; class: string } => {
    if (value === null || isNaN(value)) {
        return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
    }
    const sectorName = getSectorName(sectorId);
    const RatingRanges = getRecommendationRanges(metric, sectorId);

    if ( metric.trim().toLowerCase() === "operating margin" ||metric.trim().toLowerCase() === "operating_margin") {
        const ranges = RatingRanges.operatingMarginRanges?.[sectorName];
        if (!ranges) return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };

        if (value >= ranges.excellent) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
        if (value >= ranges.strong[0]) return { text: 'Good', class: 'bg-blue-100 text-blue-800' };
        if (value >= ranges.average[0]) return { text: 'Average', class: 'bg-yellow-100 text-yellow-800' };
        if (value >= ranges.weak[0]) return { text: 'Weak', class: 'bg-red-100 text-red-800' };
        if (value < ranges.weak[0]) return { text: 'Critical', class: 'bg-red-100 text-red-800' };
    }
    if (metric.trim().toLowerCase() === "current ratio" ||metric.trim().toLowerCase() === "current_ratio") {
        const ranges = RatingRanges.currentRatioRatingRanges[sectorName];
        
        if (!ranges || isNaN(value)) return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
        
        if (value >= ranges.high_growth) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
        else if (value >= ranges.steady_growth[0]) return { text: 'Good', class: 'bg-blue-100 text-blue-800' };
        else if (value >= ranges.stable[0]) return { text: 'Average', class: 'bg-yellow-100 text-yellow-800' };
        else if (value >= ranges.declining[0]) return { text: 'Weak', class: 'bg-red-100 text-red-800' };
        else return { text: 'Critical', class: 'bg-red-100 text-red-800' };
    }
    if (metric.trim().toLowerCase() === "cash ratio" ||metric.trim().toLowerCase() === "cash_ratio") {
        const ranges = RatingRanges.cashRatioRanges[sectorName];
        
        if (!ranges || isNaN(value)) return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
        
        if (value >= ranges.best) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
        else if (value >= ranges.better[0]) return { text: 'Better', class: 'bg-blue-100 text-blue-800' };
        else if (value >= ranges.good[0]) return { text: 'Good', class: 'bg-blue-100 text-blue-800' };
        else if (value >= ranges.neutral[0]) return { text: 'Average', class: 'bg-yellow-100 text-yellow-800' };
        else if (value >= ranges.weak[0]) return { text: 'Weak', class: 'bg-red-100 text-red-800' };
        else return { text: 'Critical', class: 'bg-red-100 text-red-800' };
    }
    if (metric.trim().toLowerCase() === "eps" ) {
        const ranges = RatingRanges.epsRatingRanges?.[sectorName];
        if (!ranges) return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
        
        if (value >= ranges.best) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
        else if (value >= ranges.better[0]) return { text: 'Better', class: 'bg-blue-100 text-blue-800' };
        else if (value >= ranges.good[0]) return { text: 'Good', class: 'bg-blue-100 text-blue-800' };
        else if (value >= ranges.neutral[0]) return { text: 'Average', class: 'bg-yellow-100 text-yellow-800' };
        else if (value >= ranges.weak[0]) return { text: 'Weak', class: 'bg-red-100 text-red-800' };
        else return { text: 'Critical', class: 'bg-red-100 text-red-800' };
    }

    return { text: 'N/A', class: 'bg-gray-100 text-gray-600' };
};
const getSectorName = (sectorId: string): string => {
    const sectorMap: Record<string, string> = {
        "37": "Commercial Banks",
        "44": "Development Banks",
        "45": "Finance",
        "49": "Microfinance",
        "43": "Non Life Insurance",
        "50": "Life Insurance",
        "41": "Hydro Power",
        "39": "Hotels And Tourism",
        "38": "Manufacturing And Processing",
        "42": "Tradings",
        "67": "Investment",
        "40": "Others"
    };
    return sectorMap[sectorId] || 'Others';
};

const availableSubcategories = computed(() => {
    return fundamentalCategories[selectedCategory.value as keyof typeof fundamentalCategories] || [];
});

const getMetricValue = (company: CompanyFundamentalData, metric: string): number | null => {
    const normalize = (str: string) =>
        str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '');
    const metricMap: Record<string, string> = {
         // profitability
        eps: 'profitability_metrics.eps',
        cash_flow_per_share: 'profitability_metrics.cash_flow_per_share',
        profit_margin: 'profitability_metrics.profit_margin',
        operating_margin: 'profitability_metrics.operating_margin',
        ebitda: 'profitability_metrics.ebitda',
        roa: 'profitability_metrics.roa', 
        // liquidity
        current_ratio: 'liquidity_metrics.current_ratio',
        quick_ratio: 'liquidity_metrics.quick_ratio',
        cash_ratio: 'liquidity_metrics.cash_ratio',
        cash_flow_ratio: 'liquidity_metrics.cash_flow_ratio',
        working_capital: 'liquidity_metrics.working_capital',
        // leverage
        cash_flow_to_debt_ratio: 'leverage_metrics.cash_flow_to_debt_ratio',
        capital_ratio: 'leverage_metrics.capital_ratio',
        interest_coverage: 'leverage_metrics.interest_coverage_ratio',
        altman_z_score: 'leverage_metrics.altman_z_score',
        de_ratio: 'leverage_metrics.de_ratio',
        equity_ratio: 'leverage_metrics.equity_ratio',
        capital_intense_ratio: 'leverage_metrics.capital_intense_ratio',
        // valuation
        plfv: 'valuation_metrics.plfv',
        ev_ebitda: 'valuation_metrics.ev_ebitda',
        graham_number: 'valuation_metrics.graham_number',
        ps_ratio: 'valuation_metrics.ps_ratio',
        ebitda_margin: 'valuation_metrics.ebitda_margin',
        cape_ratio: 'valuation_metrics.cape_ratio',
        market_capitalization: 'valuation_metrics.market_cap',
        // dividends
        dividend_yield: 'dividend_metrics.dividend_yield',
        dividend_payout: 'dividend_metrics.dividend_payout_ratio',
        dividend_coverage_ratio: 'dividend_metrics.dividend_coverage_ratio',
        cashflow_per_share: 'dividend_metrics.cashflow_per_share',
        retention_ratio: 'dividend_metrics.retention_ratio',
        // Efficiency
        fixed_asset_turnover: 'efficiency_metrics.fixed_asset_turnover',
        total_asset_turnover: 'efficiency_metrics.total_asset_turnover',
        // Growth
        revenue_growth: 'growth_metrics.revenue_growth',
        peg_ratio: 'growth_metrics.peg_ratio',
        eps_growth: 'growth_metrics.earnings_growth_rate',
        // Cash Flow
        operating_cash_flow: 'cashflow_metrics.operating_cash_flow',
        free_cash_flow: 'cashflow_metrics.free_cash_flow',
        accrual_ratio: 'cashflow_metrics.accrual_ratio',
        // Risk Detection
        beneish_m_score: 'risk_metrics.m_score',
        // Earning Quality
        earning_stability: 'earning_quality_metrics.average_roa',
        piotroski_f_score: 'earning_quality_metrics.F_Score',
        // Market Performance
        sharpe_ratio: 'market_performance_metrics.sharp_ratio',
        pb_relative: 'market_performance_metrics.pb_relative',
        mva: 'market_performance_metrics.MVA',
        adv: '',
    };

    const normalizedMetric = normalize(metric);
    const path = metricMap[normalizedMetric];
    if (!path) return null;

    const value = path.split('.').reduce((obj, key) => obj?.[key], company as any);
    return typeof value === 'number' ? value : null;
};

const fetchSectors = async () => {
    try {
        const response = await axios.get<Company[]>('https://laganisutra.com/api/symbol-id-sector');
        allCompanies.value = response.data;
        
        const sectorMap = new Map<number, {
            sector_id: number;
            sector_description: string;
            symbols: string[];
            companies: Company[];
        }>();

        response.data.forEach((company: Company) => {
            if (!sectorMap.has(company.sector_id)) {
                sectorMap.set(company.sector_id, {
                    sector_id: company.sector_id,
                    sector_description: company.sector_description,
                    symbols: [],
                    companies: []
                });
            }
            
            const sector = sectorMap.get(company.sector_id);
            if (sector) {
                sector.symbols.push(company.symbol);
                sector.companies.push(company);
            }
        });
        
        sectors.value = Array.from(sectorMap.values());
    } catch (error) {
        console.error('Error fetching sectors:', error);
    }
};

const fetchFundamentalData = async () => {
    loading.value = true;
    try {
        let selectedCompanies = [];
        
        if (selectedSector.value === 'all') {
            selectedCompanies = allCompanies.value.slice(0, 10);
        } else {
            // Convert both to numbers for comparison
            const sector = sectors.value.find(s => 
                s.sector_id.toString() === selectedSector.value.toString()
            );
            selectedCompanies = sector ? sector.companies : [];
        }

        if (selectedCompanies.length === 0) {
            console.log('No companies found for selected sector', selectedSector.value);
            fundamentalData.value = [];
            return;
        }

        const companyDataPromises = selectedCompanies.map(async (company) => {
            try {
                const summaryRes = await axios.get(`https://laganisutra.com/api/fundamentals/company-summary/${company.script_id}`);
                const apiData = Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data;

                const result: CompanyFundamentalData = {
                    script_id: company.script_id,
                    symbol: company.symbol,
                    company_name: apiData.company_name || company.symbol,
                    sector_id: company.sector_id,
                    sector_description: company.sector_description,

                    profitability_metrics: {
                        eps: parseFloat(apiData.growth_metrics?.eps) || null,
                        cashflow_per_share: parseFloat(apiData.dividend_metrics?.cash_flow_per_share) || null,
                        profit_margin: parseFloat(apiData.profitability_metrics?.net_profit_margin) || null,
                        operating_margin: parseFloat(apiData.profitability_metrics?.operating_margin) || null,
                        ebitda: parseFloat(apiData.other_metrics?.ebitda) || null,
                        roa: parseFloat(apiData.leverage_metrics?.roa) || null,
                    },

                    liquidity_metrics: {
                        current_ratio: parseFloat(apiData.liquidity_metrics?.current_ratio) || null,
                        quick_ratio: parseFloat(apiData.liquidity_metrics?.quick_ratio) || null,
                        cash_ratio: parseFloat(apiData.liquidity_metrics?.cash_ratio) || null,
                        cash_flow_ratio: parseFloat(apiData.liquidity_metrics?.cash_flow_ratio) || null,
                        working_capital: parseFloat(apiData.leverage_metrics?.working_capital) || null,
                    },

                    leverage_metrics: {
                        cash_debt_ratio: null,
                        capital_ratio: parseFloat(apiData.leverage_metrics?.capital_ratio) || null,
                        interest_coverage: parseFloat(apiData.leverage_metrics?.interest_coverage_ratio) || null,
                        altman_z_score: parseFloat(apiData.leverage_metrics?.altman_z_score) || null,
                        debt_equity_ratio: parseFloat(apiData.leverage_metrics?.de_ratio) || null,
                        equity_ratio: parseFloat(apiData.leverage_metrics?.equity_ratio) || null,
                        capital_intensity: parseFloat(apiData.profitability_metrics?.capital_intense_ratio) || null,
                    },

                    valuation_metrics: {
                        plfv: parseFloat(apiData.valuation_metrics?.plfv) || null,
                        ev_ebitda: parseFloat(apiData.valuation_metrics?.ev_ebitda) || null,
                        graham_number: parseFloat(apiData.valuation_metrics?.graham_number) || null,
                        ps_ratio: parseFloat(apiData.growth_metrics?.ps_ratio) || null,
                        ebitda_margin: parseFloat(apiData.other_metrics?.ebitda_margin) || null,
                        cape_ratio: parseFloat(apiData.valuation_metrics?.cape_ratio) || null,
                        market_capitalization: parseFloat(apiData.other_metrics?.market_cap) || null,
                    },

                    dividends_metrics: {
                        dividend_yield: parseFloat(apiData.dividend_metrics?.dividend_yield) || null,
                        dividend_payout: parseFloat(apiData.dividend_metrics?.dividend_payout_ratio) || null,
                        dividend_coverage_ratio: parseFloat(apiData.dividend_metrics?.dividend_coverage_ratio) || null,
                        cashflow_per_share: parseFloat(apiData.dividend_metrics?.cash_flow_per_share) || null,
                        retention_ratio: parseFloat(apiData.dividend_metrics?.retention_ratio) || null,
                    },

                    efficiency_metrics: {
                        fixed_asset_turnover: parseFloat(apiData.efficiency_metrics?.fixed_asset_turnover) || null,
                        total_asset_turnover: parseFloat(apiData.efficiency_metrics?.total_asset_turnover) || null,
                    },

                    growth_metrics: {
                        revenue_growth: parseFloat(apiData.growth_metrics?.revenue_growth) || null,
                        peg_ratio: parseFloat(apiData.valuation_metrics?.peg_ratio) || null,
                        eps_growth: parseFloat(apiData.valuation_metrics?.earnings_growth_rate) || null,
                    },

                    cash_flow_metrics: {
                        operating_cash_flow: parseFloat(apiData.cashflow_metrics?.operating_cash_flow) || null,
                        free_cash_flow: parseFloat(apiData.cashflow_metrics?.free_cash_flow) || null,
                        accrual_ratio: parseFloat(apiData.cashflow_metrics?.accrual_ratio) || null,
                    },

                    risk_detection_metrics: {
                        beneish_m_score: parseFloat(apiData.risk_metrics?.m_score) || null,
                    },

                    earning_quality_metrics: {
                        earning_stability: parseFloat(apiData.other_metrics?.average_roa) || null,
                        piotroski_f_score: parseFloat(apiData.risk_metrics?.F_Score) || null,
                    },

                    market_performance_metrics: {
                        sharpe_ratio: parseFloat(apiData.other_metrics?.sharp_ratio) || null,
                        pb_relative: parseFloat(apiData.other_metrics?.pb_relative) || null,
                        mva: parseFloat(apiData.other_metrics?.MVA) || null,
                        adv: null,
                    },
                };

                return result;
            } catch (error) {
                console.error(`Error processing ${company.symbol}:`, error);
                return null;
            }
        });


        const results = await Promise.allSettled(companyDataPromises);
        const processedData = results
            .filter((result): result is PromiseFulfilledResult<CompanyFundamentalData> => 
                result.status === 'fulfilled' && result.value !== null
            )
            .map(result => result.value);
            
        fundamentalData.value = processedData;
            
    } catch (error) {
        console.error('Error fetching fundamental data:', error);
        fundamentalData.value = [];
    } finally {
        loading.value = false;
    }
};

watch(selectedCategory, () => {
    fetchFundamentalData();
}, { immediate: false });

watch(selectedSector, () => {
    fetchFundamentalData();
}, { immediate: false });

onMounted(async() => {
   await fetchSectors();
   await fetchFundamentalData();
});

// async fetchFundamentalData() {
        //     this.loading = true;
        //     try {
        //         let selectedCompanies = [];
        //         if (this.selectedSector === 'all') {
        //             selectedCompanies = this.allCompanies.slice(0, 15);
        //         } else {
        //             const sector = this.sectors.find(s => 
        //                 s.sector_id.toString() === this.selectedSector.toString()
        //             );
        //             selectedCompanies = sector ? sector.companies : [];
        //         }
        //         if (selectedCompanies.length === 0) {
        //             this.fundamentalData = [];
        //             return;
        //         }
        //         const companyDataPromises = selectedCompanies.map(async (company) => {
        //             try {
        //                 const summaryRes = await axios.get(`https://laganisutra.com/api/fundamentals/company-summary/${company.script_id}`);
        //                 const apiData = Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data;
        //                 return {
        //                     script_id: company.script_id,
        //                     symbol: company.symbol,
        //                     company_name: apiData.company_name || company.symbol,
        //                     sector_id: company.sector_id,
        //                     sector_description: company.sector_description,
        //                     valuation_metrics: {
        //                         plfv: this.parseMetric(apiData.valuation_metrics?.plfv),
        //                         ev_ebitda: this.parseMetric(apiData.valuation_metrics?.ev_ebitda),
        //                         graham_number: this.parseMetric(apiData.valuation_metrics?.graham_number),
        //                         cape_ratio: this.parseMetric(apiData.valuation_metrics?.cape_ratio),
        //                         ps_ratio: this.parseMetric(apiData.growth_metrics?.ps_ratio),
        //                         pb_relative: this.parseMetric(apiData.other_metrics?.pb_relative),
        //                         pe_ratio: this.parseMetric(apiData.growth_metrics?.pe_ratio),
        //                         MVA: this.parseMetric(apiData.other_metrics?.MVA),
        //                     },
        //                     profitability_metrics: {
        //                         eps: this.parseMetric(apiData.growth_metrics?.eps),
        //                         profit_margin: this.parseMetric(apiData.profitability_metrics?.net_profit_margin),
        //                         operating_margin: this.parseMetric(apiData.profitability_metrics?.operating_margin),
        //                         ebitda_margin: this.parseMetric(apiData.other_metrics?.ebitda_margin),
        //                         ebitda: this.parseMetric(apiData.other_metrics?.ebitda),
        //                         roa: this.parseMetric(apiData.leverage_metrics?.roa),
        //                     },
        //                     liquidity_metrics: {
        //                         current_ratio: this.parseMetric(apiData.liquidity_metrics?.current_ratio),
        //                         quick_ratio: this.parseMetric(apiData.liquidity_metrics?.quick_ratio),
        //                         cash_ratio: this.parseMetric(apiData.liquidity_metrics?.cash_ratio),
        //                         cash_flow_ratio: this.parseMetric(apiData.liquidity_metrics?.cash_flow_ratio),
        //                         working_capital: this.parseMetric(apiData.liquidity_metrics?.working_capital),
        //                         adv:null, // not available in the API
        //                     },
        //                     leverage_metrics: {
        //                         interest_coverage_ratio: this.parseMetric(apiData.leverage_metrics?.interest_coverage_ratio),
        //                         cash_flow_to_debt_ratio: this.parseMetric(apiData.liquidity_metrics.cash_flow_to_debt_ratio),
        //                         capital_ratio: this.parseMetric(apiData.leverage_metrics?.capital_ratio),
        //                         altman_z_score: this.parseMetric(apiData.leverage_metrics?.altman_z_score),
        //                         de_ratio: this.parseMetric(apiData.leverage_metrics?.de_ratio),
        //                         equity_ratio: this.parseMetric(apiData.leverage_metrics?.equity_ratio),
        //                     },
        //                     efficiency_metrics: {
        //                         fixed_asset_turnover: this.parseMetric(apiData.efficiency_metrics?.fixed_asset_turnover),
        //                         total_asset_turnover: this.parseMetric(apiData.efficiency_metrics?.total_asset_turnover),
        //                         capital_intense_ratio: this.parseMetric(apiData.profitability_metrics?.capital_intense_ratio),
        //                     },
        //                     dividend_metrics: {
        //                         dividend_yield: this.parseMetric(apiData.dividend_metrics?.dividend_yield),
        //                         dividend_payout_ratio: this.parseMetric(apiData.dividend_metrics?.dividend_payout_ratio),
        //                         dividend_coverage_ratio: this.parseMetric(apiData.dividend_metrics?.dividend_coverage_ratio),
        //                         retention_ratio: this.parseMetric(apiData.dividend_metrics?.retention_ratio),
        //                     },
        //                     growth_metrics: {
        //                         revenue_growth: this.parseMetric(apiData.valuation_metrics?.revenue_growth),
        //                         peg_ratio: this.parseMetric(apiData.valuation_metrics?.peg_ratio),
        //                         earnings_growth_rate: this.parseMetric(apiData.valuation_metrics?.earnings_growth_rate),
        //                     },
        //                     cashflow_metrics: {
        //                         operating_cash_flow: this.parseMetric(apiData.cashflow_metrics?.operating_cash_flow),
        //                         free_cash_flow: this.parseMetric(apiData.cashflow_metrics?.free_cash_flow),
        //                         accrual_ratio: this.parseMetric(apiData.cashflow_metrics?.accrual_ratio),
        //                     },
        //                     risk_detection_metrics: {
        //                         m_score: this.parseMetric(apiData.risk_metrics?.m_score),
        //                         financial_leverage_ratio: this.parseMetric(apiData.leverage_metrics?.financial_leverage_ratio),
        //                     },
        //                     earning_quality_metrics: {
        //                         average_roa: this.parseMetric(apiData.other_metrics?.average_roa),
        //                         F_Score: this.parseMetric(apiData.risk_metrics?.F_Score),
        //                     },
        //                     market_performance_metrics: {
        //                         sharp_ratio: this.parseMetric(apiData.other_metrics?.sharp_ratio),
        //                         sortino_ratio: this.parseMetric(apiData.other_metrics?.sortino_ratio),
        //                         market_cap: this.parseMetric(apiData.other_metrics?.market_cap),
        //                         total_shares: this.parseMetric(apiData.valuation_metrics?.total_shares),
        //                     },
        //                 };
        //             } catch (error) {
        //                 console.error(`Error processing ${company.symbol}:`, error);
        //                 return null;
        //             }
        //         });
        //         const results = await Promise.allSettled(companyDataPromises);
        //         this.fundamentalData = results
        //             .filter(result => result.status === 'fulfilled' && result.value !== null)
        //             .map(result => result.value);
        //     } catch (error) {
        //         console.error('Error fetching fundamental data:', error);
        //         this.fundamentalData = [];
        //     } finally {
        //         this.loading = false;
        //     }
        // },
</script>

<template>
    <Head title="Summary" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <h1 class="mb-6 text-2xl font-bold">Fundamental Analysis Summary</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Category Select -->
                <div>
                    <label class="block mb-2 font-medium">Select Category:</label>
                    <select 
                        v-model="selectedCategory" 
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option 
                            v-for="(subcategories, category) in fundamentalCategories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                    </select>
                </div>

                <!-- Sector Select -->
                <div>
                    <label class="block mb-2 font-medium">Select Sector:</label>
                    <select 
                        v-model="selectedSector" 
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Sectors</option>
                        <option
                            v-for="sector in sectors"
                            :key="sector.sector_id"
                            :value="sector.sector_id"
                        >
                            {{ sector.sector_description }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Data Table -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b">
                    <h2 class="text-lg font-semibold text-gray-800">
                        {{ selectedCategory }} Analysis
                    </h2>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-100 z-10">
                                    Company
                                </th>
                                <th 
                                    v-for="subcategory in availableSubcategories"
                                    :key="subcategory"
                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {{ subcategory }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="loading">
                            <!-- Loading state -->
                            </tr>
                            <tr v-else-if="fundamentalData.length === 0">
                            <!-- No data state -->
                            </tr>
                            <tr 
                            v-else
                            v-for="company in fundamentalData"
                            :key="company.symbol"
                            class="hover:bg-gray-50"
                            >
                            <td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r">
                                <div>
                                <div class="text-sm font-medium text-gray-900">{{ company.symbol }}</div>
                                <!-- <div class="text-sm text-gray-500">{{ company.company_name }}</div> -->
                                </div>
                            </td>
                            <td 
                                v-for="subcategory in availableSubcategories"
                                :key="subcategory"
                                class="px-6 py-4 whitespace-nowrap"
                            >
                                <div class="flex flex-col items-center">
                                <div class="text-sm font-medium text-gray-900 mb-1">
                                    {{ getMetricValue(company, subcategory)?.toFixed(2) ?? 'N/A' }}
                                </div>
                                <span 
                                    v-if="getMetricValue(company, subcategory) !== null"
                                    :class="[
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                        getRecommendation(
                                            getMetricValue(company, subcategory) as number, 
                                            subcategory, 
                                            selectedSector
                                        ).class
                                    ]"
                                >
                                    {{ getRecommendation(
                                        getMetricValue(company, subcategory) as number, 
                                        subcategory, 
                                        selectedSector
                                    ).text }}
                                </span>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>