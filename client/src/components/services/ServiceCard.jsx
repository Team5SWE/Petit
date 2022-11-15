import {React, Component} from "react";

export default class ServiceCard extends Component{

  render(){
    return(
      <div class="service">
        <p>${this.props.price}</p>
        <p>{this.props.name}</p>
        <p>{this.props.category}</p>
        {this.props.editable ? <i class="fa-solid fa-trash remove-icon pointer"
        onClick={this.props.removeAction}></i> : <div class="ignore"></div>}
      </div>
    )
  }

}
