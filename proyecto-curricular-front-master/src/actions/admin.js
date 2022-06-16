import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";

import { types } from "../types/types";
// import { checkingFinish, login } from "./auth";

export const dataLoaded=()=>{
    return {
        type:types.adminDataLoaded,
    }
}
export const vacanciesReportedLoadingLast=()=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchConToken(`admin/reported-vacancies?from=0&limit=5`);
            const body=await resp.json();
            // console.log(body.vacanciesReported);
            const vacanciesReportedLast=body.vacanciesReported
            if(body.ok){
                dispatch(vacanciesReportedLoaded(vacanciesReportedLast));
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
export const vacanciesReportedLoading =(from,limit)=> {
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchConToken(`admin/reported-vacancies?from=${from}&limit=${limit}`),
                fetchConToken(`admin/reported-vacancies?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ])
            // console.log(body);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacanciesReported.length > 0){
                    dispatch(vacanciesReportedLoaded(body.vacanciesReported));
                    dispatch(vacanciesReportedNextLoaded(true));
                }else{
                    dispatch(vacanciesReportedLoaded(body.vacanciesReported));
                    dispatch(vacanciesReportedNextLoaded(false));
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
export const usersReportedLoading =(from,limit)=> {
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchConToken(`admin/reported-users?from=${from}&limit=${limit}`),
                fetchConToken(`admin/reported-users?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ])
            // console.log(body.usersReported);
            if(body.ok && bodyNext.ok){
                if(bodyNext.usersReported.length > 0){
                    dispatch(usersReportedLoaded(body.usersReported));
                    dispatch(usersReportedNextLoaded(true));
                }else{
                    dispatch(usersReportedLoaded(body.usersReported));
                    dispatch(usersReportedNextLoaded(false));
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
export const atKnowRequestsLoading =(from,limit)=> {
    return async (dispatch)=>{
        try{
            const [resp,respNext]=await Promise.all([
                fetchConToken(`users/users-ssrequest?from=${from}&limit=${limit}`),
                fetchConToken(`users/users-ssrequest?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                respNext.json(),
            ])

            if(body.ok && bodyNext.ok){
                if(bodyNext.users.length > 0){
                    dispatch(atKnowRequestsLoaded(body.users));
                    dispatch(atKnowRequestsNextLoaded(true));
                }else{
                    dispatch(atKnowRequestsLoaded(body.users));
                    dispatch(atKnowRequestsNextLoaded(false));
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
export const atKnowRequestLoading =(ssIdRequest)=> {
    return async (dispatch)=>{
        try{
            const resp=await fetchConToken(`users/find-ssrequest/${ssIdRequest}`);
            const body=await resp.json();

            if(body.ok ){
                dispatch(atKnowRequestsLoaded(body.users));
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
export const atKnowChecking=(idRequest)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Actualizando el estado de la solicitud',
                text:"Por favor espere",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp=await fetchConToken(`users/ss-checking`,{idRequest},'POST');
            const body=await resp.json();

            if(body.ok){
                const [resp,respNext]=await Promise.all([
                    fetchConToken(`users/users-ssrequest?from=${0}&limit=${5}`),
                    fetchConToken(`users/users-ssrequest?from=${5}&limit=${10}`)
                ]);
                const [body,bodyNext]=await Promise.all([
                    resp.json(),
                    respNext.json(),
                ])
    
                if(body.ok && bodyNext.ok){
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'Listo, se han registrado los cambios de estado en la solicitud',
                        'success'
                    )
                    if(bodyNext.users.length > 0){
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(true));
                    }else{
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(false));
                    }
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const atKnowAccept=(idRequest)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Mandando confirmacion',
                text:"Por favor espere hasta que la vacante cambie de estado",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp=await fetchConToken(`users/ss-confirm`,{idRequest},'POST');
            const body=await resp.json();

            if(body.ok){
                const [resp,respNext]=await Promise.all([
                    fetchConToken(`users/users-ssrequest?from=${0}&limit=${5}`),
                    fetchConToken(`users/users-ssrequest?from=${5}&limit=${10}`)
                ]);
                const [body,bodyNext]=await Promise.all([
                    resp.json(),
                    respNext.json(),
                ])
    
                if(body.ok && bodyNext.ok){
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'Listo, se han registrado los cambios de estado en la solicitud',
                        'success'
                    )
                    if(bodyNext.users.length > 0){
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(true));
                    }else{
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(false));
                    }
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const atKnowReject=(idRequest)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Mandando rechazo de solicitud',
                text:"Por favor espere hasta que la vacante cambie de estado",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp=await fetchConToken(`users/ss-reject`,{idRequest},'POST');
            const body=await resp.json();

            if(body.ok){
                const [resp,respNext]=await Promise.all([
                    fetchConToken(`users/users-ssrequest?from=${0}&limit=${5}`),
                    fetchConToken(`users/users-ssrequest?from=${5}&limit=${10}`)
                ]);
                const [body,bodyNext]=await Promise.all([
                    resp.json(),
                    respNext.json(),
                ])
    
                if(body.ok && bodyNext.ok){
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'Listo, se han registrado los cambios de estado en la solicitud',
                        'success'
                    )
                    if(bodyNext.users.length > 0){
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(true));
                    }else{
                        dispatch(atKnowRequestsLoaded(body.users));
                        dispatch(atKnowRequestsNextLoaded(false));
                    }
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const vacancieReportLoading=(id)=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchConToken(`admin/reported-vacancie/${id}`);
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                dispatch(reportLoaded(body.vacancieReported));
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
export const userReportLoading=(id)=>{
    return async(dispatch)=>{
        try{
            const resp= await fetchConToken(`admin/reported-user/${id}`);
            const body=await resp.json();
            const activeReport ={userReported:body.userReported,vacanciesReported:body.vacanciesUser}
            // console.log(activeReport);
            if(body.ok){
                dispatch(reportLoaded(activeReport));
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
export const activeReportedVacancie=(id,data)=>{
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
            const resp= await fetchConToken(`admin/clear-report-vacacie/${id}`,data,'POST');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const resp= await fetchConToken(`admin/reported-vacancies?from=0&limit=5`);
                const vacanciesReportedLast=await resp.json();
                if(vacanciesReportedLast.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido activada.',
                        'success'
                    )
                    dispatch(vacanciesReportedLoaded(vacanciesReportedLast.vacanciesReported));
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const deleteReportedVacancie=(url)=>{
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
                const resp= await fetchConToken(`admin/reported-vacancies?from=0&limit=5`);
                const vacanciesReportedLast=await resp.json();
                if(vacanciesReportedLast.ok) {
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'La vacante ha sido activada.',
                        'success'
                    )
                    dispatch(vacanciesReportedLoaded(vacanciesReportedLast.vacanciesReported));
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
export const deleteReportedUser=(uid)=>{
    return async(dispatch)=>{
        try{
            Swal.fire({
                title:'Eliminando usuario',
                text:"Por favor espere hasta que el usuario sea eliminado",
                allowOutsideClick:false,
                showConfirmButton:false,
                willOpen:()=>{
                    Swal.showLoading();
                }
            })
            const resp= await fetchConToken(`users/delete-user/${uid}`,{},'DELETE');
            const body=await resp.json();
            // console.log(body);
            if(body.ok){
                const [resp,respNext]=await Promise.all([
                    fetchConToken(`admin/reported-users?from=0&limit=5`),
                    fetchConToken(`admin/reported-users?from=5&limit=10`)
                ]);
                const [body,bodyNext]=await Promise.all([
                    resp.json(),
                    respNext.json(),
                ])
                // console.log(body.usersReported);
                if(body.ok && bodyNext.ok){
                    Swal.close();
                    Swal.fire(
                        'Listo!',
                        'El usuario ha sido eliminado.',
                        'success'
                    );
                    if(bodyNext.usersReported.length > 0){
                        dispatch(usersReportedLoaded(body.usersReported));
                        dispatch(usersReportedNextLoaded(true));
                    }else{
                        dispatch(usersReportedLoaded(body.usersReported));
                        dispatch(usersReportedNextLoaded(false));
                    }
                    dispatch(dataLoaded());
                }else{
                    Swal.fire('Error',body.msg,'error');
                    dispatch(dataLoaded());
                }
            }else{
                Swal.fire('Error',body.msg,'error');
            }
        }catch(err){
            console.log(err);
        }
    }
}
const reportLoaded=(report) =>{
    return {
        type:types.adminReportLoaded,
        payload:report
    }
}
const vacanciesReportedLoaded=(vacancies)=>{
    return {
        type:types.adminVacanciesReports,
        payload:vacancies
    }
}
const vacanciesReportedNextLoaded=(data)=>{
    return {
        type:types.adminNextReports,
        payload:data
    }
}
const usersReportedLoaded=(users)=>{
    return {
        type:types.adminUsersReports,
        payload:users
    }
}
const usersReportedNextLoaded=(data)=>{
    return {
        type:types.adminNextReports,
        payload:data
    }
}
const atKnowRequestsLoaded=(users)=>{
    return {
        type:types.adminRequests,
        payload:users
    }
}
const atKnowRequestsNextLoaded=(data)=>{
    return {
        type:types.adminNextReports,
        payload:data
    }
}