
export interface LoginFormData {
  username: string
  password: string
}

export interface Player {
  id: string
  name: string
  position: string
  height: number
  jersey: number
  stats: {
    points: number
    rebounds: number
    assists: number
  }
}

export interface NewPlayerFormData {
  name: string
  position: string
  height: number
  jersey: number
  points: number
  rebounds: number
  assists: number
}

export interface Match {
  id: string
  rival: string
  date: string
  result: string
  isHome: boolean
  stats: {
    pointsFor: number
    pointsAgainst: number
  }
  createdBy: string
}

export interface MatchFormData {
  rival: string
  date: string
  isHome: 'true' | 'false'
  pointsFor: number
  pointsAgainst: number
}


