import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Button, Col, notification, Tooltip } from 'antd';

import { setPropertyInfo } from 'redux/actions/rental';
import { getPropertyInfo, getRentalStep } from 'redux/selectors';
import {
    WEBSITE_FETCH_REQUESTED,
    CLEAR_FETCH_ERROR,
    RENTAL_STEP_VALIDATION_SUCCESS,
    RENTAL_STEP_VALIDATION_FAILED,
} from 'redux/actions/rental';

import { PROPERTY_INFO_LABELS } from '../../constants.json';
import OtherPropertyInfoForm from './OtherPropertyInfoForm';
import { mapPropsToForm } from 'helpers';
import BasicRow from 'components/BasicRow';
import FormInputNumber from 'components/FormInputNumber';
import ImageGallery from 'react-image-gallery';
import { FormComponentProps } from 'antd/lib/form/Form';
import { PropertyInfoInterface, RentalStep } from '../../types';
import formWrapper, { WrappedFormProps } from 'components/FormWrapper';

const { TextArea } = Input;
const { Option, OptGroup } = Select;
const Search = Input.Search;

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    },
};

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

interface Props extends FormComponentProps, Dispatch, StoreState, WrappedFormProps {}

interface State {
    showOtherPropertyFeatures: boolean;
    waitingForValidation: boolean;
}

