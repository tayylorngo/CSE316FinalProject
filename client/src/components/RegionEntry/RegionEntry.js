import React, {useState} from 'react';
import './RegionEntry.css';
import {WRow, WCol, WInput} from 'wt-frontend';

const RegionEntry = (props) => {

    const [editingName, toggleEditingName] = useState(false);
    const [editingCapital, toggleEditingCapital] = useState(false);
    const [editingLeader, toggleEditingLeader] = useState(false);

    const openNewRegion = () => {
        props.handleSetActiveMap(props.entry._id);
    }

    const openRegionViewer = () => {
        props.tps.clearAllTransactions();
        props.setCanUndo(props.tps.hasTransactionToUndo());
        props.setCanRedo(props.tps.hasTransactionToRedo());
        props.history.push("/viewer/" + props.activeRegion._id);
    }

    const handleDelete = () => {
        props.handleDeleteRegion(props.entry._id);
    }

    const handleEditName = (e) => {
        props.updateRegion(props.entry._id, 'name', props.entry.name, e.target.value);
        toggleEditingName(!editingName);
    }

    const handleEditCapital = (e) => {
        props.updateRegion(props.entry._id, 'capital', props.entry.capital, e.target.value);
        toggleEditingCapital(!editingCapital);
    }

    const handleEditLeader = (e) => {
        props.updateRegion(props.entry._id, 'leader', props.entry.capital, e.target.value);
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
                            <div className="entry-name" onDoubleClick={() => {toggleEditingName(!editingName)}}>
                                <WRow>
                                    <WCol size='1'>
                                        <button onClick={handleDelete} className='deleteButton'>
                                            <span className='material-icons'>
                                                close
                                            </span>
                                        </button>
                                    </WCol>
                                    <WCol size='11'>
                                        <span className="region-name" onClick={openNewRegion}> 
                                            {props.entry.name}
                                        </span>
                                    </WCol>
                                </WRow>
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
                            />
                        </div>
                    }
                </WCol>
                <WCol size="2" className="tableEntry capital-name">
                    {!editingCapital ? 
                        <div className="entry-name" onDoubleClick={() => {toggleEditingCapital(!editingCapital)}}>
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
                        <div className="entry-name" onDoubleClick={() => {toggleEditingLeader(!editingLeader)}}>
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
                    {
                        props.entry.landmarks[0] ? 
                            <div className='first-landmark'>{props.entry.landmarks[0]}, ...</div>
                        : <div className='first-landmark'>...</div>
                    }
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionEntry;