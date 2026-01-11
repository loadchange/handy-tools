'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import {
  Clock,
  MapPin,
  Car,
  Plane,
  Train,
  Ship,
  Calculator,
  Copy,
  RefreshCw,
  Navigation,
  Timer
} from 'lucide-react';

interface RouteInfo {
  name: string;
  distance: number;
  duration: number;
  speed: number;
}

interface CalculationResult {
  estimatedTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  speed: number;
  departureTime?: string;
}

const COMMON_ROUTES: RouteInfo[] = [
  { name: 'City Commute', distance: 15, duration: 30, speed: 30 },
  { name: 'Intercity Rail', distance: 300, duration: 120, speed: 240 },
  { name: 'Domestic Flight', distance: 1000, duration: 120, speed: 500 },
  { name: 'Road Trip', distance: 500, duration: 360, speed: 83 },
  { name: 'Walking', distance: 2, duration: 24, speed: 5 },
  { name: 'Cycling', distance: 10, duration: 30, speed: 20 }
];

const TRANSPORT_MODES = [
  { value: 'car', name: 'Car', icon: Car, avgSpeed: 60 },
  { value: 'plane', name: 'Plane', icon: Plane, avgSpeed: 800 },
  { value: 'train', name: 'Train', icon: Train, avgSpeed: 120 },
  { value: 'ship', name: 'Ship', icon: Ship, avgSpeed: 40 },
  { value: 'walking', name: 'Walking', icon: MapPin, avgSpeed: 5 },
  { value: 'bike', name: 'Bike', icon: MapPin, avgSpeed: 20 }
];

