import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { LoadScript, GoogleMap, Autocomplete, Marker, DirectionsRenderer, DirectionsService, useJsApiLoader } from '@react-google-maps/api';
import './Home.css'
import goldenRetrieverIcon from '../images/golden_icon.png'
import goldenRetriever from '../images/golden.png'
import dogBark from '../sounds/dog_bark.mp3'
import Sidebar from '../Sidebar';
import Login from '../Components/Login';
import AuthContext from '../Context/AuthProvider';

import { MapProvider } from '../Providers/map-providers';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';

const apiKey = process.env.REACT_APP_MAPS_API_KEY;
const libraries = ["places"];

function Home() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -33.338922035326604, lng: -70.50588060391189 });
  const [searchMarkers, setSearchMarkers] = useState([]); 
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(0.0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const mapRef = useRef(null);
  const prevSearchMarkers = useRef(searchMarkers);
  const lastRoute = useRef(0);
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const SAVEWALK_URL = '/userwalk/save-route'

  useEffect(() => {
    console.log('mapLoaded changed:', mapLoaded);
    // Load map with login window open 
    if (location.state?.pathname == '/walks' && !auth?.user) {
      console.log('babuuuuuuur')
      console.log(auth.user)
      setIsOpenLogin(true);
    }
    // Additional debugging or monitoring logic can go here
  }, [mapLoaded]);

  const mapContainerStyle = {
    width: '100%',
    height: '100vh' // Adjust height as needed
  };

  const onLoadMap = useCallback((map) => {
    setMapLoaded(true)
    console.log('Map loaded:', map);  // Logs the map instance
    mapRef.current = map;  // Store the map instance in the ref
  }, []);

  const onLoad = (autocomplete) => {
    console.log('Autocomplete loaded:', autocomplete);
    setAutocomplete(autocomplete);
  };

  useEffect(() => {
    if (isOpenLogin) {
      setIsOpenLogin(!isOpenLogin);
    }
  }, [auth])

  const handlePlaceSelected  = async () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()  
      if (place.geometry && place.geometry.location) {

      //  set place lat long 
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng();

      const snappedLatLng = await getNearestRoad(lat, lng);
      if (snappedLatLng) {
        const newMarker = {
          id: place.place_id,
          position: snappedLatLng,
          title: place.name,
          icon: {
            url: goldenRetrieverIcon,
            scaledSize: new window.google.maps.Size(60,60)
          }
        };
        setSearchMarkers([...searchMarkers, newMarker]);
        const audio = new Audio(dogBark);
        audio.play();
      }

      setSelectedPlace(place);

      mapRef.current.panTo({ lat: lat, lng: lng })
      mapRef.current.setZoom(18)
      }

    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpenLogin) {
      setIsOpenLogin(false)
    }
  };

  const handleResetClick = async (event) => {
    // TODO dashboard logic
  }

  const handleLoginClick = () => {
    setIsOpenLogin(true);
  }

  const closeLogin = () => {
    setIsOpenLogin(false)
  }

  // save walk with axios push request
  const handleSaveWalkk = async () => {
    // initial validation: check that user is online
    if (!auth?.user) {
      // toast message: make sure user is logged in
      console.log('errr')
      setIsOpenLogin(true);
      return;
    }
    // second validation: make sure there are at least 2 markers 
    if (searchMarkers.length < 2) {
      // toast message: make sure route has more than 2 markers 
      console.log('errr1')
      return;
    }
    // final validation: create date item with todays date in 'mm-dd-yyyy' format 
    const today = new Date();
    // Format the date as "mm-dd-yyyy"
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let todayFormatted = today.toLocaleDateString('en-US', options);

    const [month, day, year] = todayFormatted.split('/')
    todayFormatted = `${month}-${day}-${year}`;

    // push data
    try {
      const userName = auth.user;
      const response = await axios.post(SAVEWALK_URL,
        {
          StartLatitude: 2,
          StartLongitude: 3,
          EndLatitude: 4,
          EndLongitude: 5,
          Distance: 2,
          Time: 7,
          Date: todayFormatted,
          UserWalkEmail: userName
        },
        {
          headers: { 'Content-Type' : 'application/json'},
        }
      );

      // on success: toast message indicating succesful run, clear routes
    } catch (err) { 
      console.log(err)
    }
  }

  const handleUndoClick = async (event) => {
    // TODO undo logic
    setSearchMarkers(searchMarkers => searchMarkers.slice(0, -1));
  }

  const handleClearClick = async (event) => {
    setSearchMarkers([])
    setDirections(null); // Reset directions when clearing markers
    setDistance(0)
  }

  const handleMapClick = async (event) => {
    // block clicks if sidebar is open
    if (isOpen) {
      return;
    }

    //  set place lat long 
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const snappedLatLng = await getNearestRoad(lat, lng);
    if (snappedLatLng) {
      const newMarker = {
        id: Date.now(),
        position: snappedLatLng,
        icon: {
          url: goldenRetrieverIcon,
          scaledSize: new window.google.maps.Size(60,60)
        }
      };
    setSearchMarkers([...searchMarkers, newMarker]);
    const audio = new Audio(dogBark);
    audio.play();
    }
  } 

  const getNearestRoad = async (lat, lng) => {
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.snappedPoints && data.snappedPoints.length > 0) {
      const { location } = data.snappedPoints[0];
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    return null;
  };

  // TODO: FIX ALL THIS SHIT
  useEffect(() => {
    // Set a timeout to check if mapRef is set within 5 seconds
    const timeoutId = setTimeout(() => {
      if (!mapRef.current) {
        console.log('Map did not load within 5 seconds');
        // Handle the case where the map did not load
        window.location.reload();
      }
    }, 100);

    // Cleanup the timeout if the map loads before 5 seconds
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
     

  
  useEffect(() => {
    const prevItems = prevSearchMarkers.current;  

    // detect if useState shrank or grew
    let didShrink = false;
    if (prevItems.length > searchMarkers.length) {
      if (searchMarkers.length == 1) {
        setDistance(0.0);
      }
      didShrink = true;
    }

    if (searchMarkers.length >= 2) {
      calculateRoute(searchMarkers, didShrink)
    } else {
      setDirections(null)
    }
    prevSearchMarkers.current = searchMarkers
  }, [searchMarkers])


  // TODO: CLEAN UP ROUTE CALCULATION STUFF USING USEEFFECT 
  const calculateRoute = (markers, didShrink) => {

    if (markers.length < 2) return; // Ensure we have at least two markers

    const origin = markers[0].position;
    const destination = markers[markers.length - 1].position;
    const waypoints = markers.slice(1, -1).map(marker => ({
      location: marker.position,
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {

          setDirections(result);

          const route = result.routes[0].legs[result.routes[0].legs.length - 1].distance.value;
          const route_km = route / 1000;
          let distance_float = distance;

          if (didShrink) {
            // Logic for reducing markers 
            const distance_total = distance - lastRoute.current/1000 + 0.01;
            distance_float = parseFloat(distance_total.toString().substring(0,4))
          } else {
            // logic for adding markers 
            const distance_total = route_km + distance
            distance_float = parseFloat(distance_total.toString().substring(0,4))
          }

          lastRoute.current = route;
          setDistance(distance_float);

        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <div className="App">
      <LoadScript async
        googleMapsApiKey={apiKey}
        libraries={libraries} // Include "places" library if using Autocomplete
        onLoad={onLoadMap} // Set a callback when script successfully loads
      >
        <div className='top-bar'>
          {mapLoaded && (
              <Autocomplete
                apiKey={apiKey}
                onLoad={onLoad}
                onPlaceChanged={handlePlaceSelected}
              >
                <div className="search">
                  <label>
                    <input type='text' placeholder='Enter a location' onChange={(e) => console.log('Input changed:', e.target.value)} />
                  </label>
                </div>
              </Autocomplete>
          )}
          <div className='button-container'>
            <button className="menu-button" onClick={toggleSidebar}>Menu</button>
            <button className="undo-button" onClick={handleUndoClick}>Undo</button>
            <button className="clear-button" onClick={handleClearClick}>Clear</button>
            <button className="login-button-main" onClick={handleLoginClick}>Log In</button>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <Login isOpenLogin={isOpenLogin} isClosedLogin={closeLogin}/>
          </div>
          <div className='distance-tracker'>
            <img src={goldenRetriever}></img>
            <span className='distance-header'>{distance} km</span>
            <span className='distance-subheader'>Keep going!</span>
          </div>
        </div>
        {mapLoaded && (
          <div className="map-wrapper">
            <div className="map">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={18}
                options={{
                  mapTypeControl: false,
                  fullscreenControl: false
                }}
                onClick={handleMapClick}
                onLoad={onLoadMap} 

              >

                {searchMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.position}
                    title={marker.title}
                    icon={marker.icon}
                  />
                ))}

                {directions && (
                  <DirectionsRenderer directions={directions} 
                  options={{preserveViewport:true, suppressMarkers:true}} />
                )}

              </GoogleMap>
            </div>
          </div>
        )}
      </LoadScript>
    </div>
  );

}

export default Home;

