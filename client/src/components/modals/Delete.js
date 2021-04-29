import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const Delete = (props) => {

    const handleDelete = async () => {
        props.deleteMap(props.activeMap._id);
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.setShowDelete}>
            <WMHeader  className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete {props.activeMap.name}?
			</WMHeader >

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal >
    );
}

export default Delete;