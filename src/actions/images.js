import { IMAGED_ADDED, IMAGE_REMOVED } from '../constants'
export const imageAdded = image => dispatch => {
  return dispatch({
    type: IMAGE_ADDED,
    image
  })
}

export const imageRemoved = index => dispatch => {
  return dispatch({
    type: IMAGE_REMOVED,
    index
  })
}