import { applicationsStore } from "../../stores/Stores"
import React, { PropTypes } from "react"
import Router, { Link } from "react-router"
import { Row, Col, OverlayTrigger, Button, Popover } from "react-bootstrap"
import GroupsList from "./ApplicationItemGroupsList.react"
import ChannelsList from "./ApplicationItemChannelsList.react"
import ConfirmationContent from "../Common/ConfirmationContent.react"
import ModalButton from "../Common/ModalButton.react"

class Item extends React.Component {

  constructor(props) {
    super(props)
    this.deleteApplication = this.deleteApplication.bind(this)
  }

  static propTypes: {
    application: React.PropTypes.object.isRequired
  }

  deleteApplication() {
    let confirmationText = "Are you sure you want to delete this application?"
    if (confirm(confirmationText)) {
      applicationsStore.deleteApplication(this.props.application.id)
    }
  }

  render() {
    let application = this.props.application ? this.props.application : {},
        description = this.props.application.description ? this.props.application.description : "No description provided",
        styleDescription = this.props.application.description ? "" : " italicText",
        channels = this.props.application.channels ? this.props.application.channels : [],
        groups = this.props.application.groups ? this.props.application.groups : [],
        instances = this.props.application.instances ? this.props.application.instances : 0,
        appID = this.props.application ? this.props.application.id : "",
        popoverContent = {
          type: "application",
          appID: appID
        }
    
    return(
      <div className="apps--box">
        <Row className="apps--boxHeader">
          <Col xs={10}>
            <h3 className="apps--boxTitle">              
              <Link to="ApplicationLayout" params={{appID}}>
                {this.props.application.name} <i className="fa fa-caret-right"></i>
              </Link>
              <span className="apps--id">(ID: {appID})</span>
            </h3>
            <span className={"apps--description" + styleDescription}>{description}</span>
          </Col>
          <Col xs={2}>
            <div className="apps--buttons">
              <ModalButton icon="edit" modalToOpen="UpdateApplicationModal" data={this.props.application} />
              <button className="cr-button displayInline fa fa-trash-o" onClick={this.deleteApplication}></button>
            </div>
          </Col>
        </Row>
        <div className="apps--boxContent">
          <Row className="apps--resume">
            <Col xs={12}>
              <span className="subtitle">
                Instances:
              </span>
              <span> 
                {instances} 
              </span>
              <div className="divider">|</div>
              <span className="subtitle">
                Groups:
              </span>
              <span> 
                {groups.length} 
              </span>
              <GroupsList 
                groups={groups} 
                appID={this.props.application.id} 
                appName={this.props.application.name} />
            </Col>
          </Row>
          <Row className="apps--resume">
            <Col xs={12}>
              <span className="subtitle">Channels:</span>
              <ChannelsList channels={channels} />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

}

export default Item