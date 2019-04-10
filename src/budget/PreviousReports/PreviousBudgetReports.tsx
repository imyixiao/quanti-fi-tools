import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { PreviousBudgetReportsInterface, BudgetReportInterface } from '../types';
import PreviousBudgetReportCard from './PreviousBudgetReportCard';
import { List, Empty } from 'antd';
import { fetchBudgetReports } from 'redux/actions/budget';

interface Props extends StoreState, Dispatch {}

class BudgetPreviousReports extends Component<Props> {
    componentDidMount() {
        if (this.props.firebaseAuthLoaded && !this.props.firebaseAuthEmpty) this.props.fetchBudgetReports();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            (!prevProps.firebaseAuthLoaded && this.props.firebaseAuthLoaded && !this.props.firebaseAuthEmpty) ||
            (prevProps.firebaseAuthEmpty && !this.props.firebaseAuthEmpty)
        ) {
            this.props.fetchBudgetReports();
        }
    }

    render() {
        return (
            <div className="previous-reports">
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1> Previous Budget Reports </h1>
                </header>
                {this.props.firebaseAuthEmpty ? (
                    <Empty description="You need to log in first" />
                ) : (
                    <List
                        itemLayout="vertical"
                        split={false}
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={this.props.previousReports}
                        renderItem={(item: BudgetReportInterface) => (
                            <List.Item>
                                <PreviousBudgetReportCard reportInfo={item} />
                            </List.Item>
                        )}
                        loading={this.props.loading}
                    />
                )}
            </div>
        );
    }
}

interface Dispatch {
    fetchBudgetReports: any;
}

interface StoreState {
    firebaseAuthLoaded: boolean;
    firebaseAuthEmpty: boolean;
    previousReports: PreviousBudgetReportsInterface;
    loading: boolean;
}

const mapStateToProps = (state: AppState): StoreState => ({
    previousReports: state.budget.previousReports,
    loading: state.budget.previousReportsLoading,
    firebaseAuthEmpty: state.firebase.auth.isEmpty,
    firebaseAuthLoaded: state.firebase.auth.isLoaded,
});

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        fetchBudgetReports: () => {
            dispatch(fetchBudgetReports());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BudgetPreviousReports);
