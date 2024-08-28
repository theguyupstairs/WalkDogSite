import { useState, useContext, useEffect } from 'react';
import './Main.css'
import MapComponent from './MapComponent';
import goldenRetriever from '../images/golden.png'
import Sidebar from '../Sidebar';
import Login from './Login';
import { marker } from 'leaflet';
import AuthContext from '../Context/AuthProvider';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { faL } from '@fortawesome/free-solid-svg-icons';


function Main () {
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const {auth, setAuth} = useContext(AuthContext)
    const SAVEWALK_URL = '/userwalk/save-route';
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const [authStatus, setAuthStatus] = useState(false);

    useEffect(() => {
        // if user logged in, set auth to in (with local storage, check online)
        if (auth?.user) {
            setAuthStatus(true);
        }

        // Load map with login window open 
        if (location.state?.pathname == '/walks' && !auth?.user) {
            setIsOpenLogin(true);
        };

    }, []);

    useEffect(() => {

        // key listeners 
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (isOpenLogin) {
                    closedLogin();
                } else if (isOpenSidebar) {
                    toggleSidebar();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return() => {
            document.removeEventListener('keydown', handleKeyDown);
        }

    }, [isOpenLogin, isOpenSidebar])

    // get distance from map 
    function getWalkInfo(distance, time) {
        setTotalDistance(distance);
        setTotalTime(Math.ceil(time));
    }

    // handleSideBar click
    function toggleSidebar() {
        if (isOpenSidebar) {
            setIsOpenSidebar(!isOpenSidebar);
        } else if (!isOpenLogin && !isOpenSidebar) {
            setIsOpenSidebar(!isOpenSidebar);
        } else {
            setIsOpenSidebar(!isOpenSidebar);
            setIsOpenLogin(!isOpenLogin);
        }
    }

    function closedLogin() {
        setErrorMessage('');
        setIsOpenLogin(false);
    }

    // error message from Sidebar
    function getErrorMessage(error) {
        console.log('babbbb');
        setErrorMessage(error);
        toggleSidebar();
        setIsOpenLogin(true);
    }

    // save walk 
    async function saveWalk() {
        // initial validation: check that user is online
        if (!auth?.user) {
        // toast message: make sure user is logged in
            setErrorMessage('Please log in to use this feature');
            setIsOpenLogin(true);
            return;
        }
        // second validation: make sure there are at least 2 markers 
        if (totalDistance == 0) {
            // toast message: make sure route has more than 2 markers 
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
            console.log(totalDistance);
            const userName = auth.user;
            const response = await axios.post(SAVEWALK_URL,
            {
            StartLatitude: 2,
            StartLongitude: 3,
            EndLatitude: 4,
            EndLongitude: 5,
            Distance: totalDistance,
            Time: totalTime,
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

    // update auth based on login success
    const updateAuth = (authStatus) => {
        setAuthStatus(authStatus);
        return authStatus;
    }

    return (
        <div main-wrapper>
            <div className='map'>
                <MapComponent getWalkInfo={getWalkInfo} toggleSidebar={toggleSidebar} handleSaveWalk={saveWalk}></MapComponent>
            </div>
            <div className='login-button-wrapper'>
                <button className='login-button-item' 
                onClick={() => {setIsOpenLogin(true)}}
                disabled={authStatus ? true : false}>Log In</button>
                <Login isOpenLogin={isOpenLogin} isClosedLogin={closedLogin} setloginMessage={errorMessage} updateAuth={updateAuth}></Login>
            </div>
            <div className='golden-image'>
                <img src={goldenRetriever}></img>
                <span className='distance-head'>{totalDistance} km</span>
                <span className='distance-subHead'>Keep Going!</span>
            </div>
            <Sidebar isOpen={isOpenSidebar} toggleSidebar={toggleSidebar} getErrorMessage={getErrorMessage}></Sidebar>
        </div>
    );

}

export default Main;