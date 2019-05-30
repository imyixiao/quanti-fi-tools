import React, { Component } from 'react';
import { RentalReportInterface } from 'redux/reducers/rental/types';
import PreviousReportCard from 'components/PreviousReportCard';
import { getCashflow } from 'redux/selectors';
import { initialRentalState } from 'redux/reducers/rental/rental';
import { initialBudgetState } from 'redux/reducers/budget/budget';

interface Props {
    reportInfo: RentalReportInterface;
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

class PreviousRentalReportCard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            reportId: this.props.reportInfo._id,
            address: this.props.reportInfo.propertyInfo.address,
            linkToPath: '/rental/' + this.props.reportInfo._id,
            numOfMonthAgo: Math.round(
                new Date().getTime() / (1000 - this.props.reportInfo.createTime) / (30 * 24 * 60 * 60),
            ),
            purchasePrice: this.props.reportInfo.purchaseInfo.purchasePrice,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            reportId: nextProps.reportInfo._id,
            address: nextProps.reportInfo.propertyInfo.address,
            linkToPath: '/rental/' + nextProps.reportInfo._id,
            numOfMonthAgo: Math.round(
                new Date().getTime() / (1000 - nextProps.reportInfo.createTime) / (30 * 24 * 60 * 60),
            ),
            purchasePrice: nextProps.reportInfo.purchaseInfo.purchasePrice,
        });
    }

    componentDidMount() {
        this.setState({
            cashflow: getCashflow({
                rental: {
                    ...initialRentalState,
                    ...this.props.reportInfo,
                },
                budget: initialBudgetState,
            }),
        });
    }

    render() {
        const { reportId, address, linkToPath, numOfMonthAgo, purchasePrice, cashflow } = this.state;

        return (
            <PreviousReportCard
                reportId={reportId}
                address={address}
                linkToPath={linkToPath}
                numOfMonthAgo={numOfMonthAgo}
                purchasePrice={purchasePrice}
                cashflow={cashflow}
            />
        );
    }
}

export default PreviousRentalReportCard;
