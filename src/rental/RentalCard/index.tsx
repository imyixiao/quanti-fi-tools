import React, { Component } from 'react';
import { Steps, Card } from 'antd';
import SplitPane from 'react-split-pane';

import { connect } from 'react-redux';
import PropertyInfoForm from './PropertyInfoForm';
import PurchaseInfoForm from './PurchaseInfoForm';
import RentalInfoForm from './RentalInfoForm';
import { getRentalStep } from 'redux/selectors';
import Report from '../Report/Report';
import { RentalStep } from '../types';
import NavigationButtons from './NavigationButtons';
import ReportButtons from '../Report/ReportButtons';
import { AppState } from 'redux/store';
import { withRouter, RouteComponentProps } from 'react-router';
import { populateRentalCardAction } from 'redux/actions/rental';

const Step = Steps.Step;

interface RouteMatchParams {
    id?: string;
}
interface Props extends RouteComponentProps<RouteMatchParams> {
    step: RentalStep;
    currentReportId?: string;
    populateRentalCard: any;
    firebaseAuthLoaded: boolean;
}

class RentalCard extends Component<Props> {
    componentDidMount() {
        const urlID = this.props.match.params.id;
        if (this.props.currentReportId !== urlID && this.props.firebaseAuthLoaded) {
            this.props.populateRentalCard(urlID);
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!prevProps.firebaseAuthLoaded && this.props.firebaseAuthLoaded) {
            const urlID = this.props.match.params.id;
            this.props.populateRentalCard(urlID);
        }
    }

    render() {
        if (window.innerWidth >= 480) {
            const current = this.props.step >= 3 ? 2 : this.props.step;
            const steps = [
                {
                    title: 'Property Info',
                    content: <PropertyInfoForm />,
                },
                {
                    title: 'Purchase Info',
                    content: <PurchaseInfoForm />,
                },
                {
                    title: 'Rental Info',
                    content: <RentalInfoForm />,
                },
            ];

            return (
                <div>
                    <header style={{ height: '20vh', textAlign: 'center' }}>
                        <h1 style={{ paddingTop: '4vh' }}> Rental Property Analysis </h1>
                        <Steps
                            current={current}
                            style={{ textAlign: 'left', paddingTop: '3vh', paddingLeft: '25vw', paddingRight: '25vw' }}
                        >
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </header>
                    <SplitPane
                        split="vertical"
                        minSize={600}
                        defaultSize={750}
                        maxSize={window.innerWidth - 600}
                        style={{ margin: '0 40px' }}
                    >
                        <Card bordered={false} className="split-card">
                            <div className="steps-content">{steps[current].content}</div>
                            <NavigationButtons />
                        </Card>

                        <Card bordered={false} className="split-card">
                            <Report />
                            <ReportButtons />
                        </Card>
                    </SplitPane>
                </div>
            );
        } else {
            const current = this.props.step;
            const steps = [
                {
                    title: 'Property Info',
                    content: <PropertyInfoForm />,
                },
                {
                    title: 'Purchase Info',
                    content: <PurchaseInfoForm />,
                },
                {
                    title: 'Rental Info',
                    content: <RentalInfoForm />,
                },
                {
                    title: 'Report',
                    content: (
                        <>
                            <Report />
                            <ReportButtons />
                        </>
                    ),
                },
            ];

            return (
                <div>
                    <header style={{ textAlign: 'center' }}>
                        <h1 style={{ paddingTop: '4vh' }}> Rental Property Analysis </h1>
                        <Steps
                            current={current}
                            style={{ textAlign: 'left', paddingTop: '2px', paddingLeft: '10px', paddingRight: '10px' }}
                        >
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </header>

                    <Card bordered={false} className="split-card-mobile">
                        <div className="steps-content-mobile">{steps[current].content}</div>
                        <NavigationButtons />
                    </Card>
                </div>
            );
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    step: getRentalStep(state),
    currentReportId: state.rental.currentReportId,
    firebaseAuthLoaded: state.firebase.auth.isLoaded,
});

interface Dispatch {
    populateRentalCard: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        populateRentalCard: (reportId: string) => {
            dispatch(populateRentalCardAction(reportId));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(RentalCard));
