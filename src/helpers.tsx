import { Form, Col } from 'antd';
import _ from 'lodash';
import React from 'react';
import BasicRow from './components/BasicRow';
import FormInputNumber from './components/FormInputNumber';

export function round(num?: any) {
    if (!num || Number.isNaN(num)) {
        return 0;
    } else {
        try {
            const converted = +num.toFixed(2);
            return converted;
        } catch (e) {
            return 0;
        }
    }
}

export function mapFieldsToFormFields(fields) {
    return _.mapValues(fields, v => Form.createFormField(v));
}

export function mapPropsToForm(data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        fields[key] = Form.createFormField({
            value,
        });
    }
    return fields;
}

export function createFormFromArray(nameArray, numColsPerRow, getFieldDecorator) {
    // if (24 % numColsPerRow != 0) {
    //     throw "num of cols per row should be divisible by 24";
    // }
    const arrayLen = nameArray.length;
    const numRows = Math.ceil(arrayLen / numColsPerRow);
    const colLen = 24 / numColsPerRow;
    let indexOfArray = 0;
    let res: any[] = [];
    for (let r = 0; r < numRows; r++) {
        let oneRow: any[] = [];
        for (let c = 0; c < numColsPerRow; c++, indexOfArray++) {
            if (indexOfArray < arrayLen) {
                const labelName = nameArray[indexOfArray];
                const variable = _.camelCase(labelName);
                oneRow.push(
                    <Col span={colLen} key={c}>
                        <Form.Item label={labelName}>
                            {getFieldDecorator(variable, {})(<FormInputNumber dollar width="145px" />)}
                        </Form.Item>
                    </Col>,
                );
            } else {
                oneRow.push(<Col span={colLen} key={c} />);
            }
        }
        res.push(<BasicRow key={r}>{oneRow}</BasicRow>);
    }
    return res;
}

export function getColorForStatus(status) {
    switch (status) {
        case 'success':
            return '#52c41a';
        case 'warning':
            return '#faad14';
        case 'failed':
            return '#f5222d';
        default:
            return 'rgba(0, 0, 0, 0.85)';
    }
}

export function getStatusForCashflow(cashflow) {
    if (cashflow < 100) {
        return 'failed';
    } else if (cashflow < 200) {
        return 'warning';
    } else {
        return 'success';
    }
}

export function addThousandSeparatorForNumber(num) {
    return ('' + num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getStatusForCOC(coc) {
    if (coc < 10) {
        return 'failed';
    } else if (coc < 12) {
        return 'warning';
    } else {
        return 'success';
    }
}

export function checkNamespace(action, namespace) {
    return action.type.split('/')[0] === namespace;
}

export const transformExpensesToFormFields = (expenses: { key?: string; value?: number }[]) => {
    if (!expenses) return {};
    const transformed = {};
    for (let i = 0; i < expenses.length; i++) {
        transformed[`keys_${i}`] = expenses[i].key;
        transformed[`values_${i}`] = expenses[i].value;
    }
    return transformed;
};

export const transformFormFieldsToExpenses = (expenses, changedValues) => {
    const transformed = [...expenses];

    _.forEach(changedValues, (fieldValue, fieldKey) => {
        if (fieldKey.startsWith('keys_')) {
            const i = parseInt(fieldKey.split('keys_')[1]);
            transformed[i].key = fieldValue;
        } else if (fieldKey.startsWith('values_')) {
            const i = parseInt(fieldKey.split('values_')[1]);
            transformed[i].value = Number(fieldValue);
        }
    });
    return transformed;
};
