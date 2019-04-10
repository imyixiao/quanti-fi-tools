import { BudgetState } from './../budget/types';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import createRootReducer from './reducers';
import mySaga from './sagas';

import { RentalState } from './reducers/rental/types';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

// const persistConfig = {
//     key: 'root',
//     storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const rrfConfig = {
    // userProfile: 'users',
    // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
)(createStore);

export const store = createStoreWithFirebase(
    // persistedReducer,
    createRootReducer(history),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

// export const persistor = persistStore(store);

export interface AppState {
    rental: RentalState;
    budget: BudgetState;
    firebase?: any;
}

sagaMiddleware.run(mySaga);
