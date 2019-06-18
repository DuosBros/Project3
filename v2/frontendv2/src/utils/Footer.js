import React from 'react';
import { Grid, Segment, Container } from 'semantic-ui-react';

export default class Footer extends React.Component {
    render() {
        return (
            <Segment style={{ backgroundColor: '#006bab' }} >
                <Container>
                    <Grid style={{ color: 'white' }}>
                        <Grid.Row >
                            <Grid.Column>
                                © 2018 <a href="https://www.fei.vsb.cz" style={{ color: "white" }}>VŠB - TUO</a> <br></br>
                                FEI CAK3 Team
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        );
    }
}


