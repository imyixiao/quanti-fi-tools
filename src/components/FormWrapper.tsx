import React, { Component } from 'react';
import _ from 'lodash';

interface State {
    fields: any;
}

export interface WrappedFormProps {
    fields: any;
    handleFormChange: any;
}

export default function formWrapper(Form, selectData) {
    return class FormWrapper extends Component<any, State> {
        state = {
            fields: _.transform(
                selectData(this.props),
                (result: any, value, key) => {
                    return (result[key] = { value });
                },
                {},
            ),
        };

        static getDerivedStateFromProps(nextProps, prevState) {
            return {
                fields: _.transform(
                    selectData(nextProps),
                    (result: any, value, key) => {
                        result[key] = { value };
                    },
                    prevState.fields,
                ),
            };
        }

        handleFormChange = changedFields => {
            this.setState(({ fields }) => ({
                fields: { ...fields, ...changedFields },
            }));
        };

        render() {
            return <Form {...this.props} fields={this.state.fields} handleFormChange={this.handleFormChange} />;
        }
    };
}
