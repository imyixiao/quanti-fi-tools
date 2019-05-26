import {
    ClosingCostBreakDownInterface,
    RepairCostBreakDownInterface,
    PropertyInfoInterface,
    PurchaseInfoInterface,
    RentalInfoInterface,
    RentalStep,
} from '../../../rental/types';

export interface RentalState {
    propertyInfo: PropertyInfoInterface;
    purchaseInfo: PurchaseInfoInterface;
    rentalInfo: RentalInfoInterface;
    step: RentalStep;
    closingCostBreakdown: ClosingCostBreakDownInterface;
    repairCostBreakdown: RepairCostBreakDownInterface;
    fetchErrorMessage?: string;
    url?: string;
    waitingForValidation?: boolean;
    stepOnValidationSuccess: RentalStep;
    rentalPreviousReportList: RentalReportInterface[];
    currentReportId?: string;
    rentalPreviousReportListLoading: boolean;
}

export interface RentalReportInterface {
    _id?: string;
    createTime: number;
    propertyInfo: PropertyInfoInterface;
    purchaseInfo: PurchaseInfoInterface;
    rentalInfo: RentalInfoInterface;
    closingCostBreakdown: ClosingCostBreakDownInterface;
    repairCostBreakdown: RepairCostBreakDownInterface;
}
