import React, { useState } from 'react';
import './RegionViewer.css';
import {WRow, WCol, WButton, WInput} from 'wt-frontend';
import LandmarksList from '../LandmarksList/LandmarksList';
import DeleteLandmarkModal from '../modals/DeleteLandmarkModal';
import {useParams, Redirect} from 'react-router-dom';
import { useQuery, useMutation } 		from '@apollo/client';
import { GET_DB_REGIONS }	from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { EditLandmark_Transaction, UpdateLandmarks_Transaction, UpdateParentRegion_Transaction } from '../../utils/jsTPS';

const RegionViewer = (props) => {

    let activeRegion = {};
    let parentRegion = {
        name: "none",
        subregions: []
    };
    let subregions = [];
    let landmarks = [];
    let activeRegionLandmarks = [];
    let defaultAllLandmarks = [];
    let allRegions = [];
    let regionPath = [];
    let imgSrc;

    const {id} = useParams();

	const { loading, error, data } = useQuery(GET_DB_REGIONS);
    if(!props.user && !loading){
        props.history.push('/home');
    }
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data){
        for(let region of data.getAllRegions) {
            if(id === region._id){
                activeRegion = region;
                break;
            }
		}
        for(let region of data.getAllRegions) {
            allRegions.push(region);
            if(region._id === activeRegion.parentRegion){
                parentRegion = region;
            }
            if(region.parentRegion === activeRegion._id){
                subregions.push(region);            
            }
		}
        landmarks = activeRegion.landmarks;
        activeRegionLandmarks = activeRegion.landmarks;
        defaultAllLandmarks = activeRegion.landmarks;
        const regionTraversal = (activeRegion) => {
            if(activeRegion.subregions.length === 0)
                return
            activeRegion.subregions.forEach(subregion => {
            allRegions.forEach(region => {
                if (region._id === subregion){
                    region.landmarks.forEach(landmark => {
                        defaultAllLandmarks = [...defaultAllLandmarks, (landmark)];
                        landmarks = [...landmarks, (landmark + " - " + region.name)];
                    })
                    regionTraversal(region)
                    }
                })
            })
        }
        regionTraversal(activeRegion);
        if(landmarks.length > 1){
            landmarks = landmarks.slice().sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
        }
        regionPath.push(activeRegion);
        let tempRegion = activeRegion;
        while(tempRegion.parentRegion !== 'none'){
            for(let region of data.getAllRegions){
                if(region._id === tempRegion.parentRegion){
                    regionPath.push(region);
                    tempRegion = region;
                    break;
                }
            }
        }
        imgSrc = '../The World/';
        regionPath.reverse();
        for(let i = 0; i < regionPath.length - 1; i++){
            imgSrc += regionPath[i].name + '/';
        }
        imgSrc += activeRegion.name + " Flag.png";
    }

    const [landmarkToBeAdded, setLandmarkToBeAdded] = useState('');
    const [landmarkToBeDeleted, setLandmarkToBeDeleted] = useState('');
    const [showDelete, toggleShowDelete]            = useState(false);
    const [editingParentRegion, toggleEditingParentRegion] = useState(false);
    const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

    const [AddLandmark] 				= useMutation(mutations.ADD_LANDMARK, mutationOptions);
    const [DeleteLandmark]              = useMutation(mutations.DELETE_LANDMARK, mutationOptions);
    const [EditLandmark]                = useMutation(mutations.EDIT_LANDMARK, mutationOptions);
    const [EditParentRegion]            = useMutation(mutations.EDIT_PARENT_REGION, mutationOptions);

    const returnToSpreadsheet = () => {
        props.tps.clearAllTransactions();
        setCanUndo(props.tps.hasTransactionToUndo());
        setCanRedo(props.tps.hasTransactionToRedo());
        props.history.push('/maps/' + activeRegion._id);
    }

    if(!loading && Object.keys(activeRegion).length === 0){
        props.tps.clearAllTransactions();
        setCanUndo(props.tps.hasTransactionToUndo());
        setCanRedo(props.tps.hasTransactionToRedo());
        return <Redirect to='/home'/>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(landmarkToBeAdded === ''){
            return;
        }
        if(defaultAllLandmarks.includes(landmarkToBeAdded)){
            alert('Landmark already exists!');
            setLandmarkToBeAdded('');
            return;
        }
        let transaction = new UpdateLandmarks_Transaction(activeRegion._id, landmarkToBeAdded, 1, AddLandmark, DeleteLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
        setLandmarkToBeAdded('');
    }

    const handleChange = (e) => {
        setLandmarkToBeAdded(e.target.value);
    }

    const handleDeleteLandmark = (landmark) => {
        toggleShowDelete(true);
        setLandmarkToBeDeleted(landmark);
    }

    const deleteLandmark = async (landmark) => {
        let transaction = new UpdateLandmarks_Transaction(activeRegion._id, landmark, 0, AddLandmark, DeleteLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
        // await DeleteLandmark({variables: {_id: activeRegion._id, name: landmark}, refetchQueries: [{query: GET_DB_REGIONS}]});
        setLandmarkToBeDeleted('');
    }

    const editLandmark = async (newLandmark, prevLandmark) => {
        let transaction = new EditLandmark_Transaction(activeRegion._id, prevLandmark, newLandmark, EditLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const editParentRegion = async (e) => {
        let parentRegionId = null;
        for(let region of allRegions){
            if(e.target.value === region.name && !activeRegion.subregions.includes(region._id)){
                parentRegionId = region._id;
                break;
            }
        }
        if(parentRegionId === null){
            alert("Cannot move region to selected parent region.");
        }
        else{
            let transaction = new UpdateParentRegion_Transaction(activeRegion._id, parentRegionId, activeRegion.parentRegion, EditParentRegion);
            props.tps.addTransaction(transaction);
            tpsRedo();
        }
        toggleEditingParentRegion(false);
    }

    const viewPreviousSibling = () => {
        for(let i = 0; i < parentRegion.subregions.length; i++){
            if(parentRegion.subregions[i] === activeRegion._id && parentRegion.subregions[i - 1] !== undefined){
                props.tps.clearAllTransactions();
                setCanUndo(props.tps.hasTransactionToUndo());
                setCanRedo(props.tps.hasTransactionToRedo());
                props.history.push("/viewer/" + parentRegion.subregions[i - 1]);
                break;
            }
            if(parentRegion.subregions[i] === activeRegion._id && parentRegion.subregions[i - 1] === undefined){
                props.tps.clearAllTransactions();
                setCanUndo(props.tps.hasTransactionToUndo());
                setCanRedo(props.tps.hasTransactionToRedo());
                props.history.push("/viewer/" + parentRegion.subregions[parentRegion.subregions.length - 1]);
            }
        }
    }

    const viewNextSibling = () => {
        for(let i = 0; i < parentRegion.subregions.length; i++){
            if(parentRegion.subregions[i] === activeRegion._id && parentRegion.subregions[i + 1] !== undefined){
                props.tps.clearAllTransactions();
                setCanUndo(props.tps.hasTransactionToUndo());
                setCanRedo(props.tps.hasTransactionToRedo());
                props.history.push("/viewer/" + parentRegion.subregions[i + 1]);
                break;
            }
            if(parentRegion.subregions[i] === activeRegion._id && parentRegion.subregions[i + 1] === undefined){
                props.tps.clearAllTransactions();
                setCanUndo(props.tps.hasTransactionToUndo());
                setCanRedo(props.tps.hasTransactionToRedo());
                props.history.push("/viewer/" + parentRegion.subregions[0]);
            }
        }
    }

    const setOtherRegion = (_id) => {
        props.tps.clearAllTransactions();
        setCanUndo(props.tps.hasTransactionToUndo());
        setCanRedo(props.tps.hasTransactionToRedo());
        props.history.push("/viewer/" + _id);
    }

    const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

    const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

    return(
        <div className='region-viewer'>
            <WRow>
                <WCol id="controls" size='2'>
                    <WButton 
                        color="primary"
                        shape="pill"
                        onClick={returnToSpreadsheet}
                    >
                    <span className="material-icons">menu</span>
                    </WButton>
                    {
                        parentRegion.subregions.length > 1 ?                     
                        <WButton 
                            color="primary"
                            shape="pill"
                            onClick={viewPreviousSibling}
                        >
                        <span className="material-icons">arrow_back</span>
                        </WButton> : 
                        <WButton 
                            color="primary"
                            shape="pill"
                            onClick={viewPreviousSibling}
                            disabled="True"
                        >
                        <span className="material-icons">arrow_back</span>
                        </WButton>
                    }
                    {
                        parentRegion.subregions.length > 1 ?                     
                        <WButton 
                            color="primary"
                            shape="pill"
                            onClick={viewNextSibling}
                        >
                        <span className="material-icons">arrow_forward</span>
                        </WButton> : 
                        <WButton 
                            color="primary"
                            shape="pill"
                            onClick={viewNextSibling}
                            disabled="True"
                        >
                        <span className="material-icons">arrow_forward</span>
                        </WButton>
                    }
                    <WButton 
                        className='undo-redo-buttons'
                        color="primary"
                        shape="pill"
                        disabled={!canUndo}
                        onClick={tpsUndo}
                    >
                    <span className="material-icons">undo</span>
                    </WButton>
                    <WButton 
                        className='undo-redo-buttons'
                        color="primary"
                        shape="pill"
                        disabled={!canRedo}
                        onClick={tpsRedo}
                    >
                    <span className="material-icons">redo</span>
                    </WButton>                    
                </WCol>
                <WCol size='10'>
                {
                regionPath &&
                    regionPath.map((region, index) => (
                        index <= 0 ? 
                            <span 
                                className='region-tree-path'
                                key={index}
                                onClick={() => {
                                    setOtherRegion(region._id)
                                }}
                            >{region.name}</span> :
                            <span 
                                key={index}
                                className='region-tree-path'
                                onClick={() => {
                                    setOtherRegion(region._id)
                                }}
                            > {'>'} {region.name}</span>
                        )
                    )
                }                    
                </WCol>
            </WRow>
            <WRow>
                <WCol size='6' className='region-data-titles'>
                    <img id='picOfFlag' src={imgSrc} alt='flag'></img>
                    <div>
                        <span className='region-viewer-title'>Region Name: </span>
                        <span className='region-data'>{activeRegion.name}</span>
                    </div>
                    {
                        !editingParentRegion ? 
                        <div>
                            <span className='region-viewer-title'>Parent Region: </span>
                            <span className='region-data' id="parent-region-style">{parentRegion.name}</span>
                            {parentRegion.name !== 'none' ? 
                                <span className='material-icons edit-parent-region' onClick={() => toggleEditingParentRegion(true)}>edit</span> 
                            : null}
                        </div> : 
                        <div>
                            <WInput 
                                wType='filled'
                                className='change-parent-region-input'
                                labelText="Parent Region"
                                labelAnimation='fixed-shrink'
                                barAnimation='left-to-right'
                                defaultValue={parentRegion.name}
                                autoFocus
                                onBlur={editParentRegion}
                            >
                            </WInput>
                        </div>
                    }
                    <div>
                        <span className='region-viewer-title'>Region Capital: </span>
                        <span className='region-data'>{activeRegion.capital}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'>Region Leader: </span>
                        <span className='region-data'>{activeRegion.leader}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'># Of Sub Regions: </span>
                        <span className='region-data'>{subregions.length}</span>
                    </div>
                </WCol>
                <WCol size='6'>
                    <h1 id="region-landmark-title">Region Landmarks: </h1>
                    <div id='landmark-list'>
                        <LandmarksList 
                            map={activeRegion} 
                            landmarks={landmarks}
                            activeLandmarks={activeRegionLandmarks}
                            deleteLandmark={deleteLandmark}
                            showDelete={handleDeleteLandmark}
                            editLandmark={editLandmark}
                        />
                    </div>
                    <div>
                        <form id='landmark-form' onSubmit={handleSubmit}>
                            <WRow>
                                    <WCol size='1' className='landmark-input-col'>
                                        <WButton
                                            className='add-landmark-button'
                                            type='submit'
                                            form='landmark-form'
                                        >
                                            <span className='material-icons'>add</span>
                                        </WButton>
                                    </WCol>
                                    <WCol size='11' className='landmark-input-col'>
                                        <WInput
                                            type='text'
                                            className='landmark-input'
                                            onChange={handleChange}
                                            value={landmarkToBeAdded}
                                        />
                                    </WCol>
                            </WRow>
                        </form>
                    </div>
                </WCol>
            </WRow>
            {
                showDelete ? <DeleteLandmarkModal
                                showDelete={showDelete}
                                toggleShowDelete={toggleShowDelete}
                                landmarkToBeDeleted={landmarkToBeDeleted}
                                deleteLandmark={deleteLandmark}
                            /> : null
            }
        </div>
    )
}

export default RegionViewer;