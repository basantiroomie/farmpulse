import { healthRanges } from "./sampleData";

// Type Definitions
export interface Animal {
  id: string;
  name: string;
  breed: string;
  dob: string;
  gender: string;
  created_at: string;
}

export interface HealthData {
  id: number;
  animal_id: string;
  date: string;
  temperature: number;
  heart_rate: number;
  activity: number;
  status?: "normal" | "warning" | "critical";
  notes?: string;
}

export interface PregnancyData {
  animal_id: string;
  status: "Unknown" | "Confirmed" | "Not Pregnant";
  gestation_days: number;
  expected_due_date: string;
  last_checkup: string;
  fetal_heart_rate: number;
  notes?: string;
}

export interface PregnancyStat {
  id: number;
  animal_id: string;
  date: string;
  temperature: number;
  heart_rate: number;
  fetal_heart_rate: number;
  activity: number;
  notes?: string;
}

export interface AnimalWithData {
  animal: Animal;
  healthData: HealthData[];
  pregnancyData?: PregnancyData;
}

// Mock database - normally this would come from a backend
const ANIMALS: Animal[] = [
  { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "2022-04-10" },
  { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "2021-08-01" },
  { id: "A12347", name: "Max", breed: "Angus", dob: "2023-01-10", gender: "Male", created_at: "2023-02-05" },
  { id: "A12348", name: "Lucy", breed: "Hereford", dob: "2021-11-05", gender: "Female", created_at: "2021-12-01" }
];

const createHealthData = (animalId: string, days: number = 7): HealthData[] => {
  const data: HealthData[] = [];
  const endDate = new Date();
  
  const isPregnant = animalId === "A12346" || animalId === "A12348";
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(endDate.getDate() - (days - i - 1));
    
    // Generate data based on animal ID to create different patterns
    let temperature = 38.5; // Normal baseline
    let heartRate = 70; // Normal baseline
    let activity = 7; // Normal baseline
    
    // Create some variation based on animal ID
    switch(animalId) {
      case "A12345": // Daisy: normal, healthy
        temperature += Math.random() * 0.4;
        heartRate += Math.floor(Math.random() * 10);
        activity += Math.random() * 1.5;
        break;
      case "A12346": // Bella: pregnant, slightly elevated temperature
        temperature += Math.random() * 0.7 + 0.6;
        heartRate += Math.floor(Math.random() * 15 + 5);
        activity -= Math.random() * 2;
        break;
      case "A12347": // Max: high activity
        temperature += Math.random() * 0.3;
        heartRate += Math.floor(Math.random() * 8);
        activity += Math.random() * 2 + 1;
        break;
      case "A12348": // Lucy: pregnant, critical condition on last day
        if (i === days - 1) {
          temperature += Math.random() * 0.3 + 1.8; // Critical temperature
          heartRate += Math.floor(Math.random() * 5 + 20); // Critical heart rate
          activity -= Math.random() * 4 + 2; // Critical low activity
        } else {
          temperature += Math.random() * 0.7 + 0.3;
          heartRate += Math.floor(Math.random() * 12 + 3);
          activity -= Math.random() * 1.5;
        }
        break;
    }
    
    // Round and constrain values
    temperature = parseFloat(temperature.toFixed(1));
    heartRate = Math.max(60, Math.min(100, Math.floor(heartRate)));
    activity = parseFloat(Math.max(2, Math.min(10, activity)).toFixed(1));
    
    // Add some trends based on day index
    if (i > days - 3 && animalId === "A12346") {
      // Bella trending worse in last 2 days (except last day gets better)
      if (i === days - 2) {
        temperature += 0.7;
        heartRate += 8;
        activity -= 2;
      } else if (i === days - 1) {
        temperature -= 0.5;
        heartRate -= 5;
        activity += 1;
      }
    }
    
    // Determine status
    let status: "normal" | "warning" | "critical" = "normal";
    if (
      temperature > healthRanges.temperature.warning.max ||
      heartRate > healthRanges.heartRate.warning.max ||
      activity < healthRanges.activity.warning.min
    ) {
      status = "critical";
    } else if (
      temperature > healthRanges.temperature.normal.max ||
      heartRate > healthRanges.heartRate.normal.max ||
      activity < healthRanges.activity.normal.min
    ) {
      status = "warning";
    }
    
    // Create health entry
    data.push({
      id: i + 1,
      animal_id: animalId,
      date: date.toISOString().split('T')[0],
      temperature,
      heart_rate: heartRate,
      activity,
      status,
      notes: i === days - 1 && status === "critical" ? "Follow-up examination recommended" : undefined
    });
  }
  
  return data;
};

