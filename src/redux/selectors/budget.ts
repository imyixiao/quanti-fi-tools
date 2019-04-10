import { RetirementAccountsInfoInterface } from './../../budget/types';
import { ExpensesInfoInterface } from 'src/budget/types';
import { AppState } from '../store';
import { createSelector } from 'reselect';
import { round } from 'helpers';
import _ from 'lodash';

export const getBudget = (state: AppState) => state.budget;
export const getBudgetTitle = createSelector(
    getBudget,
    budget => budget.reportTitle,
);
export const getIncomeInfo = createSelector(
    getBudget,
    budget => budget.incomeInfo,
);
export const getRetirementAccountsInfo = createSelector(
    getBudget,
    budget => budget.retirementAccountsInfo,
);
export const getTaxInfo = createSelector(
    getBudget,
    budget => budget.taxInfo,
);
export const getMonthlyExpensesInfo = createSelector(
    getBudget,
    budget => budget.monthlyExpensesInfo,
);
export const getAnnualExpensesInfo = createSelector(
    getBudget,
    budget => budget.annualExpensesInfo,
);
export const getBudgetResults = createSelector(
    getBudget,
    budget => budget.results,
);

export const getCurrentBudgetReportId = (state: AppState) => state.budget.currentReportId;

export const getPreviousBudgetReports = (state: AppState) => state.budget.previousReports;

export const getTotalIncome = createSelector(
    getIncomeInfo,
    incomeInfo => {
        return (
            round(incomeInfo.salary) + round(incomeInfo.bonus) + round(incomeInfo.extraBonus) + round(incomeInfo.rsu)
        );
    },
);

export const getCompensation = createSelector(
    getIncomeInfo,
    incomeInfo => {
        return round(incomeInfo.salary) + round(incomeInfo.bonus);
    },
);

export const getWage = createSelector(
    getIncomeInfo,
    incomeInfo => {
        return (
            round(incomeInfo.salary) + round(incomeInfo.bonus) + round(incomeInfo.extraBonus) + round(incomeInfo.rsu)
        );
    },
);

export const getTotalDeductibles = createSelector(
    getRetirementAccountsInfo,
    retirementAccountsInfo => {
        return round(retirementAccountsInfo.employee401K);
    },
);

export const getTotalRetirementContributions = createSelector(
    getRetirementAccountsInfo,
    retirementAccountsInfo => {
        return (
            round(retirementAccountsInfo.employee401K) +
            round(retirementAccountsInfo.roth) +
            round(retirementAccountsInfo.otherIRA)
        );
    },
);

export const getCompanyMatch = createSelector(
    [getCompensation, getRetirementAccountsInfo],
    (compensation, retirementAccountsInfo: RetirementAccountsInfoInterface) => {
        const companyMatchOfCompensation = round(retirementAccountsInfo.companyMatchOfCompensation) / 100;
        const companyMatchPortionMax = Math.max(
            round(compensation * companyMatchOfCompensation),
            round(retirementAccountsInfo.employee401K),
        );
        return round((companyMatchPortionMax * round(retirementAccountsInfo.companyMatchPercentage)) / 100);
    },
);

export const getNonDeductibleContributions = createSelector(
    getRetirementAccountsInfo,
    retirementAccountsInfo => {
        return round(retirementAccountsInfo.roth) + round(retirementAccountsInfo.otherIRA);
    },
);

export const getTaxableIncome = createSelector(
    [getTotalIncome, getTotalDeductibles],
    (totalIncome, deductibles) => {
        return totalIncome - deductibles;
    },
);

export const singleStandardDeduction = 12200;

// single 2019-2020
// https://www.nerdwallet.com/blog/taxes/federal-income-tax-brackets/
export const getFederalIncomeTax = createSelector(
    getTaxableIncome,
    (income: number) => {
        const adjustedIncome = Math.max(income - singleStandardDeduction, 0);
        const taxRates: { cap: number; rate: number }[] = [
            { cap: 0, rate: 0 },
            { cap: 9700, rate: 0.1 },
            { cap: 39475, rate: 0.12 },
            { cap: 84200, rate: 0.22 },
            { cap: 160725, rate: 0.24 },
            { cap: 204100, rate: 0.32 },
            { cap: 510300, rate: 0.35 },
            { cap: -1, rate: 0.37 },
        ];

        let totalTax = 0;
        for (let i = 1; i < taxRates.length; i++) {
            const bracket = taxRates[i];
            if (adjustedIncome < bracket.cap || bracket.cap === -1) {
                return totalTax + (adjustedIncome - taxRates[i - 1].cap) * bracket.rate;
            } else {
                totalTax += (bracket.cap - taxRates[i - 1].cap) * bracket.rate;
            }
        }
        return totalTax;
    },
);

