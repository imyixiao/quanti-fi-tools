import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { round } from 'helpers';
import { getColorForStatus, getStatusForCashflow, addThousandSeparatorForNumber } from 'helpers';

interface Props {
    address?: string;
    linkToPath: string;
    numOfMonthAgo: number;
    purchasePrice?: number;
    cashflow?: number;
}

class PreviousReportCard extends Component<Props> {
    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Row>
                    <Col lg={12} xs={24}>
                        <Link to={this.props.linkToPath}>
                            <h3 style={{ lineHeight: '30px' }}>{this.props.address}</h3>
                        </Link>
                        <p>
                            {'Created about ' +
                                this.props.numOfMonthAgo +
                                (this.props.numOfMonthAgo > 1 ? ' months ago' : ' month ago')}
                        </p>
                    </Col>
                    <Col lg={6} xs={24}>
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
                    <Col lg={6} xs={12}>
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
                </Row>
            </Card>
        );
    }
}

export default PreviousReportCard;
