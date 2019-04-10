import React from 'react';
import { Row, Col, Form } from 'antd';
import FormInputNumber from 'components/FormInputNumber';
import { round, mapPropsToForm } from 'helpers';
import { IncomeInfoInterface } from '../../types';
import { getIncomeInfo } from 'redux/selectors';
import { AppState } from 'redux/store';
import { connect } from 'react-redux';
import formWrapper from 'components/FormWrapper';
import { setIncomeInfo } from 'redux/actions/budget';

const Income = props => {
    const { getFieldDecorator, getFieldValue } = props.form;
    return (
        <Form layout="vertical">
            <Row>
                <h2 style={{ float: 'left' }}>Income</h2>
            </Row>

            <Row>
                <Col lg={12} xs={24}>
                    <Form.Item label="Gross Salary">
                        {getFieldDecorator('salary', {})(<FormInputNumber dollar />)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col lg={8} xs={24}>
                    <Form.Item label="Bonus (%)">
                        {getFieldDecorator('bonusPercentage', {})(
                            <FormInputNumber
                                percentage
                                onChange={value => {
                                    const form = props.form;
                                    form.setFieldsValue({
                                        bonus: round(getFieldValue('salary') * value) / 100,
                                    });
                                }}
                            />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                    <Form.Item label="Bonus ($)">
                        {getFieldDecorator('bonus', {})(
                            <FormInputNumber
                                dollar
                                onChange={value => {
                                    const form = props.form;
                                    const salary = getFieldValue('salary');
                                    form.setFieldsValue({
                                        bonusPercentage: salary ? round((value / salary) * 100) : 0,
                                    });
                                }}
                            />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                    <Form.Item label="Extra Bonus ($)">
                        {getFieldDecorator('extraBonus', {})(<FormInputNumber dollar />)}
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col lg={12} xs={24}>
                    <Form.Item label="Vested RSU">{getFieldDecorator('rsu', {})(<FormInputNumber dollar />)}</Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

interface StoreState {
    incomeInfo: IncomeInfoInterface;
}

const mapStateToProps = (state: AppState): StoreState => ({
    incomeInfo: getIncomeInfo(state),
});

interface Dispatch {
    setIncomeInfo: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        setIncomeInfo: (incomeInfo: IncomeInfoInterface) => {
            dispatch(setIncomeInfo(incomeInfo));
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
                props.setIncomeInfo(changedValues);
            },
            mapPropsToFields(props) {
                return mapPropsToForm(props.incomeInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(Income),
        props => props.incomeInfo,
    ),
);
