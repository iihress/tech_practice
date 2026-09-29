export type UserRole = 'ADMIN' | 'COORDINATOR' | 'VOLUNTEER'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  createdAt: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface TaskComment {
  _id: string
  text: string
  author: User
  createdAt: string
}

export interface Task {
  _id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignees: User[]
  author: User
  mission: string | null
  tags: string[]
  location: string
  maxAssignees: number | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
  comments: TaskComment[]
}

export type MissionStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED'

export interface Mission {
  _id: string
  name: string
  description: string
  status: MissionStatus
  budget: number | null
  collected: number
  members: User[]
  applicants?: User[]
  location: string
  photo?: string
  createdAt: string
}

export interface DashboardStats {
  totalVolunteers: number
  activeTasks: number
  completedMissions: number
  activeMissions: number
  tasksByStatus: Record<TaskStatus, number>
  recentTasks: Task[]
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  teamId?: string | null
}

export interface KanbanBoard {
  TODO: Task[]
  IN_PROGRESS: Task[]
  REVIEW: Task[]
  DONE: Task[]
}
