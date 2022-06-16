import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { userBestVacancies } from '../../../actions/vacancies';
import { Spinner } from '../Spinner';
import './styles.css'

export const DashboardVacancies = () => {
    const history=useHistory();
    const dispatch = useDispatch();
    const {loading,vacanciesChart,totalCandidates} = useSelector(state => state.vacancies);
    const {uid} = useSelector(state => state.auth);
    const uidRef = useRef(uid)

    useEffect(() => {
        dispatch(userBestVacancies(uidRef.current))
    }, [dispatch]);
    let data={};
    const handleViewVacancies=(title)=>{
        if(title==='Otras vacantes') return;
        const vacancieToRender=vacanciesChart.filter((vacancie)=>{
            return vacancie.title===title
        });
        const url=vacancieToRender[0].url;
        history.push(`/home/vacancie-detail/${url}`);
    }
    const getElementAtEvent = element => {
        if (!element.length) return;
        const { index } = element[0];
        handleViewVacancies(data.labels[index])
    };
    if(loading){
        return (
            <Spinner/>
        )
    }
    if(vacanciesChart?.length>0 && totalCandidates!==0){
        const labelsChart=vacanciesChart.map((vacancie) =>(
            vacancie.title
        ));
        const amounts=vacanciesChart.map((vacancie) =>(
            vacancie.candidatesNumber
        ));
        const acum=amounts.reduce((prev,current)=>(
            prev+current
        ));
        if(acum!==0){
            data = {
                labels: [...labelsChart,'Otras vacantes'],
                datasets: [
                    {
                    label: '# of Votes',
                    data: [...amounts,(totalCandidates.totalCandidates-acum)],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(126, 126, 126, 0.5)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(126, 126, 126, 1)',
                    ],
                    borderWidth: 1,
                    },
                ],
            };
            return (
                <div className="container" >
                    <Doughnut
                        className="chart"
                        data={data}
                        getElementAtEvent={getElementAtEvent}
                    />
                    <p className='text-center'>Estas son tus vacantes más exitosas (recuerda algunas pueden estar sujetas a revisión)</p>
                </div>
            )
        }else{
            return(
                <h3 className="text-center border border-white p-5 my-5">Aún no tienes ningun candidato registrado en tus vacantes</h3>
            );
        }
            
    }else{
        return '';
    }
    
}
