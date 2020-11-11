import React, { useState } from 'react';

const Todo = () => {
    // single state
    // todoState is an object containing a string and array property
    const [todoState, setTodoState] = useState({ userInput: '', todoList: []});


    // function to execute the function useState gives
    const inputChangeHandler = (event) => {
        // function that updates our state with a new value
        setTodoState({
            userInput: event.target.value,
            todoList: todoState.todoList // becos it didnt change, just taking the latest value stored in the state
        })
    };

    const todoAddHandler = () => {
        // take the previous value in the state into account
        // concat always returns a new array and doesnt edit the old one
        setTodoState({
            userInput: todoState.userInput,
            todoList: todoState.todoList.concat(todoState.userInput) // manual merging
        });
    };

    return (
        <>
          <input 
            type="text"
            placeholder="Todo"
            onChange={inputChangeHandler}
            value={todoState.userInput}
            /> 
          <button 
            type="button"
            onClick={todoAddHandler}
            >Add</button>
          <ul>
            {todoState.todoList.map(todo => (
                <li key={todo}>{todo}</li>
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


