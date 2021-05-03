import React from 'react';

import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';

const AddNewMap = (props) => {

    const handleAddNewMap = (e) => {
        props.addNewMap(e.target.value);
        props.setShowNewMap();
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.setShowNewMap}>
            <WMHeader className="modal-header" onClose={() => props.setShowNewMap()}>
               <span className="delete-map-name">Create New Map</span>
			</WMHeader >
            <WMMain>
                <form>
                    <WInput className="modal-input" name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='text' />
                        <br/>
                        <WButton className="modal-button cancel-button" onClick={() => props.setShowNewMap()} wType="texted">
                        <span>Cancel</span>
                        </WButton>
                        <label className="col-spacer">&nbsp;</label>
                        <WButton onClick={handleAddNewMap} className="modal-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
                            Add New Map
                        </WButton>
                </form>
            </WMMain>

        </WModal >
    );
}

export default AddNewMap;