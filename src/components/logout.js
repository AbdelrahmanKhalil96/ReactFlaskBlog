import React, { Component } from 'react';

class Logout extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('uData');
        this.props.handleLogoutCheck()
        alert('Logged Out Succesfully');
        this.props.history.push('/');

    }
    handleRedirect = () => {
        this.props.history.push('/');

    }
    render() {
        return (
            <div>
                <h2> Logout</h2>
                <h1>Are You Sure You Want To Logout ?</h1>
                <button style={{ marginRight: '10px' }} onClick={this.handleLogout.bind(this)}>Yes</button>
                <button onClick={this.handleRedirect.bind(this)}>No</button>
            </div>
        );
    }
}
export default Logout;