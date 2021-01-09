import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class Posts extends React.Component {
    render() {
        const { posts } = this.props;
        const thePosts = posts.map((post) => {
            return (
                <div className="col-md-offset-1 col-md-7" key={post.id}>

                    <div className="p-3 mb-2 bg-light text-dark">
                        <hr />
                        <div className="inner-block">
                            <h3 className="mb-0">{post.title}</h3>
                            <div className="mb-1 text-muted">{post.date_posted}</div>
                            <p className="card-text mb-auto">{post.content}</p>
                            <div className="mr-2 float-md-right">
                                <label >Author Is : </label>
                                <Link name='author' to={`/user/${post.user_id}`}>{post.user_Name}</Link>
                            </div>


                        </div>
                    </div>
                </div>)
        })
        return (
            <div className='row'>
                {thePosts}
            </div>
        )
    }
}
export default Posts;