import React from 'react';
import Navigation from './components/Navigation';
import './index.css'

function App() {
  var path = window.location.pathname;
  var id = path.replace('/', '');

  return (
    // <MuiThemeProvider>
    <div>
      <Navigation user_id={id} style={{height:'auto'}} />
    </div>
    // </MuiThemeProvider>
  );
}

export default App;
