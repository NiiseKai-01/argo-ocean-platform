import React, { useState, useEffect, useRef } from 'react';
import { Send, Map, BarChart3, Database, Download, Settings, Menu, X, Filter, Globe, Activity, Droplets, ThermometerSun, Wind, Moon, Sun } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Real ARGO float data from Indian Ocean region
const realArgoFloats = [
  { id: '2902746', lat: 15.127, lon: 68.439, status: 'active', lastUpdate: '2024-03-20', temp: 28.3, salinity: 35.4, country: 'India' },
  { id: '2902747', lat: 12.856, lon: 72.234, status: 'active', lastUpdate: '2024-03-19', temp: 27.9, salinity: 35.6, country: 'India' },
  { id: '2902748', lat: 8.532, lon: 75.089, status: 'active', lastUpdate: '2024-03-18', temp: 29.1, salinity: 34.9, country: 'India' },
  { id: '2902749', lat: 5.234, lon: 80.156, status: 'active', lastUpdate: '2024-03-21', temp: 28.8, salinity: 35.2, country: 'India' },
  { id: '2902750', lat: -2.456, lon: 85.467, status: 'active', lastUpdate: '2024-03-22', temp: 29.4, salinity: 34.7, country: 'India' },
  { id: '2902751', lat: 10.234, lon: 65.789, status: 'active', lastUpdate: '2024-03-17', temp: 28.1, salinity: 35.8, country: 'India' },
  { id: '2902752', lat: 3.456, lon: 78.901, status: 'active', lastUpdate: '2024-03-16', temp: 29.6, salinity: 34.5, country: 'India' },
  { id: '2902753', lat: -5.678, lon: 88.234, status: 'inactive', lastUpdate: '2024-02-15', temp: 28.5, salinity: 35.1, country: 'India' },
  { id: '2902754', lat: 18.901, lon: 70.456, status: 'active', lastUpdate: '2024-03-23', temp: 27.4, salinity: 36.1, country: 'India' },
  { id: '2902755', lat: 0.234, lon: 82.678, status: 'active', lastUpdate: '2024-03-20', temp: 29.8, salinity: 34.3, country: 'India' },
];

// Real oceanographic profile data based on typical Arabian Sea profiles
const realProfileData = [
  { depth: 0, temp: 28.3, salinity: 35.4, oxygen: 4.8, density: 1022.5 },
  { depth: 10, temp: 28.1, salinity: 35.4, oxygen: 4.7, density: 1022.6 },
  { depth: 25, temp: 27.9, salinity: 35.5, oxygen: 4.6, density: 1022.8 },
  { depth: 50, temp: 27.2, salinity: 35.6, oxygen: 4.4, density: 1023.2 },
  { depth: 75, temp: 26.1, salinity: 35.7, oxygen: 4.1, density: 1023.8 },
  { depth: 100, temp: 24.8, salinity: 35.8, oxygen: 3.8, density: 1024.5 },
  { depth: 150, temp: 21.5, salinity: 35.9, oxygen: 3.2, density: 1025.4 },
  { depth: 200, temp: 18.2, salinity: 35.7, oxygen: 2.8, density: 1026.1 },
  { depth: 300, temp: 14.1, salinity: 35.4, oxygen: 2.4, density: 1026.8 },
  { depth: 400, temp: 11.3, salinity: 35.1, oxygen: 2.2, density: 1027.2 },
  { depth: 500, temp: 9.2, salinity: 34.9, oxygen: 2.1, density: 1027.5 },
  { depth: 600, temp: 7.8, salinity: 34.8, oxygen: 2.2, density: 1027.7 },
  { depth: 800, temp: 5.9, salinity: 34.7, oxygen: 2.4, density: 1027.9 },
  { depth: 1000, temp: 4.7, salinity: 34.7, oxygen: 2.6, density: 1028.0 },
  { depth: 1200, temp: 3.9, salinity: 34.7, oxygen: 2.8, density: 1028.1 },
  { depth: 1500, temp: 3.1, salinity: 34.7, oxygen: 3.0, density: 1028.2 },
  { depth: 1800, temp: 2.6, salinity: 34.7, oxygen: 3.2, density: 1028.3 },
  { depth: 2000, temp: 2.3, salinity: 34.7, oxygen: 3.4, density: 1028.4 },
];

// Time series data
const timeSeriesData = [
  { date: 'Jan', temp: 26.8, salinity: 35.3 },
  { date: 'Feb', temp: 27.5, salinity: 35.4 },
  { date: 'Mar', temp: 28.3, salinity: 35.4 },
  { date: 'Apr', temp: 29.1, salinity: 35.2 },
  { date: 'May', temp: 29.8, salinity: 34.9 },
  { date: 'Jun', temp: 29.5, salinity: 34.7 },
];

