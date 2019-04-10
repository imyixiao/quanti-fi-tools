import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store, history } from './redux/store';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Spin } from 'antd';
import { ConnectedRouter } from 'connected-react-router';

// const Loading = () => (
//     <div>
//         <Spin size="large" />
//     </div>
// );

ReactDOM.render(
    <Provider store={store}>
        {/* <PersistGate loading={<Loading />} persistor={persistor}> */}
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
        {/* </PersistGate> */}
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
