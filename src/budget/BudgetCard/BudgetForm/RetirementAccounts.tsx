import React, { Component } from 'react';
import { Row, Col, Form, InputNumber, Button } from 'antd';
import FormInputNumber from 'components/FormInputNumber';
import { RetirementAccountsInfoInterface } from '../../types';
import { getRetirementAccountsInfo, getCompensation, getTotalRetirementAccountsSavings } from 'redux/selectors';
import { AppState } from 'redux/store';
import * as actions from 'redux/actions/budget';
import formWrapper from 'components/FormWrapper';
import { mapPropsToForm, round } from 'helpers';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form';
import { max401K, budgetDisabledStyle } from 'consts/budget';

interface Props extends StoreState, FormComponentProps {}

export class RetirementAccounts extends Component<Props> {
    onClickMaxOut = () => {
        this.props.form.setFieldsValue({ employee401K: max401K });
    };

    onClickCompanyMatch = () => {
        const companyMatchOfCompensation = round(this.props.form.getFieldValue('companyMatchOfCompensation'));
        const compensation = this.props.compensation;
        const employee401K = Math.min(round((compensation * companyMatchOfCompensation) / 100), max401K);
        this.props.form.setFieldsValue({ employee401K });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical">
                <Row>
                    <h2 style={{ float: 'left' }}>Retirement Accounts</h2>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item style={{ textAlign: 'left', marginBottom: '12px' }}>
                            My company will match{' '}
                            {getFieldDecorator('companyMatchPercentage', {})(
                                <InputNumber
                                    formatter={value => `${value}%`}
                                    parser={(value: any) => value.replace('%', '')}
                                />,
                            )}{' '}
                            on the first{' '}
                            {getFieldDecorator('companyMatchOfCompensation', {})(
                                <InputNumber
                                    formatter={value => `${value}%`}
                                    parser={(value: any) => value.replace('%', '')}
                                />,
                            )}{' '}
                            of my eligibile compensation.
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="401K">
                            <div style={{ float: 'left', marginTop: '4px', marginRight: '6px' }}>
                                <Button onClick={this.onClickMaxOut}>Max out</Button> or{' '}
                                <Button onClick={this.onClickCompanyMatch}>Up to company match</Button> or
                            </div>
                            {getFieldDecorator('employee401K', {})(<FormInputNumber max={max401K} dollar />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Roth IRA">
                            {getFieldDecorator('roth', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label="Other After-Tax IRAs">
                            {getFieldDecorator('otherIRA', {})(<FormInputNumber dollar />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} sm={24}>
                        <Form.Item label="Total Retirement Accounts Savings">
                            {getFieldDecorator('totalRetirementAccountsSavings', {})(
                                <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
interface StoreState {
    retirementAccountsInfo: RetirementAccountsInfoInterface & { totalRetirementAccountsSavings: number };
    compensation: number;
}

const mapStateToProps = (state: AppState): StoreState => ({
    retirementAccountsInfo: {
        ...getRetirementAccountsInfo(state),
        totalRetirementAccountsSavings: getTotalRetirementAccountsSavings(state),
    },
    compensation: getCompensation(state),
});

interface Dispatch {
    setRetirementAccountsInfo: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        setRetirementAccountsInfo: (retirementAccountsInfo: RetirementAccountsInfoInterface) => {
            dispatch(actions.setRetirementAccountsInfo(retirementAccountsInfo));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    formWrapper(
        Form.create({
            onValuesChange(props: any, changedValues) {
                props.setRetirementAccountsInfo(changedValues);
            },
            mapPropsToFields(props) {
                return mapPropsToForm(props.retirementAccountsInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(RetirementAccounts),
        props => props.retirementAccountsInfo,
    ),
);
