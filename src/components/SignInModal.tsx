import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, Modal, message } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';

interface Props {
    visible?: boolean;
    onCancelModal: any;
}

export class SignInModal extends React.Component<Props> {
    state = {
        isSignedIn: false,
    };

    unregisterAuthObserver = () => {};

    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
                this.props.onCancelModal();
                message.success('Sign In Successful');
                return false;
            },
        },
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    signOut = () => {
        firebase.auth().signOut();
        this.props.onCancelModal();
        message.success('Sign Out Successful');
    };

    render() {
        if (!this.state.isSignedIn) {
            return (
                <Modal
                    title="Sign In"
                    visible={this.props.visible}
                    onOk={this.props.onCancelModal}
                    onCancel={this.props.onCancelModal}
                    footer={null}
                >
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </Modal>
            );
        } else {
            const user = firebase.auth().currentUser || { displayName: '' };
            return (
                <Modal
                    title="Sign Out"
                    visible={this.props.visible}
                    onOk={this.props.onCancelModal}
                    onCancel={this.props.onCancelModal}
                    footer={null}
                >
                    <p>Welcome {user.displayName}! You are now signed-in!</p>
                    <Button onClick={this.signOut}>Sign-out</Button>
                </Modal>
            );
        }
    }
}
