import { PropertyInfoInterface, PurchaseInfoInterface, RentalInfoInterface } from './../../rental/types';
import { createSelector } from 'reselect';
import { AppState } from './../store';
import { RentalStep } from '../../rental/types';
import { RentalState } from '../reducers/rental/types';

export const getPropertyInfo = (state: AppState) =>
    state && state.rental.propertyInfo ? state.rental.propertyInfo : {};

export const getPurchaseInfo = (state: AppState) =>
    state && state.rental.purchaseInfo ? state.rental.purchaseInfo : {};

export const getClosingCostBreakdown = (state: AppState) =>
    state && state.rental.closingCostBreakdown ? state.rental.closingCostBreakdown : {};

export const getRepairCostBreakdown = (state: AppState) =>
    state && state.rental.repairCostBreakdown ? state.rental.repairCostBreakdown : {};

export const getRentalInfo = (state: AppState) => (state && state.rental.rentalInfo ? state.rental.rentalInfo : {});

export const getRentalStep = (state: AppState): RentalStep => (state && state.rental.step ? state.rental.step : 0);

export const getCurrentRentalReportId = (state: AppState) => state.rental.currentReportId;

export const getPreviousRentalReports = (state: AppState) => state.rental.rentalPreviousReportList;

const checkNumber = (num: any) => (num === undefined ? 0 : num);

const getReportTitle = ({ rental }: { rental: RentalState }) => {
    return rental.propertyInfo.reportTitle || null;
};

const getReportSubtitles = ({ rental }: { rental: RentalState }) => {
    const { propertyInfo } = rental;
    const { address, city, state, zipcode, bedrooms, bathrooms, totalSqft } = propertyInfo;
    const firstAddressSubtitle: string | null = address || null;
    let secondAddressSubtitle: string | null = '';
    let bbSubtitle: string | null = '';
    let sqftSubtitle: string | null = '';

    if (city) {
        secondAddressSubtitle += city;
        if (state) {
            secondAddressSubtitle += ', ' + state;
        }
        if (zipcode) {
            secondAddressSubtitle += ' ' + zipcode;
        }
    } else {
        if (propertyInfo.state) {
            secondAddressSubtitle += propertyInfo.state;
            if (propertyInfo.zipcode) {
                secondAddressSubtitle += ' ' + propertyInfo.zipcode;
            }
        } else {
            if (propertyInfo.zipcode) {
                secondAddressSubtitle += propertyInfo.zipcode;
            } else {
                secondAddressSubtitle = null;
            }
        }
    }

    if (bedrooms) {
        bbSubtitle += `${bedrooms} Beds`;
        if (bathrooms) {
            bbSubtitle += ` ${bathrooms} Baths`;
        }
    } else {
        if (bathrooms) {
            bbSubtitle += `${bathrooms} Baths`;
        } else {
            bbSubtitle = null;
        }
    }

    if (totalSqft) {
        sqftSubtitle = `${propertyInfo.totalSqft} sqft`;
    } else {
        sqftSubtitle = null;
    }

    return {
        firstAddressSubtitle,
        secondAddressSubtitle,
        bbSubtitle,
        sqftSubtitle,
    };
};

const getMarketValue = createSelector(
    getPurchaseInfo,
    purchaseInfo => {
        const arv = checkNumber(purchaseInfo.afterRepairValue);
        if (arv) return arv;

        const listingPrice = checkNumber(purchaseInfo.listingPrice);
        if (listingPrice) return listingPrice;

        return checkNumber(purchaseInfo.purchasePrice);
    },
);

const getMonthlyIncome = createSelector(
    getRentalInfo,
    rentalInfo => {
        const rent = checkNumber(rentalInfo.monthlyRent);
        const other = checkNumber(rentalInfo.otherMonthlyIncome);
        return rent + other;
    },
);

const getMonthlyOperatingExpenses = createSelector(
    getRentalInfo,
    getPropertyInfo,
    (rentalInfo, propertyInfo) => {
        const vacancy = checkNumber(rentalInfo.vacancy);
        const capex = checkNumber(rentalInfo.capex);
        const management = checkNumber(rentalInfo.managementFees);
        const taxes = checkNumber(propertyInfo.annualTax) / 12;
        const maintenance = checkNumber(rentalInfo.maintenance);
        const insurance = checkNumber(rentalInfo.monthlyInsurance);
        const pmi = checkNumber(rentalInfo.pmi);
        const hoa = checkNumber(rentalInfo.hoa);
        const electricity = checkNumber(rentalInfo.electricity);
        const water = checkNumber(rentalInfo.waterAndSewer);
        const garbage = checkNumber(rentalInfo.garbage);
        const other = checkNumber(rentalInfo.otherMonthlyExpenses);

        return {
            total:
                vacancy +
                capex +
                management +
                taxes +
                maintenance +
                insurance +
                pmi +
                hoa +
                electricity +
                water +
                garbage +
                other,
            vacancy,
            capex,
            management,
            taxes,
            maintenance,
            insurance,
            pmi,
            hoa,
            electricity,
            water,
            garbage,
            other,
        };
    },
);

