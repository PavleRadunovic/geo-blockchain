import React from 'react'

import './PopupResults.css'

const PopupResults = ({results, hidePopupResults}) => {

    return (
        <>
            {results.type === 'point' ? (
                <div className="popup-res">
                <div id="popup-res-content">
                    House number information: <i>{results.houseNumber}</i>
                </div>
                <div className="results">
                    <p>Longitude: {Math.round(results.longitude * 1000) / 1000}</p>
                    <p>Latitude: {Math.round(results.latitude * 1000) / 1000}</p>
                    <p>Contract address: {results.contractAddress}</p>
                    <p>Account: {results.account}</p>
                </div>
                <div className="options">
                    <button onClick={hidePopupResults} type="button" className="btn btn-danger">Close</button>
                </div>
            </div>
            ) : (
                <div className="popup-res">
                <div id="popup-res-content">
                    Cadastral object information:
                </div>
                <div className="results">
                    <p>Parcel number: {results.parcelNumber}</p>
                    <p>Object number: {results.objectNumber}</p>
                    <p>Contract address: {results.contractAddress}</p>
                    <p>Account: {results.account}</p>
                </div>
                <div className="options">
                    <button onClick={hidePopupResults} type="button" className="btn btn-danger">Close</button>
                </div>
            </div>
            )}
        </> 
    )
}

export default PopupResults;