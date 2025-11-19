import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import CarDetails from "./pages/List";
import Allcars from "./pages/Allcar";
import Contact from "./pages/Contact";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home";
import MyBookings from "./pages/MyBooking";
import { AuthContext } from "./Context/AuthContext";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AddCars from "./pages/admin/AddCars";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageContact from "./pages/admin/ManageContact";
import ManageFeedbacks from "./pages/admin/ManageFeedbacks";
import StaffManagement from "./pages/admin/StaffManagement";

const App = () => {
  const { user } = useContext(AuthContext);

  // ProtectedRoute Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/cars"
          element={
            <>
              <Header />
              <Allcars />
              <Footer />
            </>
          }
        />
        <Route
          path="/carlist/:id"
          element={
            <>
              <Header />
              <CarDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/feedback"
          element={
            <>
              <Header />
              <Feedback />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />

        {/* Customer Protected Route */}
        <Route
          path="/mybooking"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Header />
              <MyBookings />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes with Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="addcars" element={<AddCars />} />
          <Route path="manageBookings" element={<ManageBookings />} />
          <Route path="managecontacts" element={<ManageContact />} />
          <Route path="managefeedbacks" element={<ManageFeedbacks />} />
          <Route path="staffmanagement" element={<StaffManagement/>} />


          {/* Future routes here */}
        </Route>
      </Routes>
    </>
  );
};

export default App;
