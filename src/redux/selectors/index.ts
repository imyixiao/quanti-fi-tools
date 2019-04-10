export * from './rental';
export * from './budget';
export const getFirebaseIDToken = state => {
    return state.firebase.auth.stsTokenManager.accessToken;
};
