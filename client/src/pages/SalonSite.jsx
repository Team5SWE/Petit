import React, {Component} from "react";


class SalonSite extends Component {

  constructor(props){
    super(props);
    this.state = {apiResponse: ""}
  }

  componentDidMount(){
    this.callApi();
  }

  callApi(){
    fetch("http://127.0.0.1:8000/1")
    .then(res => res.json())
    .then(res => this.setState({apiResponse: res}))
  }



  render(){

    console.log(this.state.apiResponse)

    return (
      <div>

        <h1> Welcome to {this.state.apiResponse.name}! </h1>
        <h2> Email: {this.state.apiResponse.email} </h2>
        <p> {this.state.apiResponse.description} </p>

      </div>

    )
  }

}

export default SalonSite;
