import {React, Component} from "react";
import "../../css/dashboard/settings.css";
import {Navigate} from "react-router-dom";
import PageLoader from "../../components/navbar/PageLoader.jsx";

import BusinessNavbar from "../../components/navbar/businessNavbar.jsx";

import default_salon from "../../assets/default_salon.png";

export default class Settings extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectedImage: null,
      name: '',
      email: '',
      phone: '',

      street: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      authenticated: false,
      loaded: false,
      stage: 'waiting',
      apiResponse: "",

      addresses: [],
      changes: []
    }

    this.onSelectFile = this.onSelectFile.bind(this);
    this.clickFileUpload = this.clickFileUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchInputData = this.fetchInputData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  handleLogout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false, stage: 'failed'})
  }

  ///////////////////////////////////////////////////////////////////////////////
  // FILE CHANGE OPERATIONS
  ///////////////////////////////////////////////////////////////////////////////

  onSelectFile(e){
    const selectedFiles = e.target.files;
    const selectedFile = selectedFiles[0];
    let urlObject = URL.createObjectURL(selectedFile);
    this.setState({selectedImage: urlObject})
  }

  clickFileUpload(e){
    let fileField = this.refs.fileField;
    fileField.click();
  }



  ///////////////////////////////////////////////////////////////////////////////
  // API INTERACTION
  ///////////////////////////////////////////////////////////////////////////////

componentDidMount(){
  this.callApi();
}

callApi(){
  let storedData = {
    access: localStorage.getItem('access')
  }
  fetch('http://127.0.0.1:8000/api/auth/', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(storedData)
  })
  .then(res => res.json())
  .then(res => {
    this.fetchInputData(res);
  });
}

//Collect changes in an object and make POST request to API
//Modifies the state when receiving the callback
handleSubmit(){
  let data = {
    changes : {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      description: this.state.description,

      addresses: this.state.addresses
    },
    access: localStorage.getItem('access')
  }

  let apiUrl = 'http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.business.id+'/'
  fetch(apiUrl, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    this.fetchInputData(res);
  });
}

