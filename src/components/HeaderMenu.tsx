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

    handleClick = e => {
        switch (e.key) {
            case 'user':
                this.onClickUser();
                break;
            default:
                return;
        }
    };

    render() {
        const menuRoutes = this.props.menuRoutes;

        return (
            <Header
                style={{
                    position: 'fixed',
                    zIndex: 1,
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px #f0f1f2',
                }}
            >
                <Menu
                    mode="horizontal"
                    theme="light"
                    defaultSelectedKeys={['/']}
                    selectedKeys={this.getSelectedKeys()}
                    style={{ lineHeight: '64px', borderBottom: '0' }}
                    onClick={this.handleClick}
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
                    <Menu.Item key="user" style={{ float: 'right' }}>
                        <Icon type="user" />
                    </Menu.Item>
                </Menu>
                <SignInModal visible={this.state.signInModalVisible} onCancelModal={this.onCancelModal} />
            </Header>
        );
    }
}

export default HeaderMenu;
