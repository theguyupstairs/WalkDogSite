import React, { useContext, useEffect, useRef, useState } from 'react';
import './Login.css';
import axios from '../api/axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faL } from "@fortawesome/free-solid-svg-icons";
import AuthContext, { AuthProvider } from '../Context/AuthProvider';

const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{12,}$/;
const REGISTER_URL = '/account/register'
const LOGIN_URL = '/account/login'

function Login({ isOpenLogin, isClosedLogin, setloginMessage, updateAuth }) {
    // LOGIN toggle state
    const divRef = useRef(null);
    const [isLogin, setIsLogin] = useState(true);
    const { auth, setAuth } = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef(null);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [name, setName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.focus(); // Automatically focus the div when the component loads
            divRef.current.click();
        }

        console.log(setloginMessage);
        setErrMsg(setloginMessage);

    }, [isOpenLogin])

    useEffect(() => {
        setUser("");
        setPwd("");
        setMatchPwd("");
    }, [isClosedLogin])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {

        const usernameInput = document.querySelector('.Email');
        const passwordInput = document.querySelector('.Password');

        // Function to validate username and password
        const validateInputs = () => {
            setUser(usernameInput.value);
            setPwd(passwordInput.value);
        };
        console.log(document.querySelector('.Email'))
        validateInputs();

        // Listen for input changes
        usernameInput.addEventListener('input', validateInputs);
        passwordInput.addEventListener('input', validateInputs);

        // Listen for autofill events
        usernameInput.addEventListener('change', validateInputs);
        passwordInput.addEventListener('change', validateInputs);

        // Clean up event listeners on component unmount
        return () => {
            usernameInput.removeEventListener('input', validateInputs);
            passwordInput.removeEventListener('input', validateInputs);
            usernameInput.removeEventListener('change', validateInputs);
            passwordInput.removeEventListener('change', validateInputs);

            setIsLogin(true);
        };
        
    }, [isOpenLogin]);

    const handleRegisterClick = async (e) => {
        e.preventDefault();

        if (isLogin) {
            setUser('');
            setPwd('');
            setIsLogin(false)
            return;
        }
        // else: SEND REGISTER POST REQUEST
        try {
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({Name: name, Email: user, Password: pwd}),
                {
                    headers: { 'Content-Type' : 'application/json'},
                    withCredentials: true
                }
            );
            setUser('');
            setPwd('');
            setMatchPwd('');
            setName('');
            setSuccess(true);
            setIsLogin(true);
             
        } catch (err) {
            console.log(err)
            if (err.response) {
                const values = err.response.data["$values"]
                setErrMsg(values[0]['description']);
            } else {
                setErrMsg('Registration Failed');
            }
            console.log(errMsg)
        }
    }

    const handleLoginClick = async (e) => {
        e.preventDefault()

        if (!isLogin) {
            setUser('');
            setPwd('');
            setMatchPwd('');
            setName('');
            setIsLogin(true);
            return;
        }
        // else: SEND LOGIN POST REQUEST
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({UserName: user, Email: user, Password: pwd}),
                {
                    headers: { 'Content-Type' : 'application/json'},
                    withCredentials: true
                }
            );

            const accessToken = response?.data.token;
            const name = response?.data['fullName'];
            updateAuth(true);
            setAuth({ user, pwd, accessToken, name });
            setUser('');
            setPwd('');
            setSuccess(true);
            isClosedLogin();

        } catch (err) {
            console.log(err)
            if (err.response) {
                setErrMsg(err.response.data)
            } else {
                setErrMsg("Login failed")
            }
        }
    }

    return(
        <div className={`login_window ${isOpenLogin ? 'open' : 'closed'}`}>
            <div className='outer-container' tabIndex="0">
                <p ref={errRef} className={errMsg ? "errmsg" : 
                    "offscreen"} aria-live='assertive'>{errMsg}</p>
                <div className='input-container' useRef={divRef}>
                    <button className='close_button' onClick={isClosedLogin}>&times;</button>
                    <input className="Email" 
                    type ='text' 
                    placeholder='Email' 
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    onLoad={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? "false" : true}
                    aria-describedby='uidnote'
                    value={user}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}></input>
                    <p id="uidnote" className={userFocus && user &&
                    !validName ? "instructions" : "offscreen"}>
                        <i className="fa fa-small fa-info-circle"></i>
                        Please make sure that username is an email!
                    </p>
                    {isLogin && (
                        <>
                        <input className="Password" 
                        type='text' 
                        placeholder='Password' 
                        type='password'
                        onLoad={(e) => setPwd(e.target.value)}
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required></input>
                        </>
                    )}
                    {!isLogin && (
                        <>
                        <input className="Name" 
                        type='text'
                        placeholder='Name' 
                        type='text'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                        aria-invalid={validFullName ? "false" : "true"}
                        aria-describedby='pwdnote'
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}></input>
                        <p id="uidnote" className={nameFocus ? "instructionspwd" : "offscreenpwd"}>
                            <i className="fa fa-small fa-info-circle"></i>
                            Please enter name<br/>
                        </p>
                        <input className="Password" 
                        type='text' 
                        placeholder='Password' 
                        type='password'
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby='pwdnote'
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}></input>
                        <p id="uidnote" className={pwdFocus && !validPwd ? "instructionspwd" : "offscreenpwd"}>
                            <i className="fa fa-small fa-info-circle"></i>
                            Make sure password includes at least 12 digits<br/>
                            Make sure password includes at least 1 digit<br/>
                            Make sure password includes at least 1 uppercase letter <br/>
                            Make sure password includes at least 1 non-alpha numeric character<br/>
                        </p>
                        <input className="confirm-password" 
                        type='text' 
                        placeholder='Confirm Password' 
                        type='password'
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby='pwdmatchnote'
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}></input>
                        <p id="uidnote" className={matchFocus && !validMatch ? "instructionspwd" : "offscreenpwd"}>
                            <i className="fa fa-small fa-info-circle"></i>
                            Make sure passwords match!<br/>
                            </p>
                        </>
                    )}
                </div>
                <div className="button-container">
                    {isLogin && (
                        <>
                            <button className="login_button" 
                            onClick={handleLoginClick}
                            disabled={!validName || !validPwd ? true : false}>Log In</button>
                            <button className="register_button" onClick={handleRegisterClick}>Register</button>
                        </>
                    )}
                    {!isLogin && (
                        <>
                            <button className="register_button" 
                            onClick={handleRegisterClick}
                            disabled={!validName || !validPwd || !validMatch? true : false}>Register</button>
                            <button className="login_button" onClick={handleLoginClick}>Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login;