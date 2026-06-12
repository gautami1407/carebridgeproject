import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "donor" | "volunteer" | "mentor" | "institution" | "admin";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string;
  avatar?: string;
} | null;

export type NeedCategory =
  | "Food"
  | "Education"
  | "Medical"
  | "Clothing"
  | "Infrastructure"
  | "Technology"
  | "Emergency";

export type Priority = "Critical" | "High" | "Medium" | "Low";
export type NeedStatus =
  | "Draft"
  | "Active"
  | "Partially Fulfilled"
  | "Fulfilled"
  | "Closed";

export type Need = {
  id: string;
  institutionId: string;
  title: string;
  category: NeedCategory;
  description: string;
  unit: string;
  goal: number;
  fulfilled: number;
  estimatedCost: number;
  priority: Priority;
  status: NeedStatus;
  deadline: string;
  beneficiaries: number;
  image?: string;
  createdAt: string;
  updates: { date: string; note: string }[];
};

export type Institution = {
  id: string;
  slug: string;
  name: string;
  type: "Orphanage" | "Old-Age Home";
  regNumber: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  description: string;
  website?: string;
  capacity: number;
  residents: number;
  image: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
};

export type Donation = {
  id: string;
  donorId: string;
  donorName: string;
  needId: string;
  institutionId: string;
  amount: number;
  type: "Money" | "Items" | "Sponsorship";
  status: "Initiated" | "Confirmed" | "Dispatched" | "Received" | "Utilized";
  date: string;
};

export type EventType = "Health Camp" | "Education" | "Birthday" | "Festival" | "Volunteer Drive" | "Fundraiser";
export type AppEvent = {
  id: string;
  institutionId: string;
  title: string;
  type: EventType;
  description: string;
  date: string;
  time: string;
  capacity: number;
  registered: number;
  location: string;
};

export type Application = {
  id: string;
  volunteerId: string;
  volunteerName: string;
  opportunity: string;
  institutionId: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  appliedAt: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  href?: string;
};

export type FeedPost = {
  id: string;
  author: string;
  authorRole: string;
  body: string;
  image?: string;
  date: string;
  likes: number;
  liked?: boolean;
};

export type ImpactReport = {
  id: string;
  needId: string;
  title: string;
  summary: string;
  beneficiariesServed: number;
  donationsTotal: number;
  outcomes: string[];
  date: string;
};

import inst1 from "@/assets/institution-1.jpg";
import inst2 from "@/assets/institution-2.jpg";
import inst3 from "@/assets/institution-3.jpg";

const seedInstitutions: Institution[] = [
  {
    id: "inst-1", slug: "sunshine-childrens-home", name: "Sunshine Children's Home", type: "Orphanage",
    regNumber: "KA/2008/4521", contact: "Priya Menon", email: "contact@sunshine.org", phone: "+91 98450 12345",
    city: "Bangalore", state: "Karnataka", address: "12, MG Road",
    description: "Home and school to 64 children since 2008. Focused on holistic education, nutrition, and mentorship.",
    website: "sunshine.org", capacity: 80, residents: 64, image: inst1, status: "Verified",
    createdAt: "2024-01-12",
  },
  {
    id: "inst-2", slug: "silver-oaks-elderly-care", name: "Silver Oaks Elderly Care", type: "Old-Age Home",
    regNumber: "MH/2012/7781", contact: "Anil Kulkarni", email: "hello@silveroaks.in", phone: "+91 98220 33442",
    city: "Pune", state: "Maharashtra", address: "Kothrud", description: "Long-term care and companionship for 38 senior residents, with on-site nursing.",
    capacity: 50, residents: 38, image: inst2, status: "Verified", createdAt: "2024-02-08",
  },
  {
    id: "inst-3", slug: "hope-foundation-school", name: "Hope Foundation School", type: "Orphanage",
    regNumber: "TS/2010/3321", contact: "Sister Mary", email: "info@hopefoundation.in", phone: "+91 90000 11122",
    city: "Hyderabad", state: "Telangana", address: "Banjara Hills", description: "Education-focused home for 92 children, K–12.",
    capacity: 100, residents: 92, image: inst3, status: "Verified", createdAt: "2024-03-15",
  },
  {
    id: "inst-4", slug: "anand-bal-sadan", name: "Anand Bal Sadan", type: "Orphanage",
    regNumber: "MH/2015/9930", contact: "Ravi Shah", email: "ravi@anandbal.org", phone: "+91 98199 22001",
    city: "Mumbai", state: "Maharashtra", address: "Dadar West", description: "Awaiting verification — submitted documents for review.",
    capacity: 60, residents: 48, image: inst1, status: "Pending", createdAt: "2026-06-01",
  },
];

