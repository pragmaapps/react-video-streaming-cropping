// - Import react components
import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import red from '@material-ui/core/colors/red'
import { IResizedVideoComponentProps } from './IResizedVideoComponentProps'
import { IResizedVideoComponentState } from './IResizedVideoComponentState'
import Grid from '@material-ui/core/Grid/Grid'
import { Typography } from '@material-ui/core'
import VideoStreamMerger from '../VideoStreamMerger.js'

// - Import app components

// - Create ResizedVideo component class
export default class ResizedVideoComponent extends Component<IResizedVideoComponentProps, IResizedVideoComponentState> {
  private vidRef: any
  // Constructor
  constructor(props: IResizedVideoComponentProps) {
    super(props)
    this.vidRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: IResizedVideoComponentProps, nextState: IResizedVideoComponentState) {
    let shouldUpdate = this.props.stream !== nextProps.stream
    return shouldUpdate
  }

  componentDidMount() {
    // Binding functions to `this`
    const { stream, width, height } = this.props
    if (stream && this.vidRef.current) {
      let videoStream = new VideoStreamMerger({
        height: height,
        width: width,
        videoElm: this.vidRef.current
      })
      videoStream.addStream(stream)
      this.vidRef.current.srcObject = videoStream.start()
    }
  }

  loadVideo() {
    return (
      <canvas ref={this.vidRef}/>
    )
  }

  // Render app DOM component
  render() {
    return (
        this.loadVideo()
    )
  }

}
