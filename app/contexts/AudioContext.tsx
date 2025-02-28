"use client"

import type React from "react"
import { createContext, useContext, useRef, useReducer } from "react"

interface AudioState {
  currentTrackId: string | null
  isPlaying: boolean
  progress: number
}

type AudioAction =
  | { type: "PLAY"; trackId: string }
  | { type: "PAUSE" }
  | { type: "STOP" }
  | { type: "SET_PROGRESS"; progress: number }

const initialState: AudioState = {
  currentTrackId: null,
  isPlaying: false,
  progress: 0,
}

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case "PLAY":
      return {
        ...state,
        currentTrackId: action.trackId,
        isPlaying: true,
      }
    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      }
    case "STOP":
      return {
        ...state,
        currentTrackId: null,
        isPlaying: false,
        progress: 0,
      }
    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.progress,
      }
    default:
      return state
  }
}

interface AudioContextType {
  state: AudioState
  dispatch: React.Dispatch<AudioAction>
  audioRef: React.RefObject<HTMLAudioElement>
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState)
  const audioRef = useRef<HTMLAudioElement>(null)

  return <AudioContext.Provider value={{ state, dispatch, audioRef }}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

