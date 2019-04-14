export const max401K = 19000; // 2019

// single 2019-2020
// https://www.nerdwallet.com/blog/taxes/federal-income-tax-brackets/
export const federalTaxBuckets: { cap: number; rate: number }[] = [
    { cap: 0, rate: 0 },
    { cap: 9700, rate: 0.1 },
    { cap: 39475, rate: 0.12 },
    { cap: 84200, rate: 0.22 },
    { cap: 160725, rate: 0.24 },
    { cap: 204100, rate: 0.32 },
    { cap: 510300, rate: 0.35 },
    { cap: -1, rate: 0.37 },
];

export const federalStandardDeduction = 12200;

// Single 2018-2019
// https://www.ftb.ca.gov/forms/2018-California-Tax-Rates-and-Exemptions.shtml
const californiaTaxBuckets: { cap: number; rate: number }[] = [
    { cap: 0, rate: 0 },
    { cap: 8544, rate: 0.01 },
    { cap: 20255, rate: 0.02 },
    { cap: 31969, rate: 0.04 },
    { cap: 44377, rate: 0.06 },
    { cap: 56085, rate: 0.08 },
    { cap: 286492, rate: 0.093 },
    { cap: 343788, rate: 0.103 },
    { cap: 572980, rate: 0.113 },
    { cap: -1, rate: 0.123 },
];

export const washingtonTaxBuckets = [{ cap: 0, rate: 0 }];

export const stateIncomeTaxBuckets = {
    CA: californiaTaxBuckets,
    WA: washingtonTaxBuckets,
};

export const stateIncomeTaxStandardDeduction = {
    CA: 4401,
    WA: 0,
};

export const budgetDisabledStyle = {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.65)',
    border: 'none',
    cursor: 'default',
};
