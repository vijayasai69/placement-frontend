import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit3, Loader2, Save, X, Mail, Phone, MapPin, CheckCircle2, XCircle, Brain, Sparkles, Code2, FileText, Trophy, Building2, Network, Cloud, Settings, Rocket, GraduationCap, Calendar, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/features/profile/services/profile-service";
import { getResumeProfile } from "@/features/resume/services/resume-service";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { toast } from "sonner";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { setUser, user, setCustomAvatar } = useAuthStore();
  const customAvatar = useAuthStore(state => state.user ? state.customAvatars[state.user.id] : null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedImage: string) => {
    setCustomAvatar(croppedImage);
  };
  const [profile, setProfile] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [customAvatar, user?.image]);

  const validCustomAvatar = customAvatar && customAvatar !== "null" ? customAvatar : null;
  const validUserImage = user?.image && user?.image !== "null" ? user?.image : null;
  const displayImage = !imageError && (validCustomAvatar || validUserImage);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    targetRole: "",
    expectedSalary: "",
    workMode: "Remote",
  });


  const loadData = () => {
    setLoading(true);
    Promise.all([getProfile(), getResumeProfile()])
      .then(([profileRes, resumeRes]) => {
        let p = null;
        let r = null;
        if (profileRes.data?.success) {
          p = profileRes.data.data;
          setProfile(p);
        }
        if (resumeRes.data?.success && resumeRes.data.profile) {
          r = resumeRes.data.profile;
          setResume(r);
        }

        const localMockDataStr = localStorage.getItem("mock_profile_data");
        const localMockData = localMockDataStr ? JSON.parse(localMockDataStr) : {};

        const localMockGoalsStr = localStorage.getItem("mock_career_goals");
        const localMockGoals = localMockGoalsStr ? JSON.parse(localMockGoalsStr) : null;

        let rawBio = localMockData.bio ?? (p?.bio || r?.bio || "");
        let rawLoc = localMockData.location ?? (p?.location || r?.location || "");
        let rawPhone = localMockData.phone ?? (p?.phone || r?.phone || "");

        if (typeof rawBio === 'string' && rawBio.includes("Aspiring Software Engineer")) rawBio = "";
        if (typeof rawLoc === 'string' && rawLoc.includes("India")) rawLoc = "";
        if (typeof rawPhone === 'string' && rawPhone.includes("98765")) rawPhone = "";

        setFormData({
          name: p?.name || r?.name || user?.name || "",
          bio: rawBio,
          location: rawLoc,
          phone: rawPhone,
          targetRole: localMockGoals?.targetRole || "Frontend Developer",
          expectedSalary: localMockGoals?.expectedSalary || "$100k - $120k",
          workMode: localMockGoals?.workMode || "Remote",
        });
      })
      .catch((err) => console.error("Failed to load profile parameters:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        skills: profile?.skills || [],
      });

      if (res.data?.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        if (user && formData.name !== user.name) setUser({ ...user, name: formData.name });

        localStorage.setItem("mock_profile_data", JSON.stringify({
          bio: formData.bio, location: formData.location, phone: formData.phone
        }));

        const newGoals = {
          targetRole: formData.targetRole, expectedSalary: formData.expectedSalary, workMode: formData.workMode
        };
        localStorage.setItem("mock_career_goals", JSON.stringify(newGoals));

        setProfile((prev: any) => ({
          ...prev, name: formData.name, bio: formData.bio, location: formData.location, phone: formData.phone,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center min-h-[500px]">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";

  let displayBio = profile?.bio || resume?.bio || "";
  if (typeof displayBio === 'string' && displayBio.includes("Aspiring Software Engineer")) displayBio = "";

  let displayLocation = profile?.location || resume?.location || "";
  if (typeof displayLocation === 'string' && displayLocation.includes("India")) displayLocation = "";

  let displayPhone = profile?.phone || resume?.phone || "";
  if (typeof displayPhone === 'string' && displayPhone.includes("98765")) displayPhone = "";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative p-6 lg:p-12 space-y-8 max-w-7xl mx-auto overflow-hidden min-h-screen">
      {/* Floating Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/50 dark:border-white/10"
      >
        <div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm font-bold tracking-widest text-blue-500 mb-3 uppercase"
          >
            <Sparkles className="h-4 w-4" /> AI-Powered Profile
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Candidate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Identity</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all"
            >
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-2 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </button>
            </div>
          )}

          <Link
            to="/dashboard"
            className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
            title="Close Profile"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Main Profile Info Card */}
          <div className="bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">

            <div className="relative z-10">
              <div className="relative inline-block mb-8">
                <label className="h-28 w-28 rounded-full flex items-center justify-center text-5xl font-display font-black border-[4px] border-white dark:border-[#0f172a] shadow-xl overflow-hidden cursor-pointer group/avatar relative"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                    color: "white"
                  }}
                  title="Upload Profile Image"
                >
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    avatarLetter
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Edit</span>
                  </div>
                </label>
                {customAvatar && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCustomAvatar(null);
                    }}
                    className="absolute bottom-0 right-0 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-20"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Professional Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about your professional journey..."
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 font-display tracking-tight">
                    {displayName}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] leading-relaxed">
                    {displayBio || <span className="italic text-slate-400/50">No bio provided. Add one to improve your AI score.</span>}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-5 pt-6 border-t border-slate-200/50 dark:border-white/10 relative z-10">
              <div className="flex items-center gap-4 text-sm group/edit">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="Location (press Enter to save)"
                    className="flex-1 bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : displayLocation ? (
                  <>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{displayLocation}</span>
                    <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover/edit:opacity-100 p-1 text-blue-500 hover:text-blue-600 transition-opacity" title="Edit Location">
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors">
                    Add Location
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm group/edit">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                  <Phone className="h-4 w-4 shrink-0" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="Phone (press Enter to save)"
                    className="flex-1 bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : displayPhone ? (
                  <>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{displayPhone}</span>
                    <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover/edit:opacity-100 p-1 text-blue-500 hover:text-blue-600 transition-opacity" title="Edit Phone Number">
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors">
                    Add Phone Number
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500">
                  <Mail className="h-4 w-4 shrink-0" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{displayEmail || "Not Provided"}</span>
              </div>
            </div>
          </div>

          {/* Education Details Card */}
          {resume && (
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0a0f1c] rounded-3xl p-[1px] relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-xl" />
              <div className="bg-white/95 dark:bg-[#0a0f1c]/95 backdrop-blur-3xl rounded-[23px] p-6 relative z-10 h-full border border-white/20 dark:border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">Education Details</h3>
                </div>
                
                <div className="space-y-4">
                  {resume?.education && resume.education.filter((edu: any) => (edu.institution || edu.school) && (edu.institution || edu.school).trim() !== '').length > 0 ? (
                    resume.education.filter((edu: any) => (edu.institution || edu.school) && (edu.institution || edu.school).trim() !== '').map((edu: any, idx: number) => {
                      const institutionName = edu.institution || edu.school;
                      const start = edu.startYear || (edu.startDate ? edu.startDate.substring(0, 4) : 'N/A');
                      const end = edu.endYear || (edu.endDate ? edu.endDate.substring(0, 4) : 'Present');
                      
                      return (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-colors group">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{institutionName}</h4>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Calendar className="w-3.5 h-3.5" /> {start} - {end}
                            </span>
                            {edu.gpa && (
                              <span className="flex items-center gap-1.5 text-xs font-black text-indigo-500 dark:text-indigo-400">
                                {edu.gpa.includes('CGPA') || edu.gpa.includes('%') ? edu.gpa : `Score: ${edu.gpa}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )})
                  ) : (
                    <div className="text-center p-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
                        <GraduationCap className="w-6 h-6 text-indigo-500" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Missing Education</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">We couldn't clearly extract your university details. Please add education details to your resume to make it more useful for recruiters.</p>
                      <Link to="/resume" className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-colors">
                        Update Resume
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>


        {/* RIGHT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {resume ? (
            <>
              {/* Top Row: AI Profile Strength & AI Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* AI Profile Strength */}
                <div className="bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors" />

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Profile Strength</h3>
                  </div>

                  <div className="flex items-center gap-8 relative z-10">
                    <CircularProgress value={87} />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Personal Info</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Resume Uploaded</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Skills Added</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        <span className="text-slate-400">Portfolio Missing</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 relative z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Complete remaining sections to increase placement opportunities by up to 34%.
                    </p>
                  </div>
                </div>

                {/* AI Badges */}
                <div className="bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(244,63,94,0.1)] transition-all flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] group-hover:bg-rose-500/20 transition-colors" />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        AI Badges
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Earned through skill completion.</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-3 mt-2">
                    {((resume?.skills && resume.skills.length > 0) ? resume.skills.slice(0, 8) : ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "SQL", "MongoDB"]).map((badge: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-default shadow-sm group/badge"
                      >
                        <Trophy className="w-3.5 h-3.5 text-rose-500 opacity-70 group-hover/badge:opacity-100 transition-opacity" />
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Learning Progress */}
              <div className="bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-purple-500/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4" />

                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/20">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                      Skills Learning Progress
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track your competency in required skills.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <AnimatedProgressBar
                    label="React & Next.js"
                    value={92}
                    icon={Code2}
                    color={{ bg: "bg-blue-500/10", text: "text-blue-500", fill: "bg-gradient-to-r from-blue-400 to-blue-600" }}
                    tooltip="Advanced proficiency"
                  />
                  <AnimatedProgressBar
                    label="System Design"
                    value={65}
                    icon={Network}
                    color={{ bg: "bg-purple-500/10", text: "text-purple-500", fill: "bg-gradient-to-r from-purple-400 to-purple-600" }}
                    tooltip="Currently learning microservices"
                  />
                  <AnimatedProgressBar
                    label="Data Structures"
                    value={84}
                    icon={Brain}
                    color={{ bg: "bg-emerald-500/10", text: "text-emerald-500", fill: "bg-gradient-to-r from-emerald-400 to-emerald-600" }}
                    tooltip="Strong problem solving"
                  />
                  <AnimatedProgressBar
                    label="Cloud & AWS"
                    value={40}
                    icon={Cloud}
                    color={{ bg: "bg-amber-500/10", text: "text-amber-500", fill: "bg-gradient-to-r from-amber-400 to-amber-600" }}
                    tooltip="Learning AWS basics"
                  />
                  <AnimatedProgressBar
                    label="TypeScript"
                    value={88}
                    icon={FileText}
                    color={{ bg: "bg-sky-500/10", text: "text-sky-500", fill: "bg-gradient-to-r from-sky-400 to-sky-600" }}
                    tooltip="Solid typing fundamentals"
                  />
                  <AnimatedProgressBar
                    label="CI/CD Pipelines"
                    value={35}
                    icon={Settings}
                    color={{ bg: "bg-rose-500/10", text: "text-rose-500", fill: "bg-gradient-to-r from-rose-400 to-rose-600" }}
                    tooltip="Introduction to Docker/Actions"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-4">No Resume Found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
                Upload your resume to unlock AI-powered insights, profile strength scoring, skill gap analysis, and tailored badges.
              </p>
              <Link to="/resume" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Resume Now
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {selectedImage && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}{suffix}</span>;
};


const CircularProgress = ({ value }: { value: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-slate-100 dark:text-white/5"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
          <AnimatedCounter value={value} suffix="%" />
        </span>
        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Score</span>
      </div>
    </div>
  );
};

const AnimatedProgressBar = ({ label, value, icon: Icon, color, tooltip }: any) => {
  return (
    <div className="relative group/skill" title={tooltip}>
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color.bg} ${color.text}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
        </div>
        <span className={`text-xs font-black ${color.text}`}><AnimatedCounter value={value} suffix="%" /></span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
          className={`h-full ${color.fill} rounded-full`}
        />
      </div>
    </div>
  );
};
