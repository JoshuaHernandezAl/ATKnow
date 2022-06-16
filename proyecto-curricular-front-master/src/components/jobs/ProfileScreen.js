import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { deleteAccount } from '../../actions/auth'
import { updateATKnowRole, updateProfile } from '../../actions/profile'
import { useForm } from '../../hooks/useForm'
import "./styles.css"
export const ProfileScreen = ({history}) => {
    const mimes=['image/jpeg', 'image/png', 'image/jpg'];
    const {name,premium,email,image,uid,role,ssRequest} = useSelector(state => state.auth);
    const [updateProfileValues,setProfileValues] =useForm({
        name,
        email,
    });
    const dispatch = useDispatch();
    const [file, setFile] = useState('');
    const [password, setPassword] = useState('')
    const handleFile=(e)=>{
        setFile(e.target.files[0])
    }
    const handlePassword=(e)=>{
        setPassword(e.target.value);
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(updateProfileValues.name === '' || updateProfileValues.email === '' ){
            Swal.fire('Error','Error, todos los campos son obligatorios','error');
            return;
        }
        if(file!==''){
            if(!mimes.includes(file.type)){
                Swal.fire('Error','Adjunta una imagen válida (png,jpeg,jpg)','error');
                return;
            }
        }
        if(password!==''){
            dispatch(updateProfile(uid,{password,...updateProfileValues},file));
        }else{
            dispatch(updateProfile(uid,{...updateProfileValues},file));
        }
        
        history.push('/');
    }
    const handlePremium=()=>{
        history.push('/home/payment')
    }
    const handleSS=()=>{
        Swal.fire({
            title: '¿Desea realizar una solicitud a ATKnow Académico?',
            text: "ATKnow Académico le permite publicar vacantes de tipo práctica profesional o servicio social",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aplicar',
            cancelButtonText:"Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title:'Eviando solicitud',
                    text:"Por favor espere",
                    allowOutsideClick:false,
                    showConfirmButton:false,
                    willOpen:()=>{
                        Swal.showLoading();
                    }
                });
                dispatch(updateATKnowRole(uid));
                history.replace('/home/profile');
            }
        });
    }
    const handleDelete=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que desea eliminar su cuenta?',
            text: "Una vez eleminada su cuenta no podra ser recuperada",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText:"Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAccount(uid));
                Swal.fire({
                    title:'Eliminando cuenta',
                    text:"Por favor espere",
                    allowOutsideClick:false,
                    showConfirmButton:false,
                    willOpen:()=>{
                        Swal.showLoading();
                    }
                });
                history.replace('/landing');
            }
        });
    }
    // console.log(updateProfileValues);
    return (
        <>
            <h1 className="text-center pt-5">Mi perfil</h1>
            <div className="row">
                <div className="col-md-7 text-center">
                    <h3 className="pt-5 fw-bold mb-5">Mis datos:</h3>
                    <p className="fs-1">Nombre:<strong className="px-4">{name}</strong></p>
                    <p className="fs-1">Email:<strong className="px-4">{email}</strong></p>
                    {
                        !premium&&<button className="btn btn-outline-warning btn-f-size__15 btn-f-weight__bold m-3" onClick={handlePremium}>Cambiar a usuario premium</button>
                    }
                    {
                        (role==='USER_ROLE')?
                        (ssRequest)?'':
                        <button className="btn btn-outline-primary btn-f-size__15 btn-f-weight__bold" onClick={handleSS}>ATKnow Académico</button>
                        :''
                    }
                </div>
                <div className="col-md-5">
                    <div className="field d-flex justify-content-center">
                        {(!image)?<h2 className="h-text m-5">No hay imagen de perfil</h2>:
                        <img src={`${process.env.REACT_APP_RESOURCES}/profiles/${image}`} className="m-5" alt="profile"/>}
                    </div>
                    <div className="field d-flex justify-content-center">
                        <button className="btn btn-outline-danger btn-f-size__15 btn-f-weight__bold col-6" onClick={handleDelete}>
                            Eliminar cuenta
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-5 m-5" >
                <h2>Actualizar Perfil</h2>
                <form  className="default-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="field col-9">
                            <label >Nombre:</label>
                            <input type="text" name="name" placeholder="Nombre" value={updateProfileValues.name} onChange={setProfileValues}/>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="field col-9">
                            <label >Email:</label>
                            <input type="text" name="email" placeholder="Email" value={updateProfileValues.email} onChange={setProfileValues} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-9">
                            <label >contraseña:</label>
                            <input type="password" name="password" placeholder="Contraseña" onChange={handlePassword} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-9">
                            <label >Imagen de perfil:</label>
                            <input type="file" name="cv" className="form-control form-control-sm" onChange={handleFile}/>
                        </div>
                    </div>
                    <div className="field row">
                        <input type="submit" className="btn btn-warning btn-f-size__15 btn-f-weight__bold col-6" value="Actualizar"/>
                    </div>
                </form>
                
            </div>
        </>
    )
}
