import React from 'react'

const List = ({ items, onClick }) => {
    console.log('rendering the list');
    return (
        <ul>
        {items.map(todo => (
            // you could use onClick={() => deleteTodoHandler(todo.id)}
            <li onClick={onClick.bind(this, todo.id)} key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    )
};

export default List;
