import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { icon } from 'leaflet';

function HomeBeforeEdit() {

    return (
        <MapContainer center={[33.4489, 70.6693]} zoom={13} style={{ height: '50vh', width: '50vh' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
    );
  
  }
  
  export default HomeBeforeEdit;