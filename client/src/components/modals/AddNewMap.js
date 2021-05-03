import React, {useState} from 'react';
import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';

const AddNewMap = (props) => {

    const [name, setName] = useState('');

    const handleAddNewMap = (e) => {
        props.addNewMap(name);
        props.setShowNewMap();
        e.preventDefault();
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.setShowNewMap}>
            <WMHeader className="modal-header" onClose={() => props.setShowNewMap()}>
               <span className="delete-map-name">Create New Map</span>
			</WMHeader >
            <WMMain>
                <form onSubmit={handleAddNewMap}>
                    <WInput onChange={(e) => setName(e.target.value)} className="modal-input" name='name' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
                        <br/>
                    <WButton className="modal-button cancel-button" onClick={() => props.setShowNewMap()} wType="texted">
                        <span>Cancel</span>
                    </WButton>
                        <label className="col-spacer">&nbsp;</label>
                    <WButton type='submit' className="modal-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
                        Add New Map
                    </WButton>
                </form>

            </WMMain>

        </WModal >
    );
}

export default AddNewMap;