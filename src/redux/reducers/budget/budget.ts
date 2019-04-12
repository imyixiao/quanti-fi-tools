import { checkNamespace } from 'helpers';
import { BudgetState, BudgetReportInterface } from './../../../budget/types';
import * as actionTypes from '../../actions/budget';
import { getDerivedBudget } from '../../selectors';
import { initialRentalState } from '../rental/rental';
import _ from 'lodash';

export const initialBudgetState: BudgetState = {
    incomeInfo: {},
    retirementAccountsInfo: {},
    taxInfo: {
        state: 'CA',
        filingStatus: 'single',
        taxableIncome: 0,
        federalIncomeTax: 0,
        stateIncomeTax: 0,
        FICATax: 0,
        NIITTax: 0,
        totalIncomeTax: 0,
        effectiveTaxRate: 0,
        afterTaxIncome: 0,
    },
    annualExpensesInfo: {
        expenses: [],
        totalExpenses: 0,
    },
    monthlyExpensesInfo: {
        expenses: [
            {
                key: 'Rent',
                value: 0,
            },
        ],
        totalExpenses: 0,
    },
    results: {
        totalNetSavings: 0,
        totalRetirementAccountsSavings: 0,
        totalSavings: 0,
    },
    previousReports: [],
    previousReportsLoading: false,
    currentReportId: '',
};

export default function(state = initialBudgetState, action): BudgetState {
    if (!checkNamespace(action, 'budget')) return state;
    const deriveBudget = newBudget => getDerivedBudget({ rental: initialRentalState, budget: newBudget });

    switch (action.type) {
        case actionTypes.SET_BUDGET_TITLE:{
            const { reportTitle } = action.payload;
            return deriveBudget({ ...state, reportTitle });
        }
        case actionTypes.SET_INCOME_INFO: {
            const { incomeInfo } = action.payload;
            return deriveBudget({ ...state, incomeInfo: { ...state.incomeInfo, ...incomeInfo } });
        }
        case actionTypes.SET_RETIREMENT_ACCOUNTS_INFO: {
            const { retirementAccountsInfo } = action.payload;
            return deriveBudget({
                ...state,
                retirementAccountsInfo: { ...state.retirementAccountsInfo, ...retirementAccountsInfo },
            });
        }
        case actionTypes.SET_TAX_INFO: {
            const { taxInfo } = action.payload;
            return deriveBudget({ ...state, taxInfo: { ...state.taxInfo, ...taxInfo } });
        }
        case actionTypes.SET_MONTHLY_EXPENSES: {
            const { expenses } = action.payload;
            return deriveBudget({
                ...state,
                monthlyExpensesInfo: { ...state.monthlyExpensesInfo, expenses },
            });
        }
        case actionTypes.SET_ANNUAL_EXPENSES: {
            const { expenses } = action.payload;
            return deriveBudget({
                ...state,
                annualExpensesInfo: { ...state.annualExpensesInfo, expenses },
            });
        }
        case actionTypes.RESET_REPORT: {
            return initialBudgetState;
        }
        case actionTypes.FETCH_BUDGET_REPORTS: {
            return {
                ...state,
                previousReportsLoading: true,
            };
        }
        case actionTypes.FETCH_BUDGET_REPORTS_SUCCEEDED: {
            const { data } = action.payload;
            return {
                ...state,
                previousReports: [...data],
                previousReportsLoading: false,
            };
        }
        case actionTypes.FETCH_BUDGET_REPORTS_FAILED: {
            return {
                ...state,
                previousReportsLoading: false,
            };
        }
        case actionTypes.POPULATE_BUDGET_CARD: {
            const { reportId } = action.payload;
            if (!reportId || reportId.length === 0) {
                return initialBudgetState;
            } else if (reportId === state.currentReportId) {
                return { ...state };
            } else {
                const previousLst = state.previousReports;
                const reportInfo: BudgetReportInterface = _.find(previousLst, { _id: reportId });
                if (!reportInfo) {
                    return initialBudgetState;
                }
                return {
                    ...state,
                    incomeInfo: {
                        ...state.incomeInfo,
                        ...reportInfo.incomeInfo,
                    },
                    retirementAccountsInfo: {
                        ...state.retirementAccountsInfo,
                        ...reportInfo.retirementAccountsInfo,
                    },
                    taxInfo: {
                        ...state.taxInfo,
                        ...reportInfo.taxInfo,
                    },
                    monthlyExpensesInfo: {
                        ...state.monthlyExpensesInfo,
                        ...reportInfo.monthlyExpensesInfo,
                    },
                    annualExpensesInfo: {
                        ...state.annualExpensesInfo,
                        ...reportInfo.annualExpensesInfo,
                    },
                    results: {},
                    reportTitle: reportInfo.reportTitle,
                    currentReportId: reportId,
                };
            }
        }
        case actionTypes.SAVE_REPORT_SUCCEEDED: {
            const { id } = action.payload.data;
            return {
                ...state,
                currentReportId: id,
            };
        }
        default:
            return state;
    }
}
