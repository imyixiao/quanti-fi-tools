export interface PropertyInfoInterface {
    reportTitle?: string;
    address?: string;
    city?: string;
    state?: string;
    commnity?: string;
    county?: string;
    zipcode?: string;
    propertyType?: string;
    annualTax?: number;
    mlsNumber?: string;
    photos?: any;
    description?: string;
    bedrooms?: string;
    bathrooms?: string;
    totalSqft?: string;
    lotSize?: string;
    yearBuilt?: string;
    yearRenovated?: string;
    units?: number;
    stories?: number;
    countyAppraisedValue?: string;
    pool?: boolean;
    heating?: boolean;
    cooling?: boolean;
    fireplace?: boolean;
    garage?: boolean;
    construction?: string;
    roofing?: string;
    flooringTypes?: string;
    wiringCondition?: string;
    plumbingCondition?: string;
    sidingMaterial?: string;
    otherInformation?: string;
}

export interface PurchaseInfoInterface {
    purchasePrice?: number;
    afterRepairValue?: number;
    closingCost?: number;
    purchaseClosingCostBreakdown?: any;
    repairCost?: number;
    isCashPurchase?: boolean;
    downPayment?: number;
    loanInterestRate?: number;
    pointsChargedByLender?: number;
    otherChargesFromLender?: number;
    wrapLoanFeesIntoLoan?: boolean;
    isInterestOnly?: boolean;
    amortizedYears?: number;
    typicalCapRate?: number;
    listingPrice?: number;
}

export interface RentalInfoInterface {
    monthlyRent?: number;
    otherMonthlyIncome?: number;
    electricity?: number;
    waterAndSewer?: number;
    pmi?: number;
    garbage?: number;
    hoa?: number;
    monthlyInsurance?: number;
    otherMonthlyExpenses?: number;
    vacancy?: number;
    maintenance?: number;
    capex?: number;
    managementFees?: number;
    annualIncomeGrowth?: number;
    annualPvGrowth?: number;
    annualExpensesGrowth?: number;
    salesExpenses?: number;
}

export interface ClosingCostBreakDownInterface {
    points?: number;
    prepaidHazardInsurance?: number;
    prepaidFloodInsurance?: number;
    prepaidPropertyTaxes?: number;
    annualAssesements?: number;
    titleAndEscrowFees?: number;
    attorneyCharges?: number;
    inspectionCosts?: number;
    recordingFees?: number;
    appraisalFees?: number;
    otherFees?: number;
    totalClosingCost?: number;
}

export interface RepairCostBreakDownInterface {
    roof?: number;
    concrete?: number;
    guttersSoffitFascia?: number;
    garage?: number;
    siding?: number;
    landscaping?: number;
    exteriorPainting?: number;
    septic?: number;
    decks?: number;
    foundation?: number;
    demo?: number;
    sheerstock?: number;
    plumbing?: number;
    carpentryWindowsDoors?: number;
    electrical?: number;
    interiorPainting?: number;
    hvac?: number;
    cabinetsCounterTops?: number;
    framing?: number;
    flooring?: number;
    permits?: number;
    termites?: number;
    mold?: number;
    miscellaneous?: number;
    totalRepairCost?: number;
}

export enum RentalStep {
    PropertyInfo,
    PurchaseInfo,
    RentalInfo,
    Report,
}

export interface DefaultStrategyInterface {
    closingCost?: number;
    repairCost?: number;
    downPayment?: number;
    loanInterestRate?: number;
    wrapLoanFeesIntoLoan?: boolean;
    amortizedYears?: number;
    electricity?: number;
    waterAndSewer?: number;
    pmi?: number;
    garbage?: number;
    hoa?: number;
    monthlyInsurance?: number;
    otherMonthlyExpenses?: number;
    vacancy?: number;
    maintenance?: number;
    capex?: number;
    managementFees?: number;
    annualIncomeGrowth?: number;
    annualPvGrowth?: number;
    annualExpensesGrowth?: number;
    salesExpenses?: number;
}
