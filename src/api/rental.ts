import axios from 'axios';
import { serverURL } from 'consts/serverURL';

export async function fetchRentalReports(idToken: string, ids?: string[]) {
    const fetchReportUrl = serverURL + '/fetch-rental-reports';
    return axios(fetchReportUrl, {
        method: 'post',
        data: { ids, idToken },
    });
}

export async function saveReport(idToken: string, reportInfo) {
    const saveReportUrl = serverURL + '/save-rental-report';
    const newReportInfo = {
        ...reportInfo,
        createTime: Math.round(new Date().getTime() / 1000),
    };
    return axios(saveReportUrl, {
        method: 'post',
        data: {
            reportInfo: newReportInfo,
            idToken,
        },
    });
}

export async function deleteReport(idToken: string, reportId: string) {
    const deleteReportUrl = serverURL + '/delete-rental-report';
    return axios(deleteReportUrl, {
        method: 'post',
        data: {
            reportId,
            idToken,
        },
    });
}

export async function fetchDefaultStrategy(idToken: string) {
    const url = serverURL + '/fetch-default-strategy';
    return axios(url, {
        method: 'post',
        data: { idToken },
    });
}

export async function saveDefaultStrategy(idToken: string, defaultStrategy) {
    const saveDefaultStrategyUrl = serverURL + '/save-default-strategy';
    return axios(saveDefaultStrategyUrl, {
        method: 'post',
        data: {
            defaultStrategy,
            idToken,
        },
    });
}
