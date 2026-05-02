import { useState } from 'react'
import { motion } from 'framer-motion'
import { geoCentroid } from 'd3-geo'
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'

const TURKEY_GEO_URL =
  'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json'

const getMapFill = ({ isSelected, isHovered }) => {
  if (isSelected) return '#F6C944'
  if (isHovered) return '#FF8FB3'
  return '#CDEAFF'
}

function TurkeyMap({ onSelectCity, selectedCity }) {
  const [hoveredCity, setHoveredCity] = useState('')

  return (
    <div className="w-full h-full relative bg-breeze/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full h-full"
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [35, 39], scale: 2900 }}
          className="w-full h-full"
        >
          <ZoomableGroup center={[35, 39]} zoom={1}>
            <Geographies geography={TURKEY_GEO_URL}>
              {({ geographies }) => {
                const activeCityName = hoveredCity || selectedCity
                const activeGeo = geographies.find((geo) => geo.properties?.name === activeCityName)
                const activeCentroid = activeGeo ? geoCentroid(activeGeo) : null

                return (
                  <>
                    {geographies.map((geo) => {
                      const cityName = geo.properties.name
                      const isSelected = selectedCity === cityName
                      const isHovered = hoveredCity === cityName

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHoveredCity(cityName)}
                          onMouseLeave={() => setHoveredCity('')}
                          onClick={() =>
                            onSelectCity(cityName, {
                              id: geo.id ?? null,
                              name: cityName,
                              properties: geo.properties ?? {},
                              centroid: geoCentroid(geo),
                              rsmKey: geo.rsmKey,
                            })
                          }
                          style={{
                            default: {
                              fill: getMapFill({ isSelected, isHovered }),
                              stroke: '#2A2A33',
                              strokeWidth: isSelected ? 1.8 : 0.9,
                              outline: 'none',
                              cursor: 'pointer',
                            },
                            hover: {
                              fill: isSelected ? '#F6C944' : '#FF8FB3',
                              stroke: '#2A2A33',
                              strokeWidth: 1.5,
                              outline: 'none',
                              cursor: 'pointer',
                            },
                            pressed: {
                              fill: '#F6C944',
                              stroke: '#2A2A33',
                              strokeWidth: 1.6,
                              outline: 'none',
                              cursor: 'pointer',
                            },
                          }}
                        />
                      )
                    })}

                    {activeGeo && Array.isArray(activeCentroid) && (
                      <Marker coordinates={activeCentroid}>
                        <g transform="translate(0, -12)">
                          <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fontFamily: 'Nunito, sans-serif',
                              fontWeight: 900,
                              fontSize: 10,
                              fill: '#2A2A33',
                              stroke: '#FFFDF7',
                              strokeWidth: 4,
                              paintOrder: 'stroke',
                              pointerEvents: 'none',
                            }}
                          >
                            {activeCityName}
                          </text>
                        </g>
                      </Marker>
                    )}
                  </>
                )
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>
    </div>
  )
}

export default TurkeyMap