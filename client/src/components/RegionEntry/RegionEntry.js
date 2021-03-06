import React, {useEffect, useState} from 'react';
import './RegionEntry.css';
import {WRow, WCol, WInput} from 'wt-frontend';

const RegionEntry = (props) => {

    const [editingName, toggleEditingName] = useState(false);
    const [editingCapital, toggleEditingCapital] = useState(false);
    const [editingLeader, toggleEditingLeader] = useState(false);

    let imgSrc = '../The World/';

    for(let i = 0; i < props.regionPath.length; i++){
        imgSrc += props.regionPath[i].name + '/';
    }
    imgSrc += props.entry.name + " Flag.png";

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
        props.setRegionIndex(-1);
        props.updateRegion(props.entry._id, 'name', props.entry.name, e.target.value);
        toggleEditingName(!editingName);
    }

    const handleEditCapital = (e) => {
        props.setRegionIndex(-1);
        props.updateRegion(props.entry._id, 'capital', props.entry.capital, e.target.value);
        toggleEditingCapital(!editingCapital);
    }

    const handleEditLeader = (e) => {
        props.setRegionIndex(-1);
        props.updateRegion(props.entry._id, 'leader', props.entry.capital, e.target.value);
        toggleEditingLeader(!editingLeader);
    }

    const handleMoveUpDownInput = (dir, field) => {
        props.handleMoveUpDownInput(dir + props.index, field);
    }

    useEffect(() => {
        if(props.currEditType === 'name'){
            if(!editingName){
                toggleEditingName(props.index === props.regionIndex);
                props.setCurrEditType('');
            }
        }
        if(props.currEditType === 'capital'){
            if(!editingCapital){
                toggleEditingCapital(props.index === props.regionIndex);
                props.setCurrEditType('');
            }
        }
        if(props.currEditType === 'leader'){
            if(!editingLeader){
                toggleEditingLeader(props.index === props.regionIndex);
                props.setCurrEditType('');
            }
        }
    }, [props, editingName, editingCapital, editingLeader]);

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
                                onKeyDown={(e) => {
                                    if(e.keyCode === 13) {
                                        handleEditName(e);
                                    }
                                    if(e.keyCode === 39){
                                        handleEditName(e);
                                        toggleEditingCapital(!editingCapital);
                                        toggleEditingName(!editingName);
                                    }
                                    //down
                                    if(e.keyCode === 40 && props.index !== props.activeRegion.subregions.length - 1){
                                        handleEditName(e);
                                        handleMoveUpDownInput(1, 'name');
                                    }
                                    //up
                                    if(e.keyCode === 38  && props.index !== 0){
                                        handleEditName(e);
                                        handleMoveUpDownInput(-1, 'name');
                                    }
                                }
                            }                           
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
                            onKeyDown={(e) => {
                                    if(e.keyCode === 13) {
                                        handleEditCapital(e);
                                    }
                                    if(e.keyCode === 37){
                                        handleEditCapital(e);
                                        toggleEditingCapital(!editingCapital);
                                        toggleEditingName(!editingName);
                                    }
                                    if(e.keyCode === 39){
                                        handleEditCapital(e);
                                        toggleEditingCapital(!editingCapital);
                                        toggleEditingLeader(!editingLeader);
                                    }
                                    //down
                                    if(e.keyCode === 40 && props.index !== props.activeRegion.subregions.length - 1){
                                        handleEditCapital(e);
                                        handleMoveUpDownInput(1, 'capital');
                                    }
                                    //up
                                    if(e.keyCode === 38  && props.index !== 0){
                                        handleEditCapital(e);
                                        handleMoveUpDownInput(-1, 'capital');
                                    }                                    
                                }
                            } 
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
                                onKeyDown={(e) => {
                                    if(e.keyCode === 13) {
                                        handleEditLeader(e);
                                    }
                                    if(e.keyCode === 37){
                                        handleEditLeader(e);
                                        toggleEditingLeader(!editingLeader);
                                        toggleEditingCapital(!editingCapital);
                                    }                                    //down
                                    if(e.keyCode === 40 && props.index !== props.activeRegion.subregions.length - 1){
                                        handleEditLeader(e);
                                        handleMoveUpDownInput(1, 'leader');
                                    }
                                    //up
                                    if(e.keyCode === 38 && props.index !== 0){
                                        handleEditLeader(e);
                                        handleMoveUpDownInput(-1, 'leader');
                                    }  
                                }
                            }
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
                    <div className="entry-name"><img src={imgSrc} className='flag-image' alt="flag"></img></div>
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