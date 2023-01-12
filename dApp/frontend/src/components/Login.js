import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import './Login.css'

import { connect } from "react-redux";
import { setLoggedIn, addWeb3State } from '../actions/appAction';


import Web3 from 'web3';

const Login = ({setLogged, addWeb3State}) => {

    const navigate = useNavigate()

    const loggedIn = (event) => {
        event.preventDefault();
        try{
             loadWeb3().then(
                res => {
                    setLogged();
                    navigate('/map');
                }
            );
            
        }
        catch (err){
            console.log(err)
        }

        
    }

    const loadWeb3 = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install metamask');
            return;
        }
        // enable() ce pokrenuti konektovanje na metamask
        await window.ethereum.enable();

        const web3 = new Web3(window.ethereum);
        // const accounts = await web3.eth.getAccounts();
        // const account = accounts[0];

        // const contract = new web3.eth.Contract(GeoAsset.abi);
        if (web3) {
            addWeb3State({
                // account,
                // contract,
                web3
            });
        }
    }

    return (
        <div className='form-container'>
            <form className='login-form' onSubmit={loggedIn}>
                <div className='login-header'>
                    Login here ...
                </div>
                <div className='login-field'>
                    <button type="submit" className='btn btn-success login-button'>Login with MetaMask</button>
                </div>
            </form>
        </div>

    )
}

  const mapDispatchToProps = dispatch => ({
    setLogged: () => dispatch(setLoggedIn),
    addWeb3State: (web3State) => dispatch(addWeb3State(web3State))
  });

export default connect(null, mapDispatchToProps)(Login);