const seedNeeds: Need[] = [
  {
    id: "need-1", institutionId: "inst-1", title: "50 School Bags & Supplies", category: "Education",
    description: "New school year starts in July. We need 50 complete school bag sets (notebooks, pens, lunchboxes) so children can start with dignity.",
    unit: "bags", goal: 50, fulfilled: 35, estimatedCost: 75000, priority: "High", status: "Partially Fulfilled",
    deadline: "5 days left", beneficiaries: 50, createdAt: "2026-06-01",
    updates: [
      { date: "2026-06-08", note: "Received 20 bags from local Rotary club." },
      { date: "2026-06-04", note: "Need posted publicly." },
    ],
  },
  {
    id: "need-2", institutionId: "inst-2", title: "Monthly Diabetes Medication Kits", category: "Medical",
    description: "Insulin and glucose monitoring kits for 20 elderly residents managing chronic diabetes.",
    unit: "kits", goal: 20, fulfilled: 12, estimatedCost: 48000, priority: "Critical", status: "Active",
    deadline: "2 days left", beneficiaries: 20, createdAt: "2026-06-05",
    updates: [{ date: "2026-06-09", note: "12 kits dispatched, urgent need for remaining." }],
  },
  {
    id: "need-3", institutionId: "inst-3", title: "Digital Learning Lab", category: "Technology",
    description: "20 refurbished laptops to start a coding and design lab for teenagers.",
    unit: "laptops", goal: 20, fulfilled: 8, estimatedCost: 240000, priority: "Medium", status: "Active",
    deadline: "12 days left", beneficiaries: 80, createdAt: "2026-05-20",
    updates: [{ date: "2026-06-02", note: "8 laptops received from corporate donor." }],
  },
  {
    id: "need-4", institutionId: "inst-1", title: "Winter Blankets", category: "Clothing",
    description: "80 warm blankets for the upcoming winter months.",
    unit: "blankets", goal: 80, fulfilled: 80, estimatedCost: 40000, priority: "Low", status: "Fulfilled",
    deadline: "Completed", beneficiaries: 80, createdAt: "2026-04-10",
    updates: [{ date: "2026-05-01", note: "All 80 blankets received and distributed." }],
  },
];

const seedDonations: Donation[] = [
  { id: "don-1", donorId: "u-1", donorName: "You", needId: "need-1", institutionId: "inst-1", amount: 3000, type: "Money", status: "Utilized", date: "2026-06-08" },
  { id: "don-2", donorId: "u-1", donorName: "You", needId: "need-3", institutionId: "inst-3", amount: 12000, type: "Money", status: "Received", date: "2026-06-05" },
  { id: "don-3", donorId: "u-2", donorName: "Anita R.", needId: "need-2", institutionId: "inst-2", amount: 5000, type: "Money", status: "Confirmed", date: "2026-06-09" },
];

const seedEvents: AppEvent[] = [
  { id: "ev-1", institutionId: "inst-1", title: "Annual Sports Day", type: "Education", description: "Volunteer to help run track events.", date: "2026-06-22", time: "9:00 AM", capacity: 30, registered: 18, location: "Sunshine Campus, Bangalore" },
  { id: "ev-2", institutionId: "inst-2", title: "Free Health Camp", type: "Health Camp", description: "Doctors and volunteers needed for senior checkups.", date: "2026-06-25", time: "10:00 AM", capacity: 15, registered: 9, location: "Silver Oaks, Pune" },
  { id: "ev-3", institutionId: "inst-3", title: "Children's Birthday Bash", type: "Birthday", description: "Celebrate birthdays of 12 children born in June.", date: "2026-06-28", time: "4:00 PM", capacity: 20, registered: 14, location: "Hope Foundation, Hyderabad" },
];

const seedApplications: Application[] = [
  { id: "app-1", volunteerId: "u-3", volunteerName: "You", opportunity: "Weekend Teaching", institutionId: "inst-1", status: "Accepted", appliedAt: "2026-05-28" },
  { id: "app-2", volunteerId: "u-3", volunteerName: "You", opportunity: "Health Camp Support", institutionId: "inst-2", status: "Pending", appliedAt: "2026-06-09" },
];

const seedNotifications: Notification[] = [
  { id: "n-1", title: "New need posted", body: "Sunshine Children's Home needs 50 school bags.", date: "2026-06-09", read: false, href: "/needs/need-1" },
  { id: "n-2", title: "Donation utilized", body: "Your ₹3,000 funded 4 school bag sets.", date: "2026-06-08", read: false, href: "/app/donor/donations" },
  { id: "n-3", title: "Volunteer application accepted", body: "Sunshine accepted your teaching application.", date: "2026-05-30", read: true, href: "/app/volunteer/applications" },
];

const seedFeed: FeedPost[] = [
  { id: "f-1", author: "Sunshine Children's Home", authorRole: "Institution", body: "All 35 of our 50 school bags are in — 15 to go before the term starts!", date: "2026-06-09", likes: 42 },
  { id: "f-2", author: "Anita R.", authorRole: "Donor", body: "Funded my third laptop for Hope Foundation today. Watching these kids learn React is everything.", date: "2026-06-07", likes: 88 },
  { id: "f-3", author: "Silver Oaks", authorRole: "Institution", body: "Dr. Patel volunteered the full day at our health camp. 38 residents screened, 6 new diagnoses caught early.", date: "2026-06-05", likes: 121 },
];

