import * as actionTypes from '../../actions/rental';
import { ClosingCostBreakDownInterface, RepairCostBreakDownInterface } from '../../../rental/types';
import { RentalState } from './types';
import { PurchaseInfoInterface } from '../../../rental/types';
import _ from 'lodash';
import { checkNamespace } from 'helpers';

export const initialRentalState: RentalState = {
    propertyInfo: {},
    purchaseInfo: {},
    rentalInfo: {},
    step: 0,
    closingCostBreakdown: {},
    repairCostBreakdown: {},
    waitingForValidation: false,
    stepOnValidationSuccess: 0,
    rentalPreviousReportList: [],
    rentalPreviousReportListLoading: false,
    currentReportId: '',
};

export default function(state = initialRentalState, action): RentalState {
    if (!checkNamespace(action, 'rental')) return state;
    switch (action.type) {
        case actionTypes.SET_PROPERTY_INFO: {
            const { propertyInfo } = action.payload;
            return {
                ...state,
                propertyInfo: {
                    ...state.propertyInfo,
                    ...propertyInfo,
                },
            };
        }
        case actionTypes.SET_PURCHASE_INFO: {
            const { purchaseInfo }: { purchaseInfo: PurchaseInfoInterface } = action.payload;
            const newClosingCostBreakdown =
                purchaseInfo &&
                purchaseInfo.closingCost &&
                state.closingCostBreakdown &&
                purchaseInfo.closingCost !== state.closingCostBreakdown.totalClosingCost
                    ? {}
                    : state.closingCostBreakdown;
            const newRepairCostBreakdown =
                purchaseInfo &&
                purchaseInfo.repairCost &&
                state.repairCostBreakdown &&
                purchaseInfo.repairCost !== state.repairCostBreakdown.totalRepairCost
                    ? {}
                    : state.repairCostBreakdown;
            return {
                ...state,
                purchaseInfo: {
                    ...state.purchaseInfo,
                    ...purchaseInfo,
                },
                closingCostBreakdown: newClosingCostBreakdown,
                repairCostBreakdown: newRepairCostBreakdown,
            };
        }
        case actionTypes.SET_CLOSING_COST_BREAKDOWN: {
            const { closingCostBreakdown }: { closingCostBreakdown: ClosingCostBreakDownInterface } = action.payload;
            const newClosingCost =
                closingCostBreakdown.totalClosingCost == null
                    ? state.purchaseInfo.closingCost
                    : closingCostBreakdown.totalClosingCost;
            return {
                ...state,
                purchaseInfo: {
                    ...state.purchaseInfo,
                    closingCost: newClosingCost,
                },
                closingCostBreakdown: {
                    ...state.closingCostBreakdown,
                    ...closingCostBreakdown,
                },
            };
        }
        case actionTypes.SET_REPAIR_COST_BREAKDOWN: {
            const { repairCostBreakdown }: { repairCostBreakdown: RepairCostBreakDownInterface } = action.payload;
            const newRepairCost =
                repairCostBreakdown.totalRepairCost == null
                    ? state.purchaseInfo.repairCost
                    : repairCostBreakdown.totalRepairCost;
            return {
                ...state,
                purchaseInfo: {
                    ...state.purchaseInfo,
                    repairCost: newRepairCost,
                },
                repairCostBreakdown: {
                    ...state.repairCostBreakdown,
                    ...repairCostBreakdown,
                },
            };
        }
        case actionTypes.SET_RENTAL_INFO: {
            const { rentalInfo } = action.payload;
            return {
                ...state,
                rentalInfo: {
                    ...state.rentalInfo,
                    ...rentalInfo,
                },
            };
        }
        case actionTypes.RENTAL_PREVIOUS_STEP: {
            if (action.mobile) {
                return {
                    ...state,
                    step: Math.max(state.step - 1, 0),
                };
            }
            return {
                ...state,
                waitingForValidation: true,
                stepOnValidationSuccess: Math.max(state.step - 1, 0),
            };
        }
        case actionTypes.RENTAL_NEXT_STEP: {
            if (action.mobile) {
                return {
                    ...state,
                    step: state.step + 1,
                };
            }
            return {
                ...state,
                waitingForValidation: true,
                stepOnValidationSuccess: state.step + 1,
            };
        }
        case actionTypes.RENTAL_STEP_VALIDATION_SUCCESS: {
            return {
                ...state,
                waitingForValidation: false,
                step: state.stepOnValidationSuccess,
                stepOnValidationSuccess: 0,
            };
        }
        case actionTypes.RENTAL_STEP_VALIDATION_FAILED: {
            return {
                ...state,
                waitingForValidation: false,
                stepOnValidationSuccess: 0,
            };
        }
        case actionTypes.RENTAL_SET_URL: {
            return {
                ...state,
                url: action.payload.url,
            };
        }

        case actionTypes.WEBSITE_FETCH_SUCCEEDED: {
            const { data } = action.payload;
            return {
                ...state,
                propertyInfo: data,
                purchaseInfo: { listingPrice: data.listingPrice },
                rentalInfo: { hoa: data.hoa },
            };
        }
        case actionTypes.WEBSITE_FETCH_FAILED: {
            // console.log('failed');
            // console.log(action.message);
            return {
                ...state,
                fetchErrorMessage: action.message,
            };
        }
        case actionTypes.CLEAR_FETCH_ERROR: {
            return {
                ...state,
                fetchErrorMessage: undefined,
            };
        }
        case actionTypes.RESET_REPORT: {
            return initialRentalState;
        }
        case actionTypes.APPLY_DEFAULT_TO_REPORT: {
            const purchasePrice = state.purchaseInfo.listingPrice
                ? state.purchaseInfo.listingPrice
                : state.purchaseInfo.purchasePrice;
            return {
                ...state,
                purchaseInfo: {
                    ...state.purchaseInfo,
                    purchasePrice: purchasePrice,
                    afterRepairValue: purchasePrice,
                    closingCost: 2500,
                    repairCost: 1000,
                    downPayment: 20,
                    loanInterestRate: 4.75,
                    wrapLoanFeesIntoLoan: false,
                    amortizedYears: 30,
                },
                rentalInfo: {
                    ...state.rentalInfo,
                    waterAndSewer: 75,
                    garbage: 20,
                    monthlyInsurance: 100,
                    vacancy: 5,
                    maintenance: 6,
                    capex: 6,
                    managementFees: 5,
                    annualIncomeGrowth: 2,
                    annualPvGrowth: 2,
                    annualExpensesGrowth: 2,
                    salesExpenses: 9,
                },
            };
        }
        case actionTypes.FETCH_RENTAL_REPORTS: {
            return {
                ...state,
                rentalPreviousReportListLoading: true,
            };
        }
        case actionTypes.FETCH_RENTAL_REPORTS_SUCCEEDED: {
            const { data } = action.payload;
            return {
                ...state,
                rentalPreviousReportList: [...data],
                rentalPreviousReportListLoading: false,
            };
        }
        case actionTypes.FETCH_RENTAL_REPORTS_FAILED: {
            return {
                ...state,
                rentalPreviousReportListLoading: false,
            };
        }
        case actionTypes.POPULATE_RENTAL_CARD: {
            const { reportId } = action.payload;
            if (!reportId || reportId.length === 0) {
                return initialRentalState;
            } else if (reportId === state.currentReportId) {
                return { ...state };
            } else {
                const previousLst = state.rentalPreviousReportList;
                const reportInfo = _.find(previousLst, { _id: reportId });
                if (!reportInfo) {
                    return initialRentalState;
                }
                return {
                    ...state,
                    propertyInfo: {
                        ...state.propertyInfo,
                        ...reportInfo.propertyInfo,
                    },
                    purchaseInfo: {
                        ...state.purchaseInfo,
                        ...reportInfo.purchaseInfo,
                    },
                    rentalInfo: {
                        ...state.rentalInfo,
                        ...reportInfo.rentalInfo,
                    },
                    closingCostBreakdown: {
                        ...state.closingCostBreakdown,
                        ...reportInfo.closingCostBreakdown,
                    },
                    repairCostBreakdown: {
                        ...state.repairCostBreakdown,
                        ...reportInfo.repairCostBreakdown,
                    },
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
