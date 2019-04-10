import React, { Component } from 'react';
import { Row, Col, Form, Input, InputNumber, Icon, Button } from 'antd';
import _ from 'lodash';
import { getMonthlyExpensesInfo } from 'redux/selectors';
import { AppState } from 'redux/store';
import * as actions from 'redux/actions/budget';
import { mapPropsToForm, transformFormFieldsToExpenses, transformExpensesToFormFields } from 'helpers';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form';
import { expensesFormWrapper, ExpensesStoreState, ExpensesDispatch } from './ExpensesFormWrapper';
import FormInputNumber from 'components/FormInputNumber';

const InputGroup = Input.Group;

const budgetDisabledStyle = {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.65)',
    border: 'none',
    cursor: 'default',
};

interface MonthlyExpensesFormProps extends WrappedMonthlyExpensesFormProps, FormComponentProps {}

class MonthlyExpenses extends Component<MonthlyExpensesFormProps> {
    onClickAdd = () => {
        this.props.form.validateFieldsAndScroll(error => {
            if (!error) {
                this.props.add();
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const expenseFormItems = _.range(this.props.expensesLength).map(id => (
            <Form.Item key={id}>
                <Row>
                    <Col lg={12} sm={24}>
                        <InputGroup compact style={{ float: 'left' }}>
                            {getFieldDecorator(`keys_${id}`, {
                                rules: [{ required: true, message: 'Please enter expense description' }],
                            })(
                                <Input
                                    style={{ width: '70%', float: 'left', textAlign: 'left' }}
                                    placeholder="Please enter expense description"
                                />,
                            )}

                            {getFieldDecorator(`values_${id}`, {
                                rules: [{ required: true, message: 'Please enter expense amount' }],
                            })(
                                <InputNumber
                                    style={{ width: '30%', float: 'left', textAlign: 'left' }}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />,
                            )}
                        </InputGroup>
                    </Col>
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.props.remove(id)}
                    />
                </Row>
            </Form.Item>
        ));

        return (
            <Form layout="vertical">
                <Row>
                    <h2 style={{ float: 'left' }}>Monthly Expenses</h2>
                </Row>

                {expenseFormItems}

                <Row>
                    <Col
                        lg={{
                            span: 12,
                            offset: 3,
                        }}
                        sm={24}
                    >
                        <Form.Item>
                            <Button type="dashed" onClick={this.onClickAdd}>
                                <Icon type="plus" /> Add Expense Item
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="Total Monthly Expenses">
                            {getFieldDecorator('totalExpenses', {})(
                                <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

interface WrappedMonthlyExpensesFormProps {
    expenses: any;
    remove: any;
    add: any;
    expensesLength: number;
    handleFormChange: any;
}

const mapStateToProps = (state: AppState): ExpensesStoreState => ({
    expensesInfo: getMonthlyExpensesInfo(state),
});

const mapDispatchToProps = (dispatch): ExpensesDispatch => {
    return {
        setExpenses: annnualExpenses => {
            dispatch(actions.setMonthlyExpenses(annnualExpenses));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    expensesFormWrapper(
        Form.create({
            onValuesChange(props: any, changedValues) {
                props.setExpenses(transformFormFieldsToExpenses(props.expensesInfo.expenses, changedValues));
            },
            mapPropsToFields(props) {
                const fields = mapPropsToForm(transformExpensesToFormFields(props.expensesInfo.expenses));
                fields['totalExpenses'] = Form.createFormField({ value: props.expensesInfo.totalExpenses });
                return fields;
            },
            // onFieldsChange(props, changedFields) {
            //     props.handleFormChange(changedFields);
            // },
        })(MonthlyExpenses),
    ),
);