class PropertyInfoForm extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            showOtherPropertyFeatures: false,
            waitingForValidation: false,
        };
    }

    static getDerivedStateFromProps(nextProps: Props) {
        if (nextProps.waitingForValidation && nextProps.step === 0) {
            return {
                waitingForValidation: true,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.fetchErrorMessage !== this.props.fetchErrorMessage && this.props.fetchErrorMessage != null) {
            this.openFetchErrorNotification(this.props.fetchErrorMessage);
        }

        if (this.props.fetchErrorMessage) {
            this.props.clearFetchError();
        }

        if (this.state.waitingForValidation) {
            this.props.form.validateFieldsAndScroll(error => {
                if (error) {
                    this.props.dispatchValidationFailed();
                } else {
                    this.props.dispatchValidationSuccess();
                }
            });
            this.setState({
                waitingForValidation: false,
            });
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            // if (!err) {}
            this.props.submitPropertyInfo(values);
        });
    };

    onSearch = url => {
        this.props.requestFetchWebsite(url);
    };

    // onUploadPhotos = (photo) => {
    //     console.log(photo);
    //     const url = window.URL.createObjectURL(photo);
    //     console.log(url);
    //     localStorage.setItem(url, photo);
    //     return true;
    // }

    // dummyRequest = ({ file, onSuccess }) => {
    //     setTimeout(() => {
    //         onSuccess('ok');
    //     }, 0);
    // };

    openFetchErrorNotification = message => {
        notification['error']({
            message: 'Fetch failed',
            description: message,
        });
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        const {
            REPORT_TITLE,
            ADDRESS,
            CITY,
            STATE,
            PROPERTY_TYPE,
            ANNUAL_TAX,
            MLS_NUMBER,
            // PHOTOS,
            DESCRIPTION,
            BATHROOMS,
            BEDROOMS,
        } = PROPERTY_INFO_LABELS;

        return (
            <Form layout="horizontal" className="stepForm" onSubmit={this.handleSubmit}>
                <Form.Item label="Import data from website">
                    <Tooltip placement="bottomRight" title="Currently supports realtor.com">
                        <Search defaultValue={this.props.url} onSearch={value => this.onSearch(value)} enterButton />
                    </Tooltip>
                </Form.Item>
                <Form.Item {...formItemLayout} label={REPORT_TITLE}>
                    {getFieldDecorator('reportTitle', {})(<Input />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={ADDRESS}>
                    {getFieldDecorator('address', {
                        rules: [{ required: true }],
                    })(<Input />)}
                </Form.Item>
                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={CITY}>
                            {getFieldDecorator('city', {})(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={STATE}>
                            {getFieldDecorator('state', {})(<Input />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 6 }} label={PROPERTY_TYPE}>
                    {getFieldDecorator('propertyType')(
                        <Select>
                            <Option value="Condo/Unit">Condo/Unit</Option>
                            <Option value="Single Family">Single Family</Option>
                            <OptGroup label="Small Multifamily">
                                <Option value="Duplex">Duplex</Option>
                                <Option value="Triplex">Triplex</Option>
                                <Option value="Fourplex">Fourplex</Option>
                            </OptGroup>
                            <OptGroup label="Large Multifamily">
                                <Option value="5-plex">5-plex</Option>
                                <Option value="6-plex">6-plex</Option>
                                <Option value="7-plex">7-plex</Option>
                                <Option value="8-plex+">8-plex+</Option>
                            </OptGroup>
                            <Option value="Commercial">Commercial</Option>
                            <Option value="Industrial">Industrial</Option>
                            <Option value="Mobile Home">Mobile Home</Option>
                            <Option value="Other">Other</Option>
                        </Select>,
                    )}
                </Form.Item>

                <BasicRow>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={BEDROOMS}>
                            {getFieldDecorator('bedrooms')(<FormInputNumber />)}
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item {...smallLayout} label={BATHROOMS}>
                            {getFieldDecorator('bathrooms')(<FormInputNumber />)}
                        </Form.Item>
                    </Col>
                </BasicRow>

                <Form.Item {...formItemLayout} label={ANNUAL_TAX}>
                    {getFieldDecorator('annualTax')(<FormInputNumber dollar />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={MLS_NUMBER}>
                    {getFieldDecorator('mlsNumber')(<Input />)}
                </Form.Item>
                {/* <Form.Item {...formItemLayout} label={PHOTOS}>
                    {getFieldDecorator('photos')(
                        <Upload
                            listType="picture"
                            className="upload-list-inline"
                            accept="image/*"
                            customRequest={this.dummyRequest}
                        >
                            <Row>
                                <Button>
                                    <Icon type="upload" /> Upload
                                </Button>
                            </Row>
                        </Upload>,
                    )}
                </Form.Item> */}
                <ImageGallery
                    items={this.props.propertyInfo.photos}
                    showPlayButton={false}
                    showFullscreenButton={false}
                />
                <Form.Item {...textAreaLayout} label={DESCRIPTION}>
                    {getFieldDecorator('description')(<TextArea rows={4} />)}
                </Form.Item>
                <Button
                    icon={this.state.showOtherPropertyFeatures ? 'up' : 'down'}
                    onClick={() =>
                        this.setState(state => {
                            return { showOtherPropertyFeatures: !state.showOtherPropertyFeatures };
                        })
                    }
                >
                    {this.state.showOtherPropertyFeatures
                        ? 'Hide other property features'
                        : 'Show other property features'}
                </Button>

                <OtherPropertyInfoForm
                    {...this.props}
                    showOtherPropertyFeatures={this.state.showOtherPropertyFeatures}
                />
            </Form>
        );
    }
}

interface StoreState {
    propertyInfo: PropertyInfoInterface;
    url?: string;
    fetchErrorMessage?: string;
    waitingForValidation?: boolean;
    step: RentalStep;
}

const mapStateToProps = state => ({
    propertyInfo: getPropertyInfo(state),
    url: state.rental.url,
    fetchErrorMessage: state.rental.fetchErrorMessage,
    waitingForValidation: state.rental.waitingForValidation,
    step: getRentalStep(state),
});

interface Dispatch {
    submitPropertyInfo: any;
    requestFetchWebsite: any;
    clearFetchError: any;
    dispatchValidationSuccess: any;
    dispatchValidationFailed: any;
}

const mapDispatchToProps = dispatch => {
    return {
        submitPropertyInfo: propertyInfo => {
            dispatch(setPropertyInfo(propertyInfo));
        },
        requestFetchWebsite: url => {
            dispatch({ type: WEBSITE_FETCH_REQUESTED, payload: { url } });
        },
        clearFetchError: () => {
            dispatch({ type: CLEAR_FETCH_ERROR });
        },
        dispatchValidationSuccess: () => {
            dispatch({ type: RENTAL_STEP_VALIDATION_SUCCESS });
        },
        dispatchValidationFailed: () => {
            dispatch({ type: RENTAL_STEP_VALIDATION_FAILED });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    formWrapper(
        Form.create({
            onValuesChange(props: Props, changedValues) {
                props.submitPropertyInfo(changedValues);
            },
            mapPropsToFields(props: Props) {
                return mapPropsToForm(props.propertyInfo);
            },
            onFieldsChange(props, changedFields) {
                props.handleFormChange(changedFields);
            },
        })(PropertyInfoForm),
        props => props.propertyInfo,
    ),
);
