import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { login } from "./auth";


export const starPayment = (data)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Realizando pago',
                text:"Por favor espere en lo que se actualiza su información",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp= await fetchConToken(`payments/payment`,data,'POST');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                dispatch(login({
                    premium:body.premium
                }));
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: body.msg,
                    text:'Revisa los beneficios de ser premium en tu correo',
                    showConfirmButton: false,
                    timer: 2000,
                });

            }else{
                const {detail,msg}=body;
                if(!detail){
                    Swal.fire('Error',body.msg,'error');
                }else{
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: msg,
                        text: `Detalles del error: ${detail}`,
                    });
                }
            }
        }catch(err){
            console.log(err);
        }
    }
}