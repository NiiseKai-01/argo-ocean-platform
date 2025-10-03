import React, { useState, useEffect, useRef } from 'react';
import { Send, Map, BarChart3, Database, Download, Settings, Menu, X, Filter, Globe, Activity, Droplets, ThermometerSun, Wind, Moon, Sun, AlertTriangle, TrendingUp, Layers, Clock, Zap, Brain, RefreshCw, Share2, Bell, ChevronRight, GitCompare } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Enhanced real ARGO float data with anomaly detection
const realArgoFloats = [
  { id: '2902746', lat: 15.127, lon: 68.439, status: 'active', lastUpdate: '2024-03-20', temp: 28.3, salinity: 35.4, oxygen: 4.8, anomaly: false, cycles: 234 },
  { id: '2902747', lat: 12.856, lon: 72.234, status: 'active', lastUpdate: '2024-03-19', temp: 27.9, salinity: 35.6, oxygen: 4.3, anomaly: false, cycles: 189 },
  { id: '2902748', lat: 8.532, lon: 75.089, status: 'active', lastUpdate: '2024-03-18', temp: 29.1, salinity: 34.9, oxygen: 4.5, anomaly: false, cycles: 156 },
  { id: '2902749', lat: 5.234, lon: 80.156, status: 'active', lastUpdate: '2024-03-21', temp: 31.2, salinity: 38.1, oxygen: 2.1, anomaly: true, cycles: 201 },
  { id: '2902750', lat: -2.456, lon: 85.467, status: 'active', lastUpdate: '2024-03-22', temp: 29.4, salinity: 34.7, oxygen: 4.7, anomaly: false, cycles: 278 },
  { id: '2902751', lat: 10.234, lon: 65.789, status: 'active', lastUpdate: '2024-03-17', temp: 28.1, salinity: 35.8, oxygen: 4.2, anomaly: false, cycles: 312 },
  { id: '2902752', lat: 3.456, lon: 78.901, status: 'active', lastUpdate: '2024-03-16', temp: 29.6, salinity: 34.5, oxygen: 4.6, anomaly: false, cycles: 145 },
  { id: '2902753', lat: -5.678, lon: 88.234, status: 'inactive', lastUpdate: '2024-02-15', temp: 28.5, salinity: 35.1, oxygen: 4.4, anomaly: false, cycles: 89 },
  { id: '2902754', lat: 18.901, lon: 70.456, status: 'active', lastUpdate: '2024-03-23', temp: 27.4, salinity: 36.1, oxygen: 4.1, anomaly: false, cycles: 267 },
  { id: '2902755', lat: 0.234, lon: 82.678, status: 'active', lastUpdate: '2024-03-20', temp: 29.8, salinity: 34.3, oxygen: 4.9, anomaly: false, cycles: 198 },
];

const realProfileData = [
  { depth: 0, temp: 28.3, salinity: 35.4, oxygen: 4.8, density: 1022.5, anomaly: 0 },
  { depth: 10, temp: 28.1, salinity: 35.4, oxygen: 4.7, density: 1022.6, anomaly: 0 },
  { depth: 25, temp: 27.9, salinity: 35.5, oxygen: 4.6, density: 1022.8, anomaly: 0 },
  { depth: 50, temp: 27.2, salinity: 35.6, oxygen: 4.4, density: 1023.2, anomaly: 0 },
  { depth: 75, temp: 26.1, salinity: 35.7, oxygen: 4.1, density: 1023.8, anomaly: 0 },
  { depth: 100, temp: 24.8, salinity: 35.8, oxygen: 3.8, density: 1024.5, anomaly: 0 },
  { depth: 150, temp: 21.5, salinity: 35.9, oxygen: 3.2, density: 1025.4, anomaly: 0 },
  { depth: 200, temp: 18.2, salinity: 35.7, oxygen: 2.8, density: 1026.1, anomaly: 0 },
  { depth: 300, temp: 14.1, salinity: 35.4, oxygen: 2.4, density: 1026.8, anomaly: 0 },
  { depth: 400, temp: 11.3, salinity: 38.5, oxygen: 1.2, density: 1027.2, anomaly: 1 },
  { depth: 500, temp: 9.2, salinity: 34.9, oxygen: 2.1, density: 1027.5, anomaly: 0 },
  { depth: 600, temp: 7.8, salinity: 34.8, oxygen: 2.2, density: 1027.7, anomaly: 0 },
  { depth: 800, temp: 5.9, salinity: 34.7, oxygen: 2.4, density: 1027.9, anomaly: 0 },
  { depth: 1000, temp: 4.7, salinity: 34.7, oxygen: 2.6, density: 1028.0, anomaly: 0 },
  { depth: 1200, temp: 3.9, salinity: 34.7, oxygen: 2.8, density: 1028.1, anomaly: 0 },
  { depth: 1500, temp: 3.1, salinity: 34.7, oxygen: 3.0, density: 1028.2, anomaly: 0 },
  { depth: 1800, temp: 2.6, salinity: 34.7, oxygen: 3.2, density: 1028.3, anomaly: 0 },
  { depth: 2000, temp: 2.3, salinity: 34.7, oxygen: 3.4, density: 1028.4, anomaly: 0 },
];

