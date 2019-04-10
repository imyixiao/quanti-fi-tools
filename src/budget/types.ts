export interface BudgetState {
    reportTitle?: string;
    incomeInfo: IncomeInfoInterface;
    retirementAccountsInfo: RetirementAccountsInfoInterface;
    taxInfo: TaxInfoInterface;
    monthlyExpensesInfo: ExpensesInfoInterface;
    annualExpensesInfo: ExpensesInfoInterface;
    results: ResultsInterface;
    currentReportId?: string;
    previousReports: any[];
    previousReportsLoading: boolean;
}

export interface IncomeInfoInterface {
    salary?: number;
    bonus?: number;
    bonusPercentage?: number;
    extraBonus?: number;
    rsu?: number;
}

export interface RetirementAccountsInfoInterface {
    employee401K?: number;
    roth?: number;
    otherIRA?: number;
    companyMatchOfCompensation?: number;
    companyMatchPercentage?: number;
}

export interface TaxInfoInterface {
    effectiveTaxRate?: number;
    taxableIncome?: number;
    afterTaxIncome?: number;
    federalIncomeTax?: number;
    californiaIncomeTax?: number;
    socialSecurityTax?: number;
    medicareTax?: number;
    FICATax?: number;
    NIITTax?: number;
    totalIncomeTax?: number;
    state?: string;
    filingStatus?: string;
}

export interface ExpensesInfoInterface {
    expenses: { key?: string; value?: number }[];
    totalExpenses?: number;
}

export interface ResultsInterface {
    totalNetSavings?: number;
    totalRetirementAccountsSavings?: number;
    totalSavings?: number;
}

export interface BudgetReportInterface {
    _id?: string;
    createAt: string;
    reportTitle?: string;
    incomeInfo: IncomeInfoInterface;
    retirementAccountsInfo: RetirementAccountsInfoInterface;
    taxInfo: TaxInfoInterface;
    monthlyExpensesInfo: ExpensesInfoInterface;
    annualExpensesInfo: ExpensesInfoInterface;
    results: ResultsInterface;
}

export interface PreviousBudgetReportsInterface {
    [index: number]: BudgetReportInterface;
}
