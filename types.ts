export type AppScreen = 'home' | 'scan' | 'results' | 'trends' | 'family' | 'settings';

export type AnemiaClassification = 'Normal' | 'Mild' | 'Moderate' | 'Severe';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatar: string;
}

export interface FeatureScores {
  vascularVisibility: number;
  colorimetricIndex: number;
  texturalAnalysis: number;
  spectralReflectance: number;
}

export interface ScanResult {
  id: string;
  userId: string;
  timestamp: number;
  hemoglobin: number;
  classification: AnemiaClassification;
  confidence: number;
  features: FeatureScores;
  imageData?: string;
}

export interface QualityMetrics {
  blur: number;
  lighting: number;
  framing: number;
  overall: 'good' | 'fair' | 'poor';
}