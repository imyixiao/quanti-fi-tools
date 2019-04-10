import React, { Component } from 'react';
import { Menu, Layout, Icon } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import { SignInModal } from 'components/SignInModal';

const SubMenu = Menu.SubMenu;
const { Header } = Layout;

interface MenuSubcomponent {
    title: string;
    exact?: boolean;
    path: string;
    component: any;
}

export interface MenuRoute {
    title: string;
    subcomponents: MenuSubcomponent[];
}

interface HeaderMenuProps extends RouteComponentProps<any> {
    menuRoutes: MenuRoute[];
}

interface State {
    signInModalVisible: boolean;
}

class HeaderMenu extends Component<HeaderMenuProps, State> {
    state = {
        signInModalVisible: false,
    };
    getSelectedKeys() {
        return [this.props.location.pathname];
    }

    onClickUser = () => {
        this.setState(state => ({
            signInModalVisible: !state.signInModalVisible,
        }));
    };

    onCancelModal = () => {
        this.setState(state => ({
            signInModalVisible: !state.signInModalVisible,
        }));
    };

    render() {
        const menuRoutes = this.props.menuRoutes;

        return (
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <Menu
                    mode="horizontal"
                    theme="dark"
                    defaultSelectedKeys={['/']}
                    selectedKeys={this.getSelectedKeys()}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    {menuRoutes.map((menuRoute, index) => (
                        <SubMenu key={index} title={<span className="submenu-title-wrapper">{menuRoute.title}</span>}>
                            {menuRoute.subcomponents.map(component => (
                                <Menu.Item key={component.path}>
                                    <Link to={component.path}>{component.title}</Link>
                                </Menu.Item>
                            ))}
                        </SubMenu>
                    ))}
                    <Menu.Item style={{ float: 'right' }}>
                        <Icon onClick={this.onClickUser} type="user" />
                    </Menu.Item>
                </Menu>
                <SignInModal visible={this.state.signInModalVisible} onCancelModal={this.onCancelModal} />
            </Header>
        );
    }
}

export default HeaderMenu;
