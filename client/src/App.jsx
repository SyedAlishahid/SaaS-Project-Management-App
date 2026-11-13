import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SignupForm } from "../pages/signup.jsx";
import { LoginFrom } from "../pages/login.jsx";
import Dashboard from "../pages/dashboard.jsx";
import ProjectDetail from "../pages/ProjectDetail.jsx";
import ProjectInfo from "../pages/ProjectInfo.jsx";
import Workspaces from "../pages/workspaces.jsx";
import MyTasks from "../pages/myTasks.jsx";

import ProtectRoutes from "../context/ProtectRoutes.jsx";
import NotFound from "../pages/Notfound.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginFrom />} />

        {/* Protected Routes */}
        <Route element={<ProtectRoutes />}>
          <Route path="/dashboard/:workspaceId" element={<Dashboard />} />

          <Route
            path="/project/workspace/:workspaceId/projects"
            element={<ProjectDetail />}
          />

          <Route path="/project/:projectId" element={<ProjectInfo />} />

          <Route path="/workspace/my-workspace" element={<Workspaces />} />

          <Route path="/task/projects/:projectId/tasks" element={<MyTasks />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
