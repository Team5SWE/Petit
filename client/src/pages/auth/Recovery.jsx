import {React, Component} from "react";
import logo from "../../assets/petit_white.png"
import PageLoader from "../../components/navbar/PageLoader.jsx";
import {Navigate} from "react-router-dom";

export default class Recovery extends Component{
  constructor(props) {
    super(props);

    this.state = {

      email: '',
      errorMsg: '',
      code: '',

      stage: 'waiting',
      waiting: false,

      newPassword: '',
      newPassword2: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.switchInputs = this.switchInputs.bind(this);
    this.switchSubmit = this.switchSubmit.bind(this);

  }

  handleChange(event){

    // Block input change when waiting for server response
    // after submission
    if(this.state.waiting)
      return

    let field = event.target.name;
    this.setState({
      ...this.state,
      [field]: event.target.value
    })
  }

  componentDidMount(){
    this.callApi();
  }

///////////////////////////////////////////////////////////////////////////////
// API INTERACTION
//////////////////////////////////////////////////////////////////////////////

// Make POST request to check if
// user has already logged in the system
callApi() {
  let storedData = {
    access: localStorage.getItem('access')
  }

  fetch('http://127.0.0.1:8000/api/auth/', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(storedData)
  })
  .then(res => res.json())
  .then(res => {
    if(res.valid){
      this.setState({...this.state, stage: 'authenticated'})
    } else {
      this.setState({...this.state, stage: 'request'})
    }
  });
}


handleSubmit(){

  // Block submission when waiting for server response
  if(this.state.waiting)
    return

  // Email input validity check
  if(this.state.email.trim() === ''){
    this.setState({...this.state, errorMsg: 'No email was provided'})
    return;
  }



  let data = {
    email: this.state.email
  }

  // Set waiting as true to prevent double submission
  this.setState({...this.state, waiting: true});

  fetch('http://127.0.0.1:8000/api/recovery/request',{
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if(res.valid){
      this.setState({...this.state, stage: 'check', errorMsg: '', waiting: false})
    } else {
      this.setState({...this.state, errorMsg: res.error, waiting: false})
    }
  });
}
///////////////////////////////////////////////////////////////////////////////

//Sends a POST request to check if provided code is the same as the one
//stored in the database
handleCodeSubmit(){

  // Block submission when waiting for server response
  if(this.state.waiting)
    return

  // Check if code input is valid
  if(this.state.code.trim() === ''){
    this.setState({...this.state, errorMsg: 'No code was provided'})
    return;
  }

  let data = {
    email: this.state.email,
    code: this.state.code
  }

  // Set waiting as true to prevent double submission
  this.setState({...this.state, waiting: true});

  fetch('http://127.0.0.1:8000/api/recovery/check', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {

    if(res.valid){
      this.setState({...this.state, stage: 'change', errorMsg: '', waiting: false})
    } else {
      this.setState({...this.state, errorMsg: res.error, waiting: false})
    }
  });
}
///////////////////////////////////////////////////////////////////////////////

// Sends a POST request to server to change Passwords
// Only can be accessed after recovery code is successfully verified
handlePasswordSubmit(){

  // Block submission when waiting for server response
  if(this.state.waiting)
    return

  // Input validity check
  let password1 = this.state.newPassword.replace(' ', '')
  let password2 = this.state.newPassword2.replace(' ', '')
  if(password1 === '' && password2 === '')
      return

  if(password1 !== password2){
    this.setState({...this.state,
       errorMsg: 'Passwords dont match'})
    return
  }
  ///////////////////////////////////

  // Set waiting as true to prevent double submission
  this.setState({...this.state, waiting: true});

  let data = {
    email: this.state.email,
    password: this.state.newPassword
  }

  fetch('http://127.0.0.1:8000/api/recovery/change', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {

    if(res.valid){
      this.setState({...this.state, stage: 'success'})
    } else {
      this.setState({...this.state, errorMsg: res.error, waiting: false})
    }
  });
}
///////////////////////////////////////////////////////////////////////////////
// FLOW CONTROL DEPENDING ON STAGE OF RECOVERY PROCESS
//////////////////////////////////////////////////////////////////////////////

