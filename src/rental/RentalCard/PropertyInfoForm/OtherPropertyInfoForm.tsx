import React, { Component } from 'react';
import { Form, InputNumber, Input, Checkbox, Col } from 'antd';
import { PROPERTY_INFO_LABELS } from '../../constants.json';
import BasicRow from 'components/BasicRow';
import FormInputNumber from 'components/FormInputNumber';
import { FormComponentProps } from 'antd/lib/form/Form';

const textAreaLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

const smallLayout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
};

const { TextArea } = Input;

interface Props extends FormComponentProps {
    showOtherPropertyFeatures?: boolean;
}

class OtherPropertyInfoForm extends Component<Props> {
    render() {
        const { form, showOtherPropertyFeatures } = this.props;
        const { getFieldDecorator } = form;
        const {
            TOTAL_SQFT,
            LOT_SIZE,
            YEAR_BUILT,
            YEAR_RENOVATED,
            UNITS,
            STORIES,
            COUNTY_APPRAISED_VALUE,
            POOL,
            HEATING,
            COOLING,
            FIREPLACE,
            GARAGE,
            CONSTRUCTION,
            ROOFING,
            FLOORING_TYPES,
            WIRING_CONDITION,
            PLUMBING_CONDITION,
            SIDING_MATERIAL,
            OTHER_INFORMATION,
        } = PROPERTY_INFO_LABELS;
        return (
            <div
                style={{
                    marginTop: '24px',
                    display: showOtherPropertyFeatures ? 'block' : 'none',
                }}
            >
                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={TOTAL_SQFT}>
                            {getFieldDecorator('totalSqft')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={LOT_SIZE}>
                            {getFieldDecorator('lotSize')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>
                </BasicRow>
                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={YEAR_BUILT}>
                            {getFieldDecorator('yearBuilt')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={YEAR_RENOVATED}>
                            {getFieldDecorator('yearRenovated')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>
                </BasicRow>
                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={UNITS}>
                            {getFieldDecorator('units')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={STORIES}>
                            {getFieldDecorator('stories')(<InputNumber min={0} />)}
                        </Form.Item>
                    </Col>
                </BasicRow>
                <Form.Item {...smallLayout} label={COUNTY_APPRAISED_VALUE}>
                    {getFieldDecorator('countyAppraisedValue')(<FormInputNumber dollar />)}
                </Form.Item>
                <BasicRow>
                    <Col lg={4} xs={8}>
                        <Form.Item>
                            {getFieldDecorator('pool', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    <span className="checkbox-label">{POOL}</span>
                                </Checkbox>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col lg={4} xs={8}>
                        <Form.Item>
                            {getFieldDecorator('heating', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    <span className="checkbox-label">{HEATING}</span>
                                </Checkbox>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col lg={4} xs={8}>
                        <Form.Item>
                            {getFieldDecorator('cooling', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    <span className="checkbox-label">{COOLING}</span>
                                </Checkbox>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col lg={4} xs={8}>
                        <Form.Item>
                            {getFieldDecorator('fireplace', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    <span className="checkbox-label">{FIREPLACE}</span>
                                </Checkbox>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col lg={4} xs={8}>
                        <Form.Item>
                            {getFieldDecorator('garage', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    <span className="checkbox-label">{GARAGE}</span>
                                </Checkbox>,
                            )}
                        </Form.Item>
                    </Col>
                </BasicRow>
                <BasicRow>
                    <Col lg={8}>
                        <Form.Item label={CONSTRUCTION}>{getFieldDecorator('construction')(<Input />)}</Form.Item>
                    </Col>

                    <Col lg={8}>
                        <Form.Item label={ROOFING}>{getFieldDecorator('roofing')(<Input />)}</Form.Item>
                    </Col>

                    <Col lg={8}>
                        <Form.Item label={FLOORING_TYPES}>{getFieldDecorator('flooringTypes')(<Input />)}</Form.Item>
                    </Col>
                </BasicRow>
                <BasicRow>
                    <Col lg={8}>
                        <Form.Item label={WIRING_CONDITION}>
                            {getFieldDecorator('wiringCondition')(<Input />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8}>
                        <Form.Item label={PLUMBING_CONDITION}>
                            {getFieldDecorator('plumbingCondition')(<Input />)}
                        </Form.Item>
                    </Col>

                    <Col lg={8}>
                        <Form.Item label={SIDING_MATERIAL}>{getFieldDecorator('sidingMaterial')(<Input />)}</Form.Item>
                    </Col>
                </BasicRow>
                <Form.Item {...textAreaLayout} label={OTHER_INFORMATION}>
                    {getFieldDecorator('otherInformation')(<TextArea rows={4} />)}
                </Form.Item>
            </div>
        );
    }
}

export default OtherPropertyInfoForm;
