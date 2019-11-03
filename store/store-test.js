import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
  count: 0
}
const userInitialState = {
  username: 'jack',
  age: 18
}

const ADD = 'ADD';
const UPDATE_USERNAME = 'UPDATE_USERNAME';

// 纯粹的方法，不应该有副作用 纯函数不依赖外部变量
// 有任何数据更新时应返回一个新对象
// 可以通过commbine
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      return { count: state.count + (action.num || 1) };
    default:
      return state;
  }
}
function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        username: action.username
      }
    default:
      return state;
  }
}

const allReducer = combineReducers({
  counter: counterReducer,
  user: userReducer
})


// action createstore
export function add(num) {
  return {
    type: ADD,
    num,
  }
}
// 异步数据
function addAsync(num) {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(add(num))
    }, 2000);
  }
}

// store.dispatch({ type: ADD });
// store.dispatch(add(5))

// 监测
// 监听store变化
// store.subscribe(() => {
//   console.log(store.getState());
// })

// store.dispatch({ type: ADD });
// store.dispatch(addAsync(10));
// store.dispatch({ type: UPDATE_USERNAME, username: 'hello word' });

// export default store;
export default function initialSizeStore(state) {
  const store = createStore(
    allReducer,
    Object.assign(
      {},
      {
        counter: initialState,
        user: userInitialState
      },
      state),
    composeWithDevTools(applyMiddleware(ReduxThunk)),
  );

  return store;
}