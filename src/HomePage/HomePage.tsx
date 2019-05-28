import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'antd';
import SignInOnlyButton from 'components/SignInOnlyButton';

class HomePage extends Component {
    render() {
        return (
            <div>
                <Row style={{ marginTop: '16px', textAlign: 'center' }} gutter={16}>
                    <Col lg={{ span: 12, offset: 6 }} sm={24}>
                        <h1>Quanti-FI Tools</h1>
                        <h3>Quantify your Financial Independence</h3>
                        <p style={{ textAlign: 'justify' }}>
                            "A goal without a plan is just a wish." The following tools are created to help you plan
                            your financial freedom by either real estate investing or annual budgeting, in the hope to
                            reduce friction during research/planning stage to minimize risk and maximize your return.
                        </p>
                    </Col>
                </Row>
                <Row style={{ marginTop: '16px' }} gutter={16}>
                    <Col md={12} sm={24}>
                        <Card title="Rental Property Calculator">
                            <p>
                                Quickly analyze your investment property potential using this comprehensive rental
                                calculator.
                            </p>
                            <div style={{ textAlign: 'end' }}>
                                <SignInOnlyButton link="/rental-reports" style={{ marginRight: '16px' }}>
                                    View Previous Reports
                                </SignInOnlyButton>
                                <Link to="/rental">
                                    <Button type="primary">New Report</Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col md={12} sm={24} className="homepage-col">
                        <Card title="Annual Budget">
                            <p>
                                Build your annual budget. Check out how much you can spend, save and how much tax you
                                need to pay.
                            </p>
                            <div style={{ textAlign: 'end' }}>
                                <SignInOnlyButton link="/budget-reports" style={{ marginRight: '16px' }}>
                                    View Previous Budgets
                                </SignInOnlyButton>
                                <Link to="/budget">
                                    <Button type="primary">New Budget</Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HomePage;
