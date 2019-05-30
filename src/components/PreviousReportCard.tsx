import React, { Component } from 'react';
import { Card, Row, Col, Button, Icon, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { round } from 'helpers';
import { getColorForStatus, getStatusForCashflow, addThousandSeparatorForNumber } from 'helpers';

interface Props {
    reportId?: string;
    address?: string;
    linkToPath: string;
    numOfMonthAgo: number;
    purchasePrice?: number;
    cashflow?: number;
}

class PreviousReportCard extends Component<Props> {
    confirmDeleteRentalReport = () => {
        console.log('delete!');
        console.log(this.props.reportId);
    };

    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Row>
                    <Col span={10}>
                        <Link to={this.props.linkToPath}>
                            <h3 style={{ lineHeight: '30px' }}>{this.props.address}</h3>
                        </Link>
                        <p>
                            {'Created about ' +
                                this.props.numOfMonthAgo +
                                (this.props.numOfMonthAgo > 1 ? ' months ago' : ' month ago')}
                        </p>
                    </Col>
                    <Col span={6}>
                        <p
                            style={{
                                fontSize: '24px',
                                lineHeight: '30px',
                                marginBottom: '10px',
                            }}
                        >
                            {'$ ' + addThousandSeparatorForNumber(round(this.props.purchasePrice))}
                        </p>

                        <p>Purchase Price</p>
                    </Col>
                    <Col span={6}>
                        <p
                            style={{
                                color: getColorForStatus(getStatusForCashflow(this.props.cashflow)),
                                fontSize: '24px',
                                lineHeight: '30px',
                                marginBottom: '10px',
                            }}
                        >
                            {'$ ' + addThousandSeparatorForNumber(round(this.props.cashflow))}
                        </p>

                        <p>Cashflow</p>
                    </Col>
                    <Col span={2}>
                        <Popconfirm
                            title="Are you sure delete this report?"
                            onConfirm={this.confirmDeleteRentalReport}
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

export default PreviousReportCard;
