import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import ExamPage from './pages/ExamPage';
import ProfilePage from './pages/ProfilePage';
import ResumeExtractPage from './pages/ResumeExtractPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CourseList />} />
              <Route path="/ParticularCourse/:id" element={<CourseDetail />} />
              <Route path="/exam/:exam_id" element={<ExamPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/extract-resume" element={<ResumeExtractPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