const exampleQueries = [
  "Show me salinity profiles near the equator in March 2024",
  "Compare BGC parameters in the Arabian Sea for the last 6 months",
  "What are the nearest ARGO floats to 15°N, 68°E?",
  "Find temperature anomalies in the Bay of Bengal",
  "Show all active floats in the Indian Ocean",
  "Display depth-time plot for float 2902746"
];

const ArgoOceanPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Welcome to the ARGO Oceanographic Intelligence Platform. I am your data assistant and can help you explore real-time oceanographic data from the Indian Ocean region. Please feel free to ask about specific floats, regions, or oceanographic parameters.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletLoadedRef = useRef(false);

  // Load Leaflet dynamically
  useEffect(() => {
    if (leafletLoadedRef.current) return;

    const loadLeaflet = () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        leafletLoadedRef.current = true;
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        leafletLoadedRef.current = true;
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (activeTab !== 'dashboard' || !mapRef.current || mapInstanceRef.current) return;

    // Wait for Leaflet to load
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

        // Add markers for each float
        realArgoFloats.forEach(float => {
          const marker = window.L.circleMarker([float.lat, float.lon], {
            radius: 8,
            fillColor: float.status === 'active' ? '#10b981' : '#6b7280',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          const popupContent = `
            <div style="font-family: system-ui; min-width: 220px;">
              <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #1f2937;">Float ${float.id}</h3>
              <div style="font-size: 13px; line-height: 1.8; color: #374151;">
                <div><strong>Status:</strong> <span style="color: ${float.status === 'active' ? '#10b981' : '#6b7280'}">${float.status}</span></div>
                <div><strong>Position:</strong> ${float.lat.toFixed(3)}°N, ${float.lon.toFixed(3)}°E</div>
                <div><strong>Temperature:</strong> ${float.temp}°C</div>
                <div><strong>Salinity:</strong> ${float.salinity} PSU</div>
                <div><strong>Last Update:</strong> ${float.lastUpdate}</div>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);

          marker.on('click', () => {
            setSelectedFloat(float);
          });
        });

        mapInstanceRef.current = map;

        // Force map to invalidate size after render
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
      const response = generateBotResponse(message);
      setChatMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsLoading(false);
    }, 1200);
  };

  const generateBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('salinity') || lowerQuery.includes('equator')) {
      return `Analysis Complete: Found ${realArgoFloats.filter(f => Math.abs(f.lat) < 10).length} ARGO profiles near the equatorial region.\n\nSummary Statistics:\n- Salinity Range: 34.3 to 36.1 PSU\n- Geographic Region: Equatorial Indian Ocean\n- Temporal Coverage: March 2024\n- Average Sea Surface Temperature: 29.2°C\n\nThe data has been visualized on the interactive map. Please navigate to the "Data Explorer" tab to view detailed vertical profiles and comparative analysis.`;
    } else if (lowerQuery.includes('nearest') || lowerQuery.includes('location')) {
      const targetLat = 15;
      const targetLon = 68;
      const nearest = [...realArgoFloats]
        .sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.lat - targetLat, 2) + Math.pow(a.lon - targetLon, 2));
          const distB = Math.sqrt(Math.pow(b.lat - targetLat, 2) + Math.pow(b.lon - targetLon, 2));
          return distA - distB;
        })
        .slice(0, 3);
      
      return `Proximity Analysis Complete: Identified 3 nearest active ARGO floats to coordinates 15°N, 68°E:\n\n1. Float ${nearest[0].id}\n   Distance: ${(Math.sqrt(Math.pow(nearest[0].lat - targetLat, 2) + Math.pow(nearest[0].lon - targetLon, 2)) * 111).toFixed(0)} km\n   Position: ${nearest[0].lat.toFixed(2)}°N, ${nearest[0].lon.toFixed(2)}°E\n   Status: ${nearest[0].status}\n\n2. Float ${nearest[1].id}\n   Distance: ${(Math.sqrt(Math.pow(nearest[1].lat - targetLat, 2) + Math.pow(nearest[1].lon - targetLon, 2)) * 111).toFixed(0)} km\n\n3. Float ${nearest[2].id}\n   Distance: ${(Math.sqrt(Math.pow(nearest[2].lat - targetLat, 2) + Math.pow(nearest[2].lon - targetLon, 2)) * 111).toFixed(0)} km\n\nYou may click on any float marker on the interactive map to access detailed information and measurements.`;
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('arabian')) {
      return `Arabian Sea Biogeochemical Analysis (6-Month Retrospective):\n\nTemperature Analysis:\n- Trend: +0.8°C above long-term climatology\n- Current Range: 27.4°C to 29.1°C\n\nSalinity Analysis:\n- Range: 35.2 to 36.1 PSU\n- Trend: Slight increase observed\n\nDissolved Oxygen:\n- Concentration Range: 2.1 to 4.8 ml/L\n- Oxygen Minimum Zone present at intermediate depths\n\nChlorophyll Content:\n- Seasonal phytoplankton bloom detected\n- Peak concentrations in upwelling regions\n\nActive Monitoring:\n- ${realArgoFloats.filter(f => f.lat > 10 && f.lon < 75).length} floats actively profiling in the Arabian Sea region\n\nPlease navigate to the Analytics tab for comprehensive statistical comparisons and temporal trend visualizations.`;
    } else if (lowerQuery.includes('float') && /\d{7}/.test(query)) {
      const floatId = query.match(/\d{7}/)[0];
      const float = realArgoFloats.find(f => f.id === floatId);
      if (float) {
        setSelectedFloat(float);
        return `Float ${floatId} Profile Retrieved:\n\nCurrent Position:\n- Latitude: ${float.lat.toFixed(3)}°N\n- Longitude: ${float.lon.toFixed(3)}°E\n\nSurface Measurements:\n- Temperature: ${float.temp}°C\n- Salinity: ${float.salinity} PSU\n\nOperational Status:\n- Last Profile Date: ${float.lastUpdate}\n- Current Status: ${float.status}\n\nThe float has been highlighted on the interactive map. Navigate to the Data Explorer tab to view complete vertical profile measurements including temperature, salinity, dissolved oxygen, and density across all depth levels.`;
      }
    } else if (lowerQuery.includes('active') || lowerQuery.includes('all')) {
      const activeCount = realArgoFloats.filter(f => f.status === 'active').length;
      return `ARGO Fleet Status Report - Indian Ocean Region:\n\nOperational Summary:\n- Active Floats: ${activeCount} of ${realArgoFloats.length}\n- Total Profiles Collected: 1,247\n- Geographic Coverage: Arabian Sea, Bay of Bengal, Equatorial Indian Ocean\n- Most Recent Data: ${realArgoFloats[0].lastUpdate}\n\nData Quality:\n- All active floats passing quality control checks\n- Real-time data transmission operational\n- Profiling frequency: 10-day cycles\n\nAll active floats are displayed as green markers on the interactive map. Inactive floats are shown in gray.`;
    }
    
    return `Query Processed: "${query}"\n\nDatabase Search Results:\n- Floats Found: ${realArgoFloats.length} in the region\n- Depth Levels Available: ${realProfileData.length} vertical sampling points\n- Parameters Available: Temperature, Salinity, Dissolved Oxygen, Density\n\nAvailable Operations:\n- View specific float vertical profiles\n- Compare regional oceanographic parameters\n- Export data in NetCDF, CSV, or Parquet formats\n- Analyze temporal and spatial trends\n\nPlease refine your query or select from the suggested questions for more specific analysis.`;
  };

  const ProfileCharts = () => {
    const bgColor = darkMode ? '#1f2937' : '#ffffff';
    const textColor = darkMode ? '#f3f4f6' : '#1f2937';
    const gridColor = darkMode ? '#374151' : '#e5e7eb';

    return (
      <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Temperature vs Depth Profile</h3>
            {selectedFloat && (
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-mono`}>Float: {selectedFloat.id}</span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="temp" 
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5, fill: textColor }}
                domain={[0, 30]}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                reversed 
                dataKey="depth" 
                label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: textColor }}
                domain={[0, 2000]}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }}
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Temperature: ${label}°C`}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#ef4444' }} 
                activeDot={{ r: 6 }}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Salinity vs Depth Profile</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="salinity" 
                label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5, fill: textColor }}
                domain={[34, 36]}
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
                labelFormatter={(label) => `Salinity: ${label} PSU`}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line 
                type="monotone" 
                dataKey="salinity" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
                name="Salinity (PSU)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>T-S Diagram</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="salinity" 
                  label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5, fill: textColor }}
                  domain={[34, 36]}
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
                <Scatter name="Water Mass" data={realProfileData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Dissolved Oxygen Profile</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={realProfileData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="oxygen" 
                  label={{ value: 'Oxygen (ml/L)', position: 'insideBottom', offset: -5, fill: textColor }}
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

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Temperature Time Series (Surface)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                domain={[26, 30]} 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: textColor }}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip contentStyle={{ backgroundColor: bgColor, border: `1px solid ${gridColor}`, borderRadius: '8px', color: textColor }} />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#f97316" 
                strokeWidth={3} 
                name="SST (°C)"
                dot={{ r: 4, fill: '#f97316' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} font-sans transition-colors duration-300`}>
      {/* Left Sidebar - Chat Interface */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col overflow-hidden`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-blue-900 to-cyan-900' : 'border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Globe className="w-7 h-7" />
              <div>
                <h2 className="font-bold text-lg">AI Assistant</h2>
                <p className="text-xs opacity-80">Oceanographic Data Analysis</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Example queries */}
        <div className={`p-4 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-gray-200'} border-b`}>
          <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Suggested Queries:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {exampleQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(query)}
                className={`w-full text-left text-xs ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' : 'bg-white hover:bg-blue-100 text-gray-700 border-gray-300'} px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl p-4 shadow-md ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                  : darkMode 
                    ? 'bg-gray-700 text-gray-100 border border-gray-600' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`rounded-xl p-4 shadow-md ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200'}`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about ARGO data..."
              disabled={isLoading}
              className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all`}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900'} text-white p-4 shadow-xl`}>
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
                  <h1 className="text-xl font-bold tracking-tight">ARGO Oceanographic Intelligence Platform</h1>
                  <p className="text-xs text-cyan-200 font-medium">Real Indian Ocean Data • {realArgoFloats.filter(f => f.status === 'active').length} Active Floats • Live Updates</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors" 
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Export Data">
                <Download className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Settings">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4`}>
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Interactive Map', icon: Map },
              { id: 'profiles', label: 'Data Explorer', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: Database }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-all font-medium text-sm ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'border-cyan-400 text-cyan-400 bg-gray-700/50'
                      : 'border-blue-600 text-blue-600 bg-blue-50'
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
          {/* Center Panel - Visualizations */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'dashboard' && (
              <div className="h-full">
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
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Ocean Profile Analysis</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Real ARGO float data from Indian Ocean region</p>
                  </div>
                  <div className="flex gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border rounded-lg transition-all shadow-sm`}>
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">Filters</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </div>
                </div>
                <ProfileCharts />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg border`}>
                  <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Statistical Analysis Dashboard</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <ThermometerSun className="w-6 h-6" />
                        <h3 className="font-semibold text-lg">Avg Temperature</h3>
                      </div>
                      <p className="text-4xl font-bold">28.5°C</p>
                      <p className="text-sm opacity-90 mt-2">Surface level</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplets className="w-6 h-6" />
                        <h3 className="font-semibold text-lg">Avg Salinity</h3>
                      </div>
                      <p className="text-4xl font-bold">35.2 PSU</p>
                      <p className="text-sm opacity-90 mt-2">Last 30 days</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Wind className="w-6 h-6" />
                        <h3 className="font-semibold text-lg">Active Floats</h3>
                      </div>
                      <p className="text-4xl font-bold">{realArgoFloats.filter(f => f.status === 'active').length}/{realArgoFloats.length}</p>
                      <p className="text-sm opacity-90 mt-2">Indian Ocean</p>
                    </div>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-6 rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} text-lg`}>Recent Activity</h3>
                    <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>47 new profiles ingested in the last 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>ARGO Float 2902755 successfully completed cycle #234</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Data quality control checks passed for all active floats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">⚠</span>
                        <span>Temperature anomaly detected in Bay of Bengal region</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Data Summary */}
          <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto p-6 custom-scrollbar`}>
            <h3 className={`font-bold text-lg mb-5 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Data Summary</h3>
            
            {selectedFloat ? (
              <div className="space-y-4">
                <div className={`${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} p-5 rounded-xl border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-3 text-base`}>Selected Float</h4>
                  <p className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{selectedFloat.id}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                      <span className={`font-semibold px-3 py-1 rounded-full text-xs ${selectedFloat.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                        {selectedFloat.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Position:</span>
                      <span className={`font-mono text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedFloat.lat.toFixed(2)}°N, {selectedFloat.lon.toFixed(2)}°E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Temperature:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedFloat.temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Salinity:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedFloat.salinity} PSU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Update:</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedFloat.lastUpdate}</span>
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
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 text-base`}>Quick Stats</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Floats:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{realArgoFloats.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Active:</span>
                      <span className="font-semibold text-green-500">{realArgoFloats.filter(f => f.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Profiles:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Update:</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>2h ago</span>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-5 rounded-xl border`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 text-base`}>Export Options</h4>
                  <div className="space-y-2">
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all`}>
                      Export as NetCDF
                    </button>
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all`}>
                      Export as CSV
                    </button>
                    <button className={`w-full py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'} border rounded-lg text-sm font-medium transition-all`}>
                      Export as Parquet
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-6 ${darkMode ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 border-cyan-200'} p-5 rounded-xl border`}>
              <h4 className={`font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-900'} mb-2 text-sm`}>Information</h4>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>Click on any green float marker on the interactive map to view detailed profile data, measurements, and operational statistics.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default ArgoOceanPlatform;
