import axios from 'axios';
import { serverURL } from 'consts/serverURL';

export async function fetchBudgetReports(idToken: string, ids?: string[]) {
    const fetchReportUrl = serverURL + '/fetch-budget-reports';
    return axios(fetchReportUrl, {
        method: 'post',
        data: { ids, idToken },
    });
}

export async function saveReport(idToken: string, reportInfo) {
    const saveReportUrl = serverURL + '/save-budget-report';
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
