import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Users,
  ScanLine,
  Bell,
  User,
  Menu,
  X,
  Command,
  ChevronRight,
} from "lucide-react";

const Navbar = ({
  title = "Saas Management",
  gridCols = "col-span-12",
  gridRows = "row-span-2",
  mdGridCols = "md:col-span-12",
  mdGridRows = "md:row-span-2",
}) => {
  const { workspaceId, projectId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      to: `/dashboard/${workspaceId}`,
      icon: LayoutDashboard,
    },
    {
      label: "Workspaces",
      to: "/workspace/my-workspace",
      icon: Briefcase,
    },
    {
      label: "Projects",
      to: `/project/workspace/${workspaceId}/projects/`,
      icon: FolderKanban,
    },
    {
      label: "Members",
      to: "/members",
      icon: Users,
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm ${gridCols} ${gridRows} ${mdGridCols} ${mdGridRows}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Hamburger Button + Brand + Scanner */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
                menuOpen
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800"
              }`}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Brand Icon & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
                <Command className="h-4 w-4" />
              </div>
              <span className="truncate text-base sm:text-lg font-bold tracking-tight text-slate-800">
                {title}
              </span>
            </div>

            {/* Quick Scan Button */}
            <button
              type="button"
              aria-label="Scan QR Code"
              className="hidden sm:inline-flex items-center gap-1.5 ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors"
            >
              <ScanLine className="h-3.5 w-3.5" />
              <span>Scan</span>
            </button>
          </div>

          {/* Right: Notifications & Account */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-slate-800 ring-2 ring-white" />
            </button>

            {/* User Profile */}
            <button
              type="button"
              aria-label="User Profile"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 sm:pr-3 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-700">
                Account
              </span>
            </button>
          </div>
        </div>

        {/* Dropdown Navigation Drawer (Opens on Hamburger Click) */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white/98 backdrop-blur-lg shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="px-2 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation Menu
              </p>

              <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-slate-800 text-white border-slate-800 shadow-md"
                            : "bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "bg-white text-slate-700 border border-slate-200 group-hover:bg-white/15 group-hover:text-white group-hover:border-transparent"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                              isActive
                                ? "text-slate-300"
                                : "text-slate-400 group-hover:text-slate-300"
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop Overlay to close menu when clicking outside */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
