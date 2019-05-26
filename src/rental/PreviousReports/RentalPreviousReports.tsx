import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { RentalReportInterface } from 'redux/reducers/rental/types';
import PreviousRentalReportCard from './PreviousRentalReportCard';
import { List, Empty } from 'antd';
import { fetchRentalReports } from 'redux/actions/rental';

interface Props extends StoreState, Dispatch {}

class RentalPreviousReports extends Component<Props> {
    componentDidMount() {
        if (this.props.firebaseAuthLoaded && !this.props.firebaseAuthEmpty) this.props.fetchRentalReports();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            (!prevProps.firebaseAuthLoaded && this.props.firebaseAuthLoaded && !this.props.firebaseAuthEmpty) ||
            (prevProps.firebaseAuthEmpty && !this.props.firebaseAuthEmpty)
        ) {
            this.props.fetchRentalReports();
        }
    }

    render() {
        return (
            <div className="previous-reports">
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1> Previous Rental Reports </h1>
                </header>
                {this.props.firebaseAuthEmpty ? (
                    <Empty description="You need to log in first" />
                ) : (
                    <List
                        itemLayout="vertical"
                        split={false}
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={this.props.previousRentalReportList}
                        renderItem={(item: RentalReportInterface) => (
                            <List.Item>
                                <PreviousRentalReportCard reportInfo={item} />
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
    fetchRentalReports: any;
}

interface StoreState {
    firebaseAuthLoaded: boolean;
    firebaseAuthEmpty: boolean;
    previousRentalReportList: RentalReportInterface[];
    loading: boolean;
}

const mapStateToProps = (state: AppState): StoreState => ({
    previousRentalReportList: state.rental.rentalPreviousReportList,
    loading: state.rental.rentalPreviousReportListLoading,
    firebaseAuthLoaded: state.firebase.auth.isLoaded,
    firebaseAuthEmpty: state.firebase.auth.isEmpty,
});

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        fetchRentalReports: () => {
            dispatch(fetchRentalReports());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RentalPreviousReports);
