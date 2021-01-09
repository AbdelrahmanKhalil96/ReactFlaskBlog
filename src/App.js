import './App.css';
import Navbar from './components/navbar'
import Login from './components/login'
/*import Chat from './components/chat'*/
import Home from './components/home'
import Profile from './components/profile'
import Logout from './components/logout'
import SignUp from './components/signup'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Component } from 'react';
import { Chat, addResponseMessage } from 'react-chat-popup';
/*import ImageUpload from './components/upImg';*/
import UserProfile from './components/user_profile';
import axios from 'axios';

class App extends Component {


  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
    const config = {
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
    axios.post('http://127.0.0.1:5000/chat', {
      userData: newMessage
    }, config).catch(function (error) {
      if (error.response) {
        console.log("error");
      }
    })
      .then((res) => {
        let resp = res.data['botResponse']
        addResponseMessage(resp)
        console.log(resp);
      });
  }
  state = {
    isLoggedIn: false,
    uData: {
      UEmail: '',
      UName: '',
      UPhone: '',
      uId: '',
      uImg: '',
    },
  }

  componentDidMount() {
    if (sessionStorage.getItem('token') !== null) {
      const tokenString = JSON.parse(sessionStorage.getItem('token'));
      const uData = JSON.parse(sessionStorage.getItem('uData'));
      console.log(tokenString);
      console.log(uData);

      this.setState({
        isLoggedIn: tokenString,
        uData: uData
      })
    }
    addResponseMessage("Welcome to this awesome chat!");

  }
  handleDataUpdate(val) {
    console.log("test")
    this.setState({
      uData: val,
    }, () => {
      console.log(val);
      console.log("test");
    });
  }
  handleLoginCkeck(val) {
    this.setState({
      isLoggedIn: val['Logged_in'],

      uData: val['uData'],
    }, () => {
      console.log(val);
      console.log("test");
    });
  }
  handleLogoutCheck() {

    this.setState({
      isLoggedIn: false,

      uData: {
        UEmail: '',
        UName: '',
        UPhone: '',
        uId: '',
        uImg: ''
      }
    }, () => {
      console.log("Logged_Out");
    });
  }
  render() {

    let { isLoggedIn } = this.state;

    return (
      <div className="App">
        <BrowserRouter>
          <Navbar loggedIn={isLoggedIn} UName={this.state.uData.UName} />
          <Switch>
            <Route exact path="/" render={(props) => <Home loggedIn={isLoggedIn} {...props} />} />
            <Route path="/login" render={(props) => <Login fn={this.handleLoginCkeck.bind(this)} {...props} />} />
            <Route path="/SignUp" component={SignUp} />
            {/**    <Route path="/chat" component={Chat} />*/}
            <Route path="/profile" render={(props) => <Profile updData={this.handleDataUpdate.bind(this)} uData={this.state.uData}  {...props} />} />
            <Route path="/logout" render={(props) => <Logout handleLogoutCheck={this.handleLogoutCheck.bind(this)} {...props} />} />
            <Route path="/user/:user_id" component={UserProfile} /></Switch>
        </BrowserRouter>
        {isLoggedIn === "true" &&
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        }
        {/* <ImageUpload />*/}
      </div>
    );
  }
}
export default App;
