import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { ChangeView } from '../../helpers/ChangeView';
import Iconlocation from './IconLocation';


export const MapView = ({location=[19.439088089129303,-99.13950441456448]}) => {      
        // console.log(location);
        return (
            <>
            <div className="field col-11">
                <MapContainer
                    center={[Number(location[0]),Number(location[1])]}
                    zoom={15}
                    scrollWheelZoom={true}
                >
                    <ChangeView center={[location[0],location[1]]} zoom={15} />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                        position={[location[0],location[1]]}
                        icon={Iconlocation}
                    >
                        <Popup>
                            {location[2]}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            </>
        )
}
