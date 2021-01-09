import React from 'react';
import axios, { isCancel } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar'


class ImageUpload extends React.Component {

    state = {
        file: null,
        uploadPercentage: 0,
        source: null
    }

    handleFile(e) {
        let file = e.target.files[0]
        this.setState({ file: file })
    }

    /*     uFile = (e) => {
            e.preventDefault();
            let data = new FormData(document.getElementById('form1'));
            let { file } = this.state
    
            data.append('file', file)
            /*    const options = {
                   onUploadProgress: (progressEvent) => {
                       const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                       console.log("onUploadProgress", totalLength);
                       if (totalLength !== null) {
                           this.updateProgressBarValue(Math.round((progressEvent.loaded * 100) / totalLength));
                       }
                   },
                   headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
               } 
            const config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(percentCompleted)
                },
                headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
            }
            axios.post('http://localhost:5000/upload_file', data, config).then(res => {
                console.log(res);
                /*  this.setState({ uploadPercentage: 100 }, () => {
                      setTimeout(() => {
                          this.setState({ uploadPercentage: 0 })
                      }, 1000)
                  })
            })
    
        } */


    handleUpload(e) {
        let { file } = this.state
        let formdata = new FormData()
        formdata.append('image', file)
        console.log(formdata)
        axios({
            url: "http://localhost:5000/upload",
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data'
            },
            data: formdata
        }).then((res) => {
            console.log(res)
        })
    }
    /* uFile = (e) => {
         e.preventDefault();
         let data = new FormData();
         let { file } = this.state
 
         data.append('file', file)
         /*    const options = {
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    console.log("onUploadProgress", totalLength);
                    if (totalLength !== null) {
                        this.updateProgressBarValue(Math.round((progressEvent.loaded * 100) / totalLength));
                    }
                },
                headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
            } 
    const config = {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(percentCompleted)
        },
        headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
    }
    axios.post('http://localhost:5000/upload', data, config).then(res => {
        console.log(res);
            /*  this.setState({ uploadPercentage: 100 }, () => {
                  setTimeout(() => {
                      this.setState({ uploadPercentage: 0 })
                  }, 1000)
              })
        })

    }

    */
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
                // console.log(`${loaded}kb of ${total}kb | ${percent}%`);
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
    uploadFile(e) {
        e.preventDefault();
        let { file } = this.state;
        var formData = new FormData();
        formData.append("file", file);
        console.log(formData.get(file));
        axios
            .post("http://localhost:5000/upload", { data: formData }, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => console.log(res))
            .catch(err => console.warn(err));
    }
    handleImageUpload(uploadEvent) {
        uploadEvent.preventDefault();
        let fileToUpload = this.state.file;
        var formData = new FormData(document.getElementById('form1'));
        formData.append('username', 'Chris');
        formData.append("file", fileToUpload);
        console.log(formData);
        axios({
            method: 'post',
            url: 'http://localhost:5000/upload_file',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' } }
        })
            .then(response => console.log(response))
            .catch(errors => console.log(errors))
    }

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