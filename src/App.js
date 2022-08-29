import React from 'react';
import Navigation from './components/Navigation';
import './index.css'

function App() {
  var path = window.location.pathname;
  var id = path.replace('/', '');
  console.log('in app.....', id)
  return (
    // <MuiThemeProvider>
    <div>
      <Navigation user_id={id}/>
    </div>
    // </MuiThemeProvider>
  );
}

export default App;
