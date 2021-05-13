import React, { useState } from 'react';
import './RegionViewer.css';
import {WRow, WCol, WButton, WInput} from 'wt-frontend';
import LandmarksList from '../LandmarksList/LandmarksList';
import DeleteLandmarkModal from '../modals/DeleteLandmarkModal';
import {useParams, Redirect} from 'react-router-dom';
import { useQuery, useMutation } 		from '@apollo/client';
import { GET_DB_REGIONS }	from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';

const RegionViewer = (props) => {

    let activeRegion = {};
    let subregions = [];
    let landmarks = [];
    let activeRegionLandmarks = [];
    let defaultAllLandmarks = [];

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
        landmarks = activeRegion.landmarks;
        activeRegionLandmarks = activeRegion.landmarks;
        defaultAllLandmarks = activeRegion.landmarks;
        for(let region of subregions){
            for(let landmark of region.landmarks){
                landmarks = [...landmarks, (landmark + " - " + region.name)];
                defaultAllLandmarks = [...defaultAllLandmarks, (landmark)];
            }
        }
        landmarks.sort();
    }

    const [landmarkToBeAdded, setLandmarkToBeAdded] = useState('');
    const [landmarkToBeDeleted, setLandmarkToBeDeleted] = useState('');
    const [showDelete, toggleShowDelete]            = useState(false);

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

    const [AddLandmark] 				= useMutation(mutations.ADD_LANDMARK, mutationOptions);
    const [DeleteLandmark]              = useMutation(mutations.DELETE_LANDMARK, mutationOptions);

    const pic = 'https://cdn11.bigcommerce.com/s-kh80nbh17m/images/stencil/1280x1280/products/8349/36571/352BB113-139F-4718-A609-46F63A57B849-xl__41206.1561690686.1280.1280__08270.1574698216.jpg?c=2';

    const returnToSpreadsheet = () => {
        props.history.push('/maps/' + activeRegion._id);
    }

    if(!loading && Object.keys(activeRegion).length === 0){
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
		await AddLandmark({variables: {_id: activeRegion._id, name: landmarkToBeAdded}, refetchQueries: [{query: GET_DB_REGIONS}]});
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
        await DeleteLandmark({variables: {_id: activeRegion._id, name: landmark}, refetchQueries: [{query: GET_DB_REGIONS}]});
        setLandmarkToBeDeleted('');
    }

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
                </WCol>
            </WRow>
            <WRow>
                <WCol size='6' className='region-data-titles'>
                    <img src={pic}></img>
                    <div>
                        <span className='region-viewer-title'>Region Name: </span>
                        <span className='region-data'>{activeRegion.name}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'>Parent Region: </span>
                        <span className='region-data' id="parent-region-style">{activeRegion.parentRegion}</span>
                    </div>
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