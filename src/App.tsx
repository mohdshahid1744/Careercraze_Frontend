import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoutes from './Route/UserRouter'
import RecruiterRoute from './Route/RecruiterRoute'
import AdminRouter from './Route/AdminRouter';
function App() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path='/*' element={<UserRoutes />} />
            <Route path='/recruiter/*' element={<RecruiterRoute />} />
            <Route path='/admin/*' element={<AdminRouter />} />
          </Routes>
        </Router>
      </div>
    );
  }
  
  export default App;