import Swal from "sweetalert2";
import { fetchSinToken} from "../helpers/fetch";

import { types } from "../types/types";
import { dataLoaded } from "./vacancies";

export const socialServiceLoading=(from,limit)=>{
    return async(dispatch)=>{
        try{
            const [resp,nextResp]=await Promise.all([
                fetchSinToken(`vacancies/social-service?from=${from}&limit=${limit}`),
                fetchSinToken(`vacancies/social-service?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                nextResp.json(),
            ]);
            // console.log(body.vacancies);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies.length>0){
                    dispatch(socialServiceLoaded(body.vacancies));
                    dispatch(socialServiceNextLoaded(true));
                }else{
                    dispatch(socialServiceLoaded(body.vacancies));
                    dispatch(socialServiceNextLoaded(false));
                }
                dispatch(dataLoaded());
            }else{
                Swal('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
const socialServiceLoaded=(vacancies)=>{
    return {
        type:types.vacanciesLoaded,
        payload:vacancies
    }
}
const socialServiceNextLoaded=(data)=>{
    return {
        type:types.vacanciesNextLoading,
        payload:data
    }
}
export const profesionalPracticeLoading=(from,limit)=>{
    return async(dispatch)=>{
        try{
            const [resp,nextResp]=await Promise.all([
                fetchSinToken(`vacancies/profesional-practices?from=${from}&limit=${limit}`),
                fetchSinToken(`vacancies/profesional-practices?from=${limit}&limit=${limit+5}`)
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                nextResp.json(),
            ]);
            // console.log(body.vacancies);
            
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies.length>0){
                    dispatch(profesionalPracticeLoaded(body.vacancies));
                    dispatch(profesionalPracticeNextLoaded(true));
                }else{
                    dispatch(profesionalPracticeLoaded(body.vacancies));
                    dispatch(profesionalPracticeNextLoaded(false));
                }
                dispatch(dataLoaded());
            }else{
                Swal('Error',body.msg,'error');
                dispatch(dataLoaded());
            }
        }catch(err){
            console.log(err);
        }
    }
}
const profesionalPracticeLoaded=(vacancies)=>{
    return {
        type:types.vacanciesLoaded,
        payload:vacancies
    }
}
const profesionalPracticeNextLoaded=(data)=>{
    return {
        type:types.vacanciesNextLoading,
        payload:data
    }
}
