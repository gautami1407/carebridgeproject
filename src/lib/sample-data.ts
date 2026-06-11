import type { Need } from "@/components/site/NeedCard";

export const sampleNeeds: Need[] = [
  {
    title: "50 School Bags & Supplies",
    institution: "Sunshine Children's Home",
    location: "Bangalore, KA",
    category: "Education",
    urgency: "High",
    fulfilled: 35,
    goal: 50,
    unit: "bags",
    deadline: "5 days left",
    impact: "Helps 50 children start the new school year with dignity and the tools to learn.",
  },
  {
    title: "Monthly Diabetes Medication",
    institution: "Silver Oaks Elderly Care",
    location: "Pune, MH",
    category: "Medical",
    urgency: "Critical",
    fulfilled: 12,
    goal: 20,
    unit: "kits",
    deadline: "2 days left",
    impact: "Insulin and glucose kits for 20 elderly residents managing chronic diabetes.",
  },
  {
    title: "Digital Learning Lab",
    institution: "Hope Foundation School",
    location: "Hyderabad, TS",
    category: "Education",
    urgency: "Medium",
    fulfilled: 8,
    goal: 20,
    unit: "laptops",
    deadline: "12 days left",
    impact: "Opens up coding, design and vocational training for teenagers preparing for college.",
  },
  {
    title: "Winter Blankets & Warm Clothes",
    institution: "Grace Old Age Home",
    location: "Delhi, DL",
    category: "Clothing",
    urgency: "High",
    fulfilled: 42,
    goal: 80,
    unit: "blankets",
    deadline: "8 days left",
    impact: "Keeps 80 elderly residents warm through the harsh North Indian winter.",
  },
  {
    title: "Nutritious Meals — November",
    institution: "Anand Bal Sadan",
    location: "Mumbai, MH",
    category: "Food",
    urgency: "High",
    fulfilled: 1820,
    goal: 3000,
    unit: "meals",
    deadline: "Ongoing",
    impact: "Three balanced meals a day for 100 children for the full month.",
  },
  {
    title: "Wheelchair Replacements",
    institution: "Karuna Elder Trust",
    location: "Chennai, TN",
    category: "Medical",
    urgency: "Medium",
    fulfilled: 4,
    goal: 10,
    unit: "wheelchairs",
    deadline: "20 days left",
    impact: "Restores mobility and independence for 10 residents with limited mobility.",
  },
];

export type Institution = {
  name: string;
  type: "Orphanage" | "Old-Age Home";
  location: string;
  residents: number;
  needs: number;
  image: string;
  blurb: string;
};

import inst1 from "@/assets/institution-1.jpg";
import inst2 from "@/assets/institution-2.jpg";
import inst3 from "@/assets/institution-3.jpg";

export const sampleInstitutions: Institution[] = [
  {
    name: "Sunshine Children's Home",
    type: "Orphanage",
    location: "Bangalore, Karnataka",
    residents: 64,
    needs: 3,
    image: inst1,
    blurb: "Home and school to 64 children, registered since 2008.",
  },
  {
    name: "Silver Oaks Elderly Care",
    type: "Old-Age Home",
    location: "Pune, Maharashtra",
    residents: 38,
    needs: 2,
    image: inst2,
    blurb: "Long-term care and companionship for 38 senior residents.",
  },
  {
    name: "Hope Foundation School",
    type: "Orphanage",
    location: "Hyderabad, Telangana",
    residents: 92,
    needs: 4,
    image: inst3,
    blurb: "Education-focused home for 92 children, K–12.",
  },
];
