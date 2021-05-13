import React, {useState} from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import RegionEntry from '../RegionEntry/RegionEntry';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useMutation } 		from '@apollo/client';
import { GET_DB_REGIONS }	from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import DeleteSubregion from '../modals/DeleteSubregion';

const MapSpreadsheet = (props) => {

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

    const [AddRegion] 				= useMutation(mutations.ADD_REGION, mutationOptions);
    const [DeleteRegion]            = useMutation(mutations.DELETE_REGION, mutationOptions);
    const [UpdateRegion]            = useMutation(mutations.UPDATE_REGION, mutationOptions);

    const [showDelete, toggleShowDelete] = useState(false);
    const [regionToBeDeleted, setRegionToBeDeleted] = useState({});

    let activeRegion = {};
    let subregions = [];

    const {id} = useParams();

	const { loading, error, data } = useQuery(GET_DB_REGIONS);
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
            if(region.parentRegion === activeRegion._id){
                subregions.push(region);            
            }
		}
    }

    const addRegion = async () => {
		let currMap = activeRegion;
		let newRegion = {
			_id: '',
			owner: props.user._id,
			name: "Untitled Region",
			capital: "None",
			leader: "None",
			parentRegion: currMap._id,
			subregions: [],
			landmarks: []
		};
		let index = currMap.subregions.length;
		await AddRegion({variables: {region: newRegion, _id: currMap._id, index: index}, refetchQueries: [{query: GET_DB_REGIONS}]});
    }

    const deleteRegion = async (_id) => {
        await DeleteRegion({variables: {_id: _id}, refetchQueries: [{query: GET_DB_REGIONS}]});
        setRegionToBeDeleted({});
    }

    const updateRegion = async (_id, field, value) => {
        await UpdateRegion({variables: {_id: _id, field: field, value: value}, refetchQueries: [{query: GET_DB_REGIONS}]});
    }

    const handleSetRegionToBeDeleted = (_id) => {
        toggleShowDelete(true);
        const selectedRegion = subregions.find(region => region._id === _id);
        setRegionToBeDeleted(selectedRegion);
    }

    const goHome = () => {
        props.history.push('/maps');
    }

    const returnToParentRegion = () => {
        if(activeRegion.parentRegion === "none"){
            goHome();
        }
        else{
            props.history.push('/maps/' + activeRegion.parentRegion);
        }
    }

    const setOtherRegion = (_id) => {
        props.history.push('/maps/' + _id);
    }

    if(!loading && Object.keys(activeRegion).length === 0){
        return <Redirect to='/home'/>
    }

    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span className="whiteColor">Region Name: </span><span id="nameOfRegion">{activeRegion.name}</span></div>
            <WRow>
                <WCol id="controls" size='2'>
                    <WButton 
                        onClick={addRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">add</span>
                    </WButton>
                    <WButton 
                        onClick={returnToParentRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">arrow_back</span>
                    </WButton>
                </WCol>
            </WRow>
            <WRow>
                <WCol size="2" className="table-heading">
                    <div className='marginTop'>Name</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div className='marginTop'>Capital</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div className='marginTop'>Leader</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div className='marginTop'>Flag</div>
                </WCol>
                <WCol size="4" className="table-heading">
                <div className='marginTop2'>Landmarks</div>
                </WCol>
            </WRow>
            {
                subregions &&
                subregions.map(entry => (
                    <RegionEntry
                        key={entry._id}
                        entry={entry}
                        handleSetActiveMap={setOtherRegion}
                        activeRegion={activeRegion}
                        history={props.history}
                        handleDeleteRegion={handleSetRegionToBeDeleted}
                        updateRegion={updateRegion}
                    />
                    )
                )
            }
            {showDelete ? <DeleteSubregion 
                            showDelete={showDelete} 
                            toggleShowDelete={toggleShowDelete}
                            deleteRegion={deleteRegion}
                            regionToBeDeleted={regionToBeDeleted}
                            /> : null}
        </div>
    );
}

export default MapSpreadsheet;