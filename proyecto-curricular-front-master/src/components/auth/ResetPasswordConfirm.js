import React from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { resetPassword } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';

export const ResetPasswordConfirm = ({history}) => {
    const [formValues,handleInputChange]=useForm({
        password:'',
        passwordMatch:'',
    });
    const {token}=useParams();
    const dispatch = useDispatch();
    const {password,passwordMatch} = formValues;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password !== passwordMatch) {
            return Swal.fire('Error','Los email no coinciden','error');
        }
        dispatch(resetPassword(password,passwordMatch,token));
        // console.log(password,passwordMatch,token);
        Swal.fire({
            title:'Actualizando tu contraseña',
            text:"Espera hasta que se realicen los cambios en tu perfil",
            allowOutsideClick:false,
            showConfirmButton:false,
            willOpen:()=>{
                Swal.showLoading();
            }
        });
        history.replace('/restricted/login');
    }
    return (
        <div className="container pt-5">
            <h1>Restablecer contraseña</h1>
            <form onSubmit={handleSubmit} className="mt-5">
                <div className="row mb-3">
                    <label className="col-md-2 form-label">Contraseña</label>
                    <div className="col-md-3">
                        <input 
                            type="password"
                            className="form-control f-size"
                            placeholder="Contraseña"
                            name='password'
                            value={password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-2 form-label">Confirmar contraseña</label>
                    <div className="col-md-3">
                        <input 
                            type="password"
                            className="form-control f-size"
                            placeholder="Confirmar contraseña"
                            name='passwordMatch'
                            value={passwordMatch}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group mt-4">
                    <input 
                        type="submit"
                        className="btn btn-primary fs-3 fw-bold"
                        value="Reestablecer" 
                    />
                </div>
            </form>
        </div>
    )
}
