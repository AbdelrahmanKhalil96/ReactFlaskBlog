import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import axios from "axios";
import ProgressBar from 'react-bootstrap/ProgressBar'

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);

    }
    componentDidMount() {

    }
    state = {
        uData: {
            UEmail: '',
            UName: '',
            UPhone: '',
            uId: '',
            uImg: '',
        },
        message: '',
        file: null,
        uploadPercentage: 0,
        img: JSON.parse(sessionStorage.getItem('uData'))['Uimg'],
    }
    encrypt(msgString, key) {
        // msgString is expected to be Utf8 encoded
        var iv = CryptoJS.lib.WordArray.random(16);
        var encrypted = CryptoJS.AES.encrypt(msgString, key, {
            iv: iv
        });
        return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    }

    postContent(url, data) {
        //self = this
        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

        axios.post(url, {
            cData: data
        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
        })
            .then((res) => {
                console.log(res);
                if (res.data['DataUpdated']) {
                    this.setState({ message: res.data['DataUpdated'] })
                }
            })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        var key = CryptoJS.enc.Utf8.parse('1234567890123456'); // TODO change to something with more entropy
        let data = new FormData(document.getElementById('chForm'));
        let uId = this.props.uData.uId
        console.log(uId)
        let newData = {
            'UName': data.get('name'),
            'UPhone': data.get('phone'),
            'id': uId,
            'Uimg': JSON.parse(sessionStorage.getItem('uData'))['Uimg']
        }
        console.log(data.get('newpass'))
        this.postContent("http://127.0.0.1:5000/chData", newData);
        if (data.get('newpass')) {
            let npass = this.encrypt(data.get('newpass'), key);
            let ndata = {
                'npass': npass,
                'id': uId
            }

            this.postContent("http://127.0.0.1:5000/chPass", ndata);

        }

        let { uData } = this.props;
        uData['UName'] = newData['UName']
        uData['UPhone'] = newData['UPhone']
        //Image Part
        this.props.updData(uData);
        sessionStorage.setItem('uData', JSON.stringify(uData));
        setTimeout(function () {
            this.setState({ message: '' });
        }.bind(this), 3000);

        console.log(newData);
    }
    handleImagePreview(previewEvent) {
        this.setState({
            file: previewEvent.target.files[0],
            img: URL.createObjectURL(previewEvent.target.files[0])
        })
    }
    uFile = (e) => {

        e.preventDefault();
        let data = new FormData(document.getElementById('formUpload'));
        let { uData } = this.props;
        let file = this.state.file
        data.append('image', file)
        const options = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                    this.setState({ uploadPercentage: percent })
                }
            },

            headers: {
                'Authorization': 'Client-ID c15f75f944a7de6',

                'Content-Type': 'multipart/form-data'
            }
        }

        axios.post('https://api.imgur.com/3/image'
            , data, options).then(res => {
                console.log(res.data.data.link);
                uData['Uimg'] = res.data.data.link;
                sessionStorage.setItem('uData', JSON.stringify(uData));

                this.setState({
                    uploadPercentage: 100,
                    img: res.data.data.link,//.replace(/['"]+/g, ''),
                    uData: uData
                }, () => {

                    setTimeout(() => {
                        this.setState({ uploadPercentage: 0 })
                    }, 1000)
                })
            }).catch(function (thrown) {
                console.log(thrown);
            })
    }
    render() {
        const { uploadPercentage } = this.state;
        let a = JSON.parse(sessionStorage.getItem('uData'))
        console.log(a['Uimg'])
        //let alt = JSON.parse(sessionStorage.getItem('uData')['Uimg'])
        let image = a['Uimg'];//replace(/['"]+/g, '')
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
                                    <img src={image} className="avatar img-circle img-thumbnail" alt='Please Wait' />
                                    <h6>Upload a different photo...</h6>
                                    <form id='formUpload' onSubmit={this.uFile} encType='multipart/form-data'>
                                        <label for="files" className='btn btn-outline-dark'>Select file</label>
                                        <input type="file" className="hidden" id="files" style={{ margin: '10px', display: 'none' }} onChange={this.handleImagePreview.bind(this)} />
                                        <br>
                                        </br>
                                        <button type="submit" class="btn btn-outline-dark">Upload</button>
                                        {uploadPercentage > 0 && <ProgressBar now={uploadPercentage} label={`${uploadPercentage}%`} />}

                                    </form>

                                </div><br />

                            </div>{/*/col-3*/}

                            <div className="col-md-9">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h4>Your Profile</h4>
                                                <hr />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <form id='chForm' onSubmit={this.handleSubmit.bind(this)}>
                                                    <div className="form-group row">
                                                        <label htmlFor="email" className="col-4 col-form-label">Email</label>
                                                        <div className="col-8">
                                                            <input id="email" className="form-control here" type="text" value={this.props.uData.UEmail} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="name" className="col-4 col-form-label">Full Name</label>
                                                        <div className="col-8">
                                                            <input id="name" name="name" placeholder="Full Name" defaultValue={this.props.uData.UName} className="form-control here" type="text" onChange={this.handleName} />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label htmlFor="phone" className="col-4 col-form-label">Phone No.</label>
                                                        <div className="col-8">
                                                            <input id="phone" name="phone" placeholder="phone" className="form-control here" type="text" defaultValue={this.props.uData.UPhone} />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label htmlFor="newpass" className="col-4 col-form-label">New Password</label>
                                                        <div className="col-8">
                                                            <input type="password" id="newpass" name="newpass" placeholder="New Password" className="form-control here" />
                                                        </div>
                                                    </div>    <div className="form-group row"> <span style={{ color: "blue", textAlign: 'center', margin: 'auto', display: 'table' }}>{this.state.message}</span><br />
                                                    </div> <div className="form-group row">
                                                        <div className="offset-4 col-8">
                                                            <button name="submit" type="submit" className="btn btn-primary">Update My Profile</button>
                                                        </div>
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
export default Profile;