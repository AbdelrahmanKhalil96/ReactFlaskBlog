import React, { Component } from 'react';
import axios from "axios";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            fetchedData: {
                UEmail: '',
                UName: '',
                UPhone: '',
                uId: '',
                uImg: '',
            }
        }

    }

    componentDidMount() {
        let uId = this.props.match.params['user_id'];

        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        axios.post('http://127.0.0.1:5000/uProfile', {
            uData: uId
        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
        })
            .then((res) => {
                let posts = res.data
                this.setState({
                    fetchedData: res.data
                })
                console.log(posts);
            });
    }


    render() {

        //let alt = JSON.parse(sessionStorage.getItem('uData')['Uimg'])
        // let image = a['Uimg'];//replace(/['"]+/g, '')
        return (
            <div>
                <div>

                    <div className="container ">
                        <div className="row">
                            <div className="col-sm-10"><h1>User Profile Page</h1></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">{/*left col*/}
                                <div className="text-center">
                                    <img src={this.state.fetchedData['uImg']} className="avatar img-circle img-thumbnail" alt='Please Wait' />

                                </div><br />

                            </div>{/*/col-3*/}

                            <div className="col-md-9">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h4>User Profile</h4>
                                                <hr />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <form id='chForm' >
                                                    <div className="form-group row">
                                                        <label htmlFor="email" className="col-4 col-form-label">Email</label>
                                                        <div className="col-8">
                                                            <input id="email" className="form-control here" type="text" value={this.state.fetchedData['UEmail']} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="name" className="col-4 col-form-label">Full Name</label>
                                                        <div className="col-8">
                                                            <input id="name" name="name" placeholder="Full Name" className="form-control here" type="text" value={this.state.fetchedData['UName']} disabled />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label htmlFor="phone" className="col-4 col-form-label">Phone No.</label>
                                                        <div className="col-8">
                                                            <input id="phone" name="phone" placeholder="phone" className="form-control here" value={this.state.fetchedData['UPhone']} type="text" disabled />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">

                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>{/*/col-9*/}
                    </div>{/*/row*/}
                </div>
            </div >
        )
    }

}
export default UserProfile;