import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox, Row, Col, Button } from 'antd';
import { setDefaultStrategy } from 'redux/actions/rental';
import { getDefaultStrategy } from 'redux/selectors';
import { PURCHASE_LABELS, RENTAL_LABELS } from 'consts/rental';

import { FormComponentProps } from 'antd/lib/form/Form';

import { mapFieldsToFormFields } from 'helpers';
import { RENTAL_STEP_VALIDATION_SUCCESS, RENTAL_STEP_VALIDATION_FAILED } from 'redux/actions/rental';
import FormInputNumber from 'components/FormInputNumber';
import BasicRow from 'components/BasicRow';
import { DefaultStrategyInterface } from './types';
import { AppState } from 'redux/store';
import formWrapper, { WrappedFormProps } from 'components/FormWrapper';

const {
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

const {
    CLOSING_COST,
    REPAIR_COST,
    DOWN_PAYMENT,
    LOAN_INTEREST_RATE,
    POINTS_CHARGED_BY_LENDER,
    OTHER_CHARGES_FROM_THE_LENDER,
    AMORTIZED_YEARS,
} = PURCHASE_LABELS;

interface Props extends FormComponentProps, Dispatch, StoreState, WrappedFormProps {
    onSave: any;
}

interface State {
    closingCostModalVisible: boolean;
    repairCostModalVisible: boolean;
}

class DefaultStrategyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            closingCostModalVisible: false,
            repairCostModalVisible: false,
        };
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.submitDefaultStrategy(values);
                this.props.onSave();
            }
        });
    };

    reset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        return (
            <Form layout="vertical" className="stepForm" onSubmit={this.handleSubmit}>
                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item label={CLOSING_COST}>
                            {getFieldDecorator('closingCost', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label={REPAIR_COST}>
                            {getFieldDecorator('repairCost', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Row>
                    <h2 style={{ float: 'left' }}>Loan Details</h2>
                </Row>

                <Row style={{ marginTop: '12px' }}>
                    <h4 style={{ float: 'left' }}>Cash Purchase?</h4>
                    <Form.Item>
                        {getFieldDecorator('isCashPurchase', {
                            valuePropName: 'checked',
                        })(<Checkbox style={{ float: 'left', marginLeft: '10px' }} />)}
                    </Form.Item>
                </Row>

                {!getFieldValue('isCashPurchase') && (
                    <>
                        <BasicRow>
                            <Col lg={12} xs={24}>
                                <Form.Item label={DOWN_PAYMENT}>
                                    {getFieldDecorator('downPayment', {})(<FormInputNumber percentage />)}
                                </Form.Item>
                            </Col>
                            <Col lg={12} xs={24}>
                                <Form.Item label={LOAN_INTEREST_RATE}>
                                    {getFieldDecorator('loanInterestRate', {})(<FormInputNumber percentage />)}
                                </Form.Item>
                            </Col>
                        </BasicRow>

                        <Row>
                            <Col lg={12} xs={24}>
                                <Form.Item label={POINTS_CHARGED_BY_LENDER}>
                                    {getFieldDecorator('pointsChargedByLender')(<FormInputNumber />)}
                                </Form.Item>
                            </Col>

                            <Col lg={12} xs={24}>
                                <Form.Item label={OTHER_CHARGES_FROM_THE_LENDER}>
                                    {getFieldDecorator('otherChargesFromLender')(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '12px' }}>
                            <h4 style={{ float: 'left' }}>Are loan fees & points wrapped into the loan?</h4>
                            <Form.Item>
                                {getFieldDecorator('wrapLoanFeesIntoLoan', {
                                    valuePropName: 'checked',
                                })(<Checkbox style={{ float: 'left', marginLeft: '10px' }} />)}
                            </Form.Item>
                        </Row>

                        <Row>
                            <Form.Item label={AMORTIZED_YEARS}>
                                {getFieldDecorator('amortizedYears', {})(<FormInputNumber />)}
                            </Form.Item>
                        </Row>

                        <Row>
                            <h2 style={{ float: 'left' }}>Fixed Landlord-Paid Expenses</h2>
                        </Row>

                        <BasicRow>
                            <Col lg={12} xs={24}>
                                <Form.Item label={ELECTRICITY}>
                                    {getFieldDecorator('electricity', {})(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>

                            <Col lg={12} xs={24}>
                                <Form.Item label={WATER_AND_SEWER}>
                                    {getFieldDecorator('waterAndSewer', {})(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>

                            <Col lg={12} xs={24}>
                                <Form.Item label={GARBAGE}>
                                    {getFieldDecorator('garbage', {})(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>

                            <Col lg={12} xs={24}>
                                <Form.Item label={HOA}>
                                    {getFieldDecorator('hoa', {})(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>
                            <Col lg={12} xs={24}>
                                <Form.Item label={PMI}>
                                    {getFieldDecorator('pmi', {})(<FormInputNumber dollar />)}
                                </Form.Item>
                            </Col>

                            <Col lg={12} xs={24}>
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
                    </>
                )}
                <BasicRow>
                    <Button type="primary" onClick={this.handleSubmit}>
                        Save
                    </Button>
                </BasicRow>
            </Form>
        );
    }
}

interface StoreState {
    defaultStrategy?: DefaultStrategyInterface;
}

const mapStateToProps = (state: AppState) => ({
    defaultStrategy: getDefaultStrategy(state),
});

interface Dispatch {
    submitDefaultStrategy: any;
    dispatchValidationSuccess: any;
    dispatchValidationFailed: any;
}

const mapDispatchToProps = dispatch => {
    return {
        submitDefaultStrategy: (purchaseInfo: DefaultStrategyInterface) => {
            dispatch(setDefaultStrategy(purchaseInfo));
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
                // props.submitDefaultStrategy(changedValues);
            },
            mapPropsToFields(props: Props) {
                return mapFieldsToFormFields(props.fields);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(DefaultStrategyForm),
        props => props.defaultStrategy,
    ),
);
