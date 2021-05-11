import React, {useState} from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import RegionEntry from '../RegionEntry/RegionEntry';
import {Switch, Route, useParams} from 'react-router-dom';
import { useQuery, useMutation } 		from '@apollo/client';
import { GET_DB_REGIONS }	from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';

const MapSpreadsheet = (props) => {

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

    const [AddRegion] 				= useMutation(mutations.ADD_REGION, mutationOptions);

    let activeRegion = {};
    let subregions = [];

    const [showRegionViewer, toggleShowRegionViewer] = useState(false);
    const {id} = useParams();

	const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
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
		AddRegion({variables: {region: newRegion, _id: currMap._id, index: index}, refetchQueries: [{query: GET_DB_REGIONS}]});
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

    const marginTop = {
        marginTop: "2.3%"
    }

    const marginTop2 = {
        marginTop: "1.4%"
    }

    const whiteColor = {
        color: "white",
        fontSize: "2rem",
        marginRight: "0.5%"
    }

    if(showRegionViewer && props.map){
        props.history.push("/viewer/" + props.map._id);
    }

    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span id="nameOfRegion">{activeRegion.name}</span></div>
            <WRow>
                <WCol id="controls" size='2'>
                    <WButton 
                        onClick={goHome}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">home</span>
                    </WButton>
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
                    <div style={marginTop}>Name</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Capital</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Leader</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Flag</div>
                </WCol>
                <WCol size="4" className="table-heading">
                <div style={marginTop2}>Landmarks</div>
                </WCol>
            </WRow>
            {
                subregions &&
                subregions.map(entry => (
                    <RegionEntry
                        key={entry._id}
                        entry={entry}
                        handleSetActiveMap={setOtherRegion}
                        showRegionViewer={toggleShowRegionViewer}
                    />
                    )
                )
            }
        </div>
    );
}

export default MapSpreadsheet;