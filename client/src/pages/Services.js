import React, { Component } from "react";
import ReactDOM from "react-dom";

class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      responseData: null
    };
  }

  //incorporating local storage
  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    this.callApi();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/2/")
      .then(res => res.json())
      .then(res => {
        this.setState({ apiResponse: res })
        console.log(res.services)
        this.updateInput('list', res.services)
        console.log(this.state.list)
      })
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }


  handleSubmit(){
    let data = {
      businessId: 2,
      servicesList: this.state.list,

    }

    let apiUrl = 'http://127.0.0.1:8000/api/salon/'+2+'/services'

    fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
    // update react state
    this.setState({ [key]: value });
  }

  addItem() {
    // create a new item with unique id
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice()

    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: ""
    });
  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });
  }

  render() {
    return (
      <div>
        <h1 className="app-title">Manage Services</h1>
        <div class="topnav">
          <a href="./salon">Go Back</a>
          <a href="./appointment">Appointment</a>
          <a href="./contact">Contact Us</a>
          <a href="/">Sign Out</a>
        </div>
        <br />
        <br />
        <div className="container">
          <div
            style={{
              padding: 50,
              maxWidth: 900,
              margin: "left"

            }}
          >
            <br />
            <input
              style={{ maxWidth: 500 }}
              type="text"
              placeholder="Type a service name here..."
              value={this.state.newItem}
              onChange={e => this.updateInput("newItem", e.target.value)}
            />
            ' '
            <button
              className="addbtn btn-floating"
              onClick={() => this.addItem()}
              disabled={!this.state.newItem.length}
            >
              ADD
            </button>
            <br /> <br />

            <ul>
              {this.state.list.map(item => {
                return (

                  <li key={item}>
                    <table><tr><td>
                    {item}</td><td>
                    <button className="removebtn" onClick={() => this.deleteItem(item)}>
                      Remove
                    </button>
                    </td><br /></tr></table>

                  </li>
                );
              })}
            </ul>

          </div>
        </div>
        <button
              className="subbtn btn-floating"
              onClick={() => this.addItem()}
              disabled={!this.state.newItem.length}
            >
              SUBMIT Changes
            </button>
      </div>
    );
  }
}



ReactDOM.render(<Services />, document.getElementById('root'));
export default Services;
