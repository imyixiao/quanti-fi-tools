import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Statistic, Card } from 'antd';
import { getReport, ReportDataInterface } from 'redux/selectors';
import ExpenseDonutChart from 'components/ExpenseDonutChart';
import { getColorForStatus, getStatusForCashflow, getStatusForCOC } from 'helpers';
import { FormComponentProps } from 'antd/lib/form/Form';
import { AppState } from 'redux/store';
import { round } from 'helpers';

interface Props extends FormComponentProps, StoreState, ReportDataInterface {}

class Report extends Component<any, Props> {
    render() {
        const { reportData } = this.props;
        const { loan, subtitles, title } = reportData;

        return (
            <div className="report">
                {title && <h1>{title}</h1>}
                <Row style={{ marginBottom: '12px' }} gutter={16}>
                    <Col lg={12} sm={24}>
                        <h2>{subtitles.firstAddressSubtitle}</h2>
                        <h3>{subtitles.secondAddressSubtitle}</h3>
                    </Col>

                    <Col lg={12} sm={24}>
                        <h2>{subtitles.bbSubtitle}</h2>
                        <h3>{subtitles.sqftSubtitle}</h3>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '16px' }} gutter={16}>
                    <Col lg={12} sm={24}>
                        <Card bordered={false}>
                            <p>Cashflow</p>
                            <p
                                style={{
                                    color: getColorForStatus(getStatusForCashflow(reportData.cashflow)),
                                    fontSize: '30px',
                                    lineHeight: '38px',
                                }}
                            >
                                {'$ ' + round(reportData.cashflow)}
                            </p>

                            <p style={{ lineHeight: '22px' }}>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.65)',
                                        marginRight: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Monthly Income
                                </span>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.85)',
                                        fontSize: '20px',
                                    }}
                                >
                                    {'$' + reportData.monthlyIncome}
                                </span>
                            </p>
                            <p style={{ lineHeight: '22px' }}>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.65)',
                                        marginRight: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Monthly Expense
                                </span>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.85)',
                                        fontSize: '20px',
                                    }}
                                >
                                    {'$' + round(reportData.monthlyExpense)}
                                </span>
                            </p>
                        </Card>
                    </Col>

                    <Col lg={12} sm={24}>
                        <Card bordered={false}>
                            <p>Cash on Cash ROI</p>
                            <p
                                style={{
                                    color: getColorForStatus(getStatusForCOC(reportData.coc)),
                                    fontSize: '30px',
                                    lineHeight: '38px',
                                }}
                            >
                                {round(reportData.coc) + '%'}
                            </p>

                            <p style={{ lineHeight: '22px' }}>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.65)',
                                        marginRight: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Total Cash Needed
                                </span>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.85)',
                                        fontSize: '20px',
                                    }}
                                >
                                    {'$' + round(reportData.totalCash)}
                                </span>
                            </p>
                            <p style={{ lineHeight: '22px' }}>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.65)',
                                        marginRight: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Cap Rate
                                </span>
                                <span
                                    style={{
                                        color: 'rgba(0,0,0,.85)',
                                        fontSize: '20px',
                                    }}
                                >
                                    {round(reportData.capRate) + '%'}
                                </span>
                            </p>
                        </Card>
                    </Col>
                </Row>

                <Card bordered={false}>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col lg={8} sm={24}>
                            <Statistic title="Down Payment" value={round(loan.downPayment)} prefix="$" />
                        </Col>
                        <Col lg={8} sm={24}>
                            <Statistic title="Monthly Mortgage" value={round(loan.monthlyMortgage)} prefix="$" />
                        </Col>
                        <Col lg={8} sm={24}>
                            <Statistic title="Loan Amount" value={round(loan.loanAmount)} prefix="$" />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col lg={8} sm={24}>
                            <Statistic title="Interest Rate" value={round(loan.interestRate)} suffix="%" />
                        </Col>
                        <Col lg={8} sm={24}>
                            <Statistic title="Amortized Over" value={loan.amortizedYears} suffix="years" />
                        </Col>
                        <Col lg={8} sm={24}>
                            <Statistic title="Loan Points" value={round(loan.points)} suffix="%" />
                        </Col>
                    </Row>
                </Card>

                <ExpenseDonutChart expense={reportData.monthlyOperatingExpenses} />
            </div>
        );
    }
}

interface StoreState {
    reportData: ReportDataInterface;
}

const mapStateToProps = (state: AppState): StoreState => ({
    reportData: getReport(state),
});

export default connect(mapStateToProps)(Report);
