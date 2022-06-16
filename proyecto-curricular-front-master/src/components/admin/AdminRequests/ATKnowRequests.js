import React from 'react'
import { ATKnowRequest } from './ATKnowRequest'

export const ATKnowRequests = ({atKnowRequests}) => {
    return (
        <div className="pt-3">
            {
                atKnowRequests.map(atKnowRequest=>{
                    return <ATKnowRequest key={atKnowRequest.uid} {...atKnowRequest}/>
                })
            }
        </div>
    )
}
