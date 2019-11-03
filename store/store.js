import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import axios from 'axios';

// initialState
const userInitialState = {}

// action type
const LOGOUT = 'LOGOUT';


// 纯粹的方法，不应该有副作用 纯函数不依赖外部变量
// 有任何数据更新时应返回一个新对象
// 可以通过commbine
function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state;
  }
}

const allReducer = combineReducers({
  user: userReducer
})

// action creators
export function logout() {
  return dispatch => {
    axios.post('/logout').then((resp) => {
      if (resp.status === 200) {
        dispatch({
          type: LOGOUT
        })
      } else {
        console.log('/logout fail' + JSON.stringify(resp))
      }
    }).catch((error) => {
      console.log('/logout fail' + JSON.stringify(error))
    })
  }
}

export default function initialSizeStore(state) {
  const store = createStore(
    allReducer,
    Object.assign(
      {},
      {
        user: userInitialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk)),
  );

  return store;
}