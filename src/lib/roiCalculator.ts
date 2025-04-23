
// ROI calculation parameters
export interface ROIParameters {
  herdSize: number;
  averageAnimalValue: number;
  diseaseIncidenceRate: number; // percentage (0-100)
  mortalityRate: number; // percentage (0-100)
  vetCostPerVisit: number;
  annualVetVisits: number;
  labTestCost: number;
  annualLabTests: number;
  laborCostPerHour: number;
  dailyMonitoringHours: number;
  treatmentCostPerCase: number;
}

// ROI calculation results
export interface ROIResults {
  annualSavings: number;
  fiveYearSavings: number;
  paybackPeriodMonths: number;
  diseasePrevention: number;
  mortalityReduction: number;
  laborSavings: number;
  vetSavings: number;
  roi: number; // Return on Investment (percentage)
}

// Default/initial values for ROI calculator
export const defaultROIParameters: ROIParameters = {
  herdSize: 100,
  averageAnimalValue: 1200,
  diseaseIncidenceRate: 15,
  mortalityRate: 3,
  vetCostPerVisit: 120,
  annualVetVisits: 12,
  labTestCost: 75,
  annualLabTests: 20,
  laborCostPerHour: 18,
  dailyMonitoringHours: 2,
  treatmentCostPerCase: 200
};

// Constants for ROI calculation
const SYSTEM_COST = 15000; // Fixed system cost
const ANNUAL_SUBSCRIPTION = 2400; // Annual maintenance/subscription
const DISEASE_REDUCTION_FACTOR = 0.4; // 40% reduction in disease with the system
const MORTALITY_REDUCTION_FACTOR = 0.5; // 50% reduction in mortality with the system
const VET_VISIT_REDUCTION_FACTOR = 0.3; // 30% reduction in vet visits
const LAB_TEST_REDUCTION_FACTOR = 0.25; // 25% reduction in lab tests
const LABOR_REDUCTION_FACTOR = 0.6; // 60% reduction in monitoring labor

// Calculate ROI based on farm parameters
export const calculateROI = (params: ROIParameters): ROIResults => {
  // Calculate disease impact savings
  const annualCasesWithoutSystem = params.herdSize * (params.diseaseIncidenceRate / 100);
  const annualCasesWithSystem = annualCasesWithoutSystem * (1 - DISEASE_REDUCTION_FACTOR);
  const caseReduction = annualCasesWithoutSystem - annualCasesWithSystem;
  const diseasePrevention = caseReduction * params.treatmentCostPerCase;
  
  // Calculate mortality savings
  const annualMortalitiesWithoutSystem = params.herdSize * (params.mortalityRate / 100);
  const annualMortalitiesWithSystem = annualMortalitiesWithoutSystem * (1 - MORTALITY_REDUCTION_FACTOR);
  const mortalityReduction = (annualMortalitiesWithoutSystem - annualMortalitiesWithSystem) * params.averageAnimalValue;
  
  // Calculate vet and lab cost savings
  const vetCostWithoutSystem = params.vetCostPerVisit * params.annualVetVisits;
  const vetCostWithSystem = vetCostWithoutSystem * (1 - VET_VISIT_REDUCTION_FACTOR);
  const vetSavings = vetCostWithoutSystem - vetCostWithSystem;
  
  const labCostWithoutSystem = params.labTestCost * params.annualLabTests;
  const labCostWithSystem = labCostWithoutSystem * (1 - LAB_TEST_REDUCTION_FACTOR);
  const labSavings = labCostWithoutSystem - labCostWithSystem;
  
  // Calculate labor savings
  const annualLaborHoursWithoutSystem = params.dailyMonitoringHours * 365;
  const annualLaborHoursWithSystem = annualLaborHoursWithoutSystem * (1 - LABOR_REDUCTION_FACTOR);
  const laborHoursSaved = annualLaborHoursWithoutSystem - annualLaborHoursWithSystem;
  const laborSavings = laborHoursSaved * params.laborCostPerHour;
  
  // Calculate total annual savings
  const annualSavings = diseasePrevention + mortalityReduction + vetSavings + labSavings + laborSavings - ANNUAL_SUBSCRIPTION;
  
  // Calculate ROI metrics
  const fiveYearSavings = annualSavings * 5 - SYSTEM_COST;
  const paybackPeriodMonths = (SYSTEM_COST / annualSavings) * 12;
  const roi = (annualSavings / (SYSTEM_COST + ANNUAL_SUBSCRIPTION)) * 100;
  
  return {
    annualSavings,
    fiveYearSavings,
    paybackPeriodMonths,
    diseasePrevention,
    mortalityReduction,
    laborSavings,
    vetSavings: vetSavings + labSavings,
    roi
  };
};
