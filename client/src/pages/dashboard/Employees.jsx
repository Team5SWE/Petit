import {React, Component} from "react";
import BusinessNavbar from "../../components/navbar/businessNavbar.jsx";


import {Navigate} from "react-router-dom";
import PageLoader from "../../components/navbar/PageLoader.jsx";

import EditEmployeeCard from "../../components/employees/EditEmployeeCard.jsx";
import "../../css/dashboard/employees.css";
import default_img from "../../assets/default_employee.jpeg"

export default class Employees extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedImage: null,
      selectedFile: null,

      apiResponse: "",
      authenticated: false,
      loaded: false,
      stage: "waiting",
      employees: [],
      changes: [],

      first: '',
      last: '',
      phone: '',
      email: ''
    }
    this.onSelectFile = this.onSelectFile.bind(this);
    this.clickFileUpload = this.clickFileUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  ////////////////////////////General Change Methods///////////////////////

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  handleLogout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false, stage: 'failed'})
  }

  onSelectFile(e){
    const selectedFiles = e.target.files;
    const selectedFile = selectedFiles[0];
    let urlObject = URL.createObjectURL(selectedFile);
    this.setState({...this.state, selectedImage: urlObject, selectedFile: selectedFile})
  }

  clickFileUpload(e){
    let fileField = this.refs.fileField;
    fileField.click();
  }

  //////////////////////////EMPLOYEE LIST RELATED CHANGES//////////////////////

    deleteItem(id){
      const list = [...this.state.employees]

      let employeeToDelete = list.find(item => item.id === id)

      let changeList= [...this.state.changes]

      if(employeeToDelete !== undefined && employeeToDelete.action === "add"){
        changeList = changeList.filter(item => item.id !== id)
      } else {
        employeeToDelete.action = "remove"
        changeList.push(employeeToDelete)
      }
      const updatedList = list.filter(item => item.id !== id);
      this.setState({...this.state, employees: updatedList, changes: changeList})
    }

    addItem(){

      if(this.state.name === '' || this.state.phone === '' || this.state.email === ''){
        console.log('Empty inputs. Ignoring')
        return;
      }

      let imageFile = this.state.selectedFile;
      let filename = null
      if(imageFile !== null)
        filename = this.state.selectedFile;

      const newEmployee = {
        id: 1 + Math.random(),
        name: this.state.first+' '+this.state.last,
        first: this.state.first,
        last: this.state.last,
        phone: this.state.phone,
        email: this.state.email,
        imageFile: this.state.selectedFile,
        fileName: filename,
        action: 'add'
      };

      const list = [...this.state.employees]
      const changesList = [...this.state.changes]

      list.push(newEmployee);
      changesList.push(newEmployee);

      this.setState({
        ...this.state,
        employees: list,
        changes: changesList,
        first: '',
        last: '',
        phone: '',
        email: ''
      });
    }

  ////////////////////////////////API RELATED METHODS///////////////////////////
  componentDidMount(){
    this.callApi();
  }

  callApi(){

    // Call authentication endpoint with access token
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

      //Save api data into states
      this.setState({...this.state, authenticated: res.valid, apiResponse: res, loaded: true, employees: []})

      //If authenticated, then fetch data from employees
      if(res.valid){

        fetch('http://127.0.0.1:8000/api/salon/'+res.business.id+'/employees/')
        .then(res => res.json())
        .then(res => {
          if(res.valid){
            this.setState({...this.state, employees: res.employees, stage: 'loaded'})
          }
        });

      } else {
        this.setState({...this.state, stage: 'failed'})
      }

    });
  }


  handleSubmit(){

    let url = 'http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.business.id+'/employees/'

    let data = {
      access: localStorage.getItem('access'),
      changeLog: this.state.changes,

    }

    fetch(url, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

      if(res.valid){
        this.setState({...this.state, employees: res.employees})
      } else {
        this.setState({...this.state, authenticated: false, stage: 'failed'})
      }

    })

  }
  /////////////////////////////////////////////////////////////////////////////



  render(){

    const hasImage = this.state.selectedImage !== null;

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
            <h1 class="page-title">EDIT EMPLOYEES</h1>
          </section>

          <section class="services-container">

            <div class="employees">
              {this.state.employees.map(employee =>
              (<EditEmployeeCard key={employee.id} name={employee.name} specialty="Master Stylist"
                email={employee.email} phone={employee.phone}
                removeAction={() => this.deleteItem(employee.id)} />)
              )}

            </div>
          </section>

          <svg id="wave" viewBox="0 0 1440 240" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(0, 0, 0, 1)" offset="0%"></stop><stop stop-color="rgba(0, 0, 0, 1)" offset="100%"></stop></linearGradient></defs><path class="path" fill="url(#sw-gradient-0)" d="M0,72L48,60C96,48,192,24,288,48C384,72,480,144,576,176C672,208,768,200,864,164C960,128,1056,64,1152,44C1248,24,1344,48,1440,76C1536,104,1632,136,1728,140C1824,144,1920,120,2016,124C2112,128,2208,160,2304,152C2400,144,2496,96,2592,68C2688,40,2784,32,2880,56C2976,80,3072,136,3168,140C3264,144,3360,96,3456,64C3552,32,3648,16,3744,12C3840,8,3936,16,4032,40C4128,64,4224,104,4320,136C4416,168,4512,192,4608,184C4704,176,4800,136,4896,104C4992,72,5088,48,5184,32C5280,16,5376,8,5472,12C5568,16,5664,32,5760,68C5856,104,5952,160,6048,188C6144,216,6240,216,6336,200C6432,184,6528,152,6624,120C6720,88,6816,56,6864,40L6912,24L6912,240L6864,240C6816,240,6720,240,6624,240C6528,240,6432,240,6336,240C6240,240,6144,240,6048,240C5952,240,5856,240,5760,240C5664,240,5568,240,5472,240C5376,240,5280,240,5184,240C5088,240,4992,240,4896,240C4800,240,4704,240,4608,240C4512,240,4416,240,4320,240C4224,240,4128,240,4032,240C3936,240,3840,240,3744,240C3648,240,3552,240,3456,240C3360,240,3264,240,3168,240C3072,240,2976,240,2880,240C2784,240,2688,240,2592,240C2496,240,2400,240,2304,240C2208,240,2112,240,2016,240C1920,240,1824,240,1728,240C1632,240,1536,240,1440,240C1344,240,1248,240,1152,240C1056,240,960,240,864,240C768,240,672,240,576,240C480,240,384,240,288,240C192,240,96,240,48,240L0,240Z"></path></svg>

          <section class="expand-employees dark">
            <h1 class="page-title">EXPAND YOUR TEAM!</h1>

            <div class="employee-expander">

              <div class="employee-adder">

              <div class="employee-adder-upper">

                <div class="emp-adder-img-div">

                  <div class="emp-img-container">
                  {hasImage ?
                    <img class="emp-img-adder" src={this.state.selectedImage} alt=""/>
                    :
                    <img class="emp-img-adder" src={default_img} alt=""/>
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

                <div class="emp-info-inputs">

                  <div class="input-box">
                    <p class="input-box-label">First:</p>
                    <input type="text" class="emp-input" name="first" value={this.state.first}
                    onChange={this.handleChange}/>
                  </div>

                  <div class="input-box">
                    <p class="input-box-label">Last:</p>
                    <input type="text" class="emp-input" name="last" value={this.state.last}
                    onChange={this.handleChange}/>
                  </div>

                  <div class="input-box">
                    <p class="input-box-label">Phone number:</p>
                    <input type="text" class="emp-input" name="phone" value={this.state.phone}
                    onChange={this.handleChange}/>
                  </div>
                </div>

              </div>

              <div class="employee-adder-lower">

                <div class="input-box">
                  <p class="input-box-label">Email Address:</p>
                  <input type="text" class="emp-input" name="email" value={this.state.email}
                  onChange={this.handleChange}/>
                </div>

                <div class="add-emp-btn green-btn pointer" onClick={this.addItem}>
                  ADD NEW EMPLOYEE
                </div>

              </div>

              </div>

              <div class="employee-submit">
                <div class="submit-btn green-btn pointer" onClick={this.handleSubmit}>
                  SAVE CHANGES
                </div>

              </div>

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
