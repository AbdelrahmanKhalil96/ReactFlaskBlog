
import React from 'react';
import axios from 'axios';
import Posts from './posts'
import ReactModal from 'react-modal';
/*
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};*/
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
class Home extends React.Component {

    constructor(props) {
        super(props);


        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    handleNewPost = (e) => {
        e.preventDefault();
        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        let data = new FormData(document.getElementById('newPostForm'));
        if ((data.get('title') !== '') && (data.get('content') !== '')) {
            let postData = {
                'title': data.get('title'),
                'content': data.get('content'),
                'user_id': JSON.parse(sessionStorage.getItem('uData'))['uId'],
            }
            axios.post('http://127.0.0.1:5000/addPosts', {
                PostData: postData
            }, config).catch(function (error) {
                if (error.response) {
                    console.log("error");
                }
            })
                .then((res) => {
                    if (res.data['message']) {
                        this.setState({ message: res.data['message'] });

                        document.getElementById("newPostForm").reset();
                        setTimeout(function () {
                            this.setState({ message: '' });
                        }.bind(this), 2000);
                    }
                    let posts = res.data
                    console.log(posts);
                });
        }
        else {
            this.setState({ message: 'Please Fill The Data First' });
            setTimeout(function () {
                this.setState({ message: '' });
            }.bind(this), 2000);
        }

    }
    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }
    state = {
        posts: [],
        showModal: false,
        message: ''

    }
    componentDidMount() {
        ReactModal.setAppElement('#homeDiv');

        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        axios.get('http://127.0.0.1:5000/getPosts', {

        }, config).catch(function (error) {
            if (error.response) {
                console.log("error");
            }
        })
            .then((res) => {
                let posts = res.data.posts
                console.log(posts);
                this.setState({ posts: posts })

            });
    }
    render() {
        console.log(this.props)
        return (
            <div className="container" id='homeDiv'>
                <div className='.col-sm-3'>

                    <h1 class="inner-block">Latest Posts</h1>
                    {
                        this.props.loggedIn === 'true' &&
                        <div class="float-md-right">
                            <button className='btn btn-secondary' onClick={this.handleOpenModal}>Create New Post</button>
                        </div>
                    }
                    <div>

                        <div class="row">

                            <Posts posts={this.state.posts} />

                        </div>
                        <ReactModal
                            isOpen={this.state.showModal}
                            contentLabel="Minimal Modal Example" style={{
                                content: {
                                    position: 'absolute',
                                    top: '40px',
                                    left: '30%',
                                    right: '30%',
                                    bottom: '30%',
                                }
                                //  content: {   color: 'lightsteelblue'    }
                            }}

                        >
                            <div>

                                <div class="container center_div">

                                    <form id='newPostForm'>
                                        <div class="form-group">
                                            <label for="title">Title</label>
                                            <input type="text" class="form-control" name='title' id="title" />
                                        </div>


                                        <div class="form-group">
                                            <label for="content">Content</label>
                                            <textarea class="form-control" id="content" rows="5" name='content'></textarea>
                                        </div>
                                        <div class="form-group" style={{ textAlign: 'center' }}>
                                            <button className='btn btn-secondary' onClick={this.handleNewPost}>Submit</button>
                                            <button className='btn btn-secondary' style={{ marginLeft: '10px' }} onClick={this.handleCloseModal}>Close</button>
                                        </div> </form>
                                    <div className="form-group row"> <span style={{ color: "blue", textAlign: 'center', margin: 'auto', display: 'table' }}>{this.state.message}</span><br />
                                    </div>

                                </div>
                            </div>

                        </ReactModal>
                    </div>

                </div>
            </div>
        )
    }
}
export default Home;


