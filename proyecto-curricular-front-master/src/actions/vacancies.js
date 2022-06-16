import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken, fetchSinTokenFile} from "../helpers/fetch";

import { types } from "../types/types";
import { checkingFinish, login } from "./auth";

export const dataLoaded=()=>{
    return {
        type:types.dataLoaded,
    }
}

export const userBestVacancies=(id)=>{
    return async(dispatch)=>{
        const resp= await fetchConToken(`vacancies/best-vacancies-user/${id}`);
        const body=await resp.json();
        
        if(body.ok){
            dispatch(dataChartLoaded({
                vacanciesChart:body.vacancies,
                totalCandidates:body.user
            }));
            dispatch(dataLoaded());
        }else{
            Swal.fire('Error',body.msg,'error');
            dispatch(dataLoaded());
        }
    };
}
const dataChartLoaded=(dataChart)=>{
    return {
        type:types.vacancieDataChart,
        payload:dataChart,
    }
}

export const searchFast=(from,limit,query)=>{
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchSinToken(`vacancies/search-fast/${query}?from=${from}&limit=${limit}`),
                fetchSinToken(`vacancies/search-fast/${query}?from=${limit}&limit=${limit+5}`),
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ]);
            // console.log(body.vacancies);
            // console.log(bodyNext.vacancies);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies?.length > 0){
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(true));
                }else{
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(false));
                }
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
            

        }catch(err){
            console.log(err);
        }
    }
}
export const searchAdvanced=(from,limit,data)=>{
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchSinToken(`vacancies/search-advanced?from=${from}&limit=${limit}`,{...data},'POST'),
                fetchSinToken(`vacancies/search-advanced?from=${limit}&limit=${limit+5}`,{...data},'POST'),
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ]);
            console.log(body.vacancies);
            // console.log(bodyNext.vacancies);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies?.length > 0){    
                    console.log('aqui');                
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(true));
                }else{
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(false));
                }
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
            

        }catch(err){
            console.log(err);
        }
    }
}

