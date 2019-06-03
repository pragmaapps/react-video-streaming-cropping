// - Import react components
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Paper from '@material-ui/core/Paper'
import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'

import { HomeRouter } from 'routes'
import {
  globalActions
} from 'src/store/actions'
import CompositeVideoComponent from 'components/compositeVideo'
import CroppedVideoComponent from 'components/croppedVideo'
import ResizedVideoComponent from 'components/resizedVideo'

import { IHomeComponentProps } from './IHomeComponentProps'
import { IHomeComponentState } from './IHomeComponentState'

import RTChart from 'react-rt-chart'

const styles = (theme: any) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    margin: theme.spacing(2)
  },
  chartBoundary: {
    minWidth: 310,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    paddingRight: theme.spacing(2),
  },
  mainVideoBoundary: {
    minWidth: 310
  },
  videoBoundary: {
    minWidth: 310,
    margin: theme.spacing(2)
  },
  videoList: {
    minWidth: 270,
    margin: theme.spacing(2)
  },
  gridListTile: {
    maxWidth: 290
  },
  button: {
    margin: theme.spacing(2),
    minWidth: 250
  },
  video: {
    width: 270
  },
  canvas: {
    display: 'none'
  },
  gridList: {
    margin: theme.spacing(2)
  },
  grid: {
    alignItems: 'center',
    justify: 'center'
  },
  gridVideo: {
    padding: theme.spacing(2),
  },
  chart: {
      minWidth: 350
  },
  modifiedVideos: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  }
})

if (!navigator.mediaDevices && !navigator.getUserMedia) {
	console.warn(`Your browser doesn't support navigator.mediaDevices.getUserMedia and navigator.getUserMedia.`)
}
// - Create Home component class
export class HomeComponent extends Component<IHomeComponentProps, IHomeComponentState> {

  // private variables
  private mediaRecorder: any
  private mediaChunk: any
  private constraints: any
  private vidRef: any
  private canRef: any
  private chart = {
      axis: {
          y: { min: 0, max: 1 }
      }
  }

  // Constructor
  constructor(props: IHomeComponentProps) {
    super(props)
    this.state = {
      drawerOpen: false,
      granted: false,
      rejectedReason: '',
      recording: false,
      paused: false,
      zoomed: false,
      asked: false,
      permission: false,
      available: false,
      stream: null,
      videos: [],
      videoPixels: {
                    date: new Date(),
                    Pixels: 0
                   }
    }
    this.addCompositeVideo = this.addCompositeVideo.bind(this)
    this.addCroppedVideo = this.addCroppedVideo.bind(this)
    this.addResizedVideo = this.addResizedVideo.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this.loadVideos = this.loadVideos.bind(this)
    this.drawChart = this.drawChart.bind(this)
    this.vidRef = React.createRef()
    this.canRef = React.createRef()
  }

  componentDidMount() {
    this.constraints = { audio: false, video: {width: {exact: 320}, height: {exact: 240}} }
    const handleSuccess = (stream) => {
			this.setState(() => {
        return {
        				permission: true,
        				asked: true,
        				recording: false,
                stream: stream
        			}
        }
      )
      this.vidRef.current.srcObject = stream
      this.drawChart()
		}
		const handleFailed = (err) => {
			this.setState({ asked: false })
      console.error(err)
		}

		if (navigator.mediaDevices) {
			navigator.mediaDevices.getUserMedia(this.constraints)
			.then(handleSuccess)
			.catch(handleFailed)
		} else if (navigator.getUserMedia) {
			navigator.getUserMedia(this.constraints, handleSuccess, handleFailed)
		} else {
			let errMessage = `Browser doesn't support UserMedia API. Please try with another browser.`
			console.warn(errMessage)
		}
  }

  drawChart() {
    console.log('Rendering Chart again')
    let context = this.canRef.current.getContext('2d')
    context.drawImage(this.vidRef.current, 0, 0, 310, 227)
    let videoImageData = context.getImageData(0, 0, 320, 240).data
    let blackPixelsCount = 0
    for ( let i = 0; i < videoImageData.length; i += 4 ) {
      if (videoImageData[ i ] === 0) {
        blackPixelsCount++
      }
    }
    this.setState({
     videoPixels: {
       date: new Date(),
       Pixels: 4 * blackPixelsCount / videoImageData.length
     }
    })
    requestAnimationFrame(this.drawChart)
  }

