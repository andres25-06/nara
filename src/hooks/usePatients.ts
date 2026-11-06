import { useState, useMemo } from 'react'
import type { Patient, Appointment, PsychologicalStats } from '@/types'

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pac-1',
    fullName: 'Laura Méndez Gómez',
    email: 'laura.mendez@email.com',
    phone: '+57 310 456 7890',
    age: 28,
    status: 'activo',
    nextSession: '2026-11-06 10:00',
    therapyType: 'Terapia Cognitivo-Conductual',
    notes: 'Seguimiento de manejo de ansiedad laboral y técnicas de respiración.',
  },
  {
    id: 'pac-2',
    fullName: 'Carlos Andrés Ruiz',
    email: 'carlos.ruiz@email.com',
    phone: '+57 315 890 1234',
    age: 35,
    status: 'en_evaluacion',
    nextSession: '2026-11-06 14:30',
    therapyType: 'Psicoterapia Individual',
    notes: 'Primera fase de evaluación diagnóstica y establecimiento de objetivos.',
  },
  {
    id: 'pac-3',
    fullName: 'Valentina Torres',
    email: 'valentina.t@email.com',
    phone: '+57 300 234 5678',
    age: 24,
    status: 'activo',
    nextSession: '2026-11-07 16:00',
    therapyType: 'Mindfulness y Gestión Emocional',
    notes: 'Avance positivo en regulación del sueño y hábitos diarios.',
  },
]

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'cita-1',
    patientId: 'pac-1',
    patientName: 'Laura Méndez Gómez',
    date: '2026-11-06',
    time: '10:00 AM',
    modality: 'online',
    status: 'programada',
    topic: 'Sesión de control - Ansiedad',
  },
  {
    id: 'cita-2',
    patientId: 'pac-2',
    patientName: 'Carlos Andrés Ruiz',
    date: '2026-11-06',
    time: '02:30 PM',
    modality: 'presencial',
    status: 'programada',
    topic: 'Entrevista inicial',
  },
  {
    id: 'cita-3',
    patientId: 'pac-3',
    patientName: 'Valentina Torres',
    date: '2026-11-07',
    time: '04:00 PM',
    modality: 'online',
    status: 'programada',
    topic: 'Seguimiento quincenal',
  },
]

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.therapyType.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'todos' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [patients, searchQuery, statusFilter])

  const stats: PsychologicalStats = useMemo(() => {
    return {
      activePatients: patients.filter((p) => p.status === 'activo').length,
      sessionsThisWeek: appointments.length,
      upcomingToday: appointments.filter((a) => a.status === 'programada').length,
      satisfactionRate: 98,
    }
  }, [patients, appointments])

  const addPatient = (newPatient: Omit<Patient, 'id'>) => {
    const created: Patient = {
      ...newPatient,
      id: `pac-${Date.now()}`,
    }
    setPatients((prev) => [created, ...prev])
  }

  return {
    patients: filteredPatients,
    allPatients: patients,
    appointments,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    addPatient,
    setAppointments,
  }
}
