import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

import { connect } from "react-redux";
import { setLoggedOut } from '../actions/appAction';

import './Header.css';

const Header = ({logged, setLogged}) => {

    const navigate = useNavigate()


    console.log('Header: ' + logged)

    const logOut = () => {
        setLogged()
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-danger mb-3 py-0">
            <div className="container">
                <a href="" className="navbar-brand">
                    Blockchain app
                </a>
                <div>
                    {logged ? (
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <i className="nav-link fas fa-plus" onClick={logOut}>LogOut</i>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="fas fa-home">Home</i>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    <i className="fas fa-plus">Login</i>
                                </Link>
                            </li>
                        </ul>
                    )}
                    
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = state => ({
    ...state
  });
  
  const mapDispatchToProps = dispatch => ({
    setLogged: () => {
        dispatch(setLoggedOut)
    },
  });

export default connect(mapStateToProps, mapDispatchToProps)(Header);