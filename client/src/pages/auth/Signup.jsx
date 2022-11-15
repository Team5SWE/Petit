import {React, Component} from "react";
import logo from "../../assets/petit_white.png"
import PageLoader from "../../components/navbar/PageLoader.jsx";
import {Navigate} from "react-router-dom";

export default class Signup extends Component{
  constructor(props){
    super(props);

    this.state = {
      //Account credentials
      username: '',
      email: '',
      phone: '',

      passType: 'password',
      pass2Type: 'password',
      password: '',
      passwordTwo: '',

      //Business credentials
      busName: "",
      busEmail: "",
      busPhone: "",
      busDescription: "",

      //Flags
      waiting: false,
      stage: 'waiting'

    }
    this.handleChange = this.handleChange.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

///////////////////////////////////////////////////////////////////////////////

  togglePassword(passwordType){
    let value = this.state[passwordType]
    if(value === "password")
      value = 'text'
    else
      value = "password"

    this.setState({...this.state, [passwordType]: value})
  }

  handleChange(event){

    if(this.state.waiting)
      return

    let field = event.target.name;
    this.setState({...this.state, [field]: event.target.value})
  }

  componentDidMount(){
    this.callApi();
  }

///////////////////////////////////////////////////////////////////////////////
// API INTERACTION
/////////////////////////////////////////////////////////////////////////////

callApi(){

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
      this.setState({...this.state, stage: 'loaded'})
    }
  });
}
///////////////////////////////////////////////////////////////////////////////

