/** @jsx React.DOM */
var React = require('react/dist/react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
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
        field:"NotifyName"
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
        var newOrders = _.map(data.EMDList.WorkOrders.WorkOrder,function(i){return i})
        this.setState(
          {
            workOrders: _.union(this.state.workOrders,newOrders)
           }
         );
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top" >
          <div className="container">
            <SearchBar selectList={ this.SearchFields } search={this.state.search} onChange={this.SearchChange} />
          </div>
        </nav>

        <WorkOrderList data={this.state.workOrders} filter={this.state.search} />
      </div> 
    );
  }
});

var SearchBar = React.createClass({
  getInitialState: function () {
    return({
      selected : "NotifyName"
      
    })
  },
  handleSelectChange: function (e) {
    this.props.search.field = e.target.innerText;
    this.state.selected = e.target.innerText;
    this.props.onChange(this.props.search);
  },
  handleInputChange: function (e) {
    this.props.search.text = e.target.value.toLowerCase()
    this.props.onChange(this.props.search);
  },
  render: function () {
    var selectOptions = this.props.selectList.map(function (optionDescription) {
      return (
        <li role="presentation"><a role="menuitem" tabIndex="-1" >{optionDescription}</a> </li>
      )
    })
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="input-group">
          <div className="input-group-btn">
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{this.state.selected } <span className="caret"></span></button>
            <ul className="dropdown-menu" role="menu" onClick = {this.handleSelectChange} >
              {selectOptions}
            </ul>
          </div>
          <input type="text" className="form-control" aria-label="..." placeholder="Type here to search" value={this.props.search.text} onChange={this.handleInputChange} ></input>
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
  handledButtonClick: function (e) {
    
  },
  render: function() {
    var diff = new Date() - new Date(this.props.data.OpenDate);    
    var age = prettydate.format(new Date (new Date() - diff))
    return (
      <li className="list-group-item">
        <p>NotifyName: {this.props.data.NotifyName}</p>
        <p>WorkOrderNumber: {this.props.data.WorkOrderNumber}</p>
        <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={"#"+this.props.data.WorkOrderNumber} aria-expanded="false" aria-controls={this.props.data.WorkOrderNumber}>
          Details ...
        </button>
        <div className="collapse" id={this.props.data.WorkOrderNumber}>
          <div className="well">
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
          </div>
        </div>
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
      <div>
        <p>Jobs</p> 
        <ul className="list-group">
          {jobs}
        </ul>
      </div>
        
    )
  }  
});

var Job = React.createClass({
  render: function () {
    var order_job_number = this.props.data.JobWorkOrderNumber+this.props.data.JobNumber
    return(
      <li className="list-group-item">
        <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={"#"+order_job_number} aria-expanded="false" aria-controls={order_job_number}>
          {this.props.data.JobDescription}
        </button>
        <div className="collapse" id={order_job_number}>
          <div className="well">
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
          </div>
        </div>
      </li>
    )
  }
})


var opentulsa = "https://www.cityoftulsa.org/cot/opendata/OpenData_EMDlist.jsn"
React.render(
  <WorkOrderDiv url="orders.json" />,
  document.body
);