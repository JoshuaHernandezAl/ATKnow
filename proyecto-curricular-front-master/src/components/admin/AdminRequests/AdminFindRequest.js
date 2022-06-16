import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { atKnowRequestLoading } from '../../../actions/admin';
import { Spinner } from '../../ui/Spinner';
import { ATKnowRequests } from './ATKnowRequests';

export const AdminFindRequest = () => {
    const {query}=useParams();
    const dispatch = useDispatch();
    useEffect(() => {
            dispatch(atKnowRequestLoading(query));
    }, [dispatch,query]);
    const {atKnowRequests=[],loading} = useSelector(state => state.admin);
    if(loading){
        return(
            <Spinner/>
        )
    }else{
        if(atKnowRequests.length ===0){
            return (
                <div>
                    <h2 className="text-center pt-5">No hay solicitudes con ese identificador</h2>
                </div>
            )
        }
        return (
            <div className="container mt-2">
                <h3 className="text-center pt-5">Solicitud:</h3>
                <ATKnowRequests atKnowRequests={atKnowRequests}/>
            </div>
        )
    }
}
