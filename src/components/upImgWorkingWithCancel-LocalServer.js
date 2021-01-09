import React from 'react';
import axios, { isCancel } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar'


class ImageUpload extends React.Component {

    state = {
        file: null,
        uploadPercentage: 0,
        source: null,
        uData: JSON.parse(sessionStorage.getItem('uData'))
    }
    uFile = (e) => {

        e.preventDefault();
        let data = new FormData(document.getElementById('form1'));
        let { file } = this.state
        data.append('file', file)
        const Canceltoken = axios.CancelToken;
        let source = Canceltoken.source();
        const options = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                    this.setState({ uploadPercentage: percent })
                }
            },
            cancelToken: source.token
            ,
            headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
        }

        axios.post('http://localhost:5000/upload_file', data, options).then(res => {
            console.log(res);
            this.setState({ uploadPercentage: 100 }, () => {
                setTimeout(() => {
                    this.setState({ uploadPercentage: 0 })
                }, 1000)
            })
        }).catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
                alert('cancelled');
            }
        })
        this.setState({ source: source })
    }
    cancelRequest = (e) => {
        e.preventDefault();
        const { source } = this.state;
        source.cancel('Operation canceled by the user.');
        this.setState({
            uploadPercentage: 0
        });
    };
    handleImagePreview(previewEvent) {
        this.setState({
            file: URL.createObjectURL(previewEvent.target.files[0])
        })
    }

    render() {

        const { uploadPercentage } = this.state;
        return (
            <form id='form1' onSubmit={this.uFile} encType='multipart/form-data'>
                <div className="form-group">
                    <input type="file" name="file" className="form-control-file" onChange={this.handleImagePreview.bind(this)} />
                    <img src={this.state.file} className="img-thumbnail" alt="" />
                    <button type="submit" className="btn btn-outline-dark" > Upload Photo </button>
                    <button type="cancel" className="btn btn-outline-dark" onClick={this.cancelRequest}>Cancel</button>
                    {uploadPercentage > 0 && <ProgressBar now={uploadPercentage} label={`${uploadPercentage}%`} />}
                </div>
            </form>
        )
    }
}

export default ImageUpload;