import { federalTaxBuckets, federalStandardDeduction } from 'consts/budget';
import { RetirementAccountsInfoInterface, TaxInfoInterface, ResultsInterface } from './../../budget/types';
import { ExpensesInfoInterface } from 'budget/types';
import { AppState } from '../store';
import { createSelector } from 'reselect';
import { round, calculateIncomeTaxForState } from 'helpers';
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
        const companyMatchPortionMax = Math.min(
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

export const getFederalIncomeTax = createSelector(
    getTaxableIncome,
    (income: number) => {
        const adjustedIncome = Math.max(income - federalStandardDeduction, 0);
        const taxBuckets = federalTaxBuckets;
        let totalTax = 0;
        for (let i = 1; i < taxBuckets.length; i++) {
            const bracket = taxBuckets[i];
            if (adjustedIncome < bracket.cap || bracket.cap === -1) {
                return totalTax + (adjustedIncome - taxBuckets[i - 1].cap) * bracket.rate;
            } else {
                totalTax += (bracket.cap - taxBuckets[i - 1].cap) * bracket.rate;
            }
        }
        return totalTax;
    },
);

export const getStateIncomeTax = createSelector(
    [getTaxInfo, getTaxableIncome],
    (taxInfo: TaxInfoInterface, income: number): number => {
        const state = taxInfo.state;
        if (!state || !income) return 0;
        return calculateIncomeTaxForState(state, income);
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
// https://www.thebalancesmb.com/medicare-tax-3193121
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
    [getFederalIncomeTax, getStateIncomeTax, getFICATax, getNIITTax],
    (federalIncomeTax: number, stateIncomeTax: number, FICATax: number, NIITTax: number) => {
        return round(federalIncomeTax + stateIncomeTax + FICATax + NIITTax);
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
        getStateIncomeTax,
        getSocialSecurityTax,
        getMedicareTax,
        getFICATax,
        getNIITTax,
        getTotalIncomeTax,
        getEffectiveTaxRate,
    ],
    (
        federalIncomeTax,
        stateIncomeTax,
        socialSecurityTax,
        medicareTax,
        FICATax,
        NIITTax,
        totalIncomeTax,
        effectiveTaxRate,
    ) => {
        return {
            federalIncomeTax,
            stateIncomeTax,
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
    [getAfterTaxIncome, getTotalNetSavings, getTotalRetirementAccountsSavings, getTotalSavings],
    (afterTaxIncome, totalNetSavings, totalRetirementAccountsSavings, totalSavings): ResultsInterface => ({
        totalNetSavings,
        totalRetirementAccountsSavings,
        totalSavings,
        totalNetSavingsRate: round((totalNetSavings / afterTaxIncome) * 100),
        totalSavingsRate: round((totalSavings / afterTaxIncome) * 100),
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
