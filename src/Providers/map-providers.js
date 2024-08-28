import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';

// Define a list of libraries to load from the Google Maps API
const libraries = ['places', 'drawing', 'geometry'];
const apiKey = process.env.REACT_APP_MAPS_API_KEY;

// Define a function component called MapProvider that takes a children prop
export function MapProvider({ children }) {
  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (loadError) return <div>Error loading maps</div>;

  // Return the children prop wrapped by this MapProvider component
  return (

    <div>
    {children}
    </div>
  );
}