import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken } from "../helpers/fetch";

import { types } from "../types/types";

export const startLogin=(email,password)=>{
    return async(dispatch)=>{
        const resp=await fetchSinToken('auth/login',{email,password},'POST');
        const body=await resp.json();
        if(body.ok){
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            const res=await fetchConToken(`vacancies/user/${body.user.uid}`);
            const vacancies=await res.json();            
            if(vacancies.ok) {
                dispatch(login({
                    uid:body.user.uid,
                    name:body.user.name,
                    vacancies:vacancies.vacancies,
                    role:body.user.role,
                    premium:body.user.premium,
                    image:body.user.image,
                    email:body.user.email,
                    ssRequest:body.user.ssRequest,
                }));
            }else{
                Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                dispatch(checkingFinish());
            }
        }else{
            Swal.fire('Error',body.msg,'error');
        }
    }
}
export const startRegister=(email,password,passwordMatch,name) => {
    return async(dispatch)=>{
        const resp=await fetchSinToken('users/create-user',{email,password,passwordMatch,name},'POST');
        const body=await resp.json();
        // console.log(body)
        if(body.ok){
            Swal.close();
            Swal.fire(
                'Listo!',
                'Tu cuenta ha sido creada correctamente, pero esta inactiva. Activala desde tu correo electrónico',
                'success'
            );
            dispatch(checkingFinish());
        }else{
            Swal.fire('Error',body.msg,'error');
        }
    }
}
export const startActiveAccount=(token)=>{
    return async(dispatch)=>{
        const resp=await fetchSinToken(`auth/active-acount/${token}`,{},'PUT');
        const body=await resp.json();
        if(body.ok){
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            const res=await fetchConToken(`vacancies/user/${body.user.uid}`);
            const vacancies=await res.json();
            if(vacancies.ok) {
                Swal.fire(
                    'Cuanta activada',
                    'Gracias por registrarse en ATKnow',
                    'success'
                );
                dispatch(login({
                    uid:body.user.uid,
                    name:body.user.name,
                    vacancies:vacancies.vacancies,
                    role:body.user.role,
                    premium:body.user.premium,
                    email:body.user.email,
                    image:body.user.image,
                    ssRequest:body.user.ssRequest,
                }));
            }else{
                Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                dispatch(checkingFinish());
            }
        }
    }
}
export const startChecking=()=>{
    return async(dispatch)=>{
        const checkToken= localStorage.getItem('token');
        if(checkToken && checkToken !== 'undefined' ){
            const resp=await fetchConToken('auth/renew');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                localStorage.setItem('token',body.token);
                localStorage.setItem('token-init-date',new Date().getTime());
                const res=await fetchConToken(`vacancies/user/${body.userAuth.uid}`);
                const vacancies=await res.json();
                const vacanciesUser=vacancies.vacancies.map((vacancie)=>{
                    const {lng,lat,dir}=vacancie.location;
                    vacancie.location=[lat,lng,dir]
                    return vacancie;
                });
                // console.log(body);
                if(vacancies.ok) {
                    dispatch(login({
                        uid:body.userAuth.uid,
                        name:body.userAuth.name,
                        vacancies:vacanciesUser,
                        role:body.userAuth.role,
                        premium:body.userAuth.premium,
                        email:body.userAuth.email,
                        image:body.userAuth.image,
                        ssRequest:body.userAuth.ssRequest,
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                dispatch(checkingFinish());
            }
        }else{
            dispatch(checkingFinish());
        }
    };
}
export const resetPasswordEmail =(email)=>{
    return async()=>{
        const resp=await fetchSinToken('auth/reset-password-email',{email},'POST');
        const body=await resp.json();
        // console.log(body)
        if(body.ok){
            Swal.close();
            Swal.fire(
                'Listo!',
                'Correo enviado',
                'success'
            );
        }else{
            Swal.fire('Error',body.msg,'error');
        }
    }

}
export const resetPassword =(password,passwordMatch,token)=>{
    return async()=>{
        const resp=await fetchSinToken('auth/reset-password',{password,passwordMatch,token},'PUT');
        const body=await resp.json();
        // console.log(body)
        if(body.ok){
            Swal.close();
            Swal.fire(
                'Listo!',
                'Tú contraseña ha sido actualizada.',
                'success'
            );
        }else{
            Swal.fire('Error',body.msg,'error');
        }
    }
}
export const deleteAccount=(uid)=>{
    return async(dispatch)=>{
        const resp=await fetchConToken(`users/delete-user/${uid}`,{},'DELETE');
        const body=await resp.json();
        // console.log(body)
        if(body.ok){
            Swal.close();
            Swal.fire(
                'Listo!',
                'Tú cuenta ha sido eliminada. Lamentamos que te vayas.',
                'success'
            );
            localStorage.clear();
            dispatch(logout());
        }else{
            Swal.fire('Error',body.msg,'error');
        }
    }
}
export const checkingFinish =()=>{
    return {
        type:types.authCheckingFinish,
    }
}
export const login=(user)=>{
    return {
        type:types.authLogin,
        payload:user,
    }
}
export const startLogout=()=>{
    return (dispatch)=>{
        localStorage.clear();
        dispatch(logout());
    }
}
const logout=()=>{
    return {
        type:types.authLogout,
    }
}