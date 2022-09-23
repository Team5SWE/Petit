import { Component } from "react";
import "./form-input.css";

export default class FormInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="form-container">
            <label className="form-label" htmlFor={this.props.key}>{this.props.label}</label>
            <input id={this.props.id} className="form-input" type={this.props.isPassword ? 'password' : 'text'} value={this.props.value}></input>
        </div>
    }
}