// Single 2018-2019
// https://www.ftb.ca.gov/forms/2018-California-Tax-Rates-and-Exemptions.shtml
export const getCaliforniaIncomeTax = createSelector(
    getTaxableIncome,
    (income: number): number => {
        const adjustedIncome = Math.max(income - 4401, 0);
        const taxRates: { cap: number; rate: number }[] = [
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

        let totalTax = 0;
        for (let i = 1; i < taxRates.length; i++) {
            const bracket = taxRates[i];
            if (adjustedIncome < bracket.cap || bracket.cap === -1) {
                return totalTax + (adjustedIncome - taxRates[i - 1].cap) * bracket.rate;
            } else {
                totalTax += (bracket.cap - taxRates[i - 1].cap) * bracket.rate;
            }
        }
        return totalTax;
    },
);

// https://www.thebalancesmb.com/social-security-taxes-3193123
export const getSocialSecurityTax = createSelector(
    getWage,
    (wage: number) => {
        return Math.min(wage, 128400) * (6.2 / 100);
    },
);

// https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax
export const getMedicareTax = createSelector(
    getWage,
    (wage: number) => {
        let tax = wage * (1.45 / 100);
        tax += Math.max(0, wage - 200000) * (0.9 / 100);

        return tax;
    },
);

export const getFICATax = createSelector(
    [getSocialSecurityTax, getMedicareTax],
    (socialSecurityTax: number, medicareTax: number) => {
        return round(socialSecurityTax + medicareTax);
    },
);

export const getNIITTax = createSelector(
    getWage,
    (wage: number) => {
        return round(Math.max(0, wage - 200000) * (3.8 / 100));
    },
);

export const getTotalIncomeTax = createSelector(
    [getFederalIncomeTax, getCaliforniaIncomeTax, getFICATax, getNIITTax],
    (federalIncomeTax: number, californiaIncomeTax: number, FICATax: number, NIITTax: number) => {
        return round(federalIncomeTax + californiaIncomeTax + FICATax + NIITTax);
    },
);

export const getEffectiveTaxRate = createSelector(
    [getTaxableIncome, getTotalIncomeTax],
    (taxableIncome: number, totalIncomeTax: number) => {
        return round((totalIncomeTax / taxableIncome) * 100);
    },
);

export const getTaxDetails = createSelector(
    [
        getFederalIncomeTax,
        getCaliforniaIncomeTax,
        getSocialSecurityTax,
        getMedicareTax,
        getFICATax,
        getNIITTax,
        getTotalIncomeTax,
        getEffectiveTaxRate,
    ],
    (
        federalIncomeTax,
        californiaIncomeTax,
        socialSecurityTax,
        medicareTax,
        FICATax,
        NIITTax,
        totalIncomeTax,
        effectiveTaxRate,
    ) => {
        return {
            federalIncomeTax,
            californiaIncomeTax,
            socialSecurityTax,
            medicareTax,
            FICATax,
            NIITTax,
            totalIncomeTax,
            effectiveTaxRate,
        };
    },
);

export const getAfterTaxIncome = createSelector(
    [getTotalIncomeTax, getTaxableIncome, getNonDeductibleContributions],
    (totalIncomeTax, taxableIncome, nonDeductibleContributions) => {
        return round(taxableIncome - totalIncomeTax - nonDeductibleContributions);
    },
);

export const getTotalMonthlyExpenses = createSelector(
    getMonthlyExpensesInfo,
    (monthlyExpensesInfo: ExpensesInfoInterface) => {
        return _.reduce(
            monthlyExpensesInfo.expenses,
            (sum, expense) => {
                return sum + round(expense.value);
            },
            0,
        );
    },
);

export const getTotalAnnualExpenses = createSelector(
    getAnnualExpensesInfo,
    (annualExpensesInfo: ExpensesInfoInterface) => {
        return _.reduce(
            annualExpensesInfo.expenses,
            (sum, expense) => {
                return sum + round(expense.value);
            },
            0,
        );
    },
);

export const getTotalExpenses = createSelector(
    [getTotalMonthlyExpenses, getTotalAnnualExpenses],
    (totalMonthlyExpenses: number, totalAnnualExpenses: number) => {
        return round(totalMonthlyExpenses * 12 + totalAnnualExpenses);
    },
);

export const getTotalNetSavings = createSelector(
    [getAfterTaxIncome, getTotalMonthlyExpenses, getTotalAnnualExpenses],
    (afterTaxIncome, totalMonthlyExpenses, totalAnnualExpenses) => {
        return round(afterTaxIncome - totalMonthlyExpenses * 12 - totalAnnualExpenses);
    },
);

export const getTotalRetirementAccountsSavings = createSelector(
    [getTotalRetirementContributions, getCompanyMatch],
    (totalRetirementContributions, companyMatch) => {
        return round(totalRetirementContributions + companyMatch);
    },
);

export const getTotalSavings = createSelector(
    [getTotalNetSavings, getTotalRetirementAccountsSavings],
    (totalNetSavings, totalRetirementAccountsSavings) => {
        return round(totalNetSavings + totalRetirementAccountsSavings);
    },
);

export const getDerivedTaxInfo = createSelector(
    [getTaxInfo, getTaxableIncome, getAfterTaxIncome, getTaxDetails],
    (taxInfo, taxableIncome, afterTaxIncome, taxDetails) => {
        return {
            ...taxInfo,
            ...taxDetails,
            afterTaxIncome: afterTaxIncome,
            taxableIncome: taxableIncome,
        };
    },
);

export const getDerivedResults = createSelector(
    [getTotalNetSavings, getTotalRetirementAccountsSavings, getTotalSavings],
    (totalNetSavings, totalRetirementAccountsSavings, totalSavings) => ({
        totalNetSavings,
        totalRetirementAccountsSavings,
        totalSavings,
    }),
);

export const getDerivedBudget = createSelector(
    [getBudget, getDerivedTaxInfo, getTotalMonthlyExpenses, getTotalAnnualExpenses, getDerivedResults],
    (budget, derivedTaxInfo, totalMonthlyExpenses, totalAnnualExpenses, derivedResults) => {
        return {
            ...budget,
            taxInfo: {
                ...budget.taxInfo,
                ...derivedTaxInfo,
            },
            monthlyExpensesInfo: {
                ...budget.monthlyExpensesInfo,
                totalExpenses: totalMonthlyExpenses,
            },
            annualExpensesInfo: {
                ...budget.annualExpensesInfo,
                totalExpenses: totalAnnualExpenses,
            },
            results: derivedResults,
        };
    },
);
