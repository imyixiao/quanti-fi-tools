import React from 'react';
import { Row, Col, Form, Select } from 'antd';
import FormInputNumber from 'components/FormInputNumber';
import { TaxInfoInterface } from '../../types';
import { AppState } from 'redux/store';
import { getTaxInfo } from 'redux/selectors';
import { setTaxInfo } from 'redux/actions/budget';
import { connect } from 'react-redux';
import formWrapper from 'components/FormWrapper';
import { mapPropsToForm, round } from 'helpers';
import { states } from 'consts/states';

const budgetDisabledStyle = {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.65)',
    border: 'none',
    cursor: 'default',
};

const Option = Select.Option;

export const Taxes = props => {
    const { getFieldDecorator, getFieldValue } = props.form;
    return (
        <Form layout="vertical">
            <Row>
                <h2 style={{ float: 'left' }}>Taxes</h2>
            </Row>

            <div style={{ textAlign: 'left' }}>
                <p>Notice: Assuming standard deduction</p>

                <h4>Disclaimer: </h4>
                <p>
                    The result on this website is just to give you a general overview, and in no way constitute advice.
                    The actual tax payable by you or any other information will depend on your personal circumstances.
                    The website is not responsible for your tax forms and such.
                </p>
            </div>

            <Row>
                <Col lg={6} sm={24}>
                    <Form.Item label="State">
                        {getFieldDecorator('state', {})(
                            <Select>
                                {states.map(state => {
                                    switch (state.abbreviation) {
                                        case 'CA':
                                        case 'WA':
                                            return (
                                                <Option value={state.abbreviation} key={state.abbreviation}>
                                                    {state.name}
                                                </Option>
                                            );
                                        default:
                                            return (
                                                <Option value={state.abbreviation} key={state.abbreviation} disabled>
                                                    {state.name}
                                                </Option>
                                            );
                                    }
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={{ span: 10, offset: 4 }} sm={24}>
                    <Form.Item label="Filing Status">
                        {getFieldDecorator('filingStatus', {})(
                            <Select>
                                <Option value="single" key="single">
                                    Single
                                </Option>
                                <Option value="mfj" key="mfj" disabled>
                                    Married Filing Jointly
                                </Option>
                                <Option value="mfs" key="mfs" disabled>
                                    Married Filing Separately
                                </Option>
                                <Option value="hoh" key="hoh" disabled>
                                    Head of Household
                                </Option>
                                <Option value="widow" key="widow" disabled>
                                    Qualifying Widow(er) with Dependent Child
                                </Option>
                            </Select>,
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col lg={12} sm={24}>
                    <Form.Item label="Taxable Income">
                        {getFieldDecorator('taxableIncome', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col lg={6} sm={24}>
                    <Form.Item label="Federal Income Tax">
                        {getFieldDecorator('federalIncomeTax', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} sm={24}>
                    <Form.Item label="State Income Tax">
                        {getFieldDecorator('stateIncomeTax', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} sm={24}>
                    <Form.Item label="FICA Tax">
                        {getFieldDecorator('FICATax', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} sm={24}>
                    <Form.Item label="NIIT Tax">
                        {getFieldDecorator('NIITTax', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col lg={12} sm={24}>
                    <Form.Item label="Total Income Tax">
                        {getFieldDecorator('totalIncomeTax', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
                <Col lg={12} sm={24}>
                    <Form.Item label="Effective Tax Rate">
                        {getFieldDecorator('effectiveTaxRate', {})(
                            <FormInputNumber percentage disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col lg={12} sm={24}>
                    <Form.Item label="After Tax Income (excluding retirement accounts)">
                        {getFieldDecorator('afterTaxIncome', {})(
                            <FormInputNumber dollar disabled style={budgetDisabledStyle} />,
                        )}
                    </Form.Item>
                </Col>

                <Col lg={12} sm={24}>
                    <Form.Item label="After Tax Income Per Month">
                        <FormInputNumber
                            dollar
                            value={round(getFieldValue('afterTaxIncome') / 12)}
                            disabled
                            style={budgetDisabledStyle}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

interface StoreState {
    taxInfo: TaxInfoInterface;
}

const mapStateToProps = (state: AppState): StoreState => ({
    taxInfo: getTaxInfo(state),
});

interface Dispatch {
    setIncomeInfo: any;
}

const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        setIncomeInfo: (taxInfo: TaxInfoInterface) => {
            dispatch(setTaxInfo(taxInfo));
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
                return mapPropsToForm(props.taxInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(Taxes),
        props => props.taxInfo,
    ),
);
