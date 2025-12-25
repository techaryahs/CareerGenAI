// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/chatbot';
import MobileCSS from './components/MobileCSS';
import Home from './pages/Home';
import Chat from './pages/Chat';
import InterestForm from './pages/InterestForm';
import CareerDetail from './pages/CareerDetail';
import Consult from './pages/Consult';
import Login from './pages/Login';
import Register from './pages/Register';
import CareerQuiz from './pages/CareerQuiz';
import VerifyOtp from './pages/VerifyOtp';
import PremiumPlans from './components/PremiumPlans';
import CollegesByLocation from './pages/CollegesByLocation';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import Services from './pages/ServicesPage';
import CareerCompare from './pages/CareerCompare';
import ResumeBuilder from './pages/templates/ResumeBuilder';
import QrPopup from './components/QrPopup';
import AdminDashboard from './pages/AdminDashboard';
import UploadReceipt from './components/UploadReceipt';
import History from './pages/History';
import RegisterConsultant from './pages/RegisterConsultant';
import CareerRoadmap from "./pages/CareerRoadmap";
import ResumeTemplateSelector from "./pages/ResumeTemplateSelector";
import ResumeBuilder2 from "./pages/templates/ResumeBuilder2";
import ResumeBuilder3 from "./pages/templates/ResumeBuilder3";
import ProfileBuilder from "./pages/ProfileBuilder";
import LinkedInBuilder from "./pages/templates/LinkedInBuilder";
import NaukriBuilder from "./pages/templates/NaukriBuilder";
import ResumeBuilderGuide from './pages/templates/ResumeBuilderGuide';
import GitHubBuilder from './pages/templates/GitHubBuilder';
import PortfolioBuilder from './pages/templates/PortfolioBuilder';
import CoverLetterBuilder from './pages/templates/CoverLetterBuilder';
import { ResumeProvider } from './context/ResumeContext';
import { BookingProvider } from './EduTutor/context/BookingContext';
import BookSlot from './pages/BookSlot';
import ForgotPassword from "./pages/ForgotPassword";
import ConsultantDashboard from './pages/ConsultantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import VideoCallPage from './pages/VideoCallPage'; // ✅ WebRTC Video Call
import MyActivity from './pages/MyActivity';
import TeacherRegister from './pages/TeacherRegister'; // ✅ Teacher Registration
import TeacherDashboard from './pages/TeacherDashboard'; // ✅ Teacher Dashboard
import TeacherSearch from './pages/TeacherSearch'; // ✅ Teacher Search
import BookTeacherSlot from './pages/BookTeacherSlot'; // ✅ Book Teacher Slot
import PaymentRedirection from './pages/PaymentRedirection'; // ✅ Payment Redirection



import IndiaVsAbroadHome from "./indiavsabroad/pages/Home";
import IndiaVsAbroadCompare from "./indiavsabroad/pages/CompareResult";
import IndiaVsAbroad from "./indiavsabroad/pages/IndiaVsAbroad";

// ✅ WebRTC Context Provider
import { WebRTCProvider } from './webrtc/context/WebRTCContext';

// Import from cleaned AllComponents.jsx
import { ResumeBuilderPage, Template1, Template2, Template3, Template4, Template5, Template6 } from './AllComponents';

// ✅ Import EduTutor Components
// import EduTutor from './pages/EduTutor';
// import EngineeringCourseCatalog from './pages/templates/edututor_pages/EngineeringCourseCatalog';
// import { MbbsCourseCatalog, MbaCourseCatalog } from './pages/templates/edututor_pages/PlaceholderComponents';


// Main Layout Component 5th to 12th
import MainPage from './StudentGuidance/MainPage';
import JuniorGuidance from './StudentGuidance/Grade5to7/Grade5to7Home';
import SeniorGuidance from './StudentGuidance/Grade8to10/Grade8to10Home';
import PostGuidence from './StudentGuidance/Grade11to12/Grade11to12Home';
import FinalReportPage from './StudentGuidance/FinalReportPage';

