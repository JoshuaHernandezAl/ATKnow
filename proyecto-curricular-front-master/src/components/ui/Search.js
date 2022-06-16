import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import './ui.css';

export const Search = () => {
    const [advancedSearch,handleAdvancedSearch]=useForm({
        state:'',
        city:'',
        title:'',
        experience:0,
    });
    const {state,city,title,experience}=advancedSearch;
    const history = useHistory();
    const handleSearch=(e)=>{
        e.preventDefault();
        if(state==='' || city==='' || title===''){
            Swal.fire('Error','Todos los campos de busqueda son obligatorios (excepto la experiencia)','error');
            return;
        }
        history.push({
            pathname:'/search-advance',
            search:`?state=${state}&city=${city}&title=${title}&experience=${experience}`
        });
        // console.log(state,city,title,experience);
    }
    return (
        <div>
            <form onSubmit={handleSearch}>
                <fieldset className="row pt-5 d-flex justify-content-evenly">
                    <legend className="mb-4">Búsqueda avanzada</legend>
                <div className="col-auto d-flex flex-column align-items-md-center">
                    <label className="fs-3 text-center mb-3">Estado</label>
                    <input type="text"  name='state' placeholder="   Estado" className="adv_searcher" onChange={handleAdvancedSearch}/>
                </div>
                <div className="col-auto d-flex flex-column align-items-md-center">
                    <label className="fs-3 text-center mb-3">Ciudad</label>
                    <input type="text"  name='city' placeholder="  Ciudad" className="adv_searcher" onChange={handleAdvancedSearch}/>
                </div>
                <div className="col-auto d-flex flex-column align-items-md-center">
                    <label className="fs-3 text-center mb-3">Vacante solicitada</label>
                    <input type="text"  name='title' placeholder="Vacante" className="adv_searcher" onChange={handleAdvancedSearch}/>
                </div>
                <div className="col-auto d-flex flex-column align-items-md-center">
                    <label className="fs-3 text-center mb-3">Experiencia</label>
                    <select  name="experience"  className="form-select adv_searcher" onChange={handleAdvancedSearch}>
                        <option value="">---Selecciona---</option>
                        <option value="0">Sin experiencia</option>
                        <option value="6">6 meses a un año</option>
                        <option value="24">1 a 2 años</option>
                        <option value="36">2 a 3 años</option>
                        <option value="40">Más de tres años</option>
                    </select>
                </div>
                <div className="col-auto d-flex flex-column align-items-md-center align-self-end">
                    <input type="submit" value="Buscar" className="btn btn-outline-info btn-large"/>
                </div>
                </fieldset>
            </form>
        </div>
    )
}