  addCompositeVideo() {
    let videos = this.state.videos
    let stream = this.state.stream
    videos.push({
            title: 'Composite Video',
            video: (<CompositeVideoComponent key={'composite-video-' + videos.length} stream={this.state.stream} width='310' height='227'/>)
    })
    this.setState({
          videos: videos
    })
  }

  addCroppedVideo() {
    let videos = this.state.videos
    videos.push({
      title: 'Cropped Video',
      video: (<CroppedVideoComponent key={'cropped-video-' + videos.length} stream={this.state.stream} croppedX='-300' croppedY='-300' width='310' height='227'/>)
    })
    this.setState({
          videos: videos
    })
  }

  addResizedVideo() {
    let videos = this.state.videos
    videos.push({
            title: 'Resized Video',
            video: (<ResizedVideoComponent key={'resized-video-' + videos.length} stream={this.state.stream} width='160' height='120'/>)
    })
    this.setState({
          videos: videos
    })
  }

  clearAll() {
    this.setState({
          videos: []
    })

  }

  loadVideos() {
    const { loaded, authed, translate, classes, theme } = this.props
    let videoList: [] = []
    if (this.state.videos.length > 0) {
      this.state.videos.map((video, key) => {
        let newVideo: any = (
            <GridListTile className={classes.gridListTile} key={'video-' + key} rows={video.rows || 1} cols={video.cols || 1}>
              {video.video}
              <GridListTileBar
                title={video.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          )
          videoList.push(newVideo as never)
      })
    }
    return videoList
  }

  /**
   * Render DOM component
   *
   * @returns DOM
   *
   * @memberof Home
   */
  render() {
    const HR = HomeRouter
    const { loaded, authed, translate, classes, theme } = this.props
    return (
        <Paper className={classes.root} elevation={1}>
          <Typography component='h2' variant='h1' gutterBottom>
            Video Stream
          </Typography>
          <Typography variant='subtitle1' gutterBottom>
            This section provides examples of using React code to apply some of the video transformation features. Use the specific button to add the video stream.
          </Typography>
          <Grid container spacing={5} className={classes.grid}>
            <Grid item xs={6}>
              <Paper className={classes.mainVideoBoundary}>
                <Grid item className={classes.gridVideo}>
                    <video className={classes.video} autoPlay playsInline muted loop  ref={this.vidRef}/>
                    <canvas ref={this.canRef} className={classes.canvas}/>
                </Grid>
                <Grid item >
                  <Button variant='contained' color='primary' className={classes.button} onClick={this.addCompositeVideo}>
                    Composite
                  </Button>
                  <Button variant='contained' color='primary' className={classes.button} onClick={this.addCroppedVideo}>
                    Crop
                  </Button>
                  <Button variant='contained' color='primary' className={classes.button} onClick={this.addResizedVideo}>
                    Resize
                  </Button>
                  <Button variant='contained' color='secondary' className={classes.button} onClick={this.clearAll}>
                     Clear
                  </Button>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6} className={classes.chart}>
              <Paper className={classes.chartBoundary}>
                <RTChart
                 fields={['Pixels']}
                 chart={this.chart}
                 data={this.state.videoPixels} />
              </Paper>
            </Grid>
        </Grid>
        <Grid container spacing={5} className={classes.grid}>
          <Paper className={classes.videoBoundary}>
            <Typography component='h6' variant='h6' gutterBottom className={classes.modifiedVideos}>
              Modified Videos
            </Typography>
            <Grid item className={classes.videoList}>
              <GridList cellHeight={218} className={classes.gridList} cols={1}>
                {this.loadVideos()}
              </GridList>
            </Grid>
          </Paper>
        </Grid>
      </Paper>
    )
  }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any, ownProps: IHomeComponentProps) => {

  return {

  }

}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IHomeComponentProps) => {
  const uid = state.getIn(['authorize', 'uid'], {})
  const global = state.get('global', {})
  return {
    authed: state.getIn(['authorize', 'authed'], false),
    isVerifide: state.getIn(['authorize', 'isVerifide'], false),
    translate: getTranslate(state.get('locale')),
    currentLanguage: getActiveLanguage(state.get('locale')).code,
    global,
    loaded: true
  }
}

// - Connect component to redux store
export default withRouter<any>(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any, { withTheme: true })(HomeComponent as any) as any)) as typeof HomeComponent
