// - Import react components
import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import red from '@material-ui/core/colors/red'
import { ICroppedVideoComponentProps } from './ICroppedVideoComponentProps'
import { ICroppedVideoComponentState } from './ICroppedVideoComponentState'
import Grid from '@material-ui/core/Grid/Grid'
import { Typography } from '@material-ui/core'
import VideoStreamMerger from '../VideoStreamMerger.js'

// - Import app components

// - Create CroppedVideo component class
export default class CroppedVideoComponent extends Component<ICroppedVideoComponentProps, ICroppedVideoComponentState> {
  private vidRef: any
  // Constructor
  constructor(props: ICroppedVideoComponentProps) {
    super(props)
    this.vidRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: ICroppedVideoComponentProps, nextState: ICroppedVideoComponentState) {
    let shouldUpdate = this.props.stream !== nextProps.stream
    return shouldUpdate
  }

  componentDidMount() {
    // Binding functions to `this`
    const { stream, croppedX, croppedY, width, height } = this.props
    if (stream && this.vidRef.current) {
      let videoStream = new VideoStreamMerger({videoElm: this.vidRef.current})
      videoStream.addStream(stream, {
        x: croppedX,
        y: croppedY,
        width: videoStream['width'] + Math.abs(croppedX),
        height: videoStream['height'] + Math.abs(croppedY)
      })
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
