"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"

interface AudioPlayerProps {
  file: File | null
}

export default function AudioPlayer({ file }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.load()
      }
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  if (!file) {
    return <p>Please select a file to play.</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Now Playing: {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} />
        <div className="flex items-center space-x-4">
          <Button onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={handleSliderChange} />
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

