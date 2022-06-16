import React from 'react'
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { resetPasswordEmail } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';

export const ResetPasswordScreen = ({history}) => {
    const [formValues,handleInputChange]=useForm({
        email: 'test5@test.com',
        email2:'test5@test.com',
    });
    const dispatch = useDispatch();
    const {email,email2} = formValues;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(email !== email2) {
            return Swal.fire('Error','Los email no coinciden','error');
        }
        dispatch(resetPasswordEmail(email));
        Swal.fire({
            title:'Enviando correo',
            text:"Revisa tu correo electronico para restablecer tu contraseña.",
            allowOutsideClick:false,
            showConfirmButton:false,
            willOpen:()=>{
                Swal.showLoading();
            }
        });
        history.replace('/restricted/login')
    }
    return (
        <div className="container pt-5">
            <h1>Restablecer contraseña</h1>
            <form onSubmit={handleSubmit} className="mt-5">
                <div className="row mb-3">
                    <label className="col-md-2 form-label">Email</label>
                    <div className="col-md-3">
                        <input 
                            type="email"
                            className="form-control f-size"
                            placeholder="Email"
                            name='email'
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-2 form-label">Confirmar Email</label>
                    <div className="col-md-3">
                        <input 
                            type="email"
                            className="form-control f-size"
                            placeholder="Confirmar email"
                            name='email2'
                            value={email2}
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
