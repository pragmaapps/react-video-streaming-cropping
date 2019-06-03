
export interface IHomeComponentState {

  /**
   * Whether drawer is open
   */
  drawerOpen: boolean
  granted: boolean
  rejectedReason: string
  recording: boolean
  paused: boolean
  zoomed: boolean
  asked: boolean
  permission: boolean
  available: boolean
  stream: any
  videos: any
  videoPixels: any
}
