import './WalkHistory.css'
import './Home.css'
import { useState, useEffect, useContext, startTransition, useRef } from 'react';
import { text } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DistanceChart from '../Components/Charts/DistanceChart';
import axios from '../api/axios';
import AuthContext from '../Context/AuthProvider';
import TimeChart from './Charts/TimeChart';
import FamilyChart from './Charts/FamilyChart';

function WalkHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenYear, setIsOpenYear] = useState(false);
    const [period, setPeriod] = useState('Weekly');
    const [year, setYear] = useState(2024);
    const [today, setToday] = useState('');
    const [monday, setMonday] = useState('');
    const [week, setWeek] = useState(0);
    const { auth, setAuth } = useContext(AuthContext);
    const WALK_URL = `/userwalk/${auth.user}`;
    const [data, setData] = useState(null);
    const [weekDataDistance, setWeekDataDistance] = useState([]);
    const [weekDataTime, setWeekDataTime] = useState([]);
    const [weekDistanceSum, setWeekDistanceSum] = useState([]);
    const [weekTimeSum, setWeekTimeSum] = useState([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [familyUsers, setFamilyUsers] = useState([]);
    const periodWindow = useRef();
    const yearWindow = useRef();
    console.log('rerendered')

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleOpenYear = () => {
        setIsOpenYear(!isOpenYear);
    }

    const handlePeriodicity = (event) => {
        const text = event.target.innerText;
        setPeriod(text)
    }

    const handleYear = (event) => {
        const text = event.target.innerText;
        setYear(text)
    }

    // close open with esc, close dropdowns with outside click
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleOpen();
          }
        };

        const handleClick = (event) => {
            if (!periodWindow.current.contains(event.target)) {
                handleOpen();
            }
        };
    
        if (isOpen) {
          document.addEventListener('keydown', handleKeyDown);
          document.addEventListener('click', handleClick);
        } else {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('click', handleClick);
        }
    
        // Cleanup the event listener when the component unmounts or when isOpen changes
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('click', handleClick);
        };
      }, [isOpen]);


    // close openyear with esc, close dropdowns with outside click
    useEffect(() => {
        
        const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
            handleOpenYear();
          }
        };

        const handleClick = (event) => {
            if (!yearWindow.current.contains(event.target)) {
                handleOpenYear();
            }
        };
    
        if (isOpenYear) {
          document.addEventListener('keydown', handleKeyDown);
          document.addEventListener('click', handleClick);
        } else {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('click', handleClick);
        };
    
        // Cleanup the event listener when the component unmounts or when isOpen changes
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('click', handleClick);
        };
    }, [isOpenYear]);

    // get information 
    useEffect(() => {
        // defined fn
        const fetchData = async () =>  {
            try {
                const response = await axios.get(WALK_URL);
                console.log(Object.keys(response.data).slice(1));
                console.log(response.data[auth?.name])
                setData(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        // call fn
        fetchData();
    }, [])

    // on data load and week number change, set new data
    useEffect(() => {
        let userData;
        let familyMembers;
        let memberDistances = [];
        let memberTimes = [];

        if (data != null) {
        
        familyMembers = Object.keys(data).slice(1);
        setFamilyUsers(familyMembers);

        // loop through users 
        familyMembers.forEach(user => {


            userData = data[user]

            const weekIndexData = userData?.[week];
            const weekDistances = [];
            const weekTimes = [];
    
            let distanceSum = 0;
            let timeSum = 0;

            // loop through weekData, check weekday name index, sum distances for more than 1 walk per day
            if (weekIndexData) {

                daysOfWeek.forEach(day => {
                    if (weekIndexData.hasOwnProperty(day)) {
                        let dayDistance = 0;
                        let dayTime = 0;
                        
                        weekIndexData[day]['$values'].forEach(walk => {
    
                            dayDistance = dayDistance + walk['distance'];
                            dayTime = dayTime + walk['time']
                        });
    
                        weekDistances.push(dayDistance);
                        weekTimes.push(dayTime);
    
                        distanceSum = distanceSum + dayDistance;
                        timeSum = timeSum + dayTime;
    
                        dayDistance = 0;
                        dayTime = 0;
    
                    } else {
                        weekDistances.push(0);
                        weekTimes.push(0);
                    }
                });
            }

            if (user == auth?.name) {
                setWeekDataDistance(weekDistances);
                setWeekDataTime(weekTimes);
            }

            memberDistances.push(distanceSum);
            memberTimes.push(timeSum);
        });

        setWeekDistanceSum(memberDistances);
        setWeekTimeSum(memberTimes);

        }

    }, [week, data])

    // when component mounts, establish today and mondays dates
    useEffect(() => {
        weeklyDate();
        getWeekNumber();
    }, [])

    // weekly browser logic 
    function weeklyDate() {

        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today)

        monday.setDate(today.getDate() - (dayOfWeek + 6) % 7);
        

        // Format the date as "Month, Day, Year"
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayFormatted = today.toLocaleDateString('en-US', options);
        const mondayFormatted = monday.toLocaleDateString('en-US', options);

        // avoid re-renders
        startTransition(() => {
            setToday(todayFormatted);
            setMonday(mondayFormatted);
        });
    }

    // find current week helper
    function getWeekNumber() {
        const todayDate = new Date();
        const todayDateNumber = (todayDate.getDay() + 6) % 7;

        todayDate.setDate(todayDate.getDate() - todayDateNumber + 3);

        const firstThursday = new Date(todayDate.getFullYear(), 0, 4);

        const timeDifference = todayDate.getTime() - firstThursday.getTime();

        // Convert time difference from milliseconds to days and calculate the week number
        const weekNumber = 1 + Math.round(timeDifference / (7 * 24 * 60 * 60 * 1000));

        setWeek(weekNumber);
    }

    // change date forward to the following week
    const advanceDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayDate = new Date(today);

        // if RHS today not equal to sunday, find most recent next sunday
        if (todayDate.getDay() != 0) {
            const nextSunday = new Date(today);

            const day = nextSunday.getDay();

            const daysToNextSunday = day === 0 ? 0 : 7 - day;

            nextSunday.setDate(todayDate.getDate() + daysToNextSunday + 7);
            todayDate.setDate(nextSunday.getDate());

        } else {
        // advance todays date
            todayDate.setDate(todayDate.getDate() + 7);
        }

        // change today
        setToday(todayDate.toLocaleDateString('en-US', options));

        // advance mondays's date
        const mondayDate = new Date(monday);
        mondayDate.setDate(mondayDate.getDate() + 7);
        
        setMonday(mondayDate.toLocaleDateString('en-US', options));

        // increase week number
        setWeek(week + 1);
    }

    // change date backwards to past week
    const reverseDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // find most recent last sunday 
        const todayDate = new Date(today);

        // if LHS date not equal to sunday: find most recent last sunday
        if (todayDate.getDay() != 0) {
            const recentSunday = new Date(todayDate);

            const day = recentSunday.getDay();

            const daysToSunday = day === 0 ? 0 : day;

            recentSunday.setDate(todayDate.getDate() - daysToSunday);
            todayDate.setDate(recentSunday.getDate());

        } else {
        // reverse today's date
            todayDate.setDate(todayDate.getDate() - 7);
        }
        // change today
        setToday(todayDate.toLocaleDateString('en-US', options));

        // reverse monday's date
        const mondayDate = new Date(monday);
        mondayDate.setDate(mondayDate.getDate() - 7);
        
        setMonday(mondayDate.toLocaleDateString('en-US', options));

        // reduce week number by 1
        setWeek(week-1);
    }

    return (
        <div className="walkHistory">
            <h1>My Dog Dashboard</h1>
            <div className='buttons'>
                <div className='periodicity' ref={periodWindow} onClick={handleOpen}>
                    <button onClick={handleOpen}>{period}</button>
                    <ul className={`list ${isOpen ? 'open' : 'closed'}`}>
                        <li class="no-hover">Select Period</li>
                        <li tabIndex="0" onClick={handlePeriodicity}>Weekly</li>
                        <li tabIndex="0" onClick={handlePeriodicity}>Monthly</li>
                    </ul>
                </div>
                <div className='year' ref={yearWindow} onClick={handleOpenYear}>
                    <button onClick={handleOpenYear}>{year}</button>
                    <ul className={`years ${isOpenYear ? 'open' : 'closed'}`}>
                        <li class="no-hover">Select Period</li>
                        <li tabIndex="0" onClick={handleYear}>2024</li>
                    </ul>
                </div>
            </div>
            <div className='dataView'>
                <div className='dateSelect'>
                    <button onClick={reverseDate}><FontAwesomeIcon icon={faChevronLeft}/></button>
                    <span>{monday} - {today}</span>
                    <button onClick={advanceDate}><FontAwesomeIcon icon={faChevronRight}/></button>
                </div>
                <div className='walkData'>
                    <div className='distanceDataContainer'>
                        <span>Distance Walked</span>
                        <div className='distanceChartContainer'>
                            <DistanceChart walkData={weekDataDistance}></DistanceChart>
                        </div>
                    </div>
                    <div className='timeDataContainer'>
                        <span>Time Walked</span>
                        <div className='timeChartContainer'>
                            <TimeChart walkData={weekDataTime}></TimeChart>
                        </div>
                    </div>
                    <div className='familyDataContainer'>
                        <span>Family Leaderboard</span>
                        <div className='familyChartContainer'>
                            <FamilyChart distanceSum={weekDistanceSum} timeSum={weekTimeSum} familyUsers={familyUsers}></FamilyChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalkHistory;