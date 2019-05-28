/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox, Row, Col } from 'antd';
import { setPurchaseInfo } from 'redux/actions/rental';
import { getPurchaseInfo, getRentalStep } from 'redux/selectors';
import { PROPERTY_INFO_LABELS, PURCHASE_LABELS } from 'consts/rental';
import { FormComponentProps } from 'antd/lib/form/Form';

import ClosingCostModal from './ClosingCostModal';
import RepairCostModal from './RepairCostModal';
import { mapPropsToForm } from 'helpers';
import { RENTAL_STEP_VALIDATION_SUCCESS, RENTAL_STEP_VALIDATION_FAILED } from 'redux/actions/rental';
import FormInputNumber from 'components/FormInputNumber';
import BasicRow from 'components/BasicRow';
import { PurchaseInfoInterface, RentalStep } from '../../types';
import { AppState } from 'redux/store';
import formWrapper, { WrappedFormProps } from 'components/FormWrapper';

const { LISTING_PRICE } = PROPERTY_INFO_LABELS;

const {
    PURCHASE_PRICE,
    AFTER_REPAIR_VALUE,
    CLOSING_COST,
    REPAIR_COST,
    DOWN_PAYMENT,
    LOAN_INTEREST_RATE,
    POINTS_CHARGED_BY_LENDER,
    OTHER_CHARGES_FROM_THE_LENDER,
    AMORTIZED_YEARS,
    TYPICAL_CAP_RATE,
} = PURCHASE_LABELS;

interface Props extends FormComponentProps, Dispatch, StoreState, WrappedFormProps {}

interface State {
    closingCostModalVisible: boolean;
    repairCostModalVisible: boolean;
    waitingForValidation: boolean;
}

class PurchaseInfoForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            closingCostModalVisible: false,
            repairCostModalVisible: false,
            waitingForValidation: false,
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.waitingForValidation && nextProps.step === 1) {
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

    showClosingCostModal = e => {
        e.preventDefault();
        this.setState({
            closingCostModalVisible: true,
        });
    };

    showRepairCostModal = e => {
        e.preventDefault();
        this.setState({
            repairCostModalVisible: true,
        });
    };

    toggleClosingCostModal = (visible: boolean) => {
        this.setState({
            closingCostModalVisible: visible,
        });
    };

    toggleRepairCostModal = (visible: boolean) => {
        this.setState({
            repairCostModalVisible: visible,
        });
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            // if (!err) {}
            this.props.submitPurchaseInfo(values);
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
                        <Form.Item label={LISTING_PRICE}>
                            {getFieldDecorator('listingPrice')(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label={PURCHASE_PRICE}>
                            {getFieldDecorator('purchasePrice', {
                                rules: [{ required: true }],
                            })(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Row>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={CLOSING_COST}
                            extra={
                                <p className="closing-cost-extra">
                                    Enter the total value or provide a{' '}
                                    <a onClick={this.showClosingCostModal}>cost breakdown</a>.
                                </p>
                            }
                        >
                            {getFieldDecorator('closingCost', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                        <ClosingCostModal
                            visible={this.state.closingCostModalVisible}
                            toggleModal={this.toggleClosingCostModal}
                        />
                    </Col>
                </Row>

                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item label={AFTER_REPAIR_VALUE}>
                            {getFieldDecorator('afterRepairValue', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={REPAIR_COST}
                            extra={
                                <p className="closing-cost-extra">
                                    Enter the total value or provide a{' '}
                                    <a onClick={this.showRepairCostModal}>cost breakdown</a>.
                                </p>
                            }
                        >
                            {getFieldDecorator('repairCost', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                        <RepairCostModal
                            visible={this.state.repairCostModalVisible}
                            toggleModal={this.toggleRepairCostModal}
                        />
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
                                    {getFieldDecorator('downPayment', {
                                        rules: [{ required: true }],
                                    })(<FormInputNumber percentage />)}
                                </Form.Item>
                            </Col>
                            <Col lg={12} xs={24}>
                                <Form.Item label={LOAN_INTEREST_RATE}>
                                    {getFieldDecorator('loanInterestRate', {
                                        rules: [{ required: true }],
                                    })(<FormInputNumber percentage />)}
                                </Form.Item>
                            </Col>
                        </BasicRow>

                        <Row>
                            <Col span={24}>
                                <Form.Item label={POINTS_CHARGED_BY_LENDER}>
                                    {getFieldDecorator('pointsChargedByLender')(<FormInputNumber />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
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
                            <h4 style={{ float: 'left' }}>Interest Only?</h4>
                            <Form.Item>
                                {getFieldDecorator('isInterestOnly', {
                                    valuePropName: 'checked',
                                })(<Checkbox disabled style={{ float: 'left', marginLeft: '10px' }} />)}
                            </Form.Item>
                        </Row>

                        <Form.Item label={AMORTIZED_YEARS}>
                            {getFieldDecorator('amortizedYears', {
                                rules: [{ required: true }],
                            })(<FormInputNumber />)}
                        </Form.Item>

                        <Form.Item label={TYPICAL_CAP_RATE}>
                            {getFieldDecorator('typicalCapRate')(<FormInputNumber percentage />)}
                        </Form.Item>
                    </>
                )}
            </Form>
        );
    }
}

interface StoreState {
    purchaseInfo?: PurchaseInfoInterface;
    waitingForValidation?: boolean;
    step: RentalStep;
}

const mapStateToProps = (state: AppState) => ({
    purchaseInfo: getPurchaseInfo(state),
    waitingForValidation: state.rental.waitingForValidation,
    step: getRentalStep(state),
});

interface Dispatch {
    submitPurchaseInfo: any;
    dispatchValidationSuccess: any;
    dispatchValidationFailed: any;
}

const mapDispatchToProps = dispatch => {
    return {
        submitPurchaseInfo: (purchaseInfo: PurchaseInfoInterface) => {
            dispatch(setPurchaseInfo(purchaseInfo));
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
                props.submitPurchaseInfo(changedValues);
            },
            mapPropsToFields(props: Props) {
                return mapPropsToForm(props.purchaseInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(PurchaseInfoForm),
        props => props.purchaseInfo,
    ),
);
