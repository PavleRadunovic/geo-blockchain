import React from 'react'

import './ChoiceOfgeometry.css'

const ChoiceOfgeometry = ({feature, showPopupView, getPoint, titleAdd, titleGet}) => {

    return (
        <div className={feature}>
            <div>
                <button onClick={showPopupView} type="button" className="btn btn-light">{titleAdd}</button>
            </div>
            <div>
                <button onClick={getPoint} type="button" className="btn btn-light">{titleGet}</button>
            </div>
        </div>
    )
}

export default ChoiceOfgeometry;