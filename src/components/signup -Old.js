import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import axios from "axios";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: { "phone": "" },
            errors: {},
            password: '',
            confirmPassword: '',
            formIsValid: false
        }


    }
    handlePasswordChange = (e) => {
        let { errors } = this.state;
        let { formIsValid } = this.state;
        let password = e.target.value;
        let { fields } = this.state;

        if (password !== this.state.confirmPassword) {
            errors["password"] = "Passwords don't match";
            delete fields.password;
            formIsValid = false;
        }
        else {
            delete errors.password;
            if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                fields["password"] = e.target.value;
                formIsValid = true;
            }
        }
        this.setState({
            password: password,
            formIsValid: formIsValid,
            errors: errors,
            fields: fields
        })

    }
    handleEmailChange = (e) => {
        let { errors } = this.state;
        let { fields } = this.state;
        let { formIsValid } = this.state;
        fields["email"] = e.target.value;

        //Email
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
    handleCheckUserName = (e) => {
    }
    handleUsernameChange = (e) => {
        let { errors } = this.state;
        let { fields } = this.state;
        let { formIsValid } = this.state;

        fields["name"] = e.target.value;
        /*  this.setState({
             fields: fields
         }) */
        if (!fields["name"]) {
            errors["name"] = "Cannot be empty";
            formIsValid = false;

        }

        else if (typeof fields["name"] !== "undefined") {
            if (!fields["name"].match(/^[a-zA-Z]+$/)) {
                errors["name"] = "Only letters";
                formIsValid = false;

            }
            else if ((fields["name"]).match(/^[a-zA-Z]+$/)) {
                delete errors.name;
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
    handleConfirmPassword = (e) => {
        /**this.setState({
            confirmPassword: e.target.value
        })*/
        let { errors } = this.state;
        let { formIsValid } = this.state;
        let { fields } = this.state;

        this.setState({
            confirmPassword: e.target.value
        }, () => {
            if (this.state.password === this.state.confirmPassword) {
                if (errors["password"]) {
                    delete errors.password;
                    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                        console.log("empty");
                        fields["password"] = e.target.value;

                        formIsValid = true;
                    }
                    this.setState({
                        errors: errors,
                        formIsValid: formIsValid,
                        fields: fields
                    });
                }
            }
            else if (this.state.password !== this.state.confirmPassword) {
                errors["password"] = "Passwords don't match";
                formIsValid = false;
                delete fields.password;

                this.setState({ errors: errors, formIsValid: formIsValid });

            }
        });

    }
    /* handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        const { password, confirmPassword } = this.state;
        // perform all neccassary validations
        if (password !== confirmPassword) {
            formIsValid = false;
            errors["password"] = "Passwords don't match"
            alert("Passwords don't match");
        }
        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }

        if (typeof fields["name"] !== "undefined") {
            if (!fields["name"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["name"] = "Only letters";
            }
        }

        //Email
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            // eslint-disable-next-line
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }



        this.setState({ errors: errors });
        return formIsValid;
    }
 */

    encrypt(msgString, key) {
        // msgString is expected to be Utf8 encoded
        var iv = CryptoJS.lib.WordArray.random(16);
        var encrypted = CryptoJS.AES.encrypt(msgString, key, {
            iv: iv
        });
        return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    }

    decrypt(ciphertextStr, key) {
        var ciphertext = CryptoJS.enc.Base64.parse(ciphertextStr);

        // split IV and ciphertext
        var iv = ciphertext.clone();
        iv.sigBytes = 16;
        iv.clamp();
        ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
        ciphertext.sigBytes -= 16;

        // decryption
        var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
            iv: iv
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    postContent(url, data) {
        //self = this
        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

        axios.post(url, {
            RegData: data
        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
        })
            .then((res) => {
                //console.log((document.cookie = "Login_is:" + res.data.token));
                console.log(res);
                if (res.status === "200") {
                    console.log("donePosting");

                    //self.$router.push("/");
                }
                //this.$cookie.set("Login-Token", res.data.token);
            });
        /* .then(function (response) {
          self.deleteText()
        }) */
    }

    handleCheckUserName = (e) => {
        let name = this.state.fields["name"];
        let { errors } = this.state;
        let { formIsValid } = this.state;

        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

        axios.post('http://127.0.0.1:5000/CheckUserName', {
            UName: name
        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
            else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            }
        })
            .then((res) => {
                //console.log((document.cookie = "Login_is:" + res.data.token));
                //              console.log(res);
                /* if (res.status === "200") {
                     console.log("doneChecking");
 
                 }*/
                if (res.data.error) {
                    errors["name"] = res.data.error;
                    formIsValid = false;
                    console.log(res.data.error);
                }
                else {
                    if (name.match(/^[a-zA-Z]+$/)) {
                        delete errors.name;
                        console.log("UserName Available");
                        if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                            console.log("No Errors");

                            formIsValid = true;
                        }
                    }
                }
                this.setState({
                    formIsValid: formIsValid,

                    errors: errors
                });
            });
        /* .then(function (response) {
          self.deleteText()
        }) */
    }
    contactSubmit(e) {
        e.preventDefault();
        var key = CryptoJS.enc.Utf8.parse('1234567890123456'); // TODO change to something with more entropy
        let { fields } = this.state;
        var oldPass = fields["password"]
        let { formIsValid } = this.state;
        if (formIsValid) {
            fields["password"] = this.encrypt(fields["password"], key);
            this.postContent("http://127.0.0.1:5000/register", fields);
            fields["password"] = oldPass;
        }

    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields["phone"] = e.target.value;
        this.setState({ fields });
    }
    render() {
        return (

            <div className="container" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <div className="wrapper">
                    <form method="POST" name="signUp_Form" className="form-signin" onSubmit={this.contactSubmit.bind(this)}>
                        <h3 className="form-signin-heading">Join Today</h3>
                        <hr className="colorgraph"></hr>

                        <div className="form-group">

                            <label className="form-control-label"> Full Name</label>
                            <input type="text" className="form-control" onChange={this.handleUsernameChange} onBlur={this.handleCheckUserName}></input>
                            <span className="error" style={{ color: "red" }}>{this.state.errors["name"]}</span>
                            <br />
                        </div>
                        <div className="form-group">

                            <label className="form-control-label"> Email</label>
                            <input type="text" className="form-control" onChange={this.handleEmailChange}></input>
                            {/* <input type="text" className="form-control" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]}></input> */}
                            <span className="error" style={{ color: "red" }}>{this.state.errors["email"]}</span>
                        </div>
                        <div className="form-group">

                            <label className="form-control-label"> Phone No.</label>
                            <input type="text" className="form-control" onChange={this.handleChange.bind(this, "phone")} value={this.state.fields["phone"]}></input>

                        </div>
                        <div className="form-group">
                            <label className="form-control-label">password</label>
                            <input type="password" className="form-control" onChange={this.handlePasswordChange}></input>

                        </div>
                        <div className="form-group">
                            <label className="form-control-label">Confirm password</label>
                            <input type="password" className="form-control" onChange={this.handleConfirmPassword} id="confPass"></input>
                            <span className="error" style={{ color: "red" }} id="passerror"> {this.state.errors["password"]}</span>
                        </div>

                        <input type="submit" className="btn btn-lg btn-primary btn-block" value="Sign Up"></input>

                    </form>
                    {/*flash */}


                    <small className="text-muted">
                        Need An Account? <a className="ml-2" href="{{ url_for('register') }}">Sign Up Now</a>
                    </small>
                </div>

            </div>
        );
    }
}

export default SignUp;