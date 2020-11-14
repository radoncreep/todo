import React, { useState } from 'react';

import Todo from './components/Todo';
import Header from './components/Header';
import Auth from './components/Auth';
import AuthContext from './auth-context';

const App = props => {
  const [page, setShowPage] = useState('auth');
  const [authStatus, setAuthStatus] = useState(false);

  const switchPageHandler = (pageName) => {
    setShowPage(pageName);
  };

  const login = () => {
    setAuthStatus(!authStatus);
  };

  return (
    <>
      <AuthContext.Provider value={{ status: authStatus, login: login }}>
        <Header 
          onLoadTodos={switchPageHandler.bind(this, 'todos')} 
          onLoadAuth={switchPageHandler.bind(this, 'auth')}/>
        <br />
        {page === 'auth' ? <Auth/> : <Todo />}
      </AuthContext.Provider>   
    </>
  );
};

export default App;
