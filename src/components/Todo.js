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
        // concat always returns a new array and doesnt edit the old one
        setTodoList(todoList.concat(todoName));
    }

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


