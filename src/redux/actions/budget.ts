const setBudgetNamespace = (actionType: string) => 'budget/' + actionType;

// actionTypes
export const SET_BUDGET_TITLE = setBudgetNamespace('SET_BUDGET_TITLE');
export const SET_ANNUAL_EXPENSES = setBudgetNamespace('SET_ANNUAL_EXPENSES');
export const SET_MONTHLY_EXPENSES = setBudgetNamespace('SET_MONTHLY_EXPENSES');
export const SET_INCOME_INFO = setBudgetNamespace('SET_INCOME_INFO');
export const SET_TAX_INFO = setBudgetNamespace('SET_TAX_INFO');
export const SET_RETIREMENT_ACCOUNTS_INFO = setBudgetNamespace('SET_RETIREMENT_ACCOUNTS_INFO');
export const RESET_REPORT = setBudgetNamespace('RESET_REPORT');

export const SAVE_REPORT = setBudgetNamespace('SAVE_REPORT');
export const SAVE_REPORT_SUCCEEDED = setBudgetNamespace('SAVE_REPORT_SUCCEEDED');
export const SAVE_REPORT_FAILED = setBudgetNamespace('SAVE_REPORT_FAILED');
export const FETCH_BUDGET_REPORTS = setBudgetNamespace('FETCH_BUDGET_REPORTS');
export const FETCH_BUDGET_REPORTS_SUCCEEDED = setBudgetNamespace('FETCH_BUDGET_REPORTS_SUCCEEDED');
export const FETCH_BUDGET_REPORTS_FAILED = setBudgetNamespace('FETCH_BUDGET_REPORTS_FAILED');

export const POPULATE_BUDGET_CARD = setBudgetNamespace('POPULATE_BUDGET_CARD');
export const POPULATE_BUDGET_CARD_ASYNC = setBudgetNamespace('POPULATE_BUDGET_CARD_ASYNC');

// actions
export const setBudgetTitle = reportTitle => ({ type: SET_BUDGET_TITLE, payload: { reportTitle } });

export const setAnnualExpenses = expenses => ({ type: SET_ANNUAL_EXPENSES, payload: { expenses } });

export const setIncomeInfo = incomeInfo => ({
    type: SET_INCOME_INFO,
    payload: { incomeInfo },
});

export const setRetirementAccountsInfo = retirementAccountsInfo => ({
    type: SET_RETIREMENT_ACCOUNTS_INFO,
    payload: { retirementAccountsInfo },
});

export const setTaxInfo = taxInfo => ({
    type: SET_TAX_INFO,
    payload: { taxInfo },
});

export const setMonthlyExpenses = expenses => ({
    type: SET_MONTHLY_EXPENSES,
    payload: { expenses },
});

export const saveNewReport = (onSuccess, onFailure, reportInfo) => {
    return { type: SAVE_REPORT, payload: { onSuccess, onFailure, reportInfo } };
};

export const fetchBudgetReports = (ids?: string[]) => ({
    type: FETCH_BUDGET_REPORTS,
    payload: { ids },
});

export const populateBudgetCard = (reportId: string) => ({
    type: POPULATE_BUDGET_CARD_ASYNC,
    payload: {
        reportId,
    },
});