// EduTutor Home Page
import EduHomePage from './EduTutor/MainPage/EduHomePage';
import EduCareerSelect from "./EduTutor/MainPage/EduCareerSelect";
import EduBranchSelect from "./EduTutor/MainPage/EduBranchSelect";
import EduSemesterSelect from "./EduTutor/MainPage/EduSemesterSelect";
import EduSubjectSelect from "./EduTutor/MainPage/EduSubjectSelect";
import EduTutorList from "./EduTutor/MainPage/EduTutorList";
import EduCartPage from "./EduTutor/MainPage/EduCartPage";
import EduSuccessPage from "./EduTutor/MainPage/EduSuccessPage";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <WebRTCProvider>
      <MobileCSS />
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/interest-form" element={<PrivateRoute><InterestForm /></PrivateRoute>} />
          <Route path="/careerQuiz" element={<PrivateRoute><CareerQuiz /></PrivateRoute>} />
          <Route path="/careerDetail" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/consult" element={<PrivateRoute><Consult /></PrivateRoute>} />
          <Route path="/college" element={<PrivateRoute><CollegesByLocation /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/pricing" element={<PremiumPlans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
          <Route path="/compare" element={<PrivateRoute><CareerCompare /></PrivateRoute>} />
          <Route path="/resume-builder/1" element={<ResumeBuilder />} />
          <Route path="/qr-popup" element={<QrPopup />} />
          <Route path="/upload-receipt" element={<UploadReceipt />} />
          <Route path="/history" element={<History />} />
          <Route path="/register-consultant" element={<RegisterConsultant />} />
          <Route path="/roadmap/:id" element={<CareerRoadmap />} />
          <Route path="/resume-templates" element={<ResumeTemplateSelector />} />
          <Route path="/resume-builder/2" element={<ResumeBuilder2 />} />
          <Route path="/resume-builder/3" element={<ResumeBuilder3 />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/templates/linkedin-builder" element={<LinkedInBuilder />} />
          <Route path="/templates/naukri-builder" element={<NaukriBuilder />} />
          <Route path="/templates/resume-builder-guide" element={<ResumeBuilderGuide />} />
          <Route path="/templates/github-builder" element={<GitHubBuilder />} />
          <Route path="/templates/portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="/templates/coverletter-builder" element={<CoverLetterBuilder />} />
          <Route path="/book-slot/:consultantId" element={<BookSlot />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/video-call/:bookingId" element={<PrivateRoute><VideoCallPage /></PrivateRoute>} /> {/* ✅ Video Call Route */}
          <Route path="/my-activity" element={<PrivateRoute><MyActivity /></PrivateRoute>} />
          {/* 5th to 12th Student Guidance Routes */}
          <Route path="/student-guidance" element={<MainPage />} />
          <Route path="/student-guidance/5th-7th" element={<JuniorGuidance />} />\
          <Route path="/student-guidance/8th-10th" element={<SeniorGuidance />} />
          <Route path="/student-guidance/11th-12th" element={<PostGuidence />} />
          <Route path="/student-guidance/final-report" element={<FinalReportPage />} />
          <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboard /></PrivateRoute>} />
          <Route path="/register-teacher" element={<TeacherRegister />} /> {/* ✅ Teacher Registration */}
          <Route path="/teacher-dashboard" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} /> {/* ✅ Teacher Dashboard */}
          <Route path="/search-teachers" element={<TeacherSearch />} /> {/* ✅ Teacher Search */}
          <Route path="/book-teacher/:teacherId" element={<PrivateRoute><BookTeacherSlot /></PrivateRoute>} /> {/* ✅ Book Teacher Slot */}
          <Route path="/payment-redirection" element={<PrivateRoute><PaymentRedirection /></PrivateRoute>} /> {/* ✅ Payment Redirection */}

          {/* India vs Abroad Routes */}
          <Route path="/india-vs-abroad" element={<IndiaVsAbroadHome />} />
          <Route path="/india-vs-abroad/compare" element={<IndiaVsAbroadCompare />} />
          <Route path="/india-vs-abroad/service" element={<IndiaVsAbroad />} />


          {/* Premium Resume Builder Route */}
          <Route
            path="/AllComponents"
            element={
              <ResumeProvider>
                <ResumeBuilderPage
                  getTemplateComponent={(id) => {
                    const templates = {
                      template1: Template1,
                      template2: Template2,
                      template3: Template3,
                      template4: Template4,
                      template5: Template5,
                      template6: Template6,
                    };
                    return templates[id] || null;
                  }}
                  templates={[
                    { id: 'template1', name: 'Template 1', preview: 'template 1.png', category: 'Professional' },
                    { id: 'template2', name: 'Template 2', preview: 'template 2.png', category: 'Creative' },
                    { id: 'template3', name: 'Template 3', preview: 'template 3.png', category: 'Modern' },
                    { id: 'template4', name: 'Template 4', preview: 'template 4.png', category: 'Elegant' },
                    { id: 'template5', name: 'Template 5', preview: 'template 5.png', category: 'Elegant' },
                    { id: 'template6', name: 'Template 6', preview: 'template 6.png', category: 'Elegant' }
                  ]}
                />
              </ResumeProvider>
            }
          />

          {/* ✅ EduTutor Routes */}
          <Route
            path="/edu/*"
            element={
              <BookingProvider>
                <Routes>
                  <Route path="/" element={<EduHomePage />} />
                  <Route path="career" element={<EduCareerSelect />} />
                  <Route path="branch/:careerId" element={<EduBranchSelect />} />
                  <Route path="semester/:branchId" element={<EduSemesterSelect />} />
                  <Route path="subjects/:branchId/:sem" element={<EduSubjectSelect />} />
                  <Route path="tutors" element={<EduTutorList />} />
                  <Route path="cart" element={<EduCartPage />} />
                  <Route path="checkout" element={<PaymentRedirection />} />
                  <Route path="success" element={<EduSuccessPage />} />
                </Routes>
              </BookingProvider>
            }
          />
        </Routes>
      </main>
      {isHomePage && <Footer />}
      <Chatbot />
    </WebRTCProvider>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
      <Route path="*" element={<Layout />} />
    </Routes>
  </Router>
);

export default App;