export default function EtaCalculatorPage() {
  const [activeTab, setActiveTab] = useState('distance');
  const [transportMode, setTransportMode] = useState('car');

  // Distance and Time Calculation
  const [distance, setDistance] = useState('100');
  const [speed, setSpeed] = useState('60');
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);

  // Route Planning
  const [departureTime, setDepartureTime] = useState('');
  const [routeDistance, setRouteDistance] = useState('200');
  const [routeResult, setRouteResult] = useState<CalculationResult | null>(null);

  // Speed Calculation
  const [travelDistance, setTravelDistance] = useState('100');
  const [travelTime, setTravelTime] = useState('2');
  const [speedResult, setSpeedResult] = useState<CalculationResult | null>(null);

  const calculateDistanceTime = useCallback(() => {
    const dist = parseFloat(distance) || 0;
    const spd = parseFloat(speed) || 1;
    const duration = (dist / spd) * 60; // Minutes
    const now = new Date();
    const arrival = new Date(now.getTime() + duration * 60000);

    setCurrentResult({
      estimatedTime: formatDuration(duration),
      arrivalTime: arrival.toLocaleString('en-US'),
      duration: formatDuration(duration),
      distance: dist,
      speed: spd
    });
  }, [distance, speed]);

  const calculateRoute = useCallback(() => {
    const dist = parseFloat(routeDistance) || 0;
    const mode = TRANSPORT_MODES.find(m => m.value === transportMode);
    const spd = mode ? mode.avgSpeed : 60;
    const duration = (dist / spd) * 60;

    let arrivalTime = '';
    if (departureTime) {
      const departure = new Date(departureTime);
      const arrival = new Date(departure.getTime() + duration * 60000);
      arrivalTime = arrival.toLocaleString('en-US');
    }

    setRouteResult({
      estimatedTime: formatDuration(duration),
      arrivalTime,
      duration: formatDuration(duration),
      distance: dist,
      speed: spd,
      departureTime: departureTime
    });
  }, [routeDistance, transportMode, departureTime]);

  const calculateSpeed = useCallback(() => {
    const dist = parseFloat(travelDistance) || 0;
    const time = parseFloat(travelTime) || 1;
    const spd = dist / time;

    setSpeedResult({
      estimatedTime: formatDuration(time * 60),
      arrivalTime: '',
      duration: formatDuration(time * 60),
      distance: dist,
      speed: spd
    });
  }, [travelDistance, travelTime]);

  useEffect(() => {
    calculateDistanceTime();
  }, [calculateDistanceTime]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  useEffect(() => {
    calculateSpeed();
  }, [calculateSpeed]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const loadQuickRoute = (route: RouteInfo) => {
    setDistance(route.distance.toString());
    setSpeed(route.speed.toString());
    setRouteDistance(route.distance.toString());
    setTravelDistance(route.distance.toString());
    setTravelTime((route.duration / 60).toString());
  };

  const loadCurrentTime = () => {
    const now = new Date();
    // Use local time for input
    const timeString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setDepartureTime(timeString);
  };

  const clearAll = () => {
    setDistance('100');
    setSpeed('60');
    setRouteDistance('200');
    setDepartureTime('');
    setTravelDistance('100');
    setTravelTime('2');
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatSpeed = (speed: number): string => {
    return `${speed.toFixed(1)} km/h`;
  };

  const getTransportIcon = (mode: string) => {
    const transport = TRANSPORT_MODES.find(m => m.value === mode);
    if (transport) {
      const IconComponent = transport.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <Car className="h-4 w-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ETA Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate Estimated Time of Arrival (ETA), supporting various transport modes and route planning.
          </p>
        </div>

        {/* Quick Route Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Common Routes
            </CardTitle>
            <CardDescription>
              Select a common route for quick calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {COMMON_ROUTES.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => loadQuickRoute(route)}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                >
                  <span className="text-sm font-medium">{route.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {route.distance}km / {formatDuration(route.duration)}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="distance">Distance & Time</TabsTrigger>
            <TabsTrigger value="route">Route Planning</TabsTrigger>
            <TabsTrigger value="speed">Speed Calc</TabsTrigger>
          </TabsList>

          <TabsContent value="distance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Distance & Time
                </CardTitle>
                <CardDescription>
                  Calculate arrival time based on distance and speed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="Enter distance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speed">Speed (km/h)</Label>
                    <Input
                      id="speed"
                      type="number"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      placeholder="Enter speed"
                    />
                  </div>
                </div>

                {currentResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Estimated Arrival Time</span>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {currentResult.estimatedTime}
                      </div>
                      <div className="space-y-2">
                        <p className="text-primary/80">
                          {currentResult.arrivalTime}
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                          <span>Distance: {currentResult.distance} km</span>
                          <span>Speed: {formatSpeed(currentResult.speed)}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(currentResult.arrivalTime)}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Time
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="route" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Planning
                </CardTitle>
                <CardDescription>
                  Plan route and calculate arrival
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure Time</Label>
                    <Input
                      id="departureTime"
                      type="datetime-local"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      placeholder="Select departure time"
                    />
                    <Button
                      variant="outline"
                      onClick={loadCurrentTime}
                      className="w-full"
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Use Current Time
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routeDistance">Route Distance (km)</Label>
                    <Input
                      id="routeDistance"
                      type="number"
                      value={routeDistance}
                      onChange={(e) => setRouteDistance(e.target.value)}
                      placeholder="Enter route distance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportMode">Transport Mode</Label>
                    <Select value={transportMode} onValueChange={setTransportMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSPORT_MODES.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            <div className="flex items-center gap-2">
                              {getTransportIcon(mode.value)}
                              <span>{mode.name}</span>
                              <span className="text-muted-foreground text-sm">
                                ({mode.avgSpeed} km/h)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Route Overview */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransportIcon(transportMode)}
                      <span className="font-medium">Route Overview</span>
                    </div>
                    <Badge variant="outline">
                      {routeDistance} km
                    </Badge>
                  </div>
                </div>

                {routeResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <Navigation className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Estimated Arrival</span>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {routeResult.estimatedTime}
                      </div>
                      <div className="space-y-2">
                        {routeResult.arrivalTime && (
                          <p className="text-primary/80">
                            {routeResult.arrivalTime}
                          </p>
                        )}
                        {routeResult.departureTime && (
                          <p className="text-sm text-muted-foreground">
                            Depart: {new Date(routeResult.departureTime).toLocaleString('en-US')}
                          </p>
                        )}
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                          <span>Distance: {routeResult.distance} km</span>
                          <span>Speed: {formatSpeed(routeResult.speed)}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(routeResult.arrivalTime || routeResult.estimatedTime)}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy ETA
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Speed Calculation
                </CardTitle>
                <CardDescription>
                  Calculate average speed from distance and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelDistance">Travel Distance (km)</Label>
                    <Input
                      id="travelDistance"
                      type="number"
                      value={travelDistance}
                      onChange={(e) => setTravelDistance(e.target.value)}
                      placeholder="Enter travel distance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelTime">Travel Time (hours)</Label>
                    <Input
                      id="travelTime"
                      type="number"
                      step="0.1"
                      value={travelTime}
                      onChange={(e) => setTravelTime(e.target.value)}
                      placeholder="Enter travel time"
                    />
                  </div>
                </div>

                {speedResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        {getTransportIcon(transportMode)}
                        <span className="font-semibold text-primary">Average Speed</span>
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        {formatSpeed(speedResult.speed)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-primary/80">
                          Trip {speedResult.estimatedTime}
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                          <span>Distance: {speedResult.distance} km</span>
                          <span>Time: {speedResult.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="text-primary">
                          <Select value={transportMode} onValueChange={setTransportMode}>
                            <SelectTrigger className="w-auto h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TRANSPORT_MODES.map((mode) => (
                                <SelectItem key={mode.value} value={mode.value}>
                                  <div className="flex items-center gap-2">
                                    {getTransportIcon(mode.value)}
                                    <span>{mode.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Badge>
                        <span className="text-sm text-primary">
                          Compare: {formatSpeed(speedResult.speed)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(formatSpeed(speedResult.speed))}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Speed
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">🚗 Speed References</h4>
                <div className="text-muted-foreground space-y-1">
                  <div>• Walking: 4-6 km/h</div>
                  <div>• Cycling: 15-20 km/h</div>
                  <div>• Car: 60-100 km/h</div>
                  <div>• High-speed Rail: 200-350 km/h</div>
                  <div>• Plane: 800-900 km/h</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">📏 Precision</h4>
                <div className="text-muted-foreground space-y-1">
                  <div>• Speed is average</div>
                  <div>• Traffic not considered</div>
                  <div>• Rest time not included</div>
                  <div>• Actual time may vary</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🕐 Time Format</h4>
                <div className="text-muted-foreground space-y-1">
                  <div>• 24-hour format</div>
                  <div>• Supports local timezone</div>
                  <div>• Auto rounding</div>
                  <div>• Displays to the minute</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
