import React, {useState, useEffect} from 'react';
import './RegionEntry.css';
import {WRow, WCol, WButton, WInput} from 'wt-frontend';

const RegionEntry = (props) => {

    const [editingName, toggleEditingName] = useState(false);
    const [editingCapital, toggleEditingCapital] = useState(false);
    const [editingLeader, toggleEditingLeader] = useState(false);

    const openNewRegion = () => {
        props.handleSetActiveMap(props.entry._id);
    }

    const openRegionViewer = () => {
        props.history.push("/viewer/" + props.activeRegion._id);
    }

    const handleDelete = () => {
        props.handleDeleteRegion(props.entry._id);
    }

    const handleEditName = () => {
        toggleEditingName(!editingName);
    }

    const handleEditCapital = () => {
        toggleEditingCapital(!editingCapital);
    }

    const handleEditLeader = () => {
        toggleEditingLeader(!editingLeader);
    }

    const blackText = {
        color: "black"
    }

    return(
        <div>
            <WRow>
                <WCol size="2" className="tableEntry subregion-name">
                    {!editingName ? 
                            <div className="entry-name" onDoubleClick={handleEditName}>
                                <span className='deleteButton'>
                                    <button onClick={handleDelete}>
                                        X
                                    </button>
                                </span>
                                <span className="region-name" onClick={openNewRegion}> 
                                    {props.entry.name}
                                </span>
                            </div>
                            : 
                        <div>
                           <WInput
                                wType="lined"
                                style={blackText}
                                className="name-input"
                                hoverAnimation="solid"
                                defaultValue={props.entry.name}
                                onBlur={handleEditName}
                                autoFocus
                            />;
                        </div>
                    }
                </WCol>
                <WCol size="2" className="tableEntry capital-name">
                    {!editingCapital ? 
                        <div className="entry-name" onDoubleClick={handleEditCapital}>
                            {props.entry.capital}
                        </div> :
                    <div>
                        <WInput
                            wType="lined"
                            autoFocus
                            style={blackText}
                            className="name-input"
                            hoverAnimation="solid"
                            defaultValue={props.entry.capital}
                            onBlur={handleEditCapital}
                        />
                    </div>
                }
                </WCol>
                <WCol size="2" className="tableEntry leader-name">
                    {!editingLeader ? 
                        <div className="entry-name" onDoubleClick={handleEditLeader}>
                            {props.entry.leader}
                        </div> : 
                        <div>
                            <WInput
                                wType="lined"
                                autoFocus
                                style={blackText}
                                className="name-input"
                                hoverAnimation="solid"
                                defaultValue={props.entry.leader}
                                onBlur={handleEditLeader}
                            />
                        </div>
                    }
                </WCol>
                <WCol size="2" className="tableEntry flag">
                    <div className="entry-name">{props.entry._id}</div>
                </WCol>
                <WCol size="4" className="tableEntry landmarks" onClick={openRegionViewer}>
                    <div className="entry-name">{props.entry.landmarks}</div>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionEntry;