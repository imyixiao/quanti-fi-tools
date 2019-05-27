import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Button, message, Drawer } from 'antd';
import { RESET_REPORT, APPLY_DEFAULT_TO_REPORT } from 'redux/actions/rental';
import { AppState } from 'redux/store';
import { withRouter, RouteComponentProps } from 'react-router';
import { saveNewReport } from 'redux/actions/rental';
import { RentalState } from 'redux/reducers/rental/types';
import SignInOnlyButton from 'components/SignInOnlyButton';
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
        return (
            <Row>
                <div className="report-buttons">
                    <SignInOnlyButton
                        className="report-button"
                        onClick={this.openDefaultDrawer}
                        text="Set Default Estimations"
                    />
                    <SignInOnlyButton className="report-button" onClick={this.applyDefault} text="Apply Default" />
                    <Button className="report-button" onClick={this.reset}>
                        Reset Report
                    </Button>
                    <SignInOnlyButton
                        type="primary"
                        className="report-button"
                        onClick={this.onClickSaveReport}
                        text="Save Report"
                    />
                </div>

                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={false}
                    onClose={this.closeDefaultDrawer}
                    visible={this.state.drawerIsOpen}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.closeDefaultDrawer();
                        }}
                    >
                        Save
                    </Button>
                </Drawer>
            </Row>
        );
    }
}

interface StoreState {
    rental: RentalState;
}

const mapStateToProps = (state: AppState): StoreState => ({
    rental: state.rental,
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
