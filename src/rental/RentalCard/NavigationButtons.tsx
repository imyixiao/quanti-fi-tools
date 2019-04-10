import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row } from 'antd';
import { rentalPreviousStep, rentalNextStep } from 'redux/actions/rental';
import { getRentalStep } from 'redux/selectors';
import { RentalStep } from '../types';
import { AppState } from 'redux/store';

interface Props {
    previousStep: any;
    nextStep: any;
    step: RentalStep;
}

interface State {
    showOtherPropertyFeatures: boolean;
}

class NavigationButtons extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showOtherPropertyFeatures: false,
        };
    }

    prev = () => {
        this.props.previousStep();
    };

    next = () => {
        this.props.nextStep();
    };

    render() {
        const current = this.props.step;
        const maxStep = window.innerWidth < 480 ? 3 : 2;

        return (
            <Row style={{ marginTop: '12px' }} type="flex" justify="end">
                {current > 0 && (
                    <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                        Previous
                    </Button>
                )}
                {current < maxStep && (
                    <Button type="primary" onClick={() => this.next()}>
                        Next
                    </Button>
                )}
            </Row>
        );
    }
}

const mapStateToProps = (state: AppState) => ({ step: getRentalStep(state) });

const mapDispatchToProps = dispatch => {
    return {
        previousStep: () => {
            const mobile = window.innerWidth < 480;
            dispatch(rentalPreviousStep(mobile));
        },
        nextStep: () => {
            const mobile = window.innerWidth < 480;
            dispatch(rentalNextStep(mobile));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavigationButtons);
