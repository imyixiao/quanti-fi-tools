import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { withRouter, RouteComponentProps } from 'react-router';
import * as actions from 'redux/actions/budget';
import BudgetForm from './BudgetForm';

interface RouteMatchParams {
    id?: string;
}
interface Props extends RouteComponentProps<RouteMatchParams> {
    currentReportId?: string;
    populateBudgetCard: any;
    firebaseAuthLoaded: boolean;
}

class BudgetCard extends Component<Props> {
    componentDidMount() {
        const urlID = this.props.match.params.id;
        if (this.props.currentReportId !== urlID && this.props.firebaseAuthLoaded) {
            this.props.populateBudgetCard(urlID);
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!prevProps.firebaseAuthLoaded && this.props.firebaseAuthLoaded) {
            const urlID = this.props.match.params.id;
            this.props.populateBudgetCard(urlID);
        }
    }

    render() {
        return (
            <div>
                <header style={{ height: '10vh', textAlign: 'center' }}>
                    <h1 style={{ paddingTop: '4vh' }}> Annual Budget </h1>
                </header>
                <Card bordered={false} className="split-card">
                    <div className="budget-content">
                        <BudgetForm />
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    currentReportId: state.budget.currentReportId,
    firebaseAuthLoaded: state.firebase.auth.isLoaded,
});

interface Dispatch {
    populateBudgetCard: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        populateBudgetCard: (reportId: string) => {
            dispatch(actions.populateBudgetCard(reportId));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(BudgetCard));
