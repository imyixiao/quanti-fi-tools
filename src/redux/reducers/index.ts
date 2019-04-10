import { combineReducers } from 'redux';
import rental from './rental/rental';
import budget from './budget/budget';
import { connectRouter } from 'connected-react-router';
import { firebaseReducer } from 'react-redux-firebase';

export default history =>
    combineReducers({
        router: connectRouter(history),
        rental,
        budget,
        firebase: firebaseReducer,
    });
