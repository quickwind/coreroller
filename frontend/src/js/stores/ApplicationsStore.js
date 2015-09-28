import API from "../api/API"
import Store from "./BaseStore"
import _ from "underscore"

class ApplicationsStore extends Store {

  constructor() {
    super()
    this.applications = this.getApplications()

    setInterval(() => {
      this.applications = this.getApplications()
    }, 60 * 1000)
  }

  // Applications

  getCachedApplications() {
    return this.applications
  }

  getApplications() {
    API.getApplications().
      done(applications => {
        this.applications = applications
        this.emitChange()
      })
  }

  getApplication(applicationID) {
    API.getApplication(applicationID).
      done(application => {
        if (this.applications) {
          let applicationItem = application[0]
          let index = this.applications ? _.findIndex(this.applications, {id: applicationID}) : null
          if (index >= 0) {
            this.applications[index] = applicationItem
          } else {
            this.applications.unshift(applicationItem)
          }
          this.emitChange()
        }
      })
  }

  createApplication(data, clonedApplication) {
    return API.createApplication(data, clonedApplication).
      done(application => {
        let applicationItem = application[0]
        this.applications.unshift(applicationItem)
        this.emitChange()
      })
  }

  updateApplication(applicationID, data) {
    data.id = applicationID;

    return API.updateApplication(data).
      done(application => {
        let applicationItem = application[0],
            applicationToUpdate = _.findWhere(this.applications, {id: applicationItem.id})
        
        applicationToUpdate.name = applicationItem.name
        applicationToUpdate.description = applicationItem.description
        this.emitChange()
      })
  }

  getAndUpdateApplication(applicationID) {
    API.getApplication(applicationID).
      done(application => {
        let applicationItem = application[0],
            index = _.findIndex(this.applications, {id: applicationID})      
        this.applications[index] = applicationItem
        this.emitChange()
      })
  }

  deleteApplication(applicationID) {
    API.deleteApplication(applicationID).
      done(() => {
        this.applications = _.without(this.applications, _.findWhere(this.applications, {id: applicationID}))
        this.emitChange()
      })
  }

  // Groups

  createGroup(data) {
    return API.createGroup(data).
      done(group => {
        let groupItem = group[0],
            applicationToUpdate = _.findWhere(this.applications, {id: groupItem.application_id})
        if (applicationToUpdate.groups) {
          applicationToUpdate.groups.unshift(groupItem)
        } else {
          applicationToUpdate.groups = [groupItem]
        }
        this.emitChange()
      })
  }

  deleteGroup(applicationID, groupID) {
    API.deleteGroup(applicationID, groupID).
      done(() => {
        let applicationToUpdate = _.findWhere(this.applications, {id: applicationID}),
            newGroups = _.without(applicationToUpdate.groups, _.findWhere(applicationToUpdate.groups, {id: groupID}))
        applicationToUpdate.groups = newGroups
        this.emitChange()
      })
  }

  updateGroup(data) {
    return API.updateGroup(data).
      done(group => {
        let groupItem = group[0],
            applicationToUpdate = _.findWhere(this.applications, {id: groupItem.application_id}),
            index = _.findIndex(applicationToUpdate.groups, {id: groupItem.id})
        applicationToUpdate.groups[index] = groupItem
        this.emitChange()
      })
  }

  getGroup(applicationID, groupID) {
    API.getGroup(applicationID, groupID).
      done(group => {
        let groupItem = group[0],
            applicationToUpdate = _.findWhere(this.applications, {id: groupItem.application_id}),
            index = _.findIndex(applicationToUpdate.groups, {id: groupItem.id})
        
        if (applicationToUpdate) {
          if (applicationToUpdate.groups) {
            if (index >= 0) {
              applicationToUpdate.groups[index] = groupItem
            } else {
              applicationToUpdate.groups.unshift(groupItem)
            }
          } else {
            applicationToUpdate.groups = [groupItem]
          }
        }
        this.emitChange()
      })
  }

  // Channels

  createChannel(data) {
    return API.createChannel(data).
      done(channel => {
        let channelItem = channel[0]
        this.getAndUpdateApplication(channelItem.application_id)
      })
  }

  deleteChannel(applicationID, channelID) {
    API.deleteChannel(applicationID, channelID).
      done(() => {
        this.getAndUpdateApplication(applicationID)
      })
  }

  updateChannel(data) {
    return API.updateChannel(data).
      done(channel => {
        let channelItem = channel[0]
        this.getAndUpdateApplication(channelItem.application_id)
      })
  }

  // Packages

  createPackage(data) {
    return API.createPackage(data).
      done(packageItem => {
        let newpackage = packageItem[0]
        this.getAndUpdateApplication(newpackage.application_id)
      })
  }

  deletePackage(applicationID, packageID) {
    API.deletePackage(applicationID, packageID).
      done(() => {
        this.getAndUpdateApplication(applicationID)
      })   
  }

  updatePackage(data) {
    return API.updatePackage(data).
      done(packageItem => {
        let updatedpackage = packageItem[0]
        this.getAndUpdateApplication(updatedpackage.application_id)
      })
  }

}

export default ApplicationsStore