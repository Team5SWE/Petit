import {React, Component} from "react";
import "../../css/inputs/inputs.css";

export default class Dropdown extends Component{
  constructor(props){
    super(props);
    this.state = {selected: this.props.default, closed: true}
    this.handleChange = this.handleChange.bind(this);
    this.toggleClosed = this.toggleClosed.bind(this);

    console.log(this.props.params);

  }

  handleChange(option){
    let value = option;
    this.setState({...this.state, selected: value, closed: true})
  }

  toggleClosed(){
    let value  = this.state.closed;
    this.setState({...this.state, closed: !value})
  }




  render(){

    const closed = this.state.closed;

    return(
      <div class={"dropdown "+this.props.mainColor+" "+this.props.posType}>

        <div class="dropdown-top" onClick={this.toggleClosed}>
          <p>{this.state.selected}</p>
          {closed ? <i class="fa-solid fa-caret-down"></i> : <i class="fa-solid fa-caret-up"></i> }
        </div>

        {closed ? <div/>
        :
        <div class={"dropdown-options "+this.props.mainColor}>
          {this.props.options?.map(option =>{
            if(option === this.state.selected)
              return <div class={"selected-option "+this.props.selectColor+" "+this.props.selectedClasses}>
                      {option}</div>
            else
              return <div class="dropdown-option"
              onClick={() => {
                this.handleChange(option);
                this.props.changeFunc(this.props.fieldName, option)
              }}
              >{option}</div>
          }
          )}
        </div>
        }

      </div>
    )
  }

}

Dropdown.defaultProps = {
  selectedClasses : "",
  mainColor: "white",
  selectColor: "dark"
}
