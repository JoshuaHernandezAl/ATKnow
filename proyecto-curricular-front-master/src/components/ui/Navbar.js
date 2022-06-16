import React from 'react';
import { Link, NavLink,withRouter} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';
import './ui.css';
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2';
const Navbar = ({history}) => {
    const {name,role} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [search,handleInputSearch]=useForm({
        query:'',
    })
    const handleLogout=()=>{
        dispatch(startLogout());
    }
    const handleLogin=()=>{
        history.push('/restricted/login');
    }
    const handleSearch=(e)=>{
        e.preventDefault();
        if(search.query===''){
            Swal.fire('Error','Necesitas un parameto para buscar','error');
            return;
        }

        history.push(`/search/${search.query}`);
    }
    return (
        <div className="navbar container " >
            <Link 
                className="nav_link" 
                to="/landing"
            >
                <div className="d-flex justify-content-center align-items-center">
                    <img className="nav-image mx-5" src={`${process.env.REACT_APP_UI_RESOURCES}/logo_transparent.png`} alt="All-That-We-Know-Logo"/>
                    <h3 className="center fw-bolder pt-3">All That We Know</h3>
                </div>
            </Link>
            {(!!name)?(
                <span className="sesion searcher nav--services">
                    <NavLink 
                            activeClassName="active"
                            className="nav_link"
                            exact
                            to="/home/profile"
                    >
                        Hola {name} 
                    </NavLink>
                    <NavLink 
                            activeClassName="active"
                            className="nav_link"
                            exact
                            to="/home"
                    >
                        Mis vacantes
                    </NavLink>
                    <NavLink 
                            activeClassName="active"
                            className="nav_link"
                            exact
                            to="/home/faq"
                    >
                        Preguntas frecuentes
                    </NavLink>
                    {(role==='ADMIN_ROLE')?
                        <NavLink 
                        activeClassName="active"
                        className="nav_link"
                        exact
                        to="/admin"
                        >
                            Adminstración
                        </NavLink>
                    :''}
                    <form onSubmit={handleSearch}>
                            <input type="text" className="searcher" name='query' placeholder="Busca por vacante" onChange={handleInputSearch}/>
                            <input type="submit" value="buscar"/>
                    </form>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        <span> Salir</span>
                    </button>
                </span>):(
                    <>
                        <div className="sesion searcher nav--services">
                            <NavLink 
                                activeClassName="active"
                                exact
                                className="nav_link" 
                                to="/first-jobs"
                            >
                                Primer Empleo
                            </NavLink>
                            <NavLink 
                                activeClassName="active"
                                exact
                                className="nav_link" 
                                to="/social-service"
                            >
                                Servicio social
                            </NavLink>
                            <NavLink 
                                activeClassName="active"
                                exact
                                className="nav_link" 
                                to="/profesional-practice"
                            >
                                Prácticas Profesionales
                            </NavLink>
                            <NavLink 
                                activeClassName="active"
                                exact
                                className="nav_link" 
                                to="/about-us"
                            >
                                Sobre nosotros
                            </NavLink>
                            <form onSubmit={handleSearch}>
                                <input type="text" className="searcher" name='query' placeholder="Busca por vacante" onChange={handleInputSearch}/>
                                <input type="submit" value="buscar"/>
                            </form>
                            <button className="btn btn-outline-success" onClick={handleLogin}>
                                <span> Ingresar</span>
                            </button>
                        </div>
                    </>
                )
            }
            
        </div>
    )
}
export default withRouter(Navbar);