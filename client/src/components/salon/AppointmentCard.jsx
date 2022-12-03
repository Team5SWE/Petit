import {React, Component} from "react";
import profile from "../../assets/default_employee.jpeg"

export default class AppointmentCard extends Component{
  constructor(props){
    super(props);
    this.state = {imageUrl: this.props.url}

    this.handleImageError = this.handleImageError.bind(this);
  }


  handleImageError(){
    this.setState({...this.state, imageUrl: ''})
  }

  render(){

    let hasUrl = this.state.imageUrl !== undefined && this.state.imageUrl !== '';

    return(
      <div class="appointment-stripe fadein-element">
        <div class="app-stripe-img-container">
          <img class="contained-image" src={hasUrl ? this.state.imageUrl : profile }
          alt="empProfile" onError={this.handleImageError}/>
        </div>
        <p class="app-stripe-text">Employee: {this.props.provider}</p>
        <p class="app-stripe-text">{this.props.service}</p>
        <p class="app-stripe-text">{this.props.date}</p>
        <p class="app-stripe-text">{this.props.start}</p>
        <p class="app-stripe-text">Client: {this.props.clientName}</p>
      </div>
    )
  }



}
