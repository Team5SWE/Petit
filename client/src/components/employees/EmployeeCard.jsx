import {React, Component} from "react";
import profile from "../../assets/default_employee.jpeg";

export default class EmployeeCard extends Component{
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

      <div class="employee">

        <div class="employee-box">

          <div class="emp-img-div">
            <div class="emp-img-container">
              <img class="emp-img-adder"
              src={ hasUrl ? this.state.imageUrl : profile} alt="" onError={this.handleImageError}/>
            </div>
          </div>

          <div class="emp-desc">
            <p>{this.props.specialty}</p>
            <h2>{this.props.name}</h2>
          </div>

          <div class="emp-btns">

            <p class="emp-btn dark">
              {this.props.email}
            </p>

          </div>

        </div>

      </div>
    )
  }
}
