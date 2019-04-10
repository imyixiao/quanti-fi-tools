import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { BudgetReportInterface } from '../types';
import { addThousandSeparatorForNumber, round } from 'helpers';

interface Props {
    reportInfo: BudgetReportInterface;
}

interface State {
    reportId?: string;
    address?: string;
    linkToPath: string;
    numOfMonthAgo: number;
    purchasePrice?: number;
    cashflow?: number;
    arv?: number;
    noi?: number;
    monthlyIncome?: number;
}

class PreviousBudgetReportCard extends Component<Props, State> {
    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Row>
                    <Col lg={12} xs={24}>
                        <Link to={'/budget/' + this.props.reportInfo._id}>
                            <h3 style={{ lineHeight: '30px' }}>{this.props.reportInfo.reportTitle || 'Budget'}</h3>
                        </Link>

                        <p>
                            {'Annual Total Savings: $ ' +
                                addThousandSeparatorForNumber(round(this.props.reportInfo.results.totalSavings))}
                        </p>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default PreviousBudgetReportCard;