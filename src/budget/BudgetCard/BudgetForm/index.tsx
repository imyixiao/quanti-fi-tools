import React, { Component } from 'react';
import Income from './Income';
import Taxes from './Taxes';
import RetirementAccounts from './RetirementAccounts';
import MonthlyExpenses from './MonthlyExpenses';
import AnnualExpenses from './AnnualExpenses';
import Results from './Results';
import BudgetButtons from './BudgetButtons';
import BudgetTitleForm from './BudgetTitleForm';

class BudgetForm extends Component {
    render() {
        return (
            <div className="stepForm">
                <BudgetTitleForm />

                <Income />

                <RetirementAccounts />

                <Taxes />

                <MonthlyExpenses />

                <AnnualExpenses />

                <Results />

                <BudgetButtons />
            </div>
        );
    }
}
export default BudgetForm;
