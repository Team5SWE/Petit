import React, {Component} from "react";

class InitialRecover extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', sent: false, errorMsg: '', code: '', verified: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    let field = event.target.name;
    this.setState({
      ...this.state,
      [field]: event.target.value
    })
  }

  handleSubmit(){

    let data = {
      email: this.state.email
    }

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
        this.setState({...this.state, sent: true, errorMsg: ''})
      } else {
        this.setState({...this.state, errorMsg: res.error})
      }
    });

  }

  handleCodeSubmit(){

    let data = {
      email: this.state.email,
      code: this.state.code
    }

    fetch('http://127.0.0.1:8000/api/recovery/request', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, verified: true})
      }






    })



  }



  render(){

    const hasError = this.state.errorMsg !== ''

    if(!this.state.sent){


      return(
        <div>
        <h1> Enter your accounts email </h1>
        <input name="email" value={this.state.email} onChange={this.handleChange}/>
        <button onClick={this.handleSubmit}>Request password reset</button>
        {
          hasError ?
            <p>{this.state.errorMsg} </p>
            :
            <div>
            </div>
        }
        </div>
      )
    } else  {

      <div>
      <h1> Enter the recovery code </h1>
      <input name="code" value={this.state.code} onChange={this.handleChange}/>
      <button onClick={this.handleSubmit}>Request password reset</button>
      {
        hasError ?
          <p>{this.state.errorMsg} </p>
          :
          <div>
          </div>
      }
      </div>

    }

  }



}

export default InitialRecover;
