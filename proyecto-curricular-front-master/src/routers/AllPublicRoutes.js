import React from 'react';
import {Route} from 'react-router-dom';

export const AllPublicRoutes = ({
    component:Component,
    ...rest
}) => {
    return (
        <div>
            <Route {...rest} component={(props)=>(<Component {...props}/>)} />
        </div>
    )
}
