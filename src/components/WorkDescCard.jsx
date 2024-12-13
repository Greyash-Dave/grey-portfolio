import React from 'react'
import './WorkDescCard.css'

const WorkDescCard = ({src}) => {
  return (
    <>
        <div className="workdesccard">
            <img src={src} />
        </div>
    </>
  )
}

export default WorkDescCard