export const vacanciesLoading =(from,limit)=> {
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchSinToken(`vacancies?from=${from}&limit=${limit}`),
                fetchSinToken(`vacancies?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ])
            // console.log(body.vacancies);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies.length > 0){
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(true));
                }else{
                    dispatch(vacanciesLoaded(body.vacancies));
                    dispatch(vacanciesNextLoaded(false));
                }
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
            

        }catch(err){
            console.log(err);
        }
    }
}
const vacanciesNextLoaded=(data)=>{
    return {
        type:types.vacanciesNextLoading,
        payload:data
    }
}
export const vacanciesLoadingLast=()=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchSinToken(`vacancies?from=0&limit=5`);
            const body=await resp.json();
            //console.log(body.vacancies);
            const vacanciesLast=body.vacancies.map((vacancie)=>{
                const {lng,lat,dir}=vacancie.location;
                vacancie.location=[lat,lng,dir]
                return vacancie;
            })
            if(body.ok){
                dispatch(vacanciesLoaded(vacanciesLast));
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const vacancieLoading=(url)=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchSinToken(`vacancies/${url}`);
            const body=await resp.json();
            //console.log(body.vacancie);
            const {lat,lng,dir,state,country,city}=body.vacancie.location;
            body.vacancie.location=[lat,lng,dir,state,city,country];
            if(body.ok){
                dispatch(vacancieLoaded(body.vacancie));
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const uploadCV=(url,candidateInfo,fileupload)=>{
    return async()=>{
        try{
            Swal.fire({
                title:'Enviando CV',
                text:"Por favor espere hasta que se envie su CV",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const data={
                ...candidateInfo,
                fileupload,
            }
            const resp= await fetchSinTokenFile(`vacancies/candidates/${url}`,data);
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
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
const vacanciesLoaded=(vacancies)=>{
    return {
        type:types.vacanciesLoaded,
        payload:vacancies
    }
}
const vacancieLoaded=(vacancie)=>{
    return {
        type:types.vancieLoaded,
        payload:vacancie
    }
}
export const startLoadingPremiumVacancie=()=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchSinToken(`vacancies/premium-vacancie`);
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                dispatch(vacanciePremiumLoaded(body.vacancie));
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
const vacanciePremiumLoaded=(vacancie)=>{
    return {
        type:types.vacanciePremiumLoaded,
        payload:vacancie
    }
}
export const vacanciesBestLoading=(premium)=>{
    return async(dispatch)=>{
        try{
            let url='';
            (premium)?(url='vacancies/best-vacancies/premium'):(url='vacancies/best-vacancies')
            const resp= await fetchSinToken(url);
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                dispatch(vacanciesBestLoaded(body.vacancies));
                dispatch(dataLoaded());
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
const vacanciesBestLoaded=(vacancies)=>{
    return {
        type:types.vacanciesLoaded,
        payload:vacancies
    }
}
export const startReportVacancie=(url,email,reason)=>{
    return async()=>{
        try{
            Swal.fire({
                title:'Enviando reporte',
                text:"Por favor espere hasta que se registre el reporte",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const data={
                email,
                reason
            }
            const resp= await fetchSinToken(`vacancies/report/${url}`,data,'PUT');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
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
export const deleteVacancie=(url,uid)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Eliminando vacante',
                text:"Por favor espere hasta que la vacante sea eliminada",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp= await fetchConToken(`vacancies/${url}`,{},'DELETE');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const res=await fetchConToken(`vacancies/user/${uid}`);
                const vacancies=await res.json();
                if(vacancies.ok) {
                    Swal.close();
                    Swal.fire(
                        'Eliminada!',
                        'La vacante ha sido eliminada.',
                        'success'
                    )
                    dispatch(login({
                        vacancies:vacancies.vacancies,
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const supendVacancie=(url,uid)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Supendiendo vacante',
                text:"Por favor espere hasta que la vacante cambie de estado",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp= await fetchConToken(`vacancies/suspend/${url}`,{},'PUT');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const res=await fetchConToken(`vacancies/user/${uid}`);
                const vacancies=await res.json();
                if(vacancies.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido suspendida.',
                        'success'
                    )
                    dispatch(login({
                        vacancies:vacancies.vacancies,
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a iniciar sesión o cree cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const activeVacancie=(url,uid)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Activando vacante',
                text:"Por favor espere hasta que la vacante cambie de estado",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp= await fetchConToken(`vacancies/active/${url}`,{},'PUT');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const res=await fetchConToken(`vacancies/user/${uid}`);
                const vacancies=await res.json();
                if(vacancies.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido activada.',
                        'success'
                    )
                    dispatch(login({
                        vacancies:vacancies.vacancies,
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const createVacancies=(data,uid)=>{
    return async (dispatch)=>{ 
        try{
            Swal.fire({
                title:'Creando vacante',
                text:"Por favor espere en lo que se registra la vacante",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            //console.log(data);
            const resp= await fetchConToken(`vacancies`,{...data},'POST');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const res=await fetchConToken(`vacancies/user/${uid}`);
                const vacancies=await res.json();
                if(vacancies.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido creada',
                        'success'
                    )
                    const vacanciesUser=vacancies.vacancies.map((vacancie)=>{
                        const {lng,lat,dir}=vacancie.location;
                        vacancie.location=[lat,lng,dir]
                        return vacancie;
                    })
                    dispatch(login({
                        vacancies:vacanciesUser, 
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const editVacancies=(data,uid,url)=>{
    return async (dispatch)=>{ 
        try{
            Swal.fire({
                title:'Actualizando vacante',
                text:"Por favor espere mientras se registran los cambios",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            //console.log(data);
            const resp= await fetchConToken(`vacancies/${url}`,{...data},'PUT');
            const body=await resp.json();
            //console.log(body);
            if(body.ok){
                const res=await fetchConToken(`vacancies/user/${uid}`);
                const vacancies=await res.json();
                if(vacancies.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido actualizada',
                        'success'
                    )
                    const vacanciesUser=vacancies.vacancies.map((vacancie)=>{
                        const {lng,lat,dir}=vacancie.location;
                        vacancie.location=[lat,lng,dir]
                        return vacancie;
                    })
                    dispatch(login({
                        vacancies:vacanciesUser, 
                    }));
                }else{
                    Swal.fire('Error',body.msg+', vuelva a hacer login o crea cuenta','error');
                    dispatch(checkingFinish());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}