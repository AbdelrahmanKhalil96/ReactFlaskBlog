import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from "axios";
class Login extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    state = {
        fields: {},
        errors: {},
        formIsValid: false,
        Logged_in: false
    }

    encrypt(msgString, key) {
        // msgString is expected to be Utf8 encoded
        var iv = CryptoJS.lib.WordArray.random(16);
        var encrypted = CryptoJS.AES.encrypt(msgString, key, {
            iv: iv
        });
        return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    }

    postContent(url, data, self) {
        let { errors } = this.state;
        let { Logged_in } = this.state;
        // let self = this
        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        axios.post(url, {
            LogInData: data
        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
        })
            .then((res) => {
                console.log(res.data);
                self.setState({
                    Logged_in: res.data['Logged_in']
                });
                this.props.fn(res.data);
                if (res.data['Logged_in'] !== 'true') {
                    errors["failed"] = 'Please Check Your Log In Data';
                    this.setState({
                        errors: errors
                    });
                }
                else if (res.data['Logged_in'] === 'true') {
                    delete errors.failed;
                    Logged_in = res.data['Logged_in'];
                    this.setState({
                        errors: errors,
                        Logged_in: Logged_in
                    });
                    this.props.history.push('/');
                    sessionStorage.setItem('token', JSON.stringify(res.data['Logged_in']));
                    sessionStorage.setItem('uData', JSON.stringify(res.data['uData']));

                }
                // this.props.history.push('/');
                //this.$cookie.set("Login-Token", res.data.token);
            });

    }
    handlePassChange = (e) => {
        let { errors } = this.state;
        let { fields } = this.state;
        let { formIsValid } = this.state;
        fields["password"] = e.target.value;
        if (!fields["password"]) {
            errors["password"] = "Cannot be empty";
            formIsValid = false;
        }

        else if (typeof fields["password"] !== "undefined") {
            delete errors.password;
            if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                console.log("emptyAfterpassword");

                formIsValid = true;
            }
        }
        this.setState({
            formIsValid: formIsValid,

            errors: errors
        });

    }
    handleEmailChange = (e) => {
        let { errors } = this.state;
        let { fields } = this.state;
        let { formIsValid } = this.state;
        fields["email"] = e.target.value;

        //Email

        if (!fields["password"]) {
            errors["password"] = "Cannot be empty";
            formIsValid = false;
        }
        if (fields["email"] === "") {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }
        else if ((fields["email"] !== "")) {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            // eslint-disable-next-line
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
            else {
                delete errors.email;
                if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                    console.log("empty");
                    formIsValid = true;
                }
            }
        }
        this.setState({
            formIsValid: formIsValid,

            errors: errors
        });

    }
    contactSubmit(e) {
        e.preventDefault();
        var key = CryptoJS.enc.Utf8.parse('1234567890123456'); // TODO change to something with more entropy
        let { fields } = this.state;
        var oldPass = fields["password"]
        let { formIsValid } = this.state;
        if (formIsValid) {
            fields["password"] = this.encrypt(fields["password"], key);
            this.postContent("http://127.0.0.1:5000/login", fields, this);
            fields["password"] = oldPass;
        }

    }
    render() {
        return (

            <div className="container">
                <div className="wrapper">
                    <form name="Login_Form" className="form-signin" onSubmit={this.contactSubmit.bind(this)}>
                        <h3 className="form-signin-heading">Welcome Back! Please Sign In</h3>
                        <hr className="colorgraph"></hr>

                        <div className="form-group">

                            <strong><label className="form-control-label"> E-mail</label></strong>
                            <input type="text" className="form-control" onChange={this.handleEmailChange}></input>
                            <span className="error" style={{ color: "red" }}>{this.state.errors["email"]}</span>

                        </div>
                        <div className="form-group">
                            <strong>    <label className="form-control-label">Password</label></strong>
                            <input type="password" className="form-control" onChange={this.handlePassChange} ></input>
                            <span className="error" style={{ color: "red" }}>{this.state.errors["password"]}</span>

                        </div>
                        <div className="form-group">
                            <input type="checkbox" ></input>
                            <strong>    <label className="form-control-label" style={{ margin: "10px" }}>Remember me</label></strong>


                        </div>
                        <input type="submit" className="btn btn-lg btn-primary btn-block" value="Login"></input>
                        <span className="error" style={{ color: "red" }}>{this.state.errors["failed"]}</span>

                    </form>
                    {/*flash */}


                    <small className="text-muted">
                        Need An Account?  <Link to="/SignUp" className="ml-2" > Join Us Now</Link>
                    </small>
                </div>

            </div>
        );
    }
}

export default Login;