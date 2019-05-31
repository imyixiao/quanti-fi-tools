import { RepairCostBreakDownInterface, ClosingCostBreakDownInterface } from '../../rental/types';

const setRentalNamespace = (actionType: string) => 'rental/' + actionType;

// action types
export const SET_PROPERTY_INFO = setRentalNamespace('SET_PROPERTY_INFO');

export const RENTAL_PREVIOUS_STEP = setRentalNamespace('RENTAL_PREVIOUS_STEP');
export const RENTAL_NEXT_STEP = setRentalNamespace('RENTAL_NEXT_STEP');
export const RENTAL_STEP_VALIDATION_SUCCESS = setRentalNamespace('RENTAL_STEP_VALIDATION_SUCCESS');
export const RENTAL_STEP_VALIDATION_FAILED = setRentalNamespace('RENTAL_STEP_VALIDATION_FAILED');

export const WEBSITE_FETCH_REQUESTED = setRentalNamespace('WEBSITE_FETCH_REQUESTED');
export const WEBSITE_FETCH_SUCCEEDED = setRentalNamespace('WEBSITE_FETCH_SUCCEEDED');
export const WEBSITE_FETCH_FAILED = setRentalNamespace('WEBSITE_FETCH_FAILED');
export const RENTAL_SET_URL = setRentalNamespace('RENTAL_SET_URL');
export const CLEAR_FETCH_ERROR = setRentalNamespace('CLEAR_FETCH_ERROR');

export const SET_PURCHASE_INFO = setRentalNamespace('SET_PURCHASE_INFO');
export const SET_CLOSING_COST_BREAKDOWN = setRentalNamespace('SET_CLOSING_COST_BREAKDOWN');
export const SET_REPAIR_COST_BREAKDOWN = setRentalNamespace('SET_REPAIR_COST_BREAKDOWN');

export const SET_RENTAL_INFO = setRentalNamespace('SET_RENTAL_INFO');
export const RESET_REPORT = setRentalNamespace('RESET_REPORT');
export const APPLY_DEFAULT_TO_REPORT = setRentalNamespace('APPLY_DEFAULT_TO_REPORT');
export const SAVE_REPORT = setRentalNamespace('SAVE_REPORT');
export const SAVE_REPORT_SUCCEEDED = setRentalNamespace('SAVE_REPORT_SUCCEEDED');
export const SAVE_REPORT_FAILED = setRentalNamespace('SAVE_REPORT_FAILED');
export const FETCH_RENTAL_REPORTS = setRentalNamespace('FETCH_RENTAL_REPORTS');
export const FETCH_RENTAL_REPORTS_SUCCEEDED = setRentalNamespace('FETCH_RENTAL_REPORTS_SUCCEEDED');
export const FETCH_RENTAL_REPORTS_FAILED = setRentalNamespace('FETCH_RENTAL_REPORTS_FAILED');
export const POPULATE_RENTAL_CARD = setRentalNamespace('POPULATE_RENTAL_CARD');
export const POPULATE_RENTAL_CARD_ASYNC = setRentalNamespace('POPULATE_RENTAL_CARD_ASYNC');
export const DELETE_REPORT = setRentalNamespace('DELETE_REPORT')

export const SET_DEFAULT_STRATEGY = setRentalNamespace('SET_DEFAULT_STRATEGY');
export const SAVE_DEFAULT_STRATEGY = setRentalNamespace('SAVE_DEFAULT_STRATEGY');
export const FETCH_DEFAULT_STRATEGY = setRentalNamespace('FETCH_DEFAULT_STRATEGY');
export const FETCH_DEFAULT_STRATEGY_SUCCEEDED = setRentalNamespace('FETCH_DEFAULT_STRATEGY_SUCCEEDED');

// actions
export const setPropertyInfo = propertyInfo => ({ type: SET_PROPERTY_INFO, payload: { propertyInfo } });
export const setPurchaseInfo = purchaseInfo => ({ type: SET_PURCHASE_INFO, payload: { purchaseInfo } });
export const setRentalInfo = rentalInfo => ({ type: SET_RENTAL_INFO, payload: { rentalInfo } });

export const setClosingCostBreakdown = (closingCostBreakdown: ClosingCostBreakDownInterface) => {
    let sum = 0;
    for (const [, value] of Object.entries(closingCostBreakdown)) {
        if (value) {
            sum += value;
        }
    }
    return {
        type: SET_CLOSING_COST_BREAKDOWN,
        payload: {
            closingCostBreakdown: { ...closingCostBreakdown, totalClosingCost: sum },
        },
    };
};

export const setRepairCostBreakdown = (repairCostBreakdown: RepairCostBreakDownInterface) => {
    let sum = 0;
    for (const [, value] of Object.entries(repairCostBreakdown)) {
        if (value) {
            sum += value;
        }
    }
    return {
        type: SET_REPAIR_COST_BREAKDOWN,
        payload: {
            repairCostBreakdown: { ...repairCostBreakdown, totalRepairCost: sum },
        },
    };
};

export const rentalPreviousStep = (mobile: boolean) => ({ type: RENTAL_PREVIOUS_STEP, mobile });
export const rentalNextStep = (mobile: boolean) => ({ type: RENTAL_NEXT_STEP, mobile });

export const saveNewReport = (onSuccess, onFailure, reportInfo) => {
    return { type: SAVE_REPORT, payload: { onSuccess, onFailure, reportInfo } };
};

export const deleteReport = (onSuccess, onFailure, reportId) => {
    return { type: DELETE_REPORT, payload: { onSuccess, onFailure, reportId} };
};

export const populateRentalCardAction = (reportId: string) => ({
    type: POPULATE_RENTAL_CARD_ASYNC,
    payload: {
        reportId,
    },
});

export const fetchRentalReports = (ids?: string[]) => ({
    type: FETCH_RENTAL_REPORTS,
    payload: { ids },
});

export const setDefaultStrategy = defaultStrategy => ({ type: SET_DEFAULT_STRATEGY, payload: { defaultStrategy } });
export const saveDefaultStrategy = defaultStrategy => ({ type: SAVE_DEFAULT_STRATEGY, payload: { defaultStrategy } });
export const fetchDefaultStrategy = () => ({ type: FETCH_DEFAULT_STRATEGY });
