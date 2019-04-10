import React from 'react';
import { Row, Col, Form } from 'antd';
import FormInputNumber from 'components/FormInputNumber';
import { RetirementAccountsInfoInterface } from '../../types';
import { getRetirementAccountsInfo } from 'redux/selectors';
import { AppState } from 'redux/store';
import * as actions from 'redux/actions/budget';
import formWrapper from 'components/FormWrapper';
import { mapPropsToForm } from 'helpers';
import { connect } from 'react-redux';

export const RetirementAccounts = props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form layout="vertical">
            <Row>
                <h2 style={{ float: 'left' }}>Retirement Accounts</h2>
            </Row>

            <Row>
                <Col lg={8} xs={24}>
                    <Form.Item label="401K">
                        {getFieldDecorator('employee401K', {})(<FormInputNumber dollar />)}
                    </Form.Item>
                </Col>

                <Col lg={8} xs={24}>
                    <Form.Item label="Roth IRA">{getFieldDecorator('roth', {})(<FormInputNumber dollar />)}</Form.Item>
                </Col>

                <Col lg={8} xs={24}>
                    <Form.Item label="Other After-Tax IRAs">
                        {getFieldDecorator('otherIRA', {})(<FormInputNumber dollar />)}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
interface StoreState {
    retirementAccountsInfo: RetirementAccountsInfoInterface;
}

const mapStateToProps = (state: AppState): StoreState => ({
    retirementAccountsInfo: getRetirementAccountsInfo(state),
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