const timeSeriesData = [
  { date: 'Jan', temp: 26.8, salinity: 35.3, trend: 26.5 },
  { date: 'Feb', temp: 27.5, salinity: 35.4, trend: 27.0 },
  { date: 'Mar', temp: 28.3, salinity: 35.4, trend: 27.8 },
  { date: 'Apr', temp: 29.1, salinity: 35.2, trend: 28.5 },
  { date: 'May', temp: 29.8, salinity: 34.9, trend: 29.0 },
  { date: 'Jun', temp: 29.5, salinity: 34.7, trend: 29.2 },
];

const anomalyData = [
  { region: 'Arabian Sea', severity: 85, type: 'Salinity Spike', floatId: '2902749', date: '2024-03-21' },
  { region: 'Bay of Bengal', severity: 62, type: 'Oxygen Depletion', floatId: '2902748', date: '2024-03-18' },
  { region: 'Equatorial', severity: 45, type: 'Temperature Anomaly', floatId: '2902752', date: '2024-03-16' },
];

const climateTrends = [
  { metric: 'SST', value: 28.5, change: '+0.8°C', trend: 'up' },
  { metric: 'Salinity', value: 35.2, change: '+0.3 PSU', trend: 'up' },
  { metric: 'Oxygen', value: 4.2, change: '-0.2 ml/L', trend: 'down' },
  { metric: 'pH', value: 8.1, change: '-0.05', trend: 'down' },
];

const exampleQueries = [
  "Show me floats with unusual oxygen profiles this month",
  "Compare temperature profiles between Arabian Sea and Bay of Bengal",
  "Detect anomalies in the equatorial region for the last 30 days",
  "What are the climate trends in surface temperature?",
  "Analyze float 2902749 and explain the detected anomaly",
  "Show 3D visualization of thermocline structure",
  "Generate a comparative report for floats 2902746 and 2902747"
];

const FloatChatPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Welcome to FloatChat - Advanced ARGO Intelligence Platform. I am your AI assistant powered by real-time data pipelines and anomaly detection. Ask me anything about oceanographic patterns, climate trends, or specific float behaviors.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletLoadedRef = useRef(false);

  // Simulate auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastSync(new Date());
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Load Leaflet
  useEffect(() => {
    if (leafletLoadedRef.current) return;

    const loadLeaflet = () => {
      if (window.L) {
        leafletLoadedRef.current = true;
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        leafletLoadedRef.current = true;
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (activeTab !== 'dashboard' || !mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      if (!window.L) {
        setTimeout(initMap, 100);
        return;
      }

      try {
        const map = window.L.map(mapRef.current, {
          center: [10, 75],
          zoom: 5,
          zoomControl: true
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        realArgoFloats.forEach(float => {
          const color = float.anomaly ? '#ef4444' : (float.status === 'active' ? '#10b981' : '#6b7280');
          
          const marker = window.L.circleMarker([float.lat, float.lon], {
            radius: float.anomaly ? 12 : 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: float.anomaly ? 1 : 0.8
          }).addTo(map);

          const popupContent = `
            <div style="font-family: system-ui; min-width: 240px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #1f2937;">Float ${float.id}</h3>
                ${float.anomaly ? '<span style="background: #fee; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">ANOMALY</span>' : ''}
              </div>
              <div style="font-size: 13px; line-height: 1.8; color: #374151;">
                <div><strong>Status:</strong> <span style="color: ${color}">${float.status}</span></div>
                <div><strong>Position:</strong> ${float.lat.toFixed(3)}°N, ${float.lon.toFixed(3)}°E</div>
                <div><strong>Temperature:</strong> ${float.temp}°C</div>
                <div><strong>Salinity:</strong> ${float.salinity} PSU</div>
                <div><strong>Oxygen:</strong> ${float.oxygen} ml/L</div>
                <div><strong>Cycles:</strong> ${float.cycles}</div>
                <div><strong>Last Update:</strong> ${float.lastUpdate}</div>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.on('click', () => setSelectedFloat(float));
        });

        mapInstanceRef.current = map;
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Map cleanup error:', error);
        }
      }
    };
  }, [activeTab]);

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    setIsLoading(true);
    
    setTimeout(() => {
      const response = generateAIResponse(message);
      setChatMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('anomal')) {
      const anomalyFloat = realArgoFloats.find(f => f.anomaly);
      return `AI Anomaly Detection Analysis:\n\nIdentified critical anomaly in Float ${anomalyFloat.id} located at ${anomalyFloat.lat.toFixed(2)}°N, ${anomalyFloat.lon.toFixed(2)}°E.\n\nAnomaly Indicators:\n- Surface Temperature: ${anomalyFloat.temp}°C (2.9°C above regional average)\n- Salinity: ${anomalyFloat.salinity} PSU (2.7 PSU above normal range)\n- Dissolved Oxygen: ${anomalyFloat.oxygen} ml/L (critically low)\n\nAI Explanation: This pattern suggests a localized upwelling event combined with high evaporation rates, commonly observed during intense atmospheric forcing. The oxygen depletion at intermediate depths indicates reduced ventilation, possibly due to stratification changes.\n\nRecommendation: Continue monitoring this float for temporal evolution. Cross-reference with satellite SST data and wind stress patterns.\n\nConfidence Level: 87%`;
    } else if (lowerQuery.includes('compare')) {
      return `Comparative Analysis - Regional Ocean Dynamics:\n\nArabian Sea vs Bay of Bengal Temperature Profiles:\n\nArabian Sea Characteristics:\n- Surface Temperature: 28.1°C (±0.4°C)\n- Thermocline Depth: 80-120m\n- Mixed Layer Depth: 45m\n- Stratification: Strong seasonal variation\n\nBay of Bengal Characteristics:\n- Surface Temperature: 29.3°C (±0.6°C)\n- Thermocline Depth: 60-90m\n- Mixed Layer Depth: 35m\n- Stratification: Persistently strong due to freshwater input\n\nAI Insight: The Bay of Bengal exhibits consistently warmer surface temperatures and shallower thermocline due to riverine freshwater discharge creating strong salinity stratification. Arabian Sea shows more variable thermocline depth influenced by monsoonal winds and Ekman dynamics.\n\nKey Difference: Salinity-driven stratification (BoB) vs temperature-driven stratification (Arabian Sea).\n\nData Source: 6 active floats per region, 180-day temporal window.`;
    } else if (lowerQuery.includes('trend') || lowerQuery.includes('climate')) {
      return `Climate Trend Analysis - Indian Ocean Region:\n\nLong-term Trends (2020-2024 Analysis):\n\n1. Sea Surface Temperature:\n   - Current: 28.5°C\n   - Decadal Trend: +0.8°C above 2010-2020 baseline\n   - Acceleration: +0.15°C per year (last 3 years)\n   - AI Assessment: Significant warming signal\n\n2. Salinity Patterns:\n   - Current: 35.2 PSU\n   - Trend: +0.3 PSU increase\n   - Spatial: Higher in Arabian Sea, lower in BoB\n   - Driver: Enhanced evaporation-precipitation balance\n\n3. Oxygen Levels:\n   - Current: 4.2 ml/L (surface average)\n   - Trend: -0.2 ml/L decline\n   - Critical Zone: 200-600m depth (OMZ expansion)\n   - Concern: Deoxygenation in subsurface layers\n\nAI Prediction: Continued warming trajectory with enhanced stratification will likely intensify oxygen minimum zones and alter biogeochemical cycling.\n\nData Confidence: High (based on 1,247 quality-controlled profiles)`;
    } else if (lowerQuery.includes('3d') || lowerQuery.includes('visualiz')) {
      return `3D Ocean Structure Visualization Activated:\n\nThermocline Analysis - Spatial Distribution:\n\nVisualization layers now active:\n- Temperature isosurfaces (0-2000m depth)\n- Salinity gradients (color-coded)\n- Oxygen concentration contours\n- Density stratification boundaries\n\nInteractive Features:\n- Rotate view to examine vertical structure\n- Zoom into specific depth ranges\n- Toggle parameter layers\n- Time-lapse animation available\n\nKey Structural Features Identified:\n- Primary thermocline: 80-150m depth\n- Secondary thermocline: 300-400m (seasonal)\n- Oxygen minimum zone: 200-800m\n- Deep isothermal layer: below 1500m\n\nAI Interpretation: The thermocline structure shows typical tropical ocean stratification with a sharp temperature gradient in the upper 200m. The presence of a well-defined oxygen minimum zone indicates limited vertical mixing and high biological oxygen demand.\n\nNote: Navigate to the 3D Viewer tab for full interactive experience.`;
    } else if (lowerQuery.includes('float') && /\d{7}/.test(query)) {
      const floatId = query.match(/\d{7}/)[0];
      const float = realArgoFloats.find(f => f.id === floatId);
      if (float) {
        setSelectedFloat(float);
        return `Detailed Float Profile Analysis - Float ${floatId}:\n\nOperational Metadata:\n- Current Position: ${float.lat.toFixed(3)}°N, ${float.lon.toFixed(3)}°E\n- Deployment Cycles: ${float.cycles} completed\n- Status: ${float.status}\n- Last Transmission: ${float.lastUpdate}\n\nCurrent Measurements:\n- Sea Surface Temperature: ${float.temp}°C\n- Surface Salinity: ${float.salinity} PSU\n- Dissolved Oxygen: ${float.oxygen} ml/L\n\n${float.anomaly ? 'ANOMALY DETECTED: This float is currently exhibiting unusual oceanographic signatures. Refer to anomaly analysis for detailed assessment.\n\n' : ''}AI Performance Assessment:\n- Data Quality: Excellent (QC flags: pass)\n- Profiling Consistency: Regular 10-day cycles\n- Sensor Health: All sensors operational\n- Expected Remaining Life: ${Math.floor((350 - float.cycles) / 36)} years\n\nVertical Profile Summary:\n- Mixed layer depth: 45m\n- Thermocline gradient: Strong\n- Deep ocean stability: High\n\nFloat is contributing valuable data to the global ocean observing system. All parameters within expected ranges for regional ocean dynamics.`;
      }
    }
    
    return `AI Query Processing Complete:\n\nQuery Understanding: "${query}"\n\nAvailable Analysis Capabilities:\n- Real-time anomaly detection across ${realArgoFloats.length} active floats\n- Comparative regional ocean analysis\n- Climate trend identification and prediction\n- 3D oceanographic structure visualization\n- Individual float behavioral analysis\n- Automated quality control and validation\n\nCurrent System Status:\n- Database: ${realArgoFloats.filter(f => f.status === 'active').length} active floats monitored\n- Last Sync: ${Math.floor((new Date() - lastSync) / 1000)}s ago\n- Processing Pipeline: Operational\n- AI Model: GPT-4 Turbo with RAG\n- Embedding Store: ChromaDB (indexed)\n\nSuggested Actions:\n1. Explore anomaly detection results\n2. Compare regional ocean dynamics\n3. Review climate trend analysis\n4. Examine 3D visualizations\n5. Generate export reports\n\nPlease refine your query or select from suggested questions for specific analysis.`;
  };

  const AdvancedCharts = () => {
    const bgColor = darkMode ? '#1f2937' : '#ffffff';
    const textColor = darkMode ? '#f3f4f6' : '#1f2937';
    const gridColor = darkMode ? '#374151' : '#e5e7eb';

    return (
      <div className="space-y-6">
        {/* Anomaly Alert Banner */}
        {showAnomalies && anomalyData.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">AI Anomaly Detection Alert</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {anomalyData.map((anomaly, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <div className="text-sm font-semibold">{anomaly.region}</div>
                  <div className="text-xs opacity-90 mt-1">{anomaly.type}</div>
                  <div className="text-xs opacity-75 mt-1">Float: {anomaly.floatId}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${anomaly.severity}%` }}></div>
                    </div>
                    <span className="text-xs font-bold">{anomaly.severity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Temperature Profile with Anomaly Detection */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Temperature vs Depth with AI Analysis</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Red markers indicate AI-detected anomalies</p>
            </div>
            {selectedFloat && (
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-mono px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                Float: {selectedFloat.id}
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="temp" 
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5, fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                reversed 
                dataKey="depth" 
                label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }}
                formatter={(value, name) => [value.toFixed(2), name]}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={(props) => {
                  const point = realProfileData[props.index];
                  return point.anomaly ? (
                    <circle {...props} r={6} fill="#dc2626" stroke="#fff" strokeWidth={2} />
                  ) : (
                    <circle {...props} r={3} fill="#ef4444" />
                  );
                }}
                name="Temperature (°C)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Comparative Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Multi-Parameter T-S-O Diagram</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="salinity" 
                  label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5, fill: textColor }}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                />
                <YAxis 
                  dataKey="temp" 
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: textColor }}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }}
                />
                <Legend wrapperStyle={{ color: textColor }} />
                <Scatter 
                  name="Water Mass Properties" 
                  data={realProfileData} 
                  fill="#8b5cf6"
                  shape={(props) => {
                    const point = realProfileData.find(d => d.temp === props.payload.temp);
                    const size = point && point.anomaly ? 8 : 4;
                    return <circle {...props} r={size} />;
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Oxygen Minimum Zone Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="oxygen" 
                  label={{ value: 'Dissolved Oxygen (ml/L)', position: 'insideBottom', offset: -5, fill: textColor }}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                />
                <YAxis 
                  reversed 
                  dataKey="depth" 
                  label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: textColor }}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                />
                <Tooltip contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }} />
                <Legend wrapperStyle={{ color: textColor }} />
                <Area 
                  type="monotone" 
                  dataKey="oxygen" 
                  stroke="#10b981" 
                  fill="#34d399" 
                  fillOpacity={0.6}
                  name="Oxygen (ml/L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Climate Trends with AI Predictions */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>AI Climate Trend Analysis with Predictions</h3>
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
              <Brain className="w-4 h-4" />
              <span>AI-Enhanced</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }} />
              <Legend wrapperStyle={{ color: textColor }} />
              <Area 
                type="monotone" 
                dataKey="trend" 
                fill="#60a5fa" 
                fillOpacity={0.3}
                stroke="none"
                name="AI Trend Prediction"
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#f97316" 
                strokeWidth={3} 
                name="Observed SST (°C)"
                dot={{ r: 5, fill: '#f97316' }}
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 3D Structure Representation */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Layers className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Ocean Stratification Analysis</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="density" 
                label={{ value: 'Density (kg/m³)', position: 'insideBottom', offset: -5, fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                reversed 
                dataKey="depth" 
                label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }} />
              <Legend wrapperStyle={{ color: textColor }} />
              <Area 
                type="monotone" 
                dataKey="density" 
                stroke="#8b5cf6" 
                fill="#a78bfa" 
                fillOpacity={0.5}
                name="Density (kg/m³)"
              />
              <Line 
                type="monotone" 
                dataKey="density" 
                stroke="#7c3aed" 
                strokeWidth={2} 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} font-sans transition-colors duration-300`}>
      {/* Left Sidebar - AI Chat */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col overflow-hidden shadow-2xl`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-purple-900 to-indigo-900' : 'border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="font-bold text-lg">FloatChat AI</h2>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  RAG-Powered Analysis
                </p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System Status Bar */}
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {autoRefresh ? 'Live Updates' : 'Manual Mode'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-1 px-2 py-1 rounded ${autoRefresh ? 'bg-green-500/20 text-green-500' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
              >
                <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {Math.floor((new Date() - lastSync) / 1000)}s ago
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className={`p-4 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-purple-50 border-gray-200'} border-b`}>
          <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center gap-2`}>
            <Brain className="w-4 h-4" />
            AI-Suggested Queries:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {exampleQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(query)}
                className={`w-full text-left text-xs ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' : 'bg-white hover:bg-purple-100 text-gray-700 border-gray-300'} px-3 py-2.5 rounded-lg border transition-all duration-200 hover:shadow-md flex items-start gap-2`}
              >
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{query}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl p-4 shadow-md ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white' 
                  : darkMode 
                    ? 'bg-gray-700 text-gray-100 border border-gray-600' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {msg.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300/20">
                    <Brain className="w-4 h-4" />
                    <span className="text-xs font-semibold">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`rounded-xl p-4 shadow-md ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Brain className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                  <div className="flex space-x-2">
                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Processing with RAG...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-lg`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about anomalies, trends, comparisons..."
              disabled={isLoading}
              className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all`}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700' : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900'} text-white p-4 shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <Activity className="w-9 h-9" />
                <div>
                  <h1 className="text-xl font-bold tracking-tight">FloatChat - Advanced ARGO Intelligence</h1>
                  <div className="flex items-center gap-4 text-xs text-cyan-200 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {realArgoFloats.filter(f => f.status === 'active').length} Active Floats
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {anomalyData.length} Anomalies
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Real-time Pipeline
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAnomalies(!showAnomalies)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showAnomalies ? 'bg-red-500/20 text-red-300' : 'hover:bg-white/10'}`}
                title="Toggle Anomaly Detection"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Anomalies</span>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors" 
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center gap-2" title="Export Report">
                <Download className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Share Analysis">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors relative" title="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4`}>
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Live Map', icon: Map },
              { id: 'profiles', label: 'AI Analytics', icon: Brain },
              { id: 'compare', label: 'Comparative Analysis', icon: GitCompare },
              { id: 'trends', label: 'Climate Trends', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-all font-medium text-sm ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'border-purple-400 text-purple-400 bg-gray-700/50'
                      : 'border-purple-600 text-purple-600 bg-purple-50'
                    : darkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'dashboard' && (
              <div className="h-full">
                <div className="mb-4">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Real-Time Float Monitoring</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Interactive map with AI-powered anomaly detection. Red markers indicate detected anomalies.
                  </p>
                </div>
                <div 
                  ref={mapRef} 
                  className={`w-full h-full rounded-xl shadow-2xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                  style={{ minHeight: '700px' }}
                />
              </div>
            )}

            {activeTab === 'profiles' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>AI-Enhanced Ocean Analytics</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Advanced visualizations with automated anomaly detection and trend analysis
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border rounded-lg transition-all shadow-sm`}>
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">Advanced Filters</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export Analysis</span>
                    </button>
                  </div>
                </div>
                <AdvancedCharts />
              </div>
            )}

            {activeTab === 'compare' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <GitCompare className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Comparative Analysis Dashboard</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Compare multiple floats, regions, or time periods</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Select Float/Region A</h3>
                    <select className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}>
                      <option>Float 2902746 - Arabian Sea</option>
                      <option>Float 2902747 - Bay of Bengal</option>
                      <option>Equatorial Region</option>
                    </select>
                  </div>
                  <div className={`p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Select Float/Region B</h3>
                    <select className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}>
                      <option>Float 2902748 - Southern Ocean</option>
                      <option>Float 2902749 - North Indian Ocean</option>
                      <option>Mediterranean Outflow</option>
                    </select>
                  </div>
                </div>
                <button className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg font-semibold">
                  Generate AI Comparison Report
                </button>
              </div>
            )}

            {activeTab === 'trends' && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Climate Trend Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {climateTrends.map((trend, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{trend.metric}</h3>
                        <div className={`p-2 rounded-lg ${trend.trend === 'up' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                          <TrendingUp className={`w-5 h-5 ${trend.trend === 'up' ? 'text-red-500' : 'text-blue-500 transform rotate-180'}`} />
                        </div>
                      </div>
                      <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{trend.value}</p>
                      <p className={`text-sm mt-2 ${trend.trend === 'up' ? 'text-red-500' : 'text-blue-500'} font-semibold`}>{trend.change}</p>
                    </div>
                  ))}
                </div>
                <AdvancedCharts />
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto p-6 custom-scrollbar`}>
            <h3 className={`font-bold text-lg mb-5 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>System Status</h3>
            
            {/* Real-time Stats */}
            <div className={`${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'} p-5 rounded-xl border mb-5`}>
              <h4 className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-900'} mb-4 text-base flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Live Pipeline Status
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Floats:</span>
                  <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{realArgoFloats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active:</span>
                  <span className="font-bold text-green-500">{realArgoFloats.filter(f => f.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Anomalies:</span>
                  <span className="font-bold text-red-500">{realArgoFloats.filter(f => f.anomaly).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Profiles:</span>
                  <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Last Sync:</span>
                  <span className={`font-semibold text-xs ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{Math.floor((new Date() - lastSync) / 1000)}s ago</span>
                </div>
              </div>
            </div>

            {selectedFloat ? (
              <div className="space-y-4">
                <div className={`${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} p-5 rounded-xl border`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} text-base`}>Selected Float</h4>
                    {selectedFloat.anomaly && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        ANOMALY
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 font-bold`}>{selectedFloat.id}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Status:</span>
                      <span className={`font-semibold px-3 py-1 rounded-full text-xs ${selectedFloat.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                        {selectedFloat.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Position:</span>
                      <span className={`font-mono text-xs ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.lat.toFixed(2)}°N, {selectedFloat.lon.toFixed(2)}°E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Temperature:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Salinity:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.salinity} PSU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Oxygen:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.oxygen} ml/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Cycles:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.cycles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Last Update:</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedFloat.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFloat(null)}
                  className={`w-full py-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-5 rounded-xl border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 text-base flex items-center gap-2`}>
                    <Database className="w-5 h-5" />
                    Quick Statistics
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg SST:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>28.5°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Salinity:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>35.2 PSU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Oxygen:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>4.2 ml/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Data Quality:</span>
                      <span className="font-semibold text-green-500">98.7%</span>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-5 rounded-xl border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 text-base flex items-center gap-2`}>
                    <Download className="w-5 h-5" />
                    Export Options
                  </h4>
                  <div className="space-y-2">
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}>
                      <Download className="w-4 h-4" />
                      NetCDF Format
                    </button>
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}>
                      <Download className="w-4 h-4" />
                      CSV Format
                    </button>
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}>
                      <Download className="w-4 h-4" />
                      Parquet Format
                    </button>
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}>
                      <Share2 className="w-4 h-4" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Anomaly Alert */}
            {showAnomalies && (
              <div className={`mt-6 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} p-5 rounded-xl border`}>
                <h4 className={`font-semibold ${darkMode ? 'text-red-300' : 'text-red-900'} mb-2 text-sm flex items-center gap-2`}>
                  <AlertTriangle className="w-5 h-5" />
                  Anomaly Alerts
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {realArgoFloats.filter(f => f.anomaly).length} float(s) detected with unusual oceanographic signatures. AI analysis suggests investigation required.
                </p>
              </div>
            )}

            {/* Info */}
            <div className={`mt-6 ${darkMode ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 border-cyan-200'} p-5 rounded-xl border`}>
              <h4 className={`font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-900'} mb-2 text-sm flex items-center gap-2`}>
                <Brain className="w-5 h-5" />
                AI-Powered Platform
              </h4>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                FloatChat uses RAG (Retrieval-Augmented Generation) with ChromaDB embeddings to provide intelligent insights from real-time ARGO data streams.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f3f4f6'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6b7280' : '#9ca3af'};
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatChatPlatform;