const seedReports: ImpactReport[] = [
  { id: "ir-1", needId: "need-4", title: "Winter Blanket Drive — Sunshine", summary: "80 blankets delivered, every resident covered through the coldest weeks of January.", beneficiariesServed: 80, donationsTotal: 40000, outcomes: ["100% goal met in 3 weeks", "Zero cold-related illness reported", "Photo updates shared with all 12 donors"], date: "2026-02-15" },
];

type State = {
  session: Session;
  institutions: Institution[];
  needs: Need[];
  donations: Donation[];
  events: AppEvent[];
  applications: Application[];
  notifications: Notification[];
  feed: FeedPost[];
  reports: ImpactReport[];
  savedNeeds: string[];
  savedInstitutions: string[];
  signIn: (s: Session) => void;
  signOut: () => void;
  setRole: (r: Role) => void;
  createNeed: (n: Omit<Need, "id" | "createdAt" | "updates" | "fulfilled" | "status">) => string;
  donate: (needId: string, amount: number) => void;
  toggleSaveNeed: (id: string) => void;
  toggleSaveInstitution: (id: string) => void;
  markNotificationRead: (id: string) => void;
  createEvent: (e: Omit<AppEvent, "id" | "registered">) => void;
  reset: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      session: null,
      institutions: seedInstitutions,
      needs: seedNeeds,
      donations: seedDonations,
      events: seedEvents,
      applications: seedApplications,
      notifications: seedNotifications,
      feed: seedFeed,
      reports: seedReports,
      savedNeeds: ["need-2"],
      savedInstitutions: ["inst-1"],
      signIn: (s) => set({ session: s }),
      signOut: () => set({ session: null }),
      setRole: (r) =>
        set((st) => ({
          session: st.session
            ? { ...st.session, role: r, institutionId: r === "institution" ? "inst-1" : undefined }
            : { id: "u-1", name: "Demo User", email: "demo@carebridge.org", role: r, institutionId: r === "institution" ? "inst-1" : undefined },
        })),
      createNeed: (n) => {
        const id = `need-${Date.now()}`;
        set((st) => ({
          needs: [
            { ...n, id, fulfilled: 0, status: "Active", createdAt: new Date().toISOString().slice(0, 10), updates: [{ date: new Date().toISOString().slice(0, 10), note: "Need created." }] },
            ...st.needs,
          ],
        }));
        return id;
      },
      donate: (needId, amount) =>
        set((st) => {
          const need = st.needs.find((x) => x.id === needId);
          if (!need) return st;
          const unitCost = need.estimatedCost / need.goal;
          const units = Math.max(1, Math.round(amount / unitCost));
          const newFulfilled = Math.min(need.goal, need.fulfilled + units);
          return {
            needs: st.needs.map((x) =>
              x.id === needId
                ? { ...x, fulfilled: newFulfilled, status: newFulfilled >= x.goal ? "Fulfilled" : "Partially Fulfilled" }
                : x,
            ),
            donations: [
              {
                id: `don-${Date.now()}`,
                donorId: st.session?.id ?? "u-1",
                donorName: st.session?.name ?? "You",
                needId,
                institutionId: need.institutionId,
                amount,
                type: "Money",
                status: "Confirmed",
                date: new Date().toISOString().slice(0, 10),
              },
              ...st.donations,
            ],
            notifications: [
              { id: `n-${Date.now()}`, title: "Donation confirmed", body: `Thank you! ₹${amount.toLocaleString()} for ${need.title}.`, date: new Date().toISOString().slice(0, 10), read: false, href: `/needs/${needId}` },
              ...st.notifications,
            ],
          };
        }),
      toggleSaveNeed: (id) =>
        set((st) => ({ savedNeeds: st.savedNeeds.includes(id) ? st.savedNeeds.filter((x) => x !== id) : [...st.savedNeeds, id] })),
      toggleSaveInstitution: (id) =>
        set((st) => ({ savedInstitutions: st.savedInstitutions.includes(id) ? st.savedInstitutions.filter((x) => x !== id) : [...st.savedInstitutions, id] })),
      markNotificationRead: (id) => set((st) => ({ notifications: st.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      createEvent: (e) => set((st) => ({ events: [{ ...e, id: `ev-${Date.now()}`, registered: 0 }, ...st.events] })),
      reset: () => set({ institutions: seedInstitutions, needs: seedNeeds, donations: seedDonations, events: seedEvents, applications: seedApplications, notifications: seedNotifications, feed: seedFeed, reports: seedReports, savedNeeds: [], savedInstitutions: [], session: null }),
    }),
    { name: "carebridge-store", version: 1 },
  ),
);

export function useSession() {
  return useStore((s) => s.session);
}
