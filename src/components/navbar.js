import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navbar extends Component {

    render() {
        const loggedIn = this.props.loggedIn;

        return (
            <div>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <label className="navbar-brand" style={{ color: "#ddd" }}>Welcome {this.props.UName} </label>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item"> <NavLink className="nav-link" exact
                                to="/">Home</NavLink></li>
                            {/*}        {loggedIn &&
                                <li className="nav-item"><NavLink
                                    className="nav-link" to="/chat">Chat</NavLink></li>
                            }
                        */}
                        </ul>
                        <ul className="navbar-nav ml-auto nav-flex-icons">
                            {loggedIn === "true"
                                ? <React.Fragment>
                                    <li className="nav-item"> <NavLink
                                        className="nav-link" to="/profile">View Profile</NavLink>
                                    </li>
                                    <li className="nav-item"> <NavLink exact
                                        className="nav-link" to="/Logout">Logout</NavLink>
                                    </li></React.Fragment>
                                : <React.Fragment>
                                    <li className="nav-item"> <NavLink exact
                                        className="nav-link" to="/login">Login</NavLink>
                                    </li>
                                    <li className="nav-item"> <NavLink exact
                                        className="nav-link" to="/SignUp">Register</NavLink>
                                    </li>
                                </React.Fragment>
                            }
                        </ul>
                        {/*  {%if conn %} <li className="nav-item"><a className="nav-link" href="/logout">Logout</a>
        </li>{%endif%} */}
                    </div>
                </nav>


            </div>
        );
    }


}
export default Navbar