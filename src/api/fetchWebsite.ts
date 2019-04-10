import axios from 'axios';
import { serverURL } from 'consts';

export default function fetchWebsite(idToken, url) {
    const encodedUrl = url.trim();
    const serverUrl = serverURL + '/fetchWebsite';
    return axios(serverUrl, {
        method: 'post',
        data: {
            url: encodedUrl,
            idToken,
        },
    });
}