  //Determines input fields displayed depending
  //on the recovery stage
  switchInputs(stage){
    switch(stage){

      case "request":
        return(
          <div class="auth-forms-input-column">

            <div class="auth-input-box">
              <p>Email address</p>
              <input class="auth-input" name="email" type="text"
              value={this.state.email} onChange={this.handleChange} />
            </div>

          </div>
        );

        case "check":
          return(
            <div class="auth-forms-input-column">

              <div class="auth-input-box">
                <p>Recovery Code</p>
                <input class="auth-input" name="code" type="text"
                value={this.state.code} onChange={this.handleChange} />
              </div>

            </div>
          );

        case "change":
        default:
          return(
            <div class="auth-forms-input-column">

              <div class="auth-input-box">
                <p>New password</p>
                <input class="auth-input" type="password" name="newPassword"
                 value={this.state.newPassword} onChange={this.handleChange} />
              </div>

              <div class="auth-input-box">
                <p>Repeat new password</p>
                <input class="auth-input" type="password" name="newPassword2"
                value={this.state.newPassword2} onChange={this.handleChange} />
              </div>

            </div>
          );
    }
  }

  //Determine buttons and their actions depending
  //on the recovery stage
  switchSubmit(stage){
    switch(stage){

      case "request":
        return(
          <div class="auth-submit-btn yellow-btn" onClick={this.handleSubmit}>
            Request code
          </div>
        );

      case "check":
        return(
          <div class="auth-submit-btn yellow-btn" onClick={this.handleCodeSubmit}>
            Recover Account
          </div>
        );

      case "change":
      default:
        return(
          <div class="auth-submit-btn yellow-btn"  onClick={this.handlePasswordSubmit}>
            Change Password
          </div>
        );

    }
  }
  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////




  render(){

    const stage = this.state.stage;
    const hasError = this.state.errorMsg !== ''

    switch(stage){

      case "authenticated":
        return(
          <Navigate to="/business"/>
        );

      case "waiting":
        return(
          <PageLoader/>
        );

      case "success":
        return(
          <Navigate to="/login"/>
        );

      default:
        return(
          <div>


            <div class="auth-div">
              <a href="/"><img class="auth-main-logo" src={logo} alt="logo"/></a>

              <div class="auth-form-div">

                <div class="auth-form-title">
                  <h4>Account Recovery</h4>
                </div>

                {this.switchInputs(this.state.stage)}

              <div class="auth-form-submit">

                {this.switchSubmit(this.state.stage)}

                {hasError ? <p class="error-txt">{this.state.errorMsg}</p> :
                 <div class="ignore"/>}

              </div>

            </div>

            <div class="auth-disclaimer-div">
              <p>©Petit 2022 | ALL RIGHTS RESERVED</p>
            </div>

            <div class="bottom-wave-div">
            <svg id="settings-wave" class="bottom-wave" viewBox="0 0 1440 350" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,105L26.7,110.8C53.3,117,107,128,160,157.5C213.3,187,267,233,320,210C373.3,187,427,93,480,52.5C533.3,12,587,23,640,64.2C693.3,105,747,175,800,192.5C853.3,210,907,175,960,134.2C1013.3,93,1067,47,1120,58.3C1173.3,70,1227,140,1280,163.3C1333.3,187,1387,163,1440,128.3C1493.3,93,1547,47,1600,58.3C1653.3,70,1707,140,1760,151.7C1813.3,163,1867,117,1920,110.8C1973.3,105,2027,140,2080,175C2133.3,210,2187,245,2240,233.3C2293.3,222,2347,163,2400,145.8C2453.3,128,2507,152,2560,163.3C2613.3,175,2667,175,2720,157.5C2773.3,140,2827,105,2880,128.3C2933.3,152,2987,233,3040,268.3C3093.3,303,3147,292,3200,291.7C3253.3,292,3307,303,3360,303.3C3413.3,303,3467,292,3520,250.8C3573.3,210,3627,140,3680,116.7C3733.3,93,3787,117,3813,128.3L3840,140L3840,350L3813.3,350C3786.7,350,3733,350,3680,350C3626.7,350,3573,350,3520,350C3466.7,350,3413,350,3360,350C3306.7,350,3253,350,3200,350C3146.7,350,3093,350,3040,350C2986.7,350,2933,350,2880,350C2826.7,350,2773,350,2720,350C2666.7,350,2613,350,2560,350C2506.7,350,2453,350,2400,350C2346.7,350,2293,350,2240,350C2186.7,350,2133,350,2080,350C2026.7,350,1973,350,1920,350C1866.7,350,1813,350,1760,350C1706.7,350,1653,350,1600,350C1546.7,350,1493,350,1440,350C1386.7,350,1333,350,1280,350C1226.7,350,1173,350,1120,350C1066.7,350,1013,350,960,350C906.7,350,853,350,800,350C746.7,350,693,350,640,350C586.7,350,533,350,480,350C426.7,350,373,350,320,350C266.7,350,213,350,160,350C106.7,350,53,350,27,350L0,350Z"></path></svg>

            </div>

          </div>

        </div>
      );
    }



  }

}
