import React, {Component} from "react";

class InitialRecover extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', sent: false, errorMsg: '', code: '' };
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



  render(){

    const hasError = this.state.errorMsg !== ''

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

  }



}

export default InitialRecover;
