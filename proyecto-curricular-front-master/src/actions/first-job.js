import Swal from "sweetalert2";
import { fetchSinToken} from "../helpers/fetch";

import { types } from "../types/types";
import { dataLoaded } from "./vacancies";

export const firstJobsLoading=(from,limit)=>{
    return async(dispatch)=>{
        try{
            const [resp,nextResp]=await Promise.all([
                fetchSinToken(`vacancies/first-job?from=${from}&limit=${limit}`),
                fetchSinToken(`vacancies/first-job?from=${limit}&limit=${limit+5}`),
            ]);
            const [body,bodyNext]=await Promise.all([
                resp.json(),
                nextResp.json(),
            ]);
            // console.log(body.vacancies);
            // console.log(bodyNext.vacancies);
            if(body.ok && bodyNext.ok){
                if(bodyNext.vacancies.length > 0){
                    dispatch(firstJobsLoaded(body.vacancies));
                    dispatch(firttJobsNextLoaded(true));
                }else{
                    dispatch(firstJobsLoaded(body.vacancies));
                    dispatch(firttJobsNextLoaded(false));
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
const firstJobsLoaded=(vacancies)=>{
    return {
        type:types.vacanciesLoaded,
        payload:vacancies
    }
}
const firttJobsNextLoaded=(data)=>{
    return {
        type:types.vacanciesNextLoading,
        payload:data
    }
}