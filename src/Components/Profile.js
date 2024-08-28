import axios from '../api/axios';
import '../Components/Profile.css';
import goldenRetrieverIcon from '../images/golden_icon.png';
import AuthContext from '../Context/AuthProvider';
import { useEffect, useContext, useState } from 'react';

function Profile() {
    const { auth, setAuth } = useContext(AuthContext);
    const PROFILE_URL = `/userwalk/${auth.user}/info`;

    const [name, setName] = useState();
    const [nameEnabled, setNameEnabled] = useState(false);

    const [email, setEmail] = useState();
    const [emailEnabled, setEmailEnabled] = useState(false);

    const [family, setFamily] = useState();
    const [familyEnabled, setFamilyEnabled] = useState(false);



    // get profile information 
    useEffect(() => {
        // defined fn
        const fetchData = async () =>  {
            try {
                const response = await axios.get(PROFILE_URL);
                fillDataHelper(response);
            } catch (err) {
                console.log(err);
            }
        }
        // call fn
        fetchData();
    }, []);

    function fillDataHelper(response) {
        console.log(response)
        console.log(response['data']['fullName']);
        setName(response['data']['fullName']);
        setEmail(response['data']['email']);
        if (response['data']['family']['familyName'] != null) {
            setFamily(response['data']['family']['familyName']);
        }
    }


    return (
        <div className="profile-wrapper">
            <h1>My Profile</h1>
            <div className="profile-view">
                <span>Name</span>
                <div className='name-field'>
                    <input onClick={() => setNameEnabled(true)} placeholder='Name'
                type='text' value={name} disabled={!nameEnabled}></input>
                </div>
                <span>Email</span>
                <div className='email-field'>
                    <input placeholder='Email' type='text' value={email} disabled={!emailEnabled}></input>
                </div>
                <span>Family</span>
                <div className='family-field'>
                    <input placeholder='Family Name' type='text' value={family} disabled={!familyEnabled}></input>
                </div>
                <span>My dogs</span>
                <div className='dog-images'>
                    <img src={goldenRetrieverIcon} onClick={() => console.log('babur')}></img>
                    <img src={goldenRetrieverIcon}></img>
                    <img src={goldenRetrieverIcon}></img>
                    <img src={goldenRetrieverIcon}></img>
                    <img src={goldenRetrieverIcon}></img>
                </div>
            </div>
        </div>
    )
}
export default Profile;