//Assigns the data received from the API
//into its different state attributes
fetchInputData(res){
  if(res.valid){

    this.setState({
      ...this.state,
      name: res.business.name,
      email: res.business.email,
      description: res.business.description,
      phone: res.business.phone,

      addresses: res.business.addresses,

      apiResponse: res,
      authenticated: res.valid,
      stage: 'loaded'

    });

  } else {
    this.setState({
      ...this.state,
      authenticated: res.valid,
      stage: 'failed'
    });
  }
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// ADDRESS OPERATIONS
///////////////////////////////////////////////////////////////////////////////
  deleteItem(id){
    let list = [...this.state.addresses]

    let addressToDelete = list.find(item => item.id === id)

    addressToDelete.action = 'remove'

    // Remove from array if it was locally added
    if(addressToDelete.local){
      list = list.filter(item => item.id !== id)
    }

    this.setState({...this.state, addresses: list})
  }
////////////////////////////////////////////////////////////////////////////////
  addItem(){

    if(this.state.street === '' || this.state.city === '' ||
     this.state.state === '' || this.state.zip === '')
      {
        console.log('Empty inputs. Ignoring')
        return;
      }


    const newAddress = {
      id: 1 + Math.random(),
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,

      action: 'add',
      local: true
    };

    const list = [...this.state.addresses]
    list.push(newAddress);

    this.setState({
      ...this.state,
      addresses: list,
      street: '',
      city: '',
      state: '',
      zip: ''
    });

  }
///////////////////////////////////////////////////////////////////////////////
  handleAddressChange(e){

    const addressList = [...this.state.addresses]
    let names = e.target.name.split(':')

    let id = Number(names[0])
    let fieldName = names[1]


    let address = addressList.find(item => item.id === id)

    address[fieldName] = e.target.value;
    if(address.action !== 'add'){
      address.action = 'set';
    }
    this.setState({...this.state, addresses: addressList})
  }
///////////////////////////////////////////////////////////////////////////////

  render(){

    const hasImage = this.state.selectedImage !== null
    const stage = this.state.stage;

    switch(stage){

      case "waiting":
        return(
          <PageLoader/>
        );

      case "loaded":
      return(
        <div>

          <BusinessNavbar exitFunc={this.handleLogout}/>
          <section class="title-container">
            <h1 class="page-title">GENERAL INFORMATION</h1>
          </section>

          <section class="services-container">

            <div class="general-info-container">

              <div class="general-info-upper">

                <div class="logo-input-section">
                  <div class="logo-img-container">
                  {
                    hasImage ? <img class="logo-img" src={this.state.selectedImage} alt="selected"/> :
                     <img class="logo-img" src={default_salon} alt="selected"/>
                  }
                  </div>

                  <div class="upload-btn dark-btn" onClick={this.clickFileUpload}>
                    UPLOAD
                    <input  ref="fileField"
                    class="file-input" type="file"
                    id="img" name="img" accept="image/*"
                    onChange={this.onSelectFile}
                    />
                  </div>
                </div>

                <div class="text-inputs-container">

                  <div class="text-input-box">
                    <p class="input-box-label">Name:</p>
                    <input type="text" class="text-input" name="name"
                    value={this.state.name} onChange={this.handleChange}/>
                  </div>

                  <div class="text-input-box">
                    <p class="input-box-label">Email address:</p>
                    <input type="text" class="text-input" name="email"
                    value={this.state.email} onChange={this.handleChange}/>
                  </div>

                  <div class="text-input-box">
                    <p class="input-box-label">Phone number:</p>
                    <input type="text" class="text-input" name="phone"
                    value={this.state.phone} onChange={this.handleChange}/>
                  </div>

                </div>

              </div>

              <div class="general-info-lower">
                <div class="text-input-box">
                  <p class="input-box-label">Description:</p>
                  <textarea name="description" rows="8" cols="80"
                   resizable="" value={this.state.description}
                   onChange={this.handleChange} />
              </div>

              </div>

            </div>

          </section>

  <svg id="settings-wave" viewBox="0 0 1440 320" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,96L34.3,117.3C68.6,139,137,181,206,181.3C274.3,181,343,139,411,138.7C480,139,549,181,617,208C685.7,235,754,245,823,218.7C891.4,192,960,128,1029,90.7C1097.1,53,1166,43,1234,80C1302.9,117,1371,203,1440,240C1508.6,277,1577,267,1646,240C1714.3,213,1783,171,1851,170.7C1920,171,1989,213,2057,240C2125.7,267,2194,277,2263,261.3C2331.4,245,2400,203,2469,160C2537.1,117,2606,75,2674,80C2742.9,85,2811,139,2880,181.3C2948.6,224,3017,256,3086,234.7C3154.3,213,3223,139,3291,90.7C3360,43,3429,21,3497,53.3C3565.7,85,3634,171,3703,208C3771.4,245,3840,235,3909,197.3C3977.1,160,4046,96,4114,90.7C4182.9,85,4251,139,4320,144C4388.6,149,4457,107,4526,74.7C4594.3,43,4663,21,4731,48C4800,75,4869,149,4903,186.7L4937.1,224L4937.1,320L4902.9,320C4868.6,320,4800,320,4731,320C4662.9,320,4594,320,4526,320C4457.1,320,4389,320,4320,320C4251.4,320,4183,320,4114,320C4045.7,320,3977,320,3909,320C3840,320,3771,320,3703,320C3634.3,320,3566,320,3497,320C3428.6,320,3360,320,3291,320C3222.9,320,3154,320,3086,320C3017.1,320,2949,320,2880,320C2811.4,320,2743,320,2674,320C2605.7,320,2537,320,2469,320C2400,320,2331,320,2263,320C2194.3,320,2126,320,2057,320C1988.6,320,1920,320,1851,320C1782.9,320,1714,320,1646,320C1577.1,320,1509,320,1440,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg>
          <section class="addresses-manager dark">
            <h1 class="page-title page-title-left">EDIT ADDRESSES</h1>

            <div class="addresses-editor-list">
            {this.state.addresses?.filter(add => add.action !== 'remove').map((address, index) =>
              <div class="address-editor" key={address.id}>

                <h4 class="address-editor-title">{'Address '+(index+1)+':'}</h4>

                <div class="address-editor-inputs">
                  <input class="add-input-street" type="text" placeholder="Street"
                   name={address.id+':street'} value={address.street} onChange={this.handleAddressChange}/>

                  <input class="add-input-city" type="text" placeholder="City"
                  name={address.id+':city'} value={address.city} onChange={this.handleAddressChange}/>

                  <input class="add-input-state" type="text" placeholder="State"
                  name={address.id+':state'} value={address.state} onChange={this.handleAddressChange}/>

                  <input class="add-input-zip" type="text" placeholder="ZIP"
                  name={address.id+':zip'} value={address.zip} onChange={this.handleAddressChange}/>

                  <div class=" address-btn red-btn pointer"
                  onClick={() => this.deleteItem(address.id)}>Remove</div>
                </div>

              </div>
            )}

            </div>

            <h1 class="page-title page-title-left">ADD NEW ADDRESS</h1>
            <div class="address-editor">

              <div class="address-editor-inputs">

                <input class="add-input-street" type="text" placeholder="Street"
                 name="street" value={this.state.street} onChange={this.handleChange}/>

                <input class="add-input-city" type="text" placeholder="City"
                name="city" value={this.state.city} onChange={this.handleChange}/>

                <input class="add-input-state" type="text" placeholder="State"
                name="state" value={this.state.state} onChange={this.handleChange}/>

                <input class="add-input-zip" type="text" placeholder="ZIP"
                name="zip" value={this.state.zip} onChange={this.handleChange}/>

                <div class="address-btn green-btn pointer" onClick={this.addItem}>
                  Create
                </div>
              </div>

            </div>

            <div class="settings-submit">
              <div class="side-submit-btn green-btn" onClick={this.handleSubmit}>SAVE SERVICES</div>
            </div>

          </section>

        </div>
      );

      default:
        return(
          <Navigate to="/login" />
        );
    }

  }

}
