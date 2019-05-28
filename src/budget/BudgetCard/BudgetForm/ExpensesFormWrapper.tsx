import React, { Component } from 'react';
import { ExpensesInfoInterface } from '../../types';

export interface ExpensesStoreState {
    expensesInfo: ExpensesInfoInterface;
}

export interface ExpensesDispatch {
    setExpenses: any;
}

interface Props extends ExpensesStoreState, ExpensesDispatch {}

export function expensesFormWrapper(Form) {
    return class ExpensesFormWrapper extends Component<Props> {
        // static getDerivedStateFromProps(nextProps, prevState) {
        //     return {
        //         expensesForForm: transformAnnualExpenses(nextProps.expensesInfo.expenses),
        //         expensesLength: nextProps.expensesInfo.expenses.length,
        //     };
        // }

        // handleFormChange = changedFields => {
        //     this.setState(({ expensesForForm }) => ({
        //         expensesForForm: { ...expensesForForm, ...changedFields },
        //     }));
        // };

        add = () => {
            const expenses = this.props.expensesInfo.expenses;
            const newExpenses = [...expenses, {}];
            this.props.setExpenses(newExpenses);
        };

        remove = key => {
            const expenses = this.props.expensesInfo.expenses;
            const newExpenses = [...expenses.slice(0, key), ...expenses.slice(key + 1)];
            this.props.setExpenses(newExpenses);
        };

        render() {
            return (
                <Form
                    {...this.props}
                    // handleFormChange={this.handleFormChange}
                    add={this.add}
                    remove={this.remove}
                    expensesLength={this.props.expensesInfo.expenses.length}
                />
            );
        }
    };
}
