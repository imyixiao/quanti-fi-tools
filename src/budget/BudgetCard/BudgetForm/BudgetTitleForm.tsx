import React from 'react';
import { Row, Col, Form, Input } from 'antd';
import { getBudgetTitle } from 'redux/selectors';
import { AppState } from 'redux/store';
import { connect } from 'react-redux';
import formWrapper from 'components/FormWrapper';
import { setBudgetTitle } from 'redux/actions/budget';

const BudgetTitleForm = props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form layout="vertical">
            <Row>
                <Col lg={12} xs={24}>
                    <Form.Item label="Title">
                        {getFieldDecorator('reportTitle', { rules: [{ required: true }] })(<Input />)}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

interface StoreState {
    reportTitle?: string;
}

const mapStateToProps = (state: AppState): StoreState => ({
    reportTitle: getBudgetTitle(state),
});

interface Dispatch {
    setBudgetTitle: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        setBudgetTitle: (title: string) => {
            dispatch(setBudgetTitle(title));
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
                props.setBudgetTitle(changedValues.reportTitle);
            },
            mapPropsToFields(props) {
                const fields = {};
                fields['reportTitle'] = Form.createFormField({ value: props.reportTitle });
                return fields;
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(BudgetTitleForm),
        props => props.reportTitle,
    ),
);
