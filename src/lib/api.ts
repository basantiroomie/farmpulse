// Use a different approach to set the API base URL that works in various environments
const getApiBaseUrl = () => {
  // Use window.location to get the current protocol and hostname
  const { protocol, hostname } = window.location;
  
  // For development environments, use the specific port
  return `${protocol}//${hostname}:3001/api`;
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
}

export interface AnimalWithData {
  animal: Animal;
  healthData: HealthData[];
  pregnancyData: PregnancyData;
}

// Fallback data to use when API fails
const fallbackAnimals = [
  { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
  { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" }
];

// API functions
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
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching animal ${animalId}:`, error);
    return null;
  }
};

export const fetchAnimalHealthData = async (animalId: string): Promise<HealthData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/health`);
    
    if (!response.ok) {
      throw new Error(`Error fetching health data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`Error fetching health data for animal ${animalId}:`, error);
    return [];
  }
};

export const fetchAnimalPregnancyData = async (animalId: string): Promise<PregnancyData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/pregnancy`);
    
    if (!response.ok) {
      throw new Error(`Error fetching pregnancy data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching pregnancy data for animal ${animalId}:`, error);
    return null;
  }
};

export const fetchAllAnimalData = async (animalId: string): Promise<AnimalWithData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/all-data`);
    
    if (!response.ok) {
      throw new Error(`Error fetching data for animal ${animalId}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching data for animal ${animalId}:`, error);
    return null;
  }
};
