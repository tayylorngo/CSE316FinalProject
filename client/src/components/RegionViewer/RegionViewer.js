import React, { useState } from 'react';
import './RegionViewer.css';
import {WRow, WCol, WButton, WInput} from 'wt-frontend';
import LandmarksList from '../LandmarksList/LandmarksList';
import {useParams, Redirect} from 'react-router-dom';
import { useQuery, useMutation } 		from '@apollo/client';
import { GET_DB_REGIONS }	from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';

const RegionViewer = (props) => {

    let activeRegion = {};
    let subregions = [];

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

    const [landmarkToBeAdded, setLandmarkToBeAdded] = useState('');

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

    const [AddLandmark] 				= useMutation(mutations.ADD_LANDMARK, mutationOptions);


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
		await AddLandmark({variables: {_id: activeRegion._id, name: landmarkToBeAdded}, refetchQueries: [{query: GET_DB_REGIONS}]});
        setLandmarkToBeAdded('');
    }

    const handleChange = (e) => {
        setLandmarkToBeAdded(e.target.value);
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
                    <span className="material-icons">arrow_back</span>
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
                        <LandmarksList map={activeRegion}/>
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
        </div>
    )
}

export default RegionViewer;