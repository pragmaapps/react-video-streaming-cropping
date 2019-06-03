// - Import react components
import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import red from '@material-ui/core/colors/red'
import { ICompositeVideoComponentProps } from './ICompositeVideoComponentProps'
import { ICompositeVideoComponentState } from './ICompositeVideoComponentState'
import Grid from '@material-ui/core/Grid/Grid'
import { Typography } from '@material-ui/core'
import VideoStreamMerger from '../VideoStreamMerger.js'

// - Import app components

// - Create CompositeVideo component class
export default class CompositeVideoComponent extends Component<ICompositeVideoComponentProps, ICompositeVideoComponentState> {
  private vidRef: any
  // Constructor
  constructor(props: ICompositeVideoComponentProps) {
    super(props)
    this.vidRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: ICompositeVideoComponentProps, nextState: ICompositeVideoComponentState) {
    let shouldUpdate = this.props.stream !== nextProps.stream
    return shouldUpdate
  }

  componentDidMount() {
    // Binding functions to `this
    this.initiateVideo = this.initiateVideo.bind(this)
    this.initiateVideo()
  }

  initiateVideo() {
    const { stream, width, height} = this.props

    if (stream && this.vidRef.current) {
      let videoStream = new VideoStreamMerger({videoElm: this.vidRef.current})
      videoStream.addStream(stream, {
        index: 0
      })
      videoStream.addStream(stream, {
        width: 50,
        height: 50,
        index: 1
      })
      videoStream.addStream(stream, {
        x: width - 50,
        y: height - 50,
        width: 50,
        height: 50,
        index: 1
      })
      this.vidRef.current.loop = true
      this.vidRef.current.muted = true
      this.vidRef.current.playsInline = true
      videoStream.start()
    }
  }
  // Render app DOM component
  render() {
    const { stream, width, height} = this.props
    return (
      <canvas ref={this.vidRef}/>
    )
  }

}
