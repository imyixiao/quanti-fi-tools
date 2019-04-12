import React from 'react';
import { Row, Col, Form } from 'antd';
import FormInputNumber from 'components/FormInputNumber';
import { round, mapPropsToForm } from 'helpers';
import { ResultsInterface } from '../../types';
import { getBudgetResults } from 'redux/selectors';
import { AppState } from 'redux/store';
import { connect } from 'react-redux';
import formWrapper from 'components/FormWrapper';
import { budgetDisabledStyle } from 'consts/budget';

export const Results = props => {
    const { getFieldDecorator, getFieldValue } = props.form;
    return (
        <Form layout="vertical">
            <Row>
                <h2 style={{ float: 'left' }}>What's Left</h2>
            </Row>
            <Row>
                <Col lg={12} sm={24}>
                    <Form.Item label="Total Net Savings (excluding retirement accounts)">
                        {getFieldDecorator('totalNetSavings', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} sm={24}>
                    <Form.Item label="Per Month">
                        <FormInputNumber
                            dollar
                            disabled
                            style={budgetDisabledStyle}
                            value={round(getFieldValue('totalNetSavings') / 12)}
                        />
                    </Form.Item>
                </Col>
                <Col lg={6} sm={24}>
                    <Form.Item label="Net Savings Rate">
                        {getFieldDecorator('totalNetSavingsRate', {})(
                            <FormInputNumber percentage disabled style={budgetDisabledStyle} />,
                        )}
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
            <Row>
                <Col lg={12} xs={24}>
                    <Form.Item label="Total Savings">
                        {getFieldDecorator('totalSavings', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                    <Form.Item label="Per Month">
                        <FormInputNumber
                            dollar
                            disabled
                            style={budgetDisabledStyle}
                            value={round(getFieldValue('totalSavings') / 12)}
                        />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                    <Form.Item label="Savings Rate">
                        {getFieldDecorator('totalSavingsRate', {})(
                            <FormInputNumber percentage disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

interface StoreState {
    results: ResultsInterface;
}

const mapStateToProps = (state: AppState): StoreState => ({
    results: getBudgetResults(state),
});

export default connect(mapStateToProps)(
    formWrapper(
        Form.create({
            onValuesChange(props: any, changedValues) {
                props.setIncomeInfo(changedValues);
            },
            mapPropsToFields(props) {
                return mapPropsToForm(props.results);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(Results),
        props => props.results,
    ),
);
