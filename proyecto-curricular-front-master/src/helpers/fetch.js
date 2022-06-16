const baseUrl=process.env.REACT_APP_API_URL;
const fetchSinToken=(endpoint,data,method='GET')=>{
    const url=`${baseUrl}/${endpoint}`;
    if(method==='GET'){
        return fetch(url);
    }else{
        return fetch(url,{
            method,
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data),
        });
    }
}
const fetchConToken=(endpoint,data,method='GET')=>{
    const token= localStorage.getItem('token')||'';
    const url=`${baseUrl}/${endpoint}`;
    if(method==='GET'){
        return fetch(url,{
            method,
            headers:{
                'x-token':token,
            }
        });
    }else{
        return fetch(url,{
            method,
            headers:{
                'Content-Type': 'application/json',
                'x-token':token,
            },
            body:JSON.stringify(data),
        });
    }
}
const fetchSinTokenFile=(endpoint,data,method='POST')=>{
    const url=`${baseUrl}/${endpoint}`;
    const formData= new FormData();
    for(let key of Object.entries(data)){
        formData.append(key[0],key[1]);
    }
    if(method==='POST'){
        return fetch(url,{
            method: "POST",
            body: formData,
        })
    }
}
const fetchConTokenFile=(endpoint,data,method='POST')=>{
    const token= localStorage.getItem('token')||'';
    const url=`${baseUrl}/${endpoint}`;
    const formData= new FormData();
    for(let key of Object.entries(data)){
        formData.append(key[0],key[1]);
    }
    if(method==='POST'){
        return fetch(url,{
            method: "POST",
            headers:{
                'x-token':token,
            },
            body: formData,
        })
    }else{
        return fetch(url,{
            method,
            headers:{
                'x-token':token,
            },
            body: formData,
        })
    }
}

export {
    fetchSinToken,
    fetchConToken,
    fetchSinTokenFile,
    fetchConTokenFile,
}