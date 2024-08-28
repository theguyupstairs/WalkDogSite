import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LoadScript, GoogleMap, Autocomplete, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import './App.css'
import goldenRetrieverIcon from './images/golden_icon.png'
import goldenRetriever from './images/golden.png'
import dogBark from './sounds/dog_bark.mp3'
import Sidebar from './Sidebar';
import Login from './Components/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import WalkHistory from './Components/WalkHistory'
import axios from 'axios';
import { AuthProvider } from './Context/AuthProvider';
import RequireAuth from './Components/RequireAuth';
import HomeBeforeEdit from './Components/HomeBeforeEdit';
import MapComponent from './Components/MapComponent';
import Main from './Components/Main';
import Profile from './Components/Profile'

const apiKey = process.env.REACT_APP_MAPS_API_KEY;
const libraries = ["places"];

function App() {

  return (
    
    <Routes>

      {/* Public Route */}
      <Route path="/" element={<Main />}/>
      {/* Protected Route */}
      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/walks" element={<WalkHistory />}/>
      </Route>
      
    </Routes>
  );

}

export default App;