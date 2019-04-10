import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'antd';

import { PURCHASE_CLOSING_COST_BREAKDOWN_LABELS } from '../../constants.json';
import { setClosingCostBreakdown } from 'redux/actions/rental';
import { getClosingCostBreakdown } from 'redux/selectors';
import { FormComponentProps } from 'antd/lib/form/Form';

import { mapPropsToForm, createFormFromArray } from 'helpers';

const {
    POINTS_FEE,
    PREPAID_HAZARD_INSURANCE,
    PREPAID_FLOOD_INSURANCE,
    PREPAID_PROPERTY_TAXES,
    ANNUAL_ASSESSMENTS,
    TITLE_AND_ESCROW_FEES,
    ATTORNEY_CHARGES,
    INSPECTION_COSTS,
    RECORDING_FEES,
    APPRAISAL_FEES,
    OTHER_FEES,
} = PURCHASE_CLOSING_COST_BREAKDOWN_LABELS;

interface Props extends FormComponentProps {
    submitClosingCostBreakdown: any;
    toggleModal: any;
    closingCostBreakdown?: any;
    visible: boolean;
}

class ClosingCostModal extends Component<Props> {
    handleClosingCostModalOk = () => {
        this.props.form.validateFields((err, values) => {
            // if (!err) {}
            this.props.submitClosingCostBreakdown(values);
        });
        this.props.toggleModal(false);
    };

    handleClosingCostModalCancel = () => {
        this.props.toggleModal(false);
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const closingSubcostArray = [
            POINTS_FEE,
            PREPAID_HAZARD_INSURANCE,
            PREPAID_FLOOD_INSURANCE,
            PREPAID_PROPERTY_TAXES,
            ANNUAL_ASSESSMENTS,
            TITLE_AND_ESCROW_FEES,
            ATTORNEY_CHARGES,
            INSPECTION_COSTS,
            RECORDING_FEES,
            APPRAISAL_FEES,
            OTHER_FEES,
        ];
        const formHTML = createFormFromArray(closingSubcostArray, 3, getFieldDecorator);

        return (
            <Modal
                title="Purchase Closing Cost Breakdown"
                visible={this.props.visible}
                onOk={this.handleClosingCostModalOk}
                onCancel={this.handleClosingCostModalCancel}
                width={700}
            >
                {formHTML}
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    closingCostBreakdown: getClosingCostBreakdown(state),
});

const mapDispatchToProps = dispatch => {
    return {
        submitClosingCostBreakdown: closingCostBreakdown => {
            dispatch(setClosingCostBreakdown(closingCostBreakdown));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    Form.create({
        mapPropsToFields(props: Props) {
            return mapPropsToForm(props.closingCostBreakdown);
        },
    })(ClosingCostModal),
);
