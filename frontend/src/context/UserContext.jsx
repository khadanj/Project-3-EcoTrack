// this file creates global use state that all components can access
import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

//create context
const UserContext = createContext(null);

// this is the provider component that wraps the whole app
// it fetches the current user and makes it available everywhere
function UserProvider({ children }) {
  // stores the currently logged in user
  // starts as null
  const [user, setUser] = useState(null);

  // when the app first loads check if there is already a logged in user
  useEffect(function () {
    fetch('/api/auth/user')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // if there's a user back set it in state
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(function () {
        // if there was an error just set user to null
        setUser(null);
      });
  }, []);

  return (
    // wrap all children in the context provider
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// this is a custom hook that makes it easy to use the user context
// instead of importing useContext and UserContext everywhere
// just import useUser
function useUser() {
  return useContext(UserContext);
}

UserProvider.propTypes = {
  children: PropTypes.node,
};

export { UserProvider, useUser };
