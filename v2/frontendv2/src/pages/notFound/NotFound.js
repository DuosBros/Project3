import React from 'react';
import {Header, Grid} from 'semantic-ui-react';

export default class NotFound extends React.Component {
    

    render() {
        return(
            <Grid container style={{ padding: '5em 0em' }}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h1' dividing>
                            NOT FOUND
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
        
    
}