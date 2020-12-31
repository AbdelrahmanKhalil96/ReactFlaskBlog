import './App.css';
import Navbar from './components/navbar'
import Login from './components/login'
/*import Chat from './components/chat'*/
import Home from './components/home'
import Profile from './components/profile'
import Logout from './components/logout'
import SignUp from './components/signup'
import { BrowserRouter, Route } from 'react-router-dom';
import { Component } from 'react';
import { Chat } from 'react-chat-popup';
import ImageUpload  from './components/upImg';
class App extends Component {
  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
  }
  state = {
    isLoggedIn: false,
    uData: {
      UEmail: '',
      UName: '',
      UPhone: '',
    }
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

  }
  handleLoginCkeck(val) {

    this.setState({
      isLoggedIn: val['Logged_in'],

      uData: val['uData']
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
          <Route exact path="/" component={Home} />
          <Route path="/login" render={(props) => <Login fn={this.handleLoginCkeck.bind(this)} {...props} />} />
          <Route path="/SignUp" component={SignUp} />
          {/**    <Route path="/chat" component={Chat} />*/}
          <Route path="/profile" component={Profile} />
          <Route path="/logout" render={(props) => <Logout handleLogoutCheck={this.handleLogoutCheck.bind(this)} {...props} />} />

        </BrowserRouter>
        {isLoggedIn &&
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        }
        <ImageUpload/>
      </div>
    );
  }
}
export default App;
