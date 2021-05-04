import React from 'react';
import './RegionViewer.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import LandmarksList from '../LandmarksList/LandmarksList';

const RegionViewer = (props) => {

    const pic = 'https://cdn11.bigcommerce.com/s-kh80nbh17m/images/stencil/1280x1280/products/8349/36571/352BB113-139F-4718-A609-46F63A57B849-xl__41206.1561690686.1280.1280__08270.1574698216.jpg?c=2';

    if(Object.keys(props.map).length === 0){
        props.history.push('/maps');
        return(null);
    }

    const goHome = () => {
        props.setActiveMap();
    }

    const returnToSpreadsheet = () => {
        props.history.push('/maps/' + props.map._id);
    }

    return(
        <div className='region-viewer'>
            <WRow>
                <WCol id="controls" size='2'>
                    <WButton 
                        color="primary"
                        shape="pill"
                        onClick={goHome}
                    >
                    <span className="material-icons">home</span>
                    </WButton>
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
                        <span className='region-data'>{props.map.name}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'>Parent Region: </span>
                        <span className='region-data' id="parent-region-style">{props.map.parentRegion}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'>Region Capital: </span>
                        <span className='region-data'>{props.map.capital}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'>Region Leader: </span>
                        <span className='region-data'>{props.map.leader}</span>
                    </div>
                    <div>
                        <span className='region-viewer-title'># Of Sub Regions: </span>
                        <span className='region-data'>{props.map.subregions.length}</span>
                    </div>
                </WCol>
                <WCol size='6'>
                    <h1 id="region-landmark-title">Region Landmarks: </h1>
                    <div id='landmark-list'>
                        <LandmarksList map={props.map}/>
                    </div>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionViewer;