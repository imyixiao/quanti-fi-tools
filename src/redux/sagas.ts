import { getCurrentBudgetReportId, getPreviousBudgetReports } from './selectors/budget';
import { getCurrentRentalReportId, getPreviousRentalReports, getFirebaseIDToken } from './selectors';
import { select, call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as rentalActionTypes from './actions/rental';
import * as rentalActions from './actions/rental';
import _ from 'lodash';
import { push } from 'connected-react-router';
import * as rentalAPI from '../api/rental';
import { default as fetchWebsiteAPI } from '../api/fetchWebsite';

import * as budgetAPI from '../api/budget';
import * as budgetActions from './actions/budget';
import * as budgetActionTypes from './actions/budget';

function* fetchWebsite(action) {
    const idToken = yield select(getFirebaseIDToken);
    try {
        const { url } = action.payload;
        yield put({ type: rentalActionTypes.RENTAL_SET_URL, payload: { url } });
        const res = yield call(fetchWebsiteAPI, idToken, url);
        if (res.data.type === 'error') {
            throw new Error(res.data.message);
        }
        yield put({ type: rentalActionTypes.WEBSITE_FETCH_SUCCEEDED, payload: { data: res.data } });
    } catch (e) {
        yield put({ type: rentalActionTypes.WEBSITE_FETCH_FAILED, message: e.message });
    }
}

function* saveRentalReport(action) {
    const { onSuccess, onFailure, reportInfo } = action.payload;
    const idToken = yield select(getFirebaseIDToken);
    try {
        const saveReportData = _.cloneDeep(reportInfo);
        saveReportData.step = undefined;
        saveReportData.waitingForValidation = undefined;
        saveReportData.stepOnValidationSuccess = undefined;
        saveReportData.rentalPreviousReportList = undefined;
        const res = yield call(rentalAPI.saveReport, idToken, saveReportData);
        if (res.data.type === 'error') {
            throw new Error(res.data.message);
        }
        const id = res.data.id;
        onSuccess(id);
        yield put({ type: rentalActionTypes.SAVE_REPORT_SUCCEEDED, payload: { data: res.data } });
        yield put(rentalActions.fetchRentalReports());
        yield put(push('/rental/' + id));
    } catch (e) {
        onFailure(e);
        yield put({ type: rentalActionTypes.SAVE_REPORT_FAILED, message: e.message });
    }
}

function* fetchRentalReports(action) {
    const { ids } = action.payload;
    const idToken = yield select(getFirebaseIDToken);
    try {
        const res = yield call(rentalAPI.fetchRentalReports, idToken, ids);
        if (res.data.type === 'error') {
            throw new Error(res.data.message);
        }
        const { reportsData } = res.data;
        yield put({ type: rentalActionTypes.FETCH_RENTAL_REPORTS_SUCCEEDED, payload: { data: reportsData } });
    } catch (e) {
        console.log(e.message);
        yield put({ type: rentalActionTypes.FETCH_RENTAL_REPORTS_FAILED, payload: { message: e.message } });
    }
}

function* populateRentalCardAsync(action) {
    const { reportId } = action.payload;
    const currentReportId = yield select(getCurrentRentalReportId);
    const previousList = yield select(getPreviousRentalReports);
    if (!!reportId && reportId !== currentReportId) {
        const reportInfo = _.find(previousList, { _id: reportId });
        if (!reportInfo) {
            yield fetchRentalReports({ payload: { ids: [reportId] } });
        }
    }

    yield put({ type: rentalActionTypes.POPULATE_RENTAL_CARD, payload: action.payload });
}

function* saveBudgetReport(action) {
    const { onSuccess, onFailure, reportInfo } = action.payload;
    const idToken = yield select(getFirebaseIDToken);
    try {
        const saveReportData = _.cloneDeep(reportInfo);
        saveReportData.previousReports = undefined;
        saveReportData.previousReportsLoading = undefined;
        const res = yield call(budgetAPI.saveReport, idToken, saveReportData);
        if (res.data.type === 'error') {
            throw new Error(res.data.message);
        }
        const id = res.data.id;
        onSuccess(id);
        yield put({ type: budgetActionTypes.SAVE_REPORT_SUCCEEDED, payload: { data: res.data } });
        yield put(budgetActions.fetchBudgetReports());
        yield put(push('/budget/' + id));
    } catch (e) {
        onFailure(e);
        yield put({ type: budgetActionTypes.SAVE_REPORT_FAILED, message: e.message });
    }
}

function* fetchBudgetReports(action) {
    const { ids } = action.payload;
    const idToken = yield select(getFirebaseIDToken);
    try {
        const res = yield call(budgetAPI.fetchBudgetReports, idToken, ids);
        if (res.data.type === 'error') {
            throw new Error(res.data.message);
        }
        const { reportsData } = res.data;
        yield put({ type: budgetActionTypes.FETCH_BUDGET_REPORTS_SUCCEEDED, payload: { data: reportsData } });
    } catch (e) {
        console.log(e.message);
        yield put({ type: budgetActionTypes.FETCH_BUDGET_REPORTS_FAILED, payload: { message: e.message } });
    }
}

function* populateBudgetCardAsync(action) {
    const { reportId } = action.payload;
    const currentReportId = yield select(getCurrentBudgetReportId);
    const previousList = yield select(getPreviousBudgetReports);
    if (!!reportId && reportId !== currentReportId) {
        const reportInfo = _.find(previousList, { _id: reportId });
        if (!reportInfo) {
            yield fetchBudgetReports({ payload: { ids: [reportId] } });
        }
    }
    yield put({ type: budgetActionTypes.POPULATE_BUDGET_CARD, payload: action.payload });
}

function* mySaga() {
    yield takeLatest(rentalActionTypes.WEBSITE_FETCH_REQUESTED, fetchWebsite);
    yield takeLatest(rentalActionTypes.SAVE_REPORT, saveRentalReport);
    yield takeLatest(rentalActionTypes.FETCH_RENTAL_REPORTS, fetchRentalReports);
    yield takeEvery(rentalActionTypes.POPULATE_RENTAL_CARD_ASYNC, populateRentalCardAsync);

    yield takeLatest(budgetActionTypes.SAVE_REPORT, saveBudgetReport);
    yield takeLatest(budgetActionTypes.FETCH_BUDGET_REPORTS, fetchBudgetReports);
    yield takeEvery(budgetActionTypes.POPULATE_BUDGET_CARD_ASYNC, populateBudgetCardAsync);
}

export default mySaga;
