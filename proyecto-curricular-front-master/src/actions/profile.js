import Swal from "sweetalert2";
import { fetchConTokenFile } from "../helpers/fetch";
import { login } from "./auth";

export const updateProfile=(uid,userInfo,fileupload)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Actualizando datos',
                text:"Por favor espere en lo que se actualiza su informacion",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const data={
                ...userInfo,
                fileupload,
            }
            const resp= await fetchConTokenFile(`users/update-user/${uid}`,data,'PUT');
            const body=await resp.json();
            if(body.ok){
                dispatch(login({
                    name:body.user.name,
                    email:body.user.email,
                    image:body.user.image,
                }));
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: body.msg,
                    showConfirmButton: false,
                    timer: 2000,
                })
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const updateATKnowRole=(uid)=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchConTokenFile(`users/update-role-user/${uid}`,{},'PUT');
            const body=await resp.json();
            if(body.ok){
                dispatch(login({
                    ssRequest:body.ssRequest,
                }));
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: body.msg,
                    text: body.msgDetail,
                    showConfirmButton: true,
                })
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}