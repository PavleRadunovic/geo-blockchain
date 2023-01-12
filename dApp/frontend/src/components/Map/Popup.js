import React from 'react'

import './Popup.css'

const Popup = ({textPopup, hidePopup, addPoint}) => {

    return (
        <>
            {textPopup.type === 'point' ? (
                <div className="popup-res">
                <div id="popup-res-content">
                    You have clicked on the following coordinates:
                </div>
                <div className="results">
                    <p>Longitude: {Math.round(textPopup.lon * 1000) / 1000}</p>
                    <p>Latitude: {Math.round(textPopup.lat * 1000) / 1000}</p>
                    <label>
                        House number:
                    </label>
                    <input type="text" id="input-field"></input>
                </div>
    
                <div className="question">
                    Do you want to create a house number?
                </div>
                <div className="options">
                    <button type="button" onClick={addPoint} className="btn btn-success">Yes</button>
    
                    <button onClick={hidePopup} type="button" className="btn btn-danger">No</button>
                </div>
            </div>
            ) : (
                <div className="popup-res">
            <div id="popup-res-content">
                You have created the following object:
            </div>
            <div className="results">
                <label>
                    Parcel number:
                </label>
                <input type="text" id="input-field1"></input>
                <br/>
                <label>
                    Object number:
                </label>
                <input type="text" id="input-field2"></input>
            </div>

            <div className="question">
                Do you want to create a cadastral object?
            </div>
            <div className="options">
                <button type="button" onClick={addPoint} className="btn btn-success">Yes</button>

                <button onClick={hidePopup} type="button" className="btn btn-danger">No</button>
            </div>
        </div>
            )}
        </> 
        
    )
}

export default Popup;