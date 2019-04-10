import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'antd';
import { setRentalInfo } from 'redux/actions/rental';
import { getRentalInfo, getRentalStep } from 'redux/selectors';
import { RENTAL_LABELS } from 'consts/rental';
import { mapPropsToForm } from 'helpers';
import FormInputNumber from 'components/FormInputNumber';
import BasicRow from 'components/BasicRow';
import { FormComponentProps } from 'antd/lib/form/Form';
import { RentalInfoInterface, RentalStep } from '../../types';
import { AppState } from 'redux/store';
import { RENTAL_STEP_VALIDATION_SUCCESS, RENTAL_STEP_VALIDATION_FAILED } from 'redux/actions/rental';
import formWrapper, { WrappedFormProps } from 'components/FormWrapper';

const {
    MONTHLY_RENT,
    OTHER_MONTHLY_INCOME,
    ELECTRICITY,
    WATER_AND_SEWER,
    PMI,
    GARBAGE,
    HOA,
    MONTHLY_INSURANCE,
    OTHER_MONTHLY_EXPENSES,
    VACANCY,
    MAINTENANCE,
    CAPEX,
    MANAGEMENT_FEES,
    ANNUAL_INCOME_GROWTH,
    ANNUAL_PV_GROWTH,
    ANNUAL_EXPENSES_GROWTH,
    SALES_EXPENSES,
} = RENTAL_LABELS;

interface Props extends FormComponentProps, Dispatch, StoreState, WrappedFormProps {}

interface State {
    waitingForValidation: boolean;
}

class RentalInfoForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            waitingForValidation: false,
        };
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            // if (!err) {}
            this.props.submitRentalInfo(values);
        });
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.waitingForValidation && nextProps.step === 2) {
            return {
                ...prevState,
                waitingForValidation: true,
            };
        }
        return null;
    }

    componentDidUpdate() {
        if (this.state.waitingForValidation) {
            this.props.form.validateFieldsAndScroll(error => {
                if (error) {
                    this.props.dispatchValidationFailed();
                } else {
                    this.props.dispatchValidationSuccess();
                }
            });
            this.setState({
                waitingForValidation: false,
            });
        }
    }

    applyDefault = () => {
        const { setFieldsValue } = this.props.form;

        setFieldsValue({
            [WATER_AND_SEWER]: 75,
            [GARBAGE]: 20,
            [MONTHLY_INSURANCE]: 75,
            [VACANCY]: 5,
            [MAINTENANCE]: 5,
            [CAPEX]: 5,
            [MANAGEMENT_FEES]: 5,
            [ANNUAL_INCOME_GROWTH]: 2,
            [ANNUAL_PV_GROWTH]: 1,
            [ANNUAL_EXPENSES_GROWTH]: 1,
            [SALES_EXPENSES]: 8,
        });
    };

    reset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical" className="stepForm" onSubmit={this.handleSubmit}>
                {/* <Row justify='start' style={{ margin: '12px 0 12px 0' }}>
                    <Col lg={12} xs={24}>
                        <Button
                            type='primary'
                            style={{ float: 'left' }}
                            onClick={this.applyDefault}
                        >
                            Apply Default
                        </Button>
                        <Button
                            style={{ float: 'left', marginLeft: '24px' }}
                            onClick={this.reset}
                        >
                            Reset
                        </Button>
                    </Col>
                    <Col lg={12} xs={24}>
                    </Col>
                </Row> */}

                <Row>
                    <h2 style={{ float: 'left' }}>Income</h2>
                </Row>

                <Row>
                    <Col lg={12} xs={24}>
                        <Form.Item label={MONTHLY_RENT}>
                            {getFieldDecorator('monthlyRent', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} xs={24}>
                        <Form.Item label={OTHER_MONTHLY_INCOME}>
                            {getFieldDecorator('otherMonthlyIncome', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <h2 style={{ float: 'left' }}>Fixed Landlord-Paid Expenses</h2>
                </Row>

                <BasicRow>
                    <Col lg={8} xs={24}>
                        <Form.Item label={ELECTRICITY}>
                            {getFieldDecorator('electricity', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label={WATER_AND_SEWER}>
                            {getFieldDecorator('waterAndSewer', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label={GARBAGE}>
                            {getFieldDecorator('garbage', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label={HOA}>{getFieldDecorator('hoa', {})(<FormInputNumber dollar />)}</Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label={PMI}>{getFieldDecorator('pmi', {})(<FormInputNumber dollar />)}</Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label={MONTHLY_INSURANCE}>
                            {getFieldDecorator('monthlyInsurance', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Row>
                    <Col lg={12} xs={24}>
                        <Form.Item label={OTHER_MONTHLY_EXPENSES}>
                            {getFieldDecorator('other_monthlyExpenses', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <h2 style={{ float: 'left' }}>Variable Landlord-Paid Expenses</h2>
                </Row>

                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item label={VACANCY}>
                            {getFieldDecorator('vacancy', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label={MAINTENANCE}>
                            {getFieldDecorator('maintenance', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label={CAPEX}>
                            {getFieldDecorator('capex', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label={MANAGEMENT_FEES}>
                            {getFieldDecorator('managementFees', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Row>
                    <h2 style={{ float: 'left' }}>Future Assumptions</h2>
                </Row>

                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item label={ANNUAL_INCOME_GROWTH}>
                            {getFieldDecorator('annualIncomeGrowth', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label={ANNUAL_PV_GROWTH}>
                            {getFieldDecorator('annualPvGrowth', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label={ANNUAL_EXPENSES_GROWTH}>
                            {getFieldDecorator('annualExpensesGrowth', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label={SALES_EXPENSES}>
                            {getFieldDecorator('salesExpenses', {})(<FormInputNumber percentage />)}
                        </Form.Item>
                    </Col>
                </BasicRow>
            </Form>
        );
    }
}

interface StoreState {
    rentalInfo: RentalInfoInterface;
    waitingForValidation?: boolean;
    step: RentalStep;
}

const mapStateToProps = (state: AppState): StoreState => ({
    rentalInfo: getRentalInfo(state),
    waitingForValidation: state.rental.waitingForValidation,
    step: getRentalStep(state),
});

interface Dispatch {
    submitRentalInfo: any;
    dispatchValidationSuccess: any;
    dispatchValidationFailed: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        submitRentalInfo: (rentalInfo: RentalInfoInterface) => {
            dispatch(setRentalInfo(rentalInfo));
        },
        dispatchValidationSuccess: () => {
            dispatch({ type: RENTAL_STEP_VALIDATION_SUCCESS });
        },
        dispatchValidationFailed: () => {
            dispatch({ type: RENTAL_STEP_VALIDATION_FAILED });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    formWrapper(
        Form.create({
            onValuesChange(props: Props, changedValues) {
                props.submitRentalInfo(changedValues);
            },
            mapPropsToFields(props) {
                return mapPropsToForm(props.rentalInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(RentalInfoForm),
        props => props.rentalInfo,
    ),
);
