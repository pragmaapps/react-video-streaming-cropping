// - Import react components
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter, Redirect, NavLink } from 'react-router-dom'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import Loadable from 'react-loadable'
import { Map } from 'immutable'

import { IRouterProps } from './IRouterProps'
import MasterLoadingComponent from 'components/masterLoading/MasterLoadingComponent'

/**
 * Home Router
 */
export class HomeRouter extends Component<IRouterProps, any> {
  render () {
    const { enabled, match, data, translate } = this.props
    return (
          enabled ? (
          <Switch>
          </Switch>
          )
          : ''

    )
  }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any, ownProps: IRouterProps) => {

  return {}

}

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IRouterProps) => {
  return {
    translate: getTranslate(state.get('locale')),
    currentLanguage: getActiveLanguage(state.get('locale')).code,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeRouter as any) as any) as typeof HomeRouter
