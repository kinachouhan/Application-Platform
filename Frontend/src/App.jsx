import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

import { ProtectedRoute } from "./components/common/ProtectedRoute";

import { AdminLayout } from "./layouts/AdminLayout";
import { CompanyLayout } from "./layouts/CompanyLayout";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { PublicLayout } from "./layouts/PublicLayout";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Customers } from "./pages/admin/Customers";
import { Companies } from "./pages/admin/Companies";
import { Jobs } from "./pages/admin/Jobs";
import { Applications } from "./pages/admin/Applications";


import { CompanyDashboard } from "./pages/company/Dashboard";
import { CreateJob } from "./pages/company/CreateJob";
import { MyJobs } from "./pages/company/MyJobs";
import { Applicants } from "./pages/company/Applicants";

import { CustomerJobs } from "./pages/customer/CustomerJobs";
import { MyApplications } from "./pages/customer/MyApplications";
import { Profile } from "./pages/customer/Profile";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";

import { Toaster } from "react-hot-toast";
import { Blocked } from "./components/common/Blocked";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/blocked" element={<Blocked />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="job-seeker" element={<Customers />} />
        <Route path="companies" element={<Companies />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="applications" element={<Applications />} />
      </Route>


      <Route
        path="/company"
        element={
          <ProtectedRoute role="company">
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CompanyDashboard />} />
        <Route path="create-job" element={<CreateJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="applicants/:jobId" element={<Applicants />} />
      </Route>


      <Route
        path="/job-seeker"
        element={
          <ProtectedRoute role="job-seeker">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerJobs />} />
        <Route path="jobs" element={<CustomerJobs />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="profile" element={<Profile />} />
      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )
);

function App() {

  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (authLoading) return <div>Loading...</div>;

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
