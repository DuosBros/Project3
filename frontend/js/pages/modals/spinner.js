import React from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import { introJs } from 'intro.js';

import { url } from '../../appConfig';
import {selectPatientAction, setActiveTagAction, selectTagAction, 
    editPatientAction, unSelectPatientAction, unSelectTagAction, 
    triggerNotification, getAllPatientsAction, getAllTagsAction, assignTagAction} from '../../actions/actions';

@connect((store) => {
    return {

    }
})
export default class SpinnerModal extends React.Component {
    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.props.onToggle();
    }

    render() {
        return(
            <Modal 
                className="modal-container" 
                dialogClassName="spinnerModal"
                bsSize="small"
                show={this.props.onShow}
                onHide={this.toggleModal}
                backdrop= "static">

                <Modal.Body>
                    <div>
                        {/* <img className = "image" src="src/img/Spinner.svg"></img> */}
                        <img className = "image" src="../src/img/Spinner.svg"></img>
                        <br/><br/><br/><br/><br/>
                        <div style={{textAlign: 'center' }}>
                            <b>Načítám data...</b>
                        </div>
                        
                    </div>
                    
                    
                </Modal.Body>      
            </Modal> 
        )
    }
}