export interface LoanDetailsInterface {
    downPayment?: number;
    monthlyMortgage?: number;
    loanAmount?: number;
    interestRate?: number;
    amortizedYears?: number;
    points?: number;
    totalCash: number;
}

const getLoanCalculations = createSelector(
    getPurchaseInfo,
    (purchaseInfo): LoanDetailsInterface => {
        if (purchaseInfo.isCashPurchase) return { totalCash: checkNumber(purchaseInfo.purchasePrice) };

        const purchasePrice = checkNumber(purchaseInfo.purchasePrice);
        let payment = purchasePrice;
        const points = checkNumber(purchaseInfo.pointsChargedByLender) / 100;
        if (purchaseInfo.wrapLoanFeesIntoLoan) {
            const otherCharges = checkNumber(purchaseInfo.otherChargesFromLender);
            payment += points * purchasePrice + otherCharges;
        }

        const interestRate = checkNumber(purchaseInfo.loanInterestRate) / 100;
        const monthlyInterestRate = interestRate / 12;
        const downPayment = payment * (checkNumber(purchaseInfo.downPayment) / 100);

        const loanAmount = payment - downPayment;
        const numberOfPayments = checkNumber(purchaseInfo.amortizedYears) * 12;
        const discount =
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) /
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));

        const monthlyMortgage = loanAmount / discount;

        const closing = checkNumber(purchaseInfo.closingCost);
        const repair = checkNumber(purchaseInfo.repairCost);

        const totalCash = downPayment + closing + repair;

        return {
            loanAmount,
            downPayment,
            interestRate: interestRate * 100,
            monthlyMortgage,
            totalCash,
            amortizedYears: purchaseInfo.amortizedYears,
            points: points * 100,
        };
    },
);

export const getCashflow = createSelector(
    getMonthlyIncome,
    getMonthlyOperatingExpenses,
    getLoanCalculations,
    (monthlyIncome, monthlyOperatingExpenses, loan) => {
        return monthlyIncome - monthlyOperatingExpenses.total - checkNumber(loan.monthlyMortgage);
    },
);

export interface SubtitlesInterface {
    firstAddressSubtitle?: string | null;
    secondAddressSubtitle?: string | null;
    bbSubtitle?: string | null;
    sqftSubtitle?: string | null;
}

export interface ReportDataInterface {
    title?: string | null;
    cashflow: number;
    monthlyIncome: number;
    monthlyExpense: number;
    noi: number;
    coc: number;
    totalCash: number;
    capRate: number;
    loan: LoanDetailsInterface;
    monthlyOperatingExpenses: any;
    propertyInfo: PropertyInfoInterface;
    purchaseInfo: PurchaseInfoInterface;
    rentalInfo: RentalInfoInterface;
    subtitles: SubtitlesInterface;
}

export const getReport = createSelector(
    [
        getPropertyInfo,
        getPurchaseInfo,
        getRentalInfo,
        getReportTitle,
        getReportSubtitles,
        getMarketValue,
        getMonthlyIncome,
        getMonthlyOperatingExpenses,
        getLoanCalculations,
        getCashflow,
    ],
    (
        propertyInfo,
        purchaseInfo,
        rentalInfo,
        title,
        subtitles,
        marketValue,
        monthlyIncome,
        monthlyOperatingExpenses,
        loan,
        cashflow,
    ): ReportDataInterface => {
        const { monthlyMortgage, totalCash } = loan;
        const noi = (monthlyIncome - monthlyOperatingExpenses.total) * 12;
        const coc = totalCash === 0 ? 100 : ((cashflow * 12) / totalCash) * 100;
        const monthlyExpense = monthlyOperatingExpenses.total + monthlyMortgage;
        const capRate = ((monthlyIncome * 12) / marketValue) * 100;

        return {
            propertyInfo,
            purchaseInfo,
            rentalInfo,
            title,
            subtitles,
            monthlyIncome,
            monthlyExpense,
            monthlyOperatingExpenses,
            cashflow,
            noi,
            totalCash,
            coc,
            capRate,
            loan,
        };
    },
);
