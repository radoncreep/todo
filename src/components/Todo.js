import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import axios from 'axios';
// import { bindActionCreators } from 'redux';
// import userEvent from '@testing-library/user-event';

import List from './List';
import { useFormInputHook } from '../hooks/forms';

const Todo = () => {
    // single state
    // todoState is an object containing a string and array property
    // const [todoName, setTodoName] = useState('');
    // const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoList, setTodoList] = useState([]);
    const todoInputRef = useRef(null); // the connection is established between the input and the constant
    // or a reference to the input is stored in this constant
    const [inputIsValid, setInputIsValid] = useState(false);

    // custom hook 
    const todoInput = useFormInputHook(); // use this way
    // or destructure it like below
    // const { value, onChange, validity } = useFormInputHook();

    // useReducer()
    const todoListReducer = (state, action) => {
        switch(action.type) { // describes what to do
            case 'ADD': 
                // conctenating a single state to our current state and returning the new state which concat() returns 
                return state.concat(action.payload); // payload here is the full todo object
            case 'SET':
                return action.payload; // array of new items returned as new state
            case 'REMOVE':
                return state.filter((todo) => todo.id !== action.payload); // payload here is the id of todo object we are getting from the action
            default:
                return state;
        };
    };

    // registering the above reducer 
    // we get back an array with exactly two elements and we use destructuring for this
    // we get back our state and dispatch function
    const [todoList, dispatch ] = useReducer(todoListReducer, []); // after this line we can start dispatching actions

    useEffect(() => {
        const todos = [];
        const getTodos = async() => {
            const result = await axios.get('https://basic-todo-cd42e.firebaseio.com/todos.json')
            // console.log(result);
            // console.log('prior side effect?')
            const todoData = result.data;

            for (const key in todoData) {
                todos.push({ id: key, name: todoData[key].name })
            };
            dispatch({ type: 'SET', payload: todos }); // the popluated todos array we are getting from the db is assigned as the payload
        };
        getTodos();

        // CLEANUP - this function ll be executed by react on every render cycle
        // and react ll eventually execute this as a cleanup 
        // before it applies the effect of your main code again
        // so you can clean up after your last useEffect call
        // we dont need to do a cleanup for http requests like this
        return () => {
            console.log('Cleanup');
        }
    }, []); // this useEffect runs only once, on mounting this component
    // because of the empty array passed as a second arg
    // [ todoName ] runs only when the todoName state changes


    // this function will handle updating the todoList state after getting a response from the post req sent to the db
    // because the useEffect that handles getting data from the db executes once upon mounting
    // there might be an issue updating the state whenever we get mulitple response from the db at almost the same time
    // so we are using the function to get the response and update the todoList state accordingly
    // because the function where we add a todo is a closure

    // useEffect(() => {
    //     if (submittedTodo) { // if the state is not null or empty
    //         console.log('Submitted todo ', submittedTodo )
    //         // here we are adding a single item to the state so we can use the ADD case in our reducer function
    //         // setTodoList(todoList.concat(submittedTodo));
    //         dispatch({ type: 'ADD', payload: submittedTodo });
    //     };
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [ submittedTodo ]);

    // // Error notification 
    // there was an error that imposed I included toddList state in the array
    // this will cause an infinte loop
    // because anytime the todoList state changes as a result of the useEffect to update it's state 
    // the useEffect function runs again, which continously update the todoList state
    // and keeps on executing the useEffect function

    const mouseMoveHandler = event => {
        // console.log(event.clientX, event.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler); 
        // better case to use a cleanup function
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    const inputValidationHandler = event => {
        // this is to find out whether the input is invalid or not
        if (event.target.value.trim() === '') {
            setInputIsValid(false);
        } else {
            setInputIsValid(true)
        };
    };

    // function to execute the function useState gives
    // do need this state update due to useRef()
    // const inputChangeHandler = (event) => {
    //     // function that updates our state with a new value
    //    setTodoName(event.target.value);
    // };

    // the todoList state is remains same when trying to concat two new req at almost the same time
    // what we do is to use another state to update the todo
    const todoAddHandler = async () => {
        // take the previous value in the state into account
        // concat always returns a new array and doesnt edit the old one

        // now that we have useRef
        // console.log(todoInputRef, ' ref');
        // const todoName = todoInputRef.current.value;
        const todoName = todoInput.value;

        // saving to database after adding each todoName to the todoList
        try {
            const result = await axios.post('https://basic-todo-cd42e.firebaseio.com/todos.json', { name: todoName });
            // console.log(result);
            setTimeout(() => {
                const todoItem = {id: result.data.name, name: todoName }
                // setSubmittedTodo(todoItem);
                dispatch({ type: 'ADD', payload: todoItem });
            }, 3000);
        } catch (err) {
            console.log(err);
        };
    };

    // DELETE TODO
    const deleteTodoHandler = async (todoId) => {
        const response = await axios.delete(`https://basic-todo-cd42e.firebaseio.com/todos/${todoId}.json`);
        console.log(response);
        dispatch({ type: 'REMOVE',  payload: todoId });
    };

    return (
        <>
          <input 
            type="text"
            placeholder="Todo"
            // onChange={inputChangeHandler}
            // value={todoName}
            // ref={todoInputRef}
            // onChange={inputValidationHandler}
            onChange={todoInput.onChange}
            value={todoInput.value}
            style={{ backgroundColor: todoInput.validity ?  'transparent' : 'red' }}
            /> 
          <button 
            type="button"
            onClick={todoAddHandler}
            >Add</button>
            {useMemo(() => ( // if the inputs dont change then we just want to take the old stored value in the end
                <List items={todoList} onClick={deleteTodoHandler}/>
                ),
                [ todoList ] // the list gets re-rendered based on todoList changes
            )};
        </>
    )
}