const createPregnancyData = (animalId: string): PregnancyData | undefined => {
  if (animalId === "A12346") {
    // Bella: Normal pregnancy
    return {
      animal_id: animalId,
      status: "Confirmed",
      gestation_days: 87,
      expected_due_date: "2025-08-15",
      last_checkup: "2025-05-01",
      fetal_heart_rate: 180,
      notes: "Progressing normally"
    };
  } else if (animalId === "A12348") {
    // Lucy: Problematic pregnancy
    return {
      animal_id: animalId,
      status: "Confirmed",
      gestation_days: 112,
      expected_due_date: "2025-07-05",
      last_checkup: "2025-05-04",
      fetal_heart_rate: 210, // Concerning high rate
      notes: "Fetal heart rate elevated, monitor closely"
    };
  }
  
  return undefined;
};

const createPregnancyStats = (animalId: string, days: number = 14): PregnancyStat[] => {
  if (animalId !== "A12346" && animalId !== "A12348") return [];
  
  const data: PregnancyStat[] = [];
  const endDate = new Date();
  const isLucy = animalId === "A12348"; // Lucy has issues
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(endDate.getDate() - (days - i - 1));
    
    // Base values
    let fetalHeartRate = isLucy ? 190 : 175;
    let temperature = isLucy ? 39.2 : 38.7;
    let heartRate = isLucy ? 75 : 72;
    let activity = isLucy ? 5.5 : 6.5;
    
    // Add some variation
    fetalHeartRate += Math.floor(Math.random() * 20 - 10);
    temperature += (Math.random() * 0.6 - 0.3);
    heartRate += Math.floor(Math.random() * 10 - 5);
    activity += (Math.random() * 1 - 0.5);
    
    // Lucy's concerning trend in last days
    if (isLucy && i > days - 4) {
      fetalHeartRate += Math.floor((i - (days - 4)) * 8); // Increasing trend
      temperature += (i - (days - 4)) * 0.2;
      activity -= (i - (days - 4)) * 0.5;
    }
    
    // Round values
    temperature = parseFloat(temperature.toFixed(1));
    fetalHeartRate = Math.max(160, Math.min(220, Math.floor(fetalHeartRate)));
    heartRate = Math.max(60, Math.min(90, Math.floor(heartRate)));
    activity = parseFloat(Math.max(3, Math.min(8, activity)).toFixed(1));
    
    // Notes for concerning values
    let notes;
    if (fetalHeartRate > 200) {
      notes = "Fetal tachycardia observed - consult veterinarian";
    } else if (temperature > 39.5) {
      notes = "Elevated temperature - monitor closely";
    } else if (activity < 4) {
      notes = "Decreased activity - possible discomfort";
    }
    
    data.push({
      id: i + 1,
      animal_id: animalId,
      date: date.toISOString().split('T')[0],
      temperature,
      heart_rate: heartRate,
      fetal_heart_rate: fetalHeartRate,
      activity,
      notes
    });
  }
  
  return data;
};

// API Functions
export const fetchAnimals = async (): Promise<Animal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return ANIMALS;
};

export const fetchAnimalData = async (animalId: string): Promise<Animal | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return ANIMALS.find(animal => animal.id === animalId) || null;
};

export const fetchAnimalHealthData = async (animalId: string): Promise<HealthData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return createHealthData(animalId);
};

export const fetchAnimalPregnancyData = async (animalId: string): Promise<PregnancyData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = createPregnancyData(animalId);
  return data || null;
};

export const fetchAnimalPregnancyStats = async (animalId: string): Promise<PregnancyStat[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return createPregnancyStats(animalId);
};

export const fetchAllAnimalData = async (animalId: string): Promise<AnimalWithData | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const animal = ANIMALS.find(a => a.id === animalId);
    if (!animal) return null;
    
    const healthData = createHealthData(animalId);
    const pregnancyData = createPregnancyData(animalId);
    
    return {
      animal,
      healthData,
      pregnancyData
    };
  } catch (error) {
    console.error("Error fetching all animal data:", error);
    return null;
  }
};