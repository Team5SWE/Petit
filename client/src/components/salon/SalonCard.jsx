import {React, Component} from "react";
import logo from "../../assets/default_salon.png"

export default class SalonCard extends Component {
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
      <div class="salon-card">

        <div class="salon-card-iconbox">
          <img class="contained-image" src={hasUrl ? this.state.imageUrl : logo}
          alt="salon logo" onError={this.handleImageError}/>
        </div>

        <div class="salon-card-info">
          <h4>{this.props.name}</h4>
          <p>{this.props.location}</p>
        </div>

        <div class="salon-card-buttons">

          <a href={"appointment/"+this.props.identifier}>
            <div class="red-btn salon-card-btn">
              MAKE APPOINTMENT
            </div>
          </a>



          <a href={"salon/"+this.props.identifier}>
            <div class="dark-btn salon-card-btn">
              LEARN MORE
            </div>
          </a>

        </div>

      </div>
    )
  }

}
