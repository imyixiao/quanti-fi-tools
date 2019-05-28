import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import RentalCard from '../rental/RentalCard';
import HeaderMenu, { MenuRoute } from 'components/HeaderMenu';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import RentalPreviousReports from '../rental/PreviousReports/RentalPreviousReports';
import BudgetCard from '../budget/BudgetCard';
import PreviousBudgetReports from '../budget/PreviousReports/PreviousBudgetReports';
import { fetchDefaultStrategy } from 'redux/actions/rental';
import { AppState } from 'redux/store';

const { Content } = Layout;

const menuRoutes: MenuRoute[] = [
    {
        title: 'Rental Analysis',
        subcomponents: [
            {
                exact: true,
                title: 'Create New Report',
                path: '/rental',
                component: RentalCard,
            },
            {
                exact: false,
                title: 'View Previous Reports',
                path: '/rental-reports',
                component: RentalPreviousReports,
            },
        ],
    },
    {
        title: 'Annual Budget',
        subcomponents: [
            {
                exact: true,
                title: 'Create New Budget',
                path: '/budget',
                component: BudgetCard,
            },
            {
                title: 'View Previous Budgets',
                path: '/budget-reports',
                component: PreviousBudgetReports,
            },
        ],
    },
];

interface Props {
    fetchDefaultStrategy: any;
    firebaseAuthLoaded: boolean;
}

class App extends Component<Props> {
    componentDidMount() {
        if (this.props.firebaseAuthLoaded) {
            this.props.fetchDefaultStrategy();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!prevProps.firebaseAuthLoaded && this.props.firebaseAuthLoaded) {
            this.props.fetchDefaultStrategy();
        }
    }

    render() {
        return (
            <Router>
                <Layout>
                    <Route path="/" render={props => <HeaderMenu {...props} menuRoutes={menuRoutes} />} />
                    <Content className="app-content">
                        <Route path="/" exact component={HomePage} />
                        {menuRoutes.map(route => {
                            return route.subcomponents.map(component => (
                                <Route
                                    key={component.path}
                                    path={component.path}
                                    exact={component.exact}
                                    component={component.component}
                                />
                            ));
                        })}
                        <Route path="/rental/:id" component={RentalCard} />
                        <Route path="/budget/:id" component={BudgetCard} />
                    </Content>
                </Layout>
            </Router>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    firebaseAuthLoaded: state.firebase.auth.isLoaded,
});

const mapDispatchToProps = dispatch => {
    return {
        fetchDefaultStrategy: () => {
            dispatch(fetchDefaultStrategy());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
