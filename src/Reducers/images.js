import {IMAGE_ADDED, IMAGE_REMOVED} from '../Constants'
export const images = (state=[], action) => {
  switch(action.type) {
    case IMAGE_ADDED:
      return [...state, ...action.image]
    case IMAGE_REMOVED:
      return state.filter((item, index) => index !== action.index)
    default:
      return state
  }
}

