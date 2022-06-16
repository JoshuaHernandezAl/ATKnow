
import { useMapEvent } from 'react-leaflet';

export const CenterMap = ({geo}) => {
    const map=useMapEvent('locationfound',() =>{
        map.setCenter([geo.lat,geo.lng]);
    })
    return null;
}
