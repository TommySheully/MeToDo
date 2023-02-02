import React from 'react';
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const Loading = () => {
    return (
        <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    );
};

export default Loading;