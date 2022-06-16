import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './payment.css'
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2';
import { starPayment } from '../../actions/payment';
import { Spinner } from '../ui/Spinner';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom';

export const CheckoutForm = () => {
    const stripe=useStripe();
    const dispatch = useDispatch();
    const elements=useElements();
    const {uid} = useSelector(state => state.auth);
    const history = useHistory(); 
    const [monthsSelect,handleMonths]=useForm({
        months:0,
    });
    const {months}=monthsSelect;
    const handlePayment=async(e) => {
        e.preventDefault();
        if(months===0){
            Swal.fire('Error',"Selecciona por cuantas meses deseas parte de ATKnow Premium",'error')
            return;
        }
        Swal.fire({
            title:'Generando datos del pago',
            text:"Por favor espere en lo que se generan las credenciales de pago",
            allowOutsideClick:false,
            showConfirmButton:false,
            willOpen:()=>{
                Swal.showLoading();
            }
        })
        if (!stripe || !elements) return;
        const {error,paymentMethod}=await stripe.createPaymentMethod({
            type:"card",
            card:elements.getElement(CardElement)
        });
        if(!error){        
            const {id}=paymentMethod;
            const data={
                id,
                months,
                uid,
            }
            Swal.close();
            Swal.fire({
                title: '¿Listo para ser miembro de ATKnow Premium?',
                text: "Antes de confirmar, porfavor cerciorate de que tus datos son correctos",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText:"Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(starPayment(data));
                    history.replace('/home/profile');
                }
            });
        }else{
            Swal.fire('Error',"Ingresa los datos de la tarjeta o asegurate que sean los correctos");
        }
    }
    if(!stripe){
        return(
            <Spinner/>
        );
    }
    return (
        <>
            <div className="row">
                <div className="col-md-10 payment-form  m-auto">
                    <h2 className="text-center mt-3">Vuelvete premium</h2>
                    <p className="text-center mt-3">Accede a todos los beneficios de ATKnow Premium</p>
                    <form onSubmit={handlePayment} className="mt-54">
                        <div className="row mb-3">
                            <label className="col-md-3 form-label">Datos de terjeta:</label>
                            <div className="col-md-8">
                                <CardElement
                                    className="pt-3 form-control"
                                />
                            </div>
                            
                        </div>
                        <div className="row mb-3 mt-5">
                            <label className="col-md-3 form-label">Tiempo y precio:</label>
                            <div className="col-md-8">
                                <select  name="months"  className="form-select fs-3" onChange={handleMonths}>
                                    <option value="">---Selecciona---</option>
                                    <option value="1">1 mes-$5</option>
                                    <option value="3">3 meses-$13</option>
                                    <option value="6">6 meses-$22</option>
                                    <option value="12">1 año-$38</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group btn-center mt-4">
                            <input 
                                type="submit"
                                className="btnSubmit btn-center"
                                value="Pagar"
                                disabled={!stripe} 
                            />
                        </div>
                    </form>
                    <Link 
                        className="none" 
                        to="/home/benefits"
                    >
                        <p className="link_ls fs-3ß">Beneficios de ser usuario premium</p>
                    </Link>
                </div>
            </div>
        </>
    )
}
