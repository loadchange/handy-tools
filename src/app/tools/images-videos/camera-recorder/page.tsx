'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Slider } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import {
  Video,
  Settings,
  Circle,
  Square,
  Pause,
  Play,
  Download,
  Trash2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';

interface RecorderConfig {
  videoResolution: string;
  videoQuality: string;
  frameRate: number;
  timeLimit: number;
  audioEnabled: boolean;
  showCountdown: boolean;
  autoDownload: boolean;
}

interface Recording {
  id: string;
  url: string;
  blob: Blob;
  timestamp: Date;
  duration: number;
  size: number;
}

const RESOLUTIONS = [
  { value: '1080p', label: '1080p (FHD)', width: 1920, height: 1080 },
  { value: '720p', label: '720p (HD)', width: 1280, height: 720 },
  { value: '480p', label: '480p (SD)', width: 854, height: 480 },
  { value: '360p', label: '360p (Low)', width: 640, height: 360 }
];

const TIME_LIMITS = [
  { value: 0, label: 'No Limit' },
  { value: 30, label: '30s' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' }
];

export default function CameraRecorderPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [config, setConfig] = useState<RecorderConfig>({
    videoResolution: '720p',
    videoQuality: 'medium',
    frameRate: 30,
    timeLimit: 0,
    audioEnabled: true,
    showCountdown: true,
    autoDownload: false
  });

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const resolution = RESOLUTIONS.find(r => r.value === config.videoResolution);

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: resolution?.width },
          height: { ideal: resolution?.height },
          frameRate: { ideal: config.frameRate }
        },
        audio: config.audioEnabled
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(`Cannot access camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [config.videoResolution, config.frameRate, config.audioEnabled]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startCamera]);

  const downloadRecording = useCallback((recording: Recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `recording-${recording.id}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  useEffect(() => {
    // Auto stop recording
    if (config.timeLimit > 0 && recordingTime >= config.timeLimit && isRecording) {
      stopRecording();
    }
  }, [recordingTime, config.timeLimit, isRecording, stopRecording]);

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9'
      };

      // Try different MIME types
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          delete options.mimeType; // Use default
        }
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const newRecording: Recording = {
          id: `rec-${Date.now()}`,
          url,
          blob,
          timestamp: new Date(),
          duration: recordingTime,
          size: blob.size
        };

        setRecordings(prev => [newRecording, ...prev]);

        if (config.autoDownload) {
          downloadRecording(newRecording);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError(`Recording failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const deleteRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      URL.revokeObjectURL(recording.url);
      setRecordings(prev => prev.filter(r => r.id !== id));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Camera Recorder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Record video using browser camera, supporting multiple resolutions and options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview and Control */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card className="relative overflow-hidden bg-black border-0">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge variant={isRecording ? "destructive" : "secondary"} className="animate-in fade-in">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Camera Preview'}
                </Badge>
                {isRecording && (
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {formatTime(recordingTime)}
                  </Badge>
                )}
              </div>

              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <div className="bg-black/50 text-white text-xs px-2 py-1 rounded flex flex-col items-end gap-1">
                  <span>Resolution: {config.videoResolution}</span>
                  <span>Frame Rate: {config.frameRate}fps</span>
                  <span>Audio: {config.audioEnabled ? 'On' : 'Off'}</span>
                </div>
              </div>

              <CardContent className="p-0 aspect-video relative group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
                    <div className="space-y-2">
                      <Settings className="h-8 w-8 mx-auto text-red-500" />
                      <p>{error}</p>
                      <Button variant="outline" onClick={startCamera} className="mt-2 text-black">
                        Retry Camera
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    {config.timeLimit > 0 && (
                      <span className="text-xs">
                        Remaining: {formatTime(config.timeLimit - recordingTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {!isRecording ? (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full h-12 w-12 hover:scale-110 transition-transform"
                        onClick={startRecording}
                        disabled={!!error}
                      >
                        <Circle className="h-6 w-6 fill-current" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full"
                          onClick={isPaused ? resumeRecording : pauseRecording}
                        >
                          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full"
                          onClick={stopRecording}
                        >
                          <Square className="h-5 w-5 fill-current" />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {config.timeLimit > 0 && isRecording && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
                    <div
                      className="h-full bg-red-500 transition-all duration-1000 linear"
                      style={{ width: `${(recordingTime / config.timeLimit) * 100}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History */}
            {recordings.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recording History ({recordings.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setRecordings([])}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {recordings.map((recording) => (
                        <div
                          key={recording.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-black rounded flex items-center justify-center text-white text-xs">
                              <Video className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">Recording {recording.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {recording.timestamp.toLocaleTimeString()} • {formatTime(recording.duration)} • {formatSize(recording.size)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => downloadRecording(recording)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteRecording(recording.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Config */}
          <div className="space-y-6">
            {/* Config Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Recording Config
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Video Resolution</Label>
                  <Select
                    value={config.videoResolution}
                    onValueChange={(val) => setConfig(prev => ({ ...prev, videoResolution: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOLUTIONS.map(res => (
                        <SelectItem key={res.value} value={res.value}>
                          {res.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Video Quality</Label>
                  <Select
                    value={config.videoQuality}
                    onValueChange={(val) => setConfig(prev => ({ ...prev, videoQuality: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frame Rate (fps)</Label>
                  <Slider
                    value={[config.frameRate]}
                    onValueChange={(val) => setConfig(prev => ({ ...prev, frameRate: val[0] }))}
                    min={15}
                    max={60}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15</span>
                    <span>{config.frameRate}</span>
                    <span>60</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time Limit</Label>
                  <Select
                    value={config.timeLimit.toString()}
                    onValueChange={(val) => setConfig(prev => ({ ...prev, timeLimit: Number(val) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_LIMITS.map(limit => (
                        <SelectItem key={limit.value} value={limit.value.toString()}>
                          {limit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Audio</Label>
                    <Switch
                      checked={config.audioEnabled}
                      onCheckedChange={(val) => setConfig(prev => ({ ...prev, audioEnabled: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Show Countdown</Label>
                    <Switch
                      checked={config.showCountdown}
                      onCheckedChange={(val) => setConfig(prev => ({ ...prev, showCountdown: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto Download</Label>
                    <Switch
                      checked={config.autoDownload}
                      onCheckedChange={(val) => setConfig(prev => ({ ...prev, autoDownload: val }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  User Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Start Recording:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Click red button to start</li>
                    <li>• Can pause and resume</li>
                    <li>• Stops automatically at time limit</li>
                  </ul>
                </div>
                <div>
                  <strong>Recording Quality:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Higher resolution takes more space</li>
                    <li>• 30fps suitable for most scenes</li>
                    <li>• 60fps suitable for fast motion</li>
                  </ul>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Requires HTTPS for camera access</li>
                    <li>• Grant camera permission on first use</li>
                    <li>• Records in WebM format</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Tech Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Tech Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Video Codec:</span>
                  <span className="font-mono text-foreground">VP9 / VP8</span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Codec:</span>
                  <span className="font-mono text-foreground">Opus</span>
                </div>
                <div className="flex justify-between">
                  <span>Container:</span>
                  <span className="font-mono text-foreground">WebM</span>
                </div>
                <div className="flex justify-between">
                  <span>Browser Support:</span>
                  <span className="font-mono text-foreground">Modern Browsers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
