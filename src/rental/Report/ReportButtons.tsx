import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Button, message, Drawer, Tooltip } from 'antd';
import { RESET_REPORT, APPLY_DEFAULT_TO_REPORT } from 'redux/actions/rental';
import { AppState } from 'redux/store';
import { withRouter, RouteComponentProps } from 'react-router';
import { saveNewReport } from 'redux/actions/rental';
import { RentalState } from 'redux/reducers/rental/types';
import SignInOnlyButton from 'components/SignInOnlyButton';
import DefaultStrategyForm from '../DefaultStrategyForm';
interface Props extends StoreState, Dispatch, RouteComponentProps {}
interface State {
    drawerIsOpen: boolean;
}

class ReportButtons extends Component<Props, State> {
    state = {
        drawerIsOpen: false,
    };

    applyDefault = () => {
        this.props.applyDefaultToReport();
    };

    reset = () => {
        this.props.resetReport();
    };

    onSaveReportSuccess = () => {
        message.success('Save report succeeded');
    };

    onSaveReportFailure = e => {
        message.error('Save report failed' + e.message);
    };

    onClickSaveReport = () => {
        this.props.saveReport(this.onSaveReportSuccess, this.onSaveReportFailure, this.props.rental);
    };

    openDefaultDrawer = () => {
        this.setState({ drawerIsOpen: true });
    };

    closeDefaultDrawer = () => {
        this.setState({ drawerIsOpen: false });
    };

    render() {
        const loggedIn = this.props.firebaseAuth.isLoaded && !this.props.firebaseAuth.isEmpty;
        return (
            <Row>
                <div className="report-buttons">
                    {loggedIn && (
                        <Tooltip title="You can change your default strategy in your user profile">
                            <Button className="report-button" onClick={this.applyDefault}>
                                Apply Default
                            </Button>
                        </Tooltip>
                    )}
                    <Button className="report-button" onClick={this.reset}>
                        Reset Report
                    </Button>
                    <SignInOnlyButton type="primary" className="report-button" onClick={this.onClickSaveReport}>
                        Save Report
                    </SignInOnlyButton>
                </div>

                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={false}
                    onClose={this.closeDefaultDrawer}
                    visible={this.state.drawerIsOpen}
                    width={500}
                >
                    <DefaultStrategyForm onSave={this.closeDefaultDrawer} />
                </Drawer>
            </Row>
        );
    }
}

interface StoreState {
    rental: RentalState;
    firebaseAuth: any;
}

const mapStateToProps = (state: AppState): StoreState => ({
    rental: state.rental,
    firebaseAuth: state.firebase.auth,
});

interface Dispatch {
    resetReport: any;
    applyDefaultToReport: any;
    saveReport: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        resetReport: () => {
            dispatch({ type: RESET_REPORT });
        },
        applyDefaultToReport: () => {
            dispatch({ type: APPLY_DEFAULT_TO_REPORT });
        },
        saveReport: (onSuccess, onFailure, reportInfo) => {
            dispatch(saveNewReport(onSuccess, onFailure, reportInfo));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ReportButtons));
