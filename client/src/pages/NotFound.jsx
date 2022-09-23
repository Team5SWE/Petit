import React, {Component} from "react";

class NotFound extends Component {

  constructor(props){
    super(props);
    this.state = { apiResponse: ""};
  }

  render(){
    return(
      <div>

        <h1> No page found </h1>

      </div>
    );

  }


}

export default NotFound;
