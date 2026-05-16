import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Jobtable from './pages/Jobtable'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Jobtable />} />
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
export default App
