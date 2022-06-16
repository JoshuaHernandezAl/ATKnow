import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { startActiveAccount } from '../../actions/auth';
import './login.css';

export const ActveAccountScreen = () => {
    const dispatch = useDispatch();
    const {token}=useParams();
    const handleActive=(e)=>{
        e.preventDefault();
        dispatch(startActiveAccount(token));
    }
    return (
        <div className="container"> 
            <h2 className="text-center pt-5">Bienvenido a ATKnow</h2>
            <h3 className="text-center pt-3">Por favor activa tu cuenta</h3>
            <div className="text-center pt-5">
                <button className="btn btn-outline-light fs-1" onClick={handleActive}>
                    Activar cuenta
                </button>
            </div>
        </div>
    )
}
