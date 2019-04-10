import React, { Component } from 'react';
import { InputNumber } from 'antd';

const style = {
    width: '162px',
    float: 'left',
    height: '32px',
    marginTop: '4px',
};

interface FormInputNumberProps {
    min?: number;
    dollar?: boolean;
    percentage?: boolean;
    width?: string;
    onChange?: any;
    value?: any;
    disabled?: boolean;
    style?: any;
}

class FormInputNumber extends Component<FormInputNumberProps> {
    render() {
        const min = this.props.min ? this.props.min : 0;
        let inputStyle: any = this.props.width ? { ...style, width: this.props.width } : style;
        inputStyle = this.props.style ? { ...inputStyle, ...this.props.style } : inputStyle;
        if (this.props.dollar) {
            return (
                <InputNumber
                    min={min}
                    style={inputStyle}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={this.props.onChange}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
            );
        } else if (this.props.percentage) {
            return (
                <InputNumber
                    style={inputStyle}
                    min={min}
                    max={200}
                    formatter={value => `${value}%`}
                    parser={(value: any) => value.replace('%', '')}
                    onChange={this.props.onChange}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
            );
        } else {
            return (
                <InputNumber
                    min={min}
                    style={inputStyle}
                    onChange={this.props.onChange}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
            );
        }
    }
}

export default FormInputNumber;
