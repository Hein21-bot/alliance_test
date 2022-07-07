import React from 'react';
import Navigation from './components/Navigation';

function App() {
  var path = window.location.pathname;
  var id = path.replace('/', '');

  return (
    // <MuiThemeProvider>
    <div>
      <Navigation user_id={id} />
    </div>
    // </MuiThemeProvider>
  );
}

export default App;
