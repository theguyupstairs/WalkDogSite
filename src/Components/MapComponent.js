import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Draggable, icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import './MapComponent.css'
import L from 'leaflet';
import goldenRetrieverIcon from '../images/golden_icon.png'
import 'leaflet-control-geocoder';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const customIcon = new L.Icon({iconUrl: goldenRetrieverIcon, iconSize: [48, 48], iconAnchor: [22, 38], popupAnchor: [-3, -76]});

function MapComponent({ getWalkInfo, toggleSidebar, handleSaveWalk }) {
    const [map, setMap] = useState(false);
    const mapRef = useRef();
    const geoCoderRef = useRef();
    const [markers, setMarkers] = useState([]);
    const [wayPoints, setWayPoints] = useState([]);
    const [routeControl, setRouteControl] = useState();
    
    useEffect(() => {

        if (mapRef.current) {

            // If geocoder doesn't exist, create geocoder control and add it to the map
            if (!geoCoderRef.current) {
                const geoCoderControl = L.Control.geocoder({
                    collapsed: false, // Ensure the search box remains open
                    defaultMarkGeocode: false, // Prevent default marker from being added
                    geocoder: L.Control.Geocoder.nominatim({
                        geocodingQueryParams: {
                            countrycodes: '', // Set to '' for worldwide search
                        },
                    }),
                }).addTo(mapRef.current);

            
                // On Search Configurations: 
                geoCoderControl.on('markgeocode', function(e) {
                    const { center } = e.geocode;
                    const marker = L.marker(center, { icon: customIcon })
                        .addTo(mapRef.current)

                    // Update markers state
                    setMarkers(prevMarkers => [...prevMarkers, marker]);
                    setWayPoints(prevWayPoints => [...prevWayPoints, center])

                    // set view on search
                    mapRef.current.setView(center, 17);
                });

                geoCoderRef.current = geoCoderControl;
            }

            // clear current Route Control
            if (routeControl) {
                mapRef.current.removeControl(routeControl);
            }

            // Set Route Control
            const routingControl = L.routing.control({
                waypoints: wayPoints,
                routeWhileDragging: true,
                router: new L.Routing.OSRMv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    profile: 'foot',  // Specify walking profile
                }),
                createMarker: function(i, waypoint, n) {
                    return L.marker(waypoint.latLng, {
                        icon: customIcon,
                        draggable: false,
                    });
                },
                lineOptions: {
                    styles: [{ color: '#6FA1EC', weight: 4 }]
                },
                summaryTemplate: '',
                show: false
            }).addTo(mapRef.current);

            setRouteControl(routingControl);

            //mapRef.current.setZoom(17);

            // Listen for route calculation event
            routingControl.on('routesfound', (e) => {
                const { routes } = e;
                const route = routes[0];
                console.log('Route data:', route);

                const dist = route['summary']['totalDistance'];
                const time = route['summary']['totalTime'];

                const dist_float = dist / 1000;
                const dist_km = parseFloat(dist_float.toString().substring(0,4))

                const time_min = time / 60;

                const dist_int = Math.round(dist_float);
                const time_int = Math.round(time_min);

                getWalkInfo(dist_int, time_int);
            });


        }
    }, [map, wayPoints, markers]); // Ensure effect runs after mapRef.current is set

////////////////////////////////////////////////////////////////////////////////////////////////// HANDLE CLICK FUNCTIONS

    // handle save walk click
    async function handleSaveClick() {
        await handleSaveWalk();
        handleClearClick();
    }

    // handle map click
    function MapClickHandler() {
        useMapEvents(
            {click(e) {
                addWayPoint(e);
            }
        });
    }

    // MARKER CHANGE LOGIC 
    const handleUndoClick = () => {
        debouncedRemoveWayPoint();
    }

    const handleClearClick = () => {
        markers.forEach((marker) => 
            mapRef.current.removeLayer(marker)
        );
        setMarkers([]);
        setWayPoints([]);
        getWalkInfo(0, 0);
    }

    function removeWayPoint() {

        if (wayPoints.length > 0) {

            if (markers[markers.length-1]) {
                //if ()
                console.log('markers')
                console.log(markers[markers.length-1])
                if (mapRef.current && mapRef.current.hasLayer(markers[markers.length-1])) {   
                    mapRef.current.removeLayer(markers[markers.length-1]);
                }
            }

            const reducedWayPoints = wayPoints.slice(0,-1);
            const reducedMarkers = markers.slice(0,-1);
            setWayPoints(reducedWayPoints);
            setMarkers(reducedMarkers);
        }
    }

    function addWayPoint(e) {
        const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: customIcon }).addTo(mapRef.current);
        const newPoint = new L.LatLng(e.latlng.lat, e.latlng.lng);

        setMarkers(prevMarkers => [...prevMarkers, marker]);
        setWayPoints(prevWayPoints => [...prevWayPoints, newPoint]);
    }

    // debounce helpers for removeWayPoint()
    const debouncedRemoveWayPoint = useCallback(debounceRemoval(removeWayPoint, 250), [removeWayPoint]);

    function debounceRemoval(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay)
        }
    }

    return (
        <div className='map-container'>
            <div className='map-buttons'>
                <button className="menu" onClick={toggleSidebar}>Menu</button>
                <button className="undo" onClick={handleUndoClick}>Undo</button>
                <button className="clear" onClick={handleClearClick}>Clear</button>
            </div>
            <div className='save-button'>
                <button onClick={handleSaveClick}>Save Walk</button>
            </div>
            <MapContainer center={[-33.339100, -70.505900]} zoom={17} ref={mapRef}
            style={{ height: '100%', width: '100%' }} whenReady={() => setMap(true)}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler></MapClickHandler>
            </MapContainer>
        </div>
    );
  
  }
  
  export default MapComponent;