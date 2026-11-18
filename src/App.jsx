import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ================= LAYOUT =================
import RoleLayout from "./layouts/RoleLayout";
import Home from "./pages/Home";

// ================= AUTH =================
import Login from "./modules/auth/Login";
import Signup from "./modules/auth/Signup";
import PortalSelector from "./modules/auth/PortalSelection";

// ================= ADMIN =================
import Dashboard from "./modules/admin/pages/Dashboard";
import Operators from "./modules/admin/pages/Operators";
import Users from "./modules/admin/pages/Users";
import Machines from "./modules/admin/pages/Machines";
import Bookings from "./modules/admin/pages/Bookings";
import Payments from "./modules/admin/pages/Payments";
import Bills from "./modules/admin/pages/Bills";
import Reports from "./modules/admin/pages/Reports";
import Feedback from "./modules/admin/pages/Feedback";
import Profile from "./modules/admin/pages/Profile";
import Settings from "./modules/admin/pages/Settings";
import OperatorBillsPayments from "./modules/admin/pages/OperatorBillsPayments";

// ================= OPERATOR =================
import OperatorDashboard from "./modules/operator/pages/OperatorDashboard";
import AssignedJobs from "./modules/operator/pages/AssignedJobs";
import CompleteJobs from "./modules/operator/pages/CompleteJobs";
import CreateBill from "./modules/operator/pages/CreateBill";
import OpProfile from "./modules/operator/pages/OpProfile";
import WorkHistory from "./modules/operator/pages/WorkHistory";
import OperatorWages from "./modules/operator/pages/OperatorWages";
// ================= USER =================
import UserDashboard from "./modules/user/pages/UserDashboard";
import MyBookings from "./modules/user/pages/MyBookings";
import UserMachines from "./modules/user/pages/UserMachines";
import UserPayments from "./modules/user/pages/UserPayments";
import MyBills from "./modules/user/pages/MyBills";
import UserFeedback from "./modules/user/pages/UserFeedback";
import UserProfile from "./modules/user/pages/UserProfile";
import PaymentStatus from "./modules/user/pages/PaymentStatus";

export default function App() {
  return (

    <BrowserRouter>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    theme="colored"
    newestOnTop
  />
      <Routes>

        {/* =====================================================
            AUTHENTICATION
        ===================================================== */}

        {/* Website opens Portal Selector */}
        <Route path="/" element={<Home />} />

        {/* Choose User / Admin / Operator */}
        <Route
          path="/portal-selector"
          element={<PortalSelector />}
        />

        {/* Login
            /login?role=user
            /login?role=admin
            /login?role=operator
        */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* User registration only */}
        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =====================================================
            ADMIN
        ===================================================== */}

        <Route
          path="/admin"
          element={<RoleLayout role="admin" />}
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<Users />}
          />

          {/* Operators */}
          <Route
            path="operators"
            element={<Operators />}
          />

          {/* Machines & GPS */}
          <Route
            path="machines"
            element={<Machines />}
          />

          {/* Bookings */}
          <Route
            path="bookings"
            element={<Bookings />}
          />

          {/* Payments */}
          <Route
            path="payments"
            element={<Payments />}
          />

          {/* Bills & Invoices */}
          <Route
            path="bills"
            element={<Bills />}
          />
           <Route
  path="operator-bills-payments"
  element={<OperatorBillsPayments />}
/>
          {/* Reports */}
          <Route
            path="reports"
            element={<Reports />}
          />

          {/* Feedback */}
          <Route
            path="feedback"
            element={<Feedback />}
          />

          {/* Profile */}
          <Route
            path="profile"
            element={<Profile />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>


        {/* =====================================================
            USER
        ===================================================== */}

        <Route
          path="/user"
          element={<RoleLayout role="user" />}
        >

          {/* User Dashboard */}
          <Route
            index
            element={<UserDashboard />}
          />

          {/* My Bookings */}
          <Route
            path="bookings"
            element={<MyBookings />}
          />

          {/* Machines */}
          <Route
            path="UserMachines"
            element={<UserMachines />}
          />

          {/* Payments */}
          <Route
            path="userpayments"
            element={<UserPayments />}
          />

          {/* My Bills */}
          <Route
            path="mybills"
            element={<MyBills />}
          />

          {/* Feedback */}
          <Route
            path="userfeedback"
            element={<UserFeedback />}
          />

          {/* My Profile */}
          <Route
            path="userprofile"
            element={<UserProfile />}
          />

          {/* Payment Status */}
          <Route
            path="payment-status"
            element={<PaymentStatus />}
          />

        </Route>


        {/* =====================================================
            OPERATOR
        ===================================================== */}

        <Route
          path="/operator"
          element={<RoleLayout role="operator" />}
        >

          {/* Operator Dashboard */}
          <Route
            index
            element={<OperatorDashboard />}
          />

          {/* Assigned Jobs */}
          <Route
            path="Assignedjobs"
            element={<AssignedJobs />}
          />

          {/* Complete Jobs */}
          <Route
            path="completejobs"
            element={<CompleteJobs />}
          />

          {/* Create Bill */}
          <Route
            path="createbills"
            element={<CreateBill />}
          />
          <Route
  path="createbill/:id"
  element={<CreateBill />}
/>
<Route
  path="Myearnings"
  element={<OperatorWages />}
/>

          {/* Work History */}
          <Route
            path="workhistory"
            element={<WorkHistory />}
          />

          {/* Operator Profile */}
          <Route
            path="opprofile"
            element={<OpProfile />}
          />
          <>
  
  
</>

        </Route>


        {/* =====================================================
            PAGE NOT FOUND
        ===================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
              <div className="text-center">

                <h1 className="text-5xl font-bold text-[#0B1D2B]">
                  404
                </h1>

                <h2 className="mt-3 text-2xl font-bold text-gray-800">
                  Page Not Found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  The page you are looking for does not exist.
                </p>

                <a
                  href="/portal-selector"
                  className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500"
                >
                  Go to Bismi Earth Movers
                </a>

              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}