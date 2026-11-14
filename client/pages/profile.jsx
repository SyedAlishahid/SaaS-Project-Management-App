import React, { useState } from "react";
import {
  Mail,
  Hash,
  BadgeCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [copied, setCopied] = useState(false);

  // Dummy data matching your exact API response structure
  const data = {
    _id: "6ad67001d322a43f5865f0c9",
    user: {
      _id: "6ad14b9d9d4c05df566f442b",
      name: "abuzar",
      email: "abuzar@gmail.com",
      bio: "HEY! there i am using SAAS MANAGEMENT",
      isVerified: false,
      profile:
        "http://res.cloudinary.com/dthzttg6r/image/upload/v1792101265/ew6itmx5zvygztwn7doc.jpg",
    },
  };

  const { user } = data;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Back Link */}
        <Link
          to={-1}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        {/* Main Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Subtle Top Banner */}
          <div className="h-24 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />

          {/* Avatar & Header Info */}
          <div className="px-6 pb-6">
            <div className="relative flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-5 gap-4">
              <div className="relative inline-block">
                <img
                  src={user.profile}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=fff&size=128`;
                  }}
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-800"
                />
              </div>

              {/* Verification Status Pill */}
              <div>
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Name & Email Subtitle */}
            <div className="mb-6">
              <h1 className="text-xl font-bold capitalize tracking-tight text-slate-800">
                {user.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>

            {/* Clean Details List */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              {/* Bio */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-50/80 border border-slate-200/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Bio
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {user.bio}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 border border-slate-200/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-slate-800 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User ID with One-Click Copy */}
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50/80 border border-slate-200/70 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600">
                    <Hash className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      User ID
                    </p>
                    <p className="text-xs font-mono font-medium text-slate-700 truncate mt-0.5">
                      {user._id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
