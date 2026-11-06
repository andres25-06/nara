export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  status: 'activo' | 'en_evaluacion' | 'alta';
  nextSession?: string;
  therapyType: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  modality: 'presencial' | 'online';
  status: 'programada' | 'completada' | 'cancelada';
  topic: string;
}

export interface PsychologicalStats {
  activePatients: number;
  sessionsThisWeek: number;
  upcomingToday: number;
  satisfactionRate: number;
}
