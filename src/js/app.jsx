/** @jsx React.DOM */
var React = require('react/dist/react');
var _ = require('underscore');
var prettydate = require('pretty-date')

var WorkOrderDiv = React.createClass({
  SearchFields : [
      "WorkOrderNumber",
      "OpenDate",
      "Status",
      "UnitNumber",
      "CreatedBy",
      "CompletedDate",
      "CloseDate",
      "NotifyName",
      "UsingDeptName",
      "LocationName"
  ],
  getInitialState: function() {
    return ({
      selectList:this.SearchFields,
      search: {
        text:"",
        field:"WorkOrderNumber"
      },
      workOrders:[]
    
    })},
  SearchChange: function (data) {
    var newState = this.state
    newState.search = data
    this.setState(newState);
    },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      type: "GET",
      dataType: 'json',
      success: function(data) {
        var newState = this.state
        newState.workOrders = data.EMDList.WorkOrders.WorkOrder
        this.setState(newState)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <SearchBar selectList={ this.SearchFields } search={this.state.search} onChange={this.SearchChange} />
        </nav>

        <WorkOrderList data={this.state.workOrders} filter={this.state.search} />
      </div> 
    );
  }
});

var SearchBar = React.createClass({
  handleSelectChange: function (e) {
    this.props.search.field = e.target.value
    this.props.onChange(this.props.search);
  },
  handleInputChange: function (e) {
    this.props.search.text = e.target.value.toLowerCase()
    this.props.onChange(this.props.search);
  },
  render: function () {
    var selectOptions = this.props.selectList.map(function (optionDescription) {
      return (
        <option value= {optionDescription}> {optionDescription} </option>
      )
    })
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="form-group">
          <select onChange = {this.handleSelectChange}>
            {selectOptions}
          </select>
          <input type="text" className="form-control"placeholder="Type here to search" value={this.props.search.text} onChange={this.handleInputChange} />
        </div>
      </form>
    )
  }
});

   

var WorkOrderList = React.createClass({
  render: function() {
    var filter = this.props.filter
    workorders = this.props.data
      .filter(function(order){
        return order[filter.field].toLowerCase().match(filter.text );
      })
      .map(function (order) {
        return (
            <WorkOrder data={order} key ={order.WorkOrderNumber}/>
        );
      });
    return (
      <ul className="list-group">
        {workorders}
      </ul>
    );
  }
});

var WorkOrder = React.createClass({
  render: function() {
    var diff = new Date() - new Date(this.props.data.OpenDate);    
    var age = prettydate.format(new Date (new Date() - diff))
    return (
      <li className="list-group-item">
        <p>NotifyName: {this.props.data.NotifyName}</p>
        <p>WorkOrderNumber: {this.props.data.WorkOrderNumber}</p>
        <p>Status: {this.props.data.Status}</p>
        <p>UnitNumber: {this.props.data.UnitNumber}</p>
        <p>CreatedBy: {this.props.data.CreatedBy}</p>
        <p>CompletedDate: {this.props.data.CompletedDate}</p>
        <p>CloseDate: {this.props.data.CloseDate}</p>
        <p>UsingDeptName: {this.props.data.UsingDeptName}</p>
        <p>LocationName: {this.props.data.LocationName}</p>
        <p>OpenDate: {this.props.data.OpenDate}</p>
        <p>Age: { age }</p>
        <JobList jobs={this.props.data.Jobs.Job}/>
      </li>
    );
  }
});


var JobList = React.createClass({
  render: function () {
    var jobs;
    if (_.isArray(this.props.jobs)) {
      jobs = _.map(this.props.jobs,function (job) {
          return(<Job data={job} key = {job.JobNumber }/>)
      });
    } else {      
      jobs = <Job data={this.props.jobs} key = {this.props.jobs.JobNumber }/>
    }
      
    return ( 
      <ul className="list-group">
        {jobs}
      </ul>
    )
  }  
});

var Job = React.createClass({
  render: function () {
    return(
      <li className="list-group-item">
        <p>JobID: {this.props.data.JobID}</p>
        <p>JobWorkOrderNumber: {this.props.data.JobWorkOrderNumber}</p>
        <p>JobReasonCode: {this.props.data.JobReasonCode}</p>
        <p>JobNumber: {this.props.data.JobNumber}</p>
        <p>JobDescription: {this.props.data.JobDescription}</p>
        <p>JobStatus: {this.props.data.JobStatus}</p>
        <p>JobStatusDescription: {this.props.data.JobStatusDescription}</p>
        <p>JobStatusPriority: {this.props.data.JobStatusPriority}</p>
        <p>JobStatusColor: {this.props.data.JobStatusColor}</p>
        <p>JobCompletedDate: {this.props.data.JobCompletedDate}</p>
        <p>ActualJobHours: {this.props.data.ActualJobHours}</p>
      </li>
    )
  }
})




var opentulsa = "https://www.cityoftulsa.org/cot/opendata/OpenData_EMDlist.jsn"
React.render(
  <WorkOrderDiv url="orders.json" />,
  document.body
);