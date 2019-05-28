import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

interface Props extends StoreState {
    link?: string;
    style?: any;
    children?: any;
    onClick?: any;
    type?: 'default' | 'ghost' | 'primary' | 'dashed' | 'danger' | undefined;
    className?: string;
}

class SignInOnlyButton extends Component<Props> {
    render() {
        const loggedIn = this.props.firebaseAuth.isLoaded && !this.props.firebaseAuth.isEmpty;
        const buttonType = this.props.type || 'default';
        if (this.props.link) {
            if (loggedIn) {
                return (
                    <Link to={this.props.link} style={this.props.style}>
                        <Button type={buttonType} className={this.props.className}>
                            {this.props.children}
                        </Button>
                    </Link>
                );
            } else {
                return (
                    <Tooltip title="Please sign in first">
                        <Button type={buttonType} className={this.props.className} style={this.props.style} disabled>
                            {this.props.children}
                        </Button>
                    </Tooltip>
                );
            }
        } else {
            if (loggedIn) {
                return (
                    <Button
                        type={buttonType}
                        className={this.props.className}
                        onClick={this.props.onClick}
                        style={this.props.style}
                    >
                        {this.props.children}
                    </Button>
                );
            } else {
                return (
                    <Tooltip title="Please sign in first">
                        <Button type={buttonType} className={this.props.className} disabled style={this.props.style}>
                            {this.props.children}
                        </Button>
                    </Tooltip>
                );
            }
        }
    }
}

interface StoreState {
    firebaseAuth: any;
}

const mapStateToProps = (state: AppState): StoreState => ({
    firebaseAuth: state.firebase.auth,
});

export default connect(mapStateToProps)(SignInOnlyButton);
