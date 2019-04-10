let serverURL = '';
if (process.env.NODE_ENV !== 'production') {
    serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
} else {
    serverURL = process.env.REACT_APP_SERVER_URL || '';
}

export { serverURL };
