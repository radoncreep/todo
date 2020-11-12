import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Todo = () => {
    // single state
    // todoState is an object containing a string and array property
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        const todos = [];
        const getTodos = async() => {
            const result = await axios.get('https://basic-todo-cd42e.firebaseio.com/todos.json')
            console.log(result);
            const todoData = result.data;

            for (const key in todoData) {
                todos.push({ id: key, name: key.name })
            };
        };
        getTodos();
        setTodoList(todos);

        // CLEANUP - this function ll be executed by react on every render cycle
        // and react ll eventually execute this as a cleanup 
        // before it applies the effect of your main code again
        // so you can clean up after your last useEffect call
        // we dont need to do a cleanup for http requests like this
        return () => {
            console.log('Cleanup');
        }
    }, [ ]); // [ todoName ] runs only when the todoName state changes

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler); 
        // better case to use a cleanup function
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    // function to execute the function useState gives
    const inputChangeHandler = (event) => {
        // function that updates our state with a new value
       setTodoName(event.target.value);
    };

    const todoAddHandler = async () => {
        // take the previous value in the state into account
        // concat always returns a new array and doesnt edit the old one
        setTodoList(todoList.concat(todoName));

        // saving to database after adding each todoName to the todoList
        try {
            const result = await axios.post('https://basic-todo-cd42e.firebaseio.com/todos.json', { name: todoName });
            console.log(result);
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <>
          <input 
            type="text"
            placeholder="Todo"
            onChange={inputChangeHandler}
            value={todoName}
            /> 
          <button 
            type="button"
            onClick={todoAddHandler}
            >Add</button>
          <ul>
            {todoList.map(todo => (
                <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
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



