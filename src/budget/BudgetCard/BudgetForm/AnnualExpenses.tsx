import React, { Component } from 'react';
import { Row, Col, Form, Input, InputNumber, Icon, Button } from 'antd';
import _ from 'lodash';
import { getAnnualExpensesInfo, getTotalExpenses } from 'redux/selectors';
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

interface AnnualExpensesFormProps extends WrappedAnnualExpensesFormProps, FormComponentProps {}

class AnnualExpenses extends Component<AnnualExpensesFormProps> {
    onClickAdd = () => {
        this.props.form.validateFieldsAndScroll(error => {
            if (!error) {
                this.props.add();
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const annualExpenseFormItems = _.range(this.props.expensesLength).map(id => (
            <Form.Item key={id}>
                <Row type="flex" justify="space-between">
                    <Col lg={12} sm={16} xs={20}>
                        <InputGroup compact style={{ float: 'left' }}>
                            {getFieldDecorator(`keys_${id}`, {
                                rules: [{ required: true, message: 'Please enter expense description' }],
                            })(
                                <Input
                                    className="expense-input-group-left"
                                    placeholder="Please enter expense description"
                                />,
                            )}

                            {getFieldDecorator(`values_${id}`, {
                                rules: [{ required: true, message: 'Please enter expense amount' }],
                            })(
                                <InputNumber
                                    className="expense-input-group-right"
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />,
                            )}
                        </InputGroup>
                    </Col>
                    <Col span={4}>
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            style={{ float: 'right', marginTop: '8px' }}
                            onClick={() => this.props.remove(id)}
                        />
                    </Col>
                </Row>
            </Form.Item>
        ));

        return (
            <Form layout="vertical">
                <Row>
                    <h2 style={{ float: 'left' }}>Annual Expenses</h2>
                </Row>

                {annualExpenseFormItems}

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
                        <Form.Item label="Total Annual Expenses">
                            {getFieldDecorator('totalAnnualExpenses', {})(
                                <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="Total Expenses">
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

interface WrappedAnnualExpensesFormProps {
    expenses: any;
    remove: any;
    add: any;
    expensesLength: number;
    handleFormChange: any;
}

interface StoreState extends ExpensesStoreState {
    totalExpenses: number;
}

const mapStateToProps = (state: AppState): StoreState => ({
    expensesInfo: getAnnualExpensesInfo(state),
    totalExpenses: getTotalExpenses(state),
});

const mapDispatchToProps = (dispatch): ExpensesDispatch => {
    return {
        setExpenses: annnualExpenses => {
            dispatch(actions.setAnnualExpenses(annnualExpenses));
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
                fields['totalAnnualExpenses'] = Form.createFormField({ value: props.expensesInfo.totalExpenses });
                fields['totalExpenses'] = Form.createFormField({ value: props.totalExpenses });
                return fields;
            },
            // onFieldsChange(props, changedFields) {
            //     props.handleFormChange(changedFields);
            // },
        })(AnnualExpenses),
    ),
);