//Makes POST request with all credentials to server
handleSubmit(){

  //Block submission if already waiting for a response from the server
  if(this.state.waiting)
    return;

  this.setState({...this.state, waiting: true})

  //Input validty checks
  if(this.state.password === '' || this.state.email === ''
   || this.state.username ==='' || this.state.phone === ''){
    this.setState({...this.state, errorMsg:'Missing account credentials'})
    return;
  }

  if(this.state.busDescription === '' || this.state.busEmail ===''
     || this.state.busName === '' || this.state.busPhone === ''){
       this.setState({...this.state, errorMsg:'Missing business credentials'})
       return;
  }

  if(this.state.password !== this.state.passwordTwo){
    this.setState({...this.state, errorMsg: 'Passwords dont match!'})
    return;
  }


  //Send POST request

  let data = {

    user_name: this.state.username,
    password: this.state.password,
    email: this.state.email,

    businessData: {
      name: this.state.busName,
      email: this.state.busEmail,
      phone: this.state.busPhone,
      description: this.state.busDescription
    }

  }

  fetch('http://127.0.0.1:8000/api/signup/', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if(res.valid){
      this.setState({...this.state, stage: 'success', errorMsg: ''})
    } else {
      this.setState({...this.state, waiting: false, errorMsg: res.error})
    }
  });
}
////////////////////////////////////////////////////////////////////////////////

  render(){

    const showPassword = this.state.passType === "text" ;
    const showPasswordTwo = this.state.pass2Type === "text";

    const isPassIn = this.state.password !== '';
    const isPassInTwo = this.state.passwordTwo !== '';

    const hasError = this.state.errorMsg !== '';

    const stage = this.state.stage;

    switch(stage){
      case "waiting":
        return(<PageLoader/>);
      case "loaded":
      return(
        <div>


          <div class="auth-div dark">
            <a href="/"><img class="auth-main-logo" src={logo} alt="logo"/></a>

            <div class="auth-form-div auth-form-div-divided">

              <div class="auth-divided-div">

                <div class="auth-form-inputs-column">

                  <h4>YOUR ACCOUNT</h4>

                  <div class="auth-input-box">
                    <p>Username</p>
                    <input class="auth-input" name="username" value={this.state.username}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box">
                    <p>Email address</p>
                    <input class="auth-input" name="email" value={this.state.email}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box">
                    <p>Phone number</p>
                    <input class="auth-input" name="phone" value={this.state.phone}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box">

                    <div class="password-label">
                      <p>Password</p>
                      {showPassword ? (isPassIn ? <i class="fa-solid fa-eye-slash pointer" onClick={() => this.togglePassword("passType")}></i> : <div></div>)
                      : (isPassIn ? <i class="fa-solid fa-eye pointer" onClick={() => this.togglePassword("passType")}></i> : <div></div>)}
                    </div>

                    <input class="auth-input" name="password" type={this.state.passType}
                    value={this.state.password} onChange={this.handleChange} />
                  </div>

                  <div class="auth-input-box">
                  <div class="password-label">
                    <p>Repeat Password</p>
                    {showPasswordTwo ? (isPassInTwo ? <i class="fa-solid fa-eye-slash pointer" onClick={() => this.togglePassword("pass2Type")}></i> : <div></div>)
                    : (isPassInTwo ? <i class="fa-solid fa-eye pointer" onClick={() => this.togglePassword("pass2Type")}></i> : <div></div>)}
                  </div>
                    <input class="auth-input" type={this.state.pass2Type} name="passwordTwo"
                    value={this.state.passwordTwo} onChange={this.handleChange} />
                  </div>

                </div>

                <div class="auth-form-inputs-column right-inputs-column">

                  <h4>YOUR BUSINESS</h4>

                  <div class="auth-input-box">
                    <p>Business name</p>
                    <input class="auth-input" name="busName" value={this.state.busName}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box">
                    <p>Email address</p>
                    <input class="auth-input" name="busEmail" value={this.state.busEmail}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box">
                    <p>Phone number</p>
                    <input class="auth-input" name="busPhone" value={this.state.busPhone}
                    onChange={this.handleChange} type="text" />
                  </div>

                  <div class="auth-input-box growable-input-box">
                    <p>Description</p>
                    <textarea class="auth-input" name="busDescription" value={this.state.busDescription}
                    onChange={this.handleChange} resizable=""></textarea>
                  </div>

                </div>

              </div>

              <div class="auth-form-submit">
                <div class="auth-submit-btn dark-btn" onClick={this.handleSubmit}>
                  SIGN UP
                </div>

                {hasError ? <p class="error-txt">{this.state.errorMsg}</p> : <div class="ignore"/>}

                <p>Already have an account? <a href="/login" class="black-href"><strong>Log In</strong></a> </p>
              </div>
            </div>

            <div class="auth-disclaimer-div black-script">
              <p>©Petit 2022 | ALL RIGHTS RESERVED</p>
            </div>

            <div class="bottom-wave-div">

  <svg id="settings-wave" class="bottom-wave" viewBox="0 0 1440 490" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(250, 194, 19, 1)" offset="0%"></stop><stop stop-color="rgba(250, 194, 19, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,294L34.3,318.5C68.6,343,137,392,206,367.5C274.3,343,343,245,411,228.7C480,212,549,278,617,261.3C685.7,245,754,147,823,106.2C891.4,65,960,82,1029,73.5C1097.1,65,1166,33,1234,24.5C1302.9,16,1371,33,1440,89.8C1508.6,147,1577,245,1646,261.3C1714.3,278,1783,212,1851,179.7C1920,147,1989,147,2057,171.5C2125.7,196,2194,245,2263,269.5C2331.4,294,2400,294,2469,261.3C2537.1,229,2606,163,2674,187.8C2742.9,212,2811,327,2880,318.5C2948.6,310,3017,180,3086,171.5C3154.3,163,3223,278,3291,269.5C3360,261,3429,131,3497,73.5C3565.7,16,3634,33,3703,65.3C3771.4,98,3840,147,3909,196C3977.1,245,4046,294,4114,277.7C4182.9,261,4251,180,4320,163.3C4388.6,147,4457,196,4526,236.8C4594.3,278,4663,310,4731,343C4800,376,4869,408,4903,424.7L4937.1,441L4937.1,490L4902.9,490C4868.6,490,4800,490,4731,490C4662.9,490,4594,490,4526,490C4457.1,490,4389,490,4320,490C4251.4,490,4183,490,4114,490C4045.7,490,3977,490,3909,490C3840,490,3771,490,3703,490C3634.3,490,3566,490,3497,490C3428.6,490,3360,490,3291,490C3222.9,490,3154,490,3086,490C3017.1,490,2949,490,2880,490C2811.4,490,2743,490,2674,490C2605.7,490,2537,490,2469,490C2400,490,2331,490,2263,490C2194.3,490,2126,490,2057,490C1988.6,490,1920,490,1851,490C1782.9,490,1714,490,1646,490C1577.1,490,1509,490,1440,490C1371.4,490,1303,490,1234,490C1165.7,490,1097,490,1029,490C960,490,891,490,823,490C754.3,490,686,490,617,490C548.6,490,480,490,411,490C342.9,490,274,490,206,490C137.1,490,69,490,34,490L0,490Z"></path></svg>
            </div>
          </div>
        </div>
      );

      default:
        return(
          <Navigate to="/login" />
        );

    }



  }

}
