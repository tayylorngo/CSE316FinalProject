import React from 'react';

const Logo = (props) => {
    return (
        <div className='logo' onClick={() => {props.history.push('/home')}}>
            The World Data Mapper
        </div>
    );
};

export default Logo;