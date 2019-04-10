import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'antd';

import { REPAIR_COST_BREAKDOWN_LABELS } from '../../constants.json';
import { setRepairCostBreakdown } from 'redux/actions/rental';
import { getRepairCostBreakdown } from 'redux/selectors';
import { createFormFromArray, mapPropsToForm } from 'helpers';
import { FormComponentProps } from 'antd/lib/form/Form';
import { RepairCostBreakDownInterface } from '../../types.js';
import { AppState } from 'redux/store.js';

const {
    ROOF,
    CONCRETE,
    GUTTERS_SOFFIT_FASCIA,
    GARAGE,
    SIDING,
    LANDSCAPING,
    EXTERIOR_PAINTING,
    SEPTIC,
    DECKS,
    FOUNDATION,
    DEMO,
    SHEETROCK,
    PLUMBING,
    CARPENTRY_WINDOW_DOORS,
    ELECTRICAL,
    INTERIOR_PAINTING,
    HVAC,
    CABINETS_COUNTERTOPS,
    FRAMING,
    FLOORING,
    PERMITS,
    TERMITES,
    MOLD,
    MISCELLANEOUS,
} = REPAIR_COST_BREAKDOWN_LABELS;

interface Props extends FormComponentProps, Dispatch, StoreState {
    toggleModal: any;
    visible: boolean;
}

class RepairCostModal extends Component<Props> {
    handleRepairCostModalOk = () => {
        this.props.form.validateFields((err, values) => {
            // if (!err) {}
            this.props.submitRepairCostBreakdown(values);
        });
        this.props.toggleModal(false);
    };

    handleRepairCostModalCancel = () => {
        this.props.toggleModal(false);
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const exterior = [
            ROOF,
            CONCRETE,
            GUTTERS_SOFFIT_FASCIA,
            GARAGE,
            SIDING,
            LANDSCAPING,
            EXTERIOR_PAINTING,
            SEPTIC,
            DECKS,
            FOUNDATION,
        ];
        const interior = [
            DEMO,
            SHEETROCK,
            PLUMBING,
            CARPENTRY_WINDOW_DOORS,
            ELECTRICAL,
            INTERIOR_PAINTING,
            HVAC,
            CABINETS_COUNTERTOPS,
            FRAMING,
            FLOORING,
        ];
        const general = [PERMITS, TERMITES, MOLD, MISCELLANEOUS];

        const exteriorPart = createFormFromArray(exterior, 4, getFieldDecorator);
        const interiorPart = createFormFromArray(interior, 4, getFieldDecorator);
        const generalPart = createFormFromArray(general, 4, getFieldDecorator);

        return (
            <Modal
                title="Repair Cost Breakdown"
                visible={this.props.visible}
                onOk={this.handleRepairCostModalOk}
                onCancel={this.handleRepairCostModalCancel}
                width={800}
            >
                <h4> Exterior Repairs </h4>
                {exteriorPart}
                <h4> Interior Repairs </h4>
                {interiorPart}
                <h4> General Components </h4>
                {generalPart}
            </Modal>
        );
    }
}

interface StoreState {
    repairCostBreakdown: RepairCostBreakDownInterface;
}

const mapStateToProps = (state: AppState) => ({
    repairCostBreakdown: getRepairCostBreakdown(state),
});

interface Dispatch {
    submitRepairCostBreakdown: any;
}

const mapDispatchToProps = dispatch => {
    return {
        submitRepairCostBreakdown: (repairCostBreakdown: RepairCostBreakDownInterface) => {
            dispatch(setRepairCostBreakdown(repairCostBreakdown));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    Form.create({
        mapPropsToFields(props: Props) {
            return mapPropsToForm(props.repairCostBreakdown);
        },
    })(RepairCostModal),
);
