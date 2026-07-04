import type { ActivityItem } from "@/types";

export const dummyActivity: ActivityItem[] = [
  {
    id: "1",
    type: "resume_upload",
    title: "Resume uploaded",
    description: "Your resume was successfully uploaded",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "resume_parsed",
    title: "Profile parsed successfully",
    description: "AI extracted your skills, education, and experience",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "jobs_matched",
    title: "24 job matches found",
    description: "Based on your profile and skills",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "top_match",
    title: "Top match: SDE at Google — 94%",
    description: "Strong match on React & Node.js skills",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];
