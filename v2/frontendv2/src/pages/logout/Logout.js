import React from 'react';
import { Button, Grid, Image, Segment } from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';

import logo from '../../../src/logo.jpg';

class Logout extends React.Component {

    render() {
        return (
            <div className='login-form'>
                {/* <style>{`
                body > div,
                body > div > div,
                body > div > div > div.login-form {
                    height: 100%;
                }
                `}</style> */}
                <Grid columns={3} stackable>
                    <Grid.Column width='4'></Grid.Column>
                    <Grid.Column width='8'>
                        <Image fluid src={logo}/>
                        <Segment  textAlign='center' inverted color='red' tertiary>
                            Byli jste odhlášení!<br/> Přihlašte se znovu stisknutím tlačítka Přihlásit.
                        </Segment>
                        <Button
                            onClick={() => browserHistory.push('/login')}
                            style={{backgroundColor: '#006bab'}}
                            primary
                            fluid
                            size='large'>
                                Login
                        </Button>
                    </Grid.Column>
                    <Grid.Column width='4'></Grid.Column>
                </Grid>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginPageStore: state.LoginReducer
    };
  }

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);