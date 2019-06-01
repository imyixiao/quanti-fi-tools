import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Popconfirm, Button, Icon, message } from 'antd'   ;
import { BudgetReportInterface } from '../types';
import { addThousandSeparatorForNumber, round } from 'helpers';
import { connect } from 'react-redux';
import { deleteReport } from 'redux/actions/budget';

interface Props extends Dispatch {
    reportInfo: BudgetReportInterface;
}

class PreviousBudgetReportCard extends Component<Props> {
    onDeleteReportSuccess = () => {
        const msg = 'Delete report of ' + this.props.reportInfo.reportTitle + ' succeeded!'
        message.success(msg);
    };

    onDeleteReportFailure = e => {
        const msg = 'Delete report of ' + this.props.reportInfo.reportTitle + ' failed: ' + e.message
        message.error(msg);
    };

    onConfirmDeleteReport = () => {
        this.props.deleteBudgetReport(this.onDeleteReportSuccess, this.onDeleteReportFailure, this.props.reportInfo._id);
    };

    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Row>
                    <Col span={22}>
                        <Link to={'/budget/' + this.props.reportInfo._id}>
                            <h3 style={{ lineHeight: '30px' }}>{this.props.reportInfo.reportTitle || 'Budget'}</h3>
                        </Link>

                        <p>
                            {'Annual Total Savings: $ ' +
                                addThousandSeparatorForNumber(round(this.props.reportInfo.results.totalSavings))}
                        </p>
                    </Col>
                    <Col span={2}>
                        <Popconfirm
                            title="Are you sure delete this report?"
                            onConfirm={this.onConfirmDeleteReport}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="danger">
                                <Icon type="delete" />
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </Card>
        );
    }
}

interface Dispatch {
    deleteBudgetReport: any;
}


const mapDispatchToProps = (dispatch): Dispatch => {
    return {
        deleteBudgetReport: (onSuccess, onFailure, reportId) => {
            dispatch(deleteReport(onSuccess, onFailure, reportId));
        },
    };
};

export default connect(null, mapDispatchToProps)(PreviousBudgetReportCard);
