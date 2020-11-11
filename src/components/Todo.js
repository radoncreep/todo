import React, { useState } from 'react';

const Todo = () => {
    // capture user input
    const [todoName, setTodoName] = useState('');
    // having an array, todoList that contains todoItems
    const [todoList, setTodoList ] = useState([]);

    // function to execute the function useState gives
    const inputChangeHandler = (event) => {
        // function that updates our state with a new value
        setTodoName(event.target.value);
    };

    const todoAddHandler = () => {
        // take the previous value in the state into account
        setTodoList()
    }

    return (
        <>
          <input 
            type="text"
            placeholder="Todo"
            onChange={inputChangeHandler}
            value={todoName}
            /> 
          <button type="button">Add</button>
          <ul>

          </ul>
        </>
    )
}

export default Todo;

// USESTATE
// useState returns two values
// the first value is the state 
// and the second value is function used to update the state


