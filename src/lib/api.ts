
const API_BASE_URL = 'http://localhost:3001/api';

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

// API functions
export const fetchAllAnimals = async (): Promise<Animal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals`);
    
    if (!response.ok) {
      throw new Error(`Error fetching animals: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching animals:', error);
    return [];
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
