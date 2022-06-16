import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { startLogin, startRegister } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';
import './login.css';

export const LoginScreen = () => {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [formLoginValues,handleLoginInputChange]=useForm({
        lEmail:'test5@test.com',
        lPassword:'123123',
    });
    const [formRegisterValues,handleRegisterInputChange]=useForm({
        rEmail:'test1@test.com',
        rPassword1:'123123',
        rPassword2:'123123',
        rName:'Camilla Puga'
    });
    const {rEmail,rPassword1,rPassword2,rName,}= formRegisterValues;
    const dispatch = useDispatch();
    const {lEmail,lPassword}=formLoginValues;
    const handleLogin=(e)=>{
        e.preventDefault();
        if(lEmail==='' || lPassword===''){
            return Swal.fire('Error','Todos los campos son obligatorios','error')
        }
        dispatch(startLogin(lEmail,lPassword));
    }
    const handleRegister=(e)=>{
        e.preventDefault();
        if(rEmail==='' || rName===''){
            return Swal.fire('Error','Todos los campos son obligatorios','error')
        }
        if(rPassword1!==rPassword2){
            return Swal.fire('Error','Las contraseñas deben ser iguales','error')
        }
        dispatch(startRegister(rEmail,rPassword1,rPassword2,rName));
        Swal.fire({
            title:'Creando cuenta',
            text:"Por favor espere mientras se registran sus datos de acceso",
            allowOutsideClick:false,
            showConfirmButton:false,
            willOpen:()=>{
                Swal.showLoading();
            }
        });
    }
    const handleShowPassword=(e)=>{
        e.preventDefault();
        setShow(!show);
    }
    const handleShowPassword1=(e)=>{
        e.preventDefault();
        setShow1(!show1);
    }
    const handleShowPassword2=(e)=>{
        e.preventDefault();
        setShow2(!show2);
    }
    return (
        <>
            <h1 className="center">Bienvenido a ATKnow</h1>
            <div className="container login-container">
                <div className="row">
                    <div className="col-md-5 login-form-1">
                        <h3>Ingreso</h3>
                        <form onSubmit={handleLogin} className="mt-5">
                            <div className="row mb-3">
                                <label className="col-md-4 form-label">Email</label>
                                <div className="col-md-8">
                                    <input 
                                        type="text"
                                        className="form-control f-size"
                                        placeholder="Email"
                                        name='lEmail'
                                        value={lEmail}
                                        onChange={handleLoginInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label  className="col-md-4 form-label">Contraseña</label>
                                <div className="col-md-8 d-flex justify-content-start">
                                    <input
                                        type={(show?'text':'password')}
                                        className="form-control f-size"
                                        placeholder="Contraseña"
                                        name='lPassword'
                                        value={lPassword}
                                        onChange={handleLoginInputChange}
                                    />
                                    <button className="btn btn-dark" onClick={handleShowPassword}><span className='fs-4'>{(show)?<i className="far fa-eye-slash"></i>:<i className="far fa-eye"></i>}</span></button>
                                </div>
                            </div>
                            <div className="form-group btn-center mt-4">
                                <input 
                                    type="submit"
                                    className="btnSubmit btn-center"
                                    value="Ingresar" 
                                />
                            </div>
                        </form>
                        <Link 
                            className="none" 
                            to="/restricted/reset-password"
                        >
                            <p className="link_ls fs-4">¿Olvidaste tu contraseña?</p>
                        </Link>
                        {/* <Link 
                            className="none" 
                            to="/restricted/ss-login"
                        >
                            <p className="link_ls fs-5">¿Eres alumno o administrativo de servicio social? Ingresa aquí</p>
                        </Link> */}
                    </div>

                    <div className="col-md-6 login-form-2">
                        <h3>Registro</h3>
                        <form onSubmit={handleRegister}>
                            <div className="row mb-3">
                                <label  className="col-md-4 form-label">Nombre</label>
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control f-size"
                                        placeholder="Nombre"
                                        name='rName'
                                        value={rName}
                                        onChange={handleRegisterInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label  className="col-md-4 form-label">Email</label>
                                <div className="col-md-8">
                                    <input
                                        type="email"
                                        className="form-control f-size"
                                        placeholder="Correo"
                                        name='rEmail'
                                        value={rEmail}
                                        onChange={handleRegisterInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label  className="col-md-4 form-label">Contaseña</label>
                                <div className="col-md-8 d-flex justify-content-start">
                                    <input
                                        type={(show1?'text':'password')}
                                        className="form-control f-size"
                                        placeholder="Contraseña"
                                        name='rPassword1'
                                        value={rPassword1}
                                        onChange={handleRegisterInputChange} 
                                    />
                                    <button className="btn btn-dark" onClick={handleShowPassword1}><span className='fs-4'>{(show1)?<i className="far fa-eye-slash"></i>:<i className="far fa-eye"></i>}</span></button>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label  className="col-md-4 form-label">Confirmar</label>
                                <div className="col-md-8 d-flex justify-content-start">
                                    <input
                                        type={(show2?'text':'password')}
                                        className="form-control f-size"
                                        placeholder="Repita la contraseña" 
                                        name='rPassword2'
                                        value={rPassword2}
                                        onChange={handleRegisterInputChange}
                                    />
                                    <button className="btn btn-dark" onClick={handleShowPassword2}><span className='fs-4'>{(show2)?<i className="far fa-eye-slash"></i>:<i className="far fa-eye"></i>}</span></button>
                                </div>
                            </div>
                            <div className="form-group btn-center">
                                <input 
                                    type="submit"
                                    className="btnSubmit btn-center"
                                    value="Registrar" 
                                />
                            </div>
                        </form>
                        {/* <Link 
                            className="none" 
                            to="/restricted/ss-register"
                        >
                            <p className="link_rs fs-4">¿Eres alumno o administrativo de servicio social? Registrate aquí</p>
                        </Link> */}
                    </div>
                </div>
            </div>
        </>
    )
}