export default Todo;

// USESTATE
// useState returns two values
// the first value is the state 
// and the second value is function used to update the state


//   // single state
//     // todoState is an object containing a string and array property
//     const [todoState, setTodoState] = useState({ userInput: '', todoList: []});


//     // function to execute the function useState gives
//     const inputChangeHandler = (event) => {
//         // function that updates our state with a new value
//         setTodoState({
//             userInput: event.target.value,
//             todoList: todoState.todoList // becos it didnt change, just taking the latest value stored in the state
//         })
//     };

//     const todoAddHandler = () => {
//         // take the previous value in the state into account
//         // concat always returns a new array and doesnt edit the old one
//         setTodoState({
//             userInput: todoState.userInput,
//             todoList: todoState.todoList.concat(todoState.userInput) // manual merging
//         });
//     };


// say we want to fetch data when this component gets loaded
// we can use another hook called useEffect() hook
// useEffect is also a function which you call 
// and to the function we pass a function that should be executed
// in the callback function you put your code that for example 
// should be executed when this component loads for the first time
// it could also be executed in other scenarios
// do not use any side effects in a render function
// do them in a callback function passed to useEffect instead
// useEffect hooks to react internals and make sure the side effect code 
// executes at the right time which is after this render cycle finished
// so the UI gets updated correctly
// it runs after every render cycle
// we make more an more requests in the useEffect function 
// becos the UI is updates the state hence the UI gets re-rendered hence new req
// avoid doing that using a second arg which is an array of values 
// which we want to look at before executing this
// only if the values we have a look at changes, then the effect should run again
// if an empty array is being passed then it will run once and never run again, for mounting of the array
// thats a replication of componentDidMount()



// anyttome a state changes react re-renders


// useReducer - helps to get rid of items
// delete a todo
// const deleteTodoHandler = async (todoId) => {
//     const response = await axios.delete(`https://basic-todo-cd42e.firebaseio.com/todos/${todoId}.json`);
//     console.log(response, ' delete response');
//     let todos = todoList.filter(todo => todo.id !== todoId);
//     setTodoList(todos);
// };
// the above method can be used but we are taking a look at how we can use useReducer hook
// useReducer allows us to bundle the logic for updating the state in one simple function
// It receives two argument the state and the action which react will pass automatically for us
// the action will be an object with information on what to do and 
// the state will be our latest/current state which we want to edit based on the action
// useReducer can be an powerful alternative to the useState hook for handling a state
// becos it allows us to encode all possible actions to be carried out on the state
// instead of having to write them as normal functions in this functional component4

// we wont be needing the submittedTodo anymore becos
// whenever we dispatch a function we get the lastest state which is automated by react
// and taking advantage of that we can manipulate our state knowing it is updated
// so no matter how fast a req is being sent back to update the state
// we work with our always updated and latest state to update our UI accordingly
// for every run of the reducer function we get the latest state snapshot
// and not the snapshot at the point of time we start a logic


// useRef
// using references to interract with input
// or for example any element on out page
// we use the internal state management of the input e element
// and use a ref to extract its current value whenever we need 
// the constant assigned the useRef function refers to the HTML item
// but to be precise this does not yet refer to it
// it is an object which has current property and the 
// current property is what holds the actual HTML reference4
// So on current I can then access the value 
// input element in Js have a value field which is the currently entered value

// useMemo hook
// to ensure that we dont uncessarily re-render (list)
// useMemo takes a function as an arg
// it doesnt have to be JSX code
// You can use useMemo on any value you want to memoize
// Memoization is an optimization texhnique used to primarily speed up computer programs
// by storing the results of expensiive function calls 
// and returning the cached result when the same inputs occur again
// for example if you have a function that adds to numbers and you pass in 3 and 5
// the function returns a result which should be 8
// what memoization does is to store the result of that operation carried out by the function
// so if the inputs 3 and 5 where to be passed in as inputs again 
// instead of running that function again 
// it simply checks the input and return the result it stored or cached previously
// my thought on that example
// max - caching values of their inputs dont change
// useMemo does the storage retrieval and recreation for us