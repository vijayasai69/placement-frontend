import { api } from "@/services/api";

// TODO: Backend — POST /api/resume/upload (multipart/form-data, PDF only, max 5MB)
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/api/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Poll until status === "ANALYZED" or "FAILED"
export const getResumeStatus = (jobId: string) =>
  api.get(`/api/resume/status/${jobId}`);

// TODO: Backend — GET /api/resume/profile (returns parsed candidate profile)
export const getResumeProfile = (profileId?: string | null) => 
  api.get("/api/resume/profile", { params: { profileId } });
export const getResumeHistory = () => api.get("/api/resume/history");

export const deleteResumeProfile = (profileId: string) =>
  api.delete(`/api/resume/profile/${profileId}`);

export const resetUserData = () => api.delete("/api/resume/reset");

export const downloadResumeProfile = async (profileId: string, fileName: string) => {
  const res = await api.get(`/api/resume/download/${profileId}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
