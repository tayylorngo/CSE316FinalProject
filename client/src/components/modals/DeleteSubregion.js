import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteSubregion = (props) => {

    const handleDelete = async () => {
        props.deleteRegion(props.regionToBeDeleted._id);
        props.toggleShowDelete(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.showDelete}>
            <WMHeader className="modal-header" onClose={() => props.toggleShowDelete(false)}>
               <span className="delete-map-name">Delete {props.regionToBeDeleted.name}?</span>
			</WMHeader >

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.toggleShowDelete(false)} wType="texted">
                <span className="delete-map-name">Cancel</span>
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal >
    );
}

export default DeleteSubregion;