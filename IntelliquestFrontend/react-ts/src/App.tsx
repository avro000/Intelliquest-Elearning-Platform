import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Settings from "./Settings";
import LoginPage from "./Logpage";
import { Toaster } from "@/components/ui/sonner";
import SignupPage from "./SignupPage";
import OAuthSuccess from "./OAuthSuccess";
import ForgotPassword from "./components/ui/ForgotPassword";
import AdminDashboard from "./admin/Admin-Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import InstructorDashboard from "./Instructor-Dashboard";
import ViewCourses from "./ViewCourses";
import CreateCourse from "./CreateCourse";
import SearchUser from "./admin/SearchUser";
import UsersTable from "./admin/UsersTable";
import CourseTable from "./admin/CourseTable";
import ManageInstructors from "./admin/ManageInstructors";
import LandingPage from "./LandingPage";
import AllCoursesPage from "./admin/AllCoursesPage";
import AdminSettings from "./admin/AdminSettings";
import UserDashboard from "./UserDashboard/User-Dashboard";
import EnrolledCourses from "./UserDashboard/EnrolledCourses";
import AccountSettings from "./UserDashboard/AccountSettings";
import CourseDetailsPage from "./UserDashboard/CourseDetailsPage";
import CourseContentPage from "./admin/CourseContentPage";
import './index.css';
import ChatBotWidget from './components/ChatBotWidget';
import { useAuth } from "./AuthContext"; 
import SupportPage from "./SupportPage";
import FeedbackPage from "./FeedbackPage";
import InstructorApplicationForm from "./components/LandingPage/InstructorApplicationForm";
import QuizCreator from "./Quiz/quiz-creator";
import ViewQuizzes from "./Quiz/ViewQuizzes";
import PlayQuiz from "./Quiz/PlayQuiz";
import TestInterface from "./Quiz/quiz-interface";
import QuizDashboard from "./Quiz/QuizDashboard";

const App = () => {
  const { userRole, loadingUser } = useAuth();
  const hasToken = Boolean(localStorage.getItem("token"));

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Public Routes - redirect if logged in */}
          <Route
            path="/"
            element={
              loadingUser && hasToken ? null : !userRole ? (
                <LandingPage />
              ) : (
                <Navigate to={`/${userRole}Dashboard`} replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              loadingUser && hasToken ? null : !userRole ? (
                <LoginPage />
              ) : (
                <Navigate to={`/${userRole}Dashboard`} replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              loadingUser && hasToken ? null : !userRole ? (
                <SignupPage />
              ) : (
                <Navigate to={`/${userRole}Dashboard`} replace />
              )
            }
          />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/apply-instructor" element={<InstructorApplicationForm />} />

          {/* INSTRUCTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}>
            <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
            <Route path="/CreateCourse" element={<CreateCourse />} />
            <Route path="/ViewCourses" element={<ViewCourses />} />
            <Route path="/quiz" element={<QuizCreator />} />
            <Route path="/view-quiz" element={<ViewQuizzes />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/search-user" element={<SearchUser />} />
            <Route path="/users" element={<UsersTable />} />
            <Route path="/courses" element={<CourseTable />} />
            <Route path="/manage-instructor" element={<ManageInstructors />} />
            <Route path="/view-allcourses" element={<AllCoursesPage />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
          </Route>

          {/* USER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route path="/UserDashboard" element={<UserDashboard />} />
            <Route path="/EnrolledCourses" element={<EnrolledCourses />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            <Route path="/course-content/:id" element={<CourseContentPage />} />
            <Route path="/quiz-list" element={<PlayQuiz />} />
            <Route path="/play-quiz/:id" element={<TestInterface />} />
            <Route path="/quiz-dashboard" element={<QuizDashboard />} />
          </Route>

          {/* Catch all unknown routes */}
          <Route
            path="*"
            element={
              userRole
                ? <Navigate to={`/${userRole}Dashboard`} replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>

        {/* Render ChatBotWidget only if loading finished and role is USER */}
        {!loadingUser && userRole === "USER" && <ChatBotWidget />}
      </Router>
    </>
  );
};

export default App;
