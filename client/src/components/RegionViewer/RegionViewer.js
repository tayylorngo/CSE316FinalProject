import React from 'react';
import './RegionViewer.css';
import {WRow, WCol} from 'wt-frontend';

const RegionViewer = (props) => {

    const pic = 'https://cdn11.bigcommerce.com/s-kh80nbh17m/images/stencil/1280x1280/products/8349/36571/352BB113-139F-4718-A609-46F63A57B849-xl__41206.1561690686.1280.1280__08270.1574698216.jpg?c=2';

    return(
        <div className='region-viewer'>
            <WRow>
                <WCol size='6'>
                    <img src={pic}></img>
                </WCol>
                <WCol size='6'>
                    <h1>Region Landmarks: </h1>
                </WCol>
            </WRow>
            <WRow>
                <WCol size='6' className='region-data-titles'>
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

                </WCol>
            </WRow>
        </div>
    )
}

export default RegionViewer;