// - Import react components
import {Map} from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'

import { ServiceProvide, IServiceProvider } from 'src/core/factories'
import MasterRouter from 'src/routes/MasterRouter'

import { IMasterComponentProps } from './IMasterComponentProps'
import { IMasterComponentState } from './IMasterComponentState'

/* ------------------------------------ */

// - Create Master component class
export class MasterComponent extends Component<IMasterComponentProps, IMasterComponentState> {

  static isPrivate = true

  private readonly _serviceProvider: IServiceProvider
  // Constructor
  constructor (props: IMasterComponentProps) {
    super(props)

    this._serviceProvider = new ServiceProvide()
    this.state = {
      loading: true,
      authed: false,
      dataLoaded: false,
      isVerifide: false
    }

    // Binding functions to `this`
    this.handleMessage = this.handleMessage.bind(this)

  }

  // Handle click on message
  handleMessage = (evt: any) => {
    this.props.closeMessage()
  }

  componentDidCatch (error: any, info: any) {
    console.log('===========Catched by React componentDidCatch==============')
    console.log(error, info)
    console.log('====================================')
  }

  componentDidMount () {
  }

  /**
   * Render app DOM component
   *
   * @returns
   *
   * @memberof Master
   */
  public render () {

    const { progress, global, loaded, guest, uid, sendFeedbackStatus, hideMessage } = this.props
    const { loading, isVerifide } = this.state

    return (
      <React.Fragment>
        <MasterRouter enabled={!loading} data={{uid}} />
        <Snackbar
          open={this.props.global.messageOpen}
          message={this.props.global.message}
          onClose={hideMessage}
          autoHideDuration={4000}
          style={{ left: '1%', transform: 'none' }}
        />
      </React.Fragment>
    )
  }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any, ownProps: IMasterComponentProps) => {

  return {}

}

/**
 * Map state to props
 * @param {object} state
 */
const mapStateToProps = (state: Map<string, any>) => {
  // FIXME: Never use toJS() in mapStateToProps https://redux.js.org/recipes/usingimmutablejs
  const global = Map(state.get('global', {})).toJS() as any
  const { sendFeedbackStatus, progress } = global
  return {
    sendFeedbackStatus,
    progress,
    global: global
  }

}
// - Connect commponent to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MasterComponent as any) as any)
