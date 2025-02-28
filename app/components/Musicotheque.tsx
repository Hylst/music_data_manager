import { useMemo } from "react"

const filteredTracks = useMemo(() => {
  if (!filter) return tracks
  const lowerFilter = filter.toLowerCase()
  return tracks.filter((track) =>
    Object.values(track.tags).some((value) => typeof value === "string" && value.toLowerCase().includes(lowerFilter)),
  )
}, [tracks, filter])

