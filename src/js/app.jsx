/** @jsx React.DOM */
var React = require('react/dist/react');
var _ = require('underscore');
var prettydate = require('pretty-date')
var d3 = require("d3")

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
      workorders:[]
    
    })},
  SearchChange: function (data) {
    this.setState({search:data})
    },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      type: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState(
          {
            workorders: data.EMDList.WorkOrders.WorkOrder
           }
         );
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var workorders = []
    _.each(this.state.workorders,function (order) {      
      if (order[this.state.search.field].toLowerCase().match(this.state.search.text)){
        workorders.push(order)
      }
    },this)

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top" >
          <div className="container">
            <SearchBar selectList={ this.SearchFields } search={this.state.search} onChange={this.SearchChange} />
          </div>
        </nav>
        <Summary data={workorders}/>
        <WorkOrderList data={workorders} />
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
    workorders = this.props.data.map(function (order) {
      return(
        <WorkOrder data={order} key ={order.WorkOrderNumber}/>
      )
    })
    return (
      <ul className="list-group">
        <a className="list-group-item active">Work Orders</a>
        {workorders}
      </ul>
    );
  }
});

var WorkOrder = React.createClass({
  handledButtonClick: function (e) {
    var current_class = $("#"+this.props.data.WorkOrderNumber).attr("class")
    switch (current_class){
    case "collapse":
      new_class = "collapse.in"
      break;
    case "collapse.in":
      new_class = "collapse"
      break;
    } 
    $("#"+this.props.data.WorkOrderNumber).attr("class",new_class)
  },
  render: function() {
    var diff = new Date() - new Date(this.props.data.OpenDate);    
    var age = prettydate.format(new Date (new Date() - diff))
    return (
      <li className="list-group-item">
        <p>NotifyName: {this.props.data.NotifyName}</p>
        <p>WorkOrderNumber: {this.props.data.WorkOrderNumber}</p>
        <p>This was opened {age}.</p>

        <button className="btn btn-primary" type="button" onClick={this.handledButtonClick} data-target={"#"+this.props.data.WorkOrderNumber} aria-expanded="false" aria-controls={this.props.data.WorkOrderNumber}>
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
        <ul className="list-group">
          <a className="list-group-item active">Jobs</a>
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



var getJobs = function (wo_list){
  
  var all_jobs = []

  _.each(wo_list,function (wo) {
    var job_list = wo.Jobs.Job
    
    if (_.isArray(job_list)) {
      _.each(job_list,function(i){
        all_jobs.push(i)
      })
    } else {
      all_jobs.push(job_list)  
    }
  })
    
  return all_jobs

}

var Summary = React.createClass({
  getInitialState: function (){
    return({
      data: []
    })
  },
  
  render: function () {

    var summarize = function (data) {
      var payload = []
      var jobs = getJobs(data)

      job_status=[[],[]]
      
      _.each(jobs,function (e, i) {
        var stat = e.JobStatusDescription
        var seenit = _.findIndex(job_status[0],function (val) {
          return stat===val
        })
        if (seenit===-1){
          job_status[0].push(stat)
          job_status[1].push(1)
        } else {
          job_status[1][seenit] = job_status[1][seenit] + 1
        }
      })
            
      payload.push({label:"Total Work Orders",value:data.length})
      payload.push({label:"Total Jobs",value:jobs.length})
      payload.push({label:"Status",value:job_status})
      return payload
    }
    
    summary = summarize (this.props.data)
    
    return(
      <div className="page-header" style={{padding:'3%'}} >
      <h1>Work Orders&nbsp;  
        <small>
          There are {summary[0].value} work orders and {summary[1].value} jobs in this list.
        </small>
      </h1>
      </div>
    )
  }
})

var Chart = React.createClass({
  getInitialState: function () {
    return({
      width : 96,
      height : 32,
      xScale : d3.scale.ordinal().domain(this.props.labels).rangeRoundBands([0, this.props.width], .2),
      yScale : d3.scale.linear().range([ this.props.height, 0])
    })
  },
  render: function () {
    var labels = this.props.labels.map(function (label,idx) {
      return(
         <Label {...this.props} index={idx} text={label} />
      )
    }.bind(this))
    return(
      <div>
        <svg width={this.props.width} height={this.props.height}>
          {labels}
        </svg>
      </div>
    )
  }
});

var Label = React.createClass({
  render: function () {
    return(
      <text x={this.props.xScale(this.props.index)} y={this.props.height}> {this.props.text} </text>
    )
  }
});

var Bar = React.createClass({
  getInitialState: function () {
    return ({
      x:0,
      y:0
      })
  },
  render: function () {
    return (
      <rect fill={this.props.fill}
        width={this.props.width} 
        height={this.props.height} 
        x={this.state.x} 
        y={this.state.y} />
    )
  }
})

var opentulsa = "https://www.cityoftulsa.org/cot/opendata/OpenData_EMDlist.jsn"
React.render(
  <WorkOrderDiv url="orders.json" />,
  document.body
);