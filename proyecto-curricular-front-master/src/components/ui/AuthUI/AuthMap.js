import React, { useMemo, useRef, useState } from 'react';
import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import 'leaflet/dist/leaflet.css'
import '../map.css';
import Iconlocation from '../IconLocation';
import { ChangeView } from '../../../helpers/ChangeView';
import Geocode from "react-geocode";


export const AuthMap = ({setLocation,lat,lng,location}) => {
    Geocode.setApiKey(`${process.env.REACT_APP_GEOCODING_KEY}`);
    const [geo, setGeo] = useState({
        lat:lat|| 19.439088089129303,
        lng:lng|| -99.13950441456448,
    });
    const [labelPopup, setLabelPopup] = useState('');
    const [zoom, setZoom] = useState(13)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
        dragend() {
            const marker = markerRef.current
            if (marker != null) {
                const latlng=marker.getLatLng();
                setGeo({...latlng});
                Geocode.fromLatLng(`${latlng.lat}`,`${latlng.lng}`).then(
                    (response) => {
                        const address = response.results[0].formatted_address;
                        setLocation({
                            ...geo,
                            dir:address,
                            state:response.results[0].address_components[4]?.long_name||'Unknow',
                            city:response.results[0].address_components[3]?.long_name||'Unknow',
                            country:response.results[0].address_components[response.results[0].address_components.length-2].long_name,
                        });
                        setLabelPopup(address);
                        setZoom(17);
                    },
                    (error) => {
                        console.error(error);
                    }
                    );
                
            }
        },
        }),
        [geo,setLocation],
    )
    const handleLocation=(e) => {
        if(e.target.value.length>=4){
            const provider=new OpenStreetMapProvider();
            provider.search({query:e.target.value})
            .then(res=>{
                if(res[0]?.bounds[0]){
                        const [lat,lng]=res[0].bounds[0];
                        setGeo({
                            lat,
                            lng,
                        });
                        setLabelPopup(res[0].label);
                        setZoom(17);
                        //console.log(res);
                        setLocation({
                            ...location,
                            lat:lat,
                            lng:lng,
                            dir:res[0].label
                        });
                }
            })
        }
    }
    
    
    return (
        <>
            <div className="row my-3 col-md-11">
                <label >Ubicación</label>
                <input type="text" name="location" placeholder="Ej:Av Instituto Politécnico NacionalCiudad de México" onChange={handleLocation}/>
            </div>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-9">
                    <div className="field col-12">
                        <MapContainer
                            center={[geo.lat,geo.lng]}
                            zoom={zoom}
                            scrollWheelZoom={true}
                        >
                            <ChangeView center={[geo.lat,geo.lng]} zoom={zoom} />
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker 
                                position={[geo.lat,geo.lng]}
                                icon={Iconlocation}
                                draggable={true}
                                autoPan={true}
                                eventHandlers={eventHandlers}
                                ref={markerRef}
                            >
                                <Popup>
                                    {labelPopup}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
            
        </>
    )
}
