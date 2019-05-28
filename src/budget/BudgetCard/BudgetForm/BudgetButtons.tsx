import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Button, message } from 'antd';
import { RESET_REPORT, saveNewReport } from 'redux/actions/budget';
import { AppState } from 'redux/store';
import { withRouter, RouteComponentProps } from 'react-router';
import { BudgetState } from '../../types';
import SignInOnlyButton from 'components/SignInOnlyButton';

interface Props extends StoreState, Dispatch, RouteComponentProps {}

class ReportButtons extends Component<Props> {
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
        this.props.saveReport(this.onSaveReportSuccess, this.onSaveReportFailure, this.props.budget);
    };

    render() {
        return (
            <Row>
                <div className="report-buttons">
                    <Button className="report-button" onClick={this.reset}>
                        Reset Report
                    </Button>
                    <SignInOnlyButton type="primary" className="report-button" onClick={this.onClickSaveReport}>
                        Save Report
                    </SignInOnlyButton>
                </div>
            </Row>
        );
    }
}

interface StoreState {
    budget: BudgetState;
}

const mapStateToProps = (state: AppState): StoreState => ({
    budget: state.budget,
});

interface Dispatch {
    resetReport: any;
    saveReport: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        resetReport: () => {
            dispatch({ type: RESET_REPORT });
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
