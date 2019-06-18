import React from 'react';
import { Menu, Segment, Container, Icon } from 'semantic-ui-react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { version } from '../appConfig';

import { loginFailedAction } from '../pages/login/LoginAction';

class Header extends React.Component {
    constructor(props) {
        super(props)

        this.logout = this.logout.bind(this);

        var currentPath = browserHistory.getCurrentLocation().pathname.replace("/", "");

        if (currentPath !== 'patients' && currentPath !== 'graphs') {
            currentPath = 'patients'
        }
        this.state = {
            activeItem: currentPath
        }
    }

    componentDidMount() {
        var currentPath = browserHistory.getCurrentLocation().pathname.replace("/", "");

        if (currentPath !== 'patients' && currentPath !== 'graphs') {
            currentPath = 'patients'
        }

        this.setState({ activeItem: currentPath })
    }

    handleItemClick = (e, { name }) => {
        if (name !== 'FNO - Urgent') {
            this.setState({ activeItem: name })
        }

        if (name === 'FNO - Urgent') {
            browserHistory.push('/patients');
            window.location.reload()
        }

        if (name === 'patients') {
            browserHistory.push('/patients');
        }

        if (name === 'graphs') {
            browserHistory.push('/graphs');
            window.location.reload()
        }

    }

    logout() {
        this.props.loginFailedAction();
        this.setState({ activeItem: "" })
        browserHistory.push('/logout');
    }

    render() {
        const { activeItem } = this.state
        return (
            <Segment style={{ backgroundColor: '#006bab', color: 'white' }}>
                <Container>
                    <Menu style={{ borderBottom: '0px' }} pointing secondary size='huge'>
                        <Menu.Item style={{ color: 'white' }} name='FNO - Urgent' onClick={this.handleItemClick} />
                        <Menu.Item style={{ color: 'white', borderColor: activeItem === 'patients' ? 'white' : 'transparent' }} className='patients' name='patients' active={activeItem === 'patients'} onClick={this.handleItemClick}>Pacienti</Menu.Item>
                        <Menu.Item
                            style={{ color: 'white', borderColor: activeItem === 'graphs' ? 'white' : 'transparent' }}
                            className='reports'
                            name='graphs'
                            active={activeItem === 'graphs'}
                            onClick={this.handleItemClick}
                        >Grafy</Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item style={{ color: 'white' }}>Verze: {version}</Menu.Item>
                            <Menu.Item
                                style={{ color: 'white' }}
                                className='logout'
                                name='logout'
                                active={activeItem === 'logout'}
                                onClick={() => this.logout()}>
                                Odhlášení <Icon name='log out' style={{ marginLeft: '0.5em' }} />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginPageStore: state.LoginReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginFailedAction: loginFailedAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);