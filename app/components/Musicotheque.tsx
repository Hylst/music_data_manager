"use client"

import type React from "react"

import { useReducer, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { readID3Tags } from "../utils/fileUtils"
import type { ID3Tags } from "../utils/fileUtils"

interface Track {
  id: string
  file: File
  tags: ID3Tags
}

type State = {
  tracks: Track[]
  currentTrackId: string | null
}

type Action =
  | { type: "SET_TRACKS"; payload: Track[] }
  | { type: "UPDATE_TAG"; payload: { trackId: string; field: keyof ID3Tags; value: string } }
  | { type: "TOGGLE_PLAY"; payload: string }

const initialState: State = {
  tracks: [],
  currentTrackId: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.payload,
      }
    case "UPDATE_TAG":
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          track.id === action.payload.trackId
            ? {
                ...track,
                tags: {
                  ...track.tags,
                  [action.payload.field]: action.payload.value,
                },
              }
            : track,
        ),
      }
    case "TOGGLE_PLAY":
      return {
        ...state,
        currentTrackId: state.currentTrackId === action.payload ? null : action.payload,
      }
    default:
      return state
  }
}

export default function Musicotheque() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return

    const newTracks = await Promise.all(
      Array.from(event.target.files).map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        tags: await readID3Tags(file),
      })),
    )
    dispatch({ type: "SET_TRACKS", payload: newTracks })
  }, [])

  const handleTagChange = useCallback((trackId: string, field: keyof ID3Tags, value: string) => {
    dispatch({ type: "UPDATE_TAG", payload: { trackId, field, value } })
  }, [])

  const handleTogglePlay = useCallback((trackId: string) => {
    dispatch({ type: "TOGGLE_PLAY", payload: trackId })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Musicothèque</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="file" accept=".mp3" multiple onChange={handleFileSelect} className="mb-4" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Artiste</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.tracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => handleTogglePlay(track.id)}>
                    {state.currentTrackId === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell>
                  <Input
                    value={track.tags.title}
                    onChange={(e) => handleTagChange(track.id, "title", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={track.tags.artist}
                    onChange={(e) => handleTagChange(track.id, "artist", e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

