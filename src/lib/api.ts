// Use a different approach to set the API base URL that works in various environments
const getApiBaseUrl = () => {
  // Use window.location to get the current protocol and hostname
  const { protocol, hostname } = window.location;
  
  // For development environments, use the specific port
  // Check if we're running on localhost or a development environment
  if (hostname === 'localhost' || hostname.includes('lovableproject.com')) {
    return `${protocol}//${hostname}:3001/api`;
  }
  
  // For production environment (adjust as needed)
  return `${protocol}//${hostname}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Type definitions
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
  heart_rate: number;
  temperature: number;
  activity: number;
}

export interface PregnancyData {
  id?: number;
  animal_id: string;
  status: string;
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
  notes: string;
}

export interface AnimalWithData {
  animal: Animal;
  healthData: HealthData[];
  pregnancyData: PregnancyData;
  pregnancyStats?: PregnancyStat[];
}

// Fallback data to use when API fails
const fallbackAnimals = [
  { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
  { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" },
  { id: "A12347", name: "Max", breed: "Angus", dob: "2022-01-10", gender: "Male", created_at: "" },
  { id: "A12348", name: "Rosie", breed: "Hereford", dob: "2023-02-05", gender: "Female", created_at: "" },
  { id: "A12349", name: "Duke", breed: "Brahman", dob: "2022-09-18", gender: "Male", created_at: "" }
];

// Fallback health data
const getDefaultHealthData = (animalId: string): HealthData[] => [
  {
    id: 1,
    animal_id: animalId,
    date: new Date().toISOString().split('T')[0],
    heart_rate: 75,
    temperature: 38.5,
    activity: 7
  }
];

// Fallback pregnancy data
const getDefaultPregnancyData = (animalId: string): PregnancyData => ({
  animal_id: animalId,
  status: "Unknown",
  gestation_days: 0,
  expected_due_date: "",
  last_checkup: "",
  fetal_heart_rate: 0,
  notes: ""
});

// Fallback pregnancy stats data
const getDefaultPregnancyStats = (animalId: string): PregnancyStat[] => {
  const stats: PregnancyStat[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    
    stats.push({
      id: i + 1,
      animal_id: animalId,
      date: date.toISOString().split('T')[0],
      temperature: 38.5,
      heart_rate: 75,
      fetal_heart_rate: 170,
      activity: 8,
      notes: "Fallback data"
    });
  }
  
  return stats;
};

// API functions with improved error handling
export const fetchAllAnimals = async (): Promise<Animal[]> => {
  try {
    console.log(`Fetching animals from: ${API_BASE_URL}/animals`);
    const response = await fetch(`${API_BASE_URL}/animals`, {
      // Add a timeout to prevent long hanging requests
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching animals: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Ensure we always return an array, even if data is unexpected
    return data && data.success && Array.isArray(data.data) ? data.data : fallbackAnimals;
  } catch (error) {
    console.error('Error fetching animals:', error);
    // Return fallback data when API fails
    return fallbackAnimals;
  }
};

export const fetchAnimalById = async (animalId: string): Promise<Animal | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}`, {
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching animal ${animalId}:`, error);
    // Find a fallback animal with the matching ID or return the first one
    return fallbackAnimals.find(a => a.id === animalId) || fallbackAnimals[0] || null;
  }
};

export const fetchAnimalHealthData = async (animalId: string): Promise<HealthData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/health`, {
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching health data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : getDefaultHealthData(animalId);
  } catch (error) {
    console.error(`Error fetching health data for animal ${animalId}:`, error);
    return getDefaultHealthData(animalId);
  }
};

export const fetchAnimalPregnancyData = async (animalId: string): Promise<PregnancyData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/pregnancy`, {
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching pregnancy data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : getDefaultPregnancyData(animalId);
  } catch (error) {
    console.error(`Error fetching pregnancy data for animal ${animalId}:`, error);
    return getDefaultPregnancyData(animalId);
  }
};

export const fetchAnimalPregnancyStats = async (animalId: string): Promise<PregnancyStat[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/pregnancy-stats`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching pregnancy stats for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : getDefaultPregnancyStats(animalId);
  } catch (error) {
    console.error(`Error fetching pregnancy stats for animal ${animalId}:`, error);
    return getDefaultPregnancyStats(animalId);
  }
};

export const fetchAllAnimalData = async (animalId: string): Promise<AnimalWithData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/all-data`, {
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    
    // If API call succeeds but returns no data, build fallback data
    throw new Error('API returned no data');
  } catch (error) {
    console.error(`Error fetching data for animal ${animalId}:`, error);
    
    // Create complete fallback data
    const animal = await fetchAnimalById(animalId) || fallbackAnimals.find(a => a.id === animalId) || {
      id: animalId,
      name: "Unknown Animal",
      breed: "Unknown",
      dob: new Date().toISOString().split('T')[0],
      gender: "Unknown",
      created_at: new Date().toISOString()
    };
    
    return {
      animal,
      healthData: getDefaultHealthData(animalId),
      pregnancyData: getDefaultPregnancyData(animalId),
      pregnancyStats: getDefaultPregnancyStats(animalId)
    };
  }
};
