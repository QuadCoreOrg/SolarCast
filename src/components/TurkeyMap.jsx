import { useState } from 'react'
import { motion } from 'framer-motion'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

const TURKEY_GEO_URL =
  'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json'

const getMapFill = ({ isSelected, isHovered }) => {
  if (isSelected) return '#F6C944'
  if (isHovered) return '#FF8FB3'
  return '#CDEAFF'
}

function TurkeyMap({ onSelectCity, selectedCity }) {
  const [hoveredCity, setHoveredCity] = useState('')

  const labelCity = hoveredCity || selectedCity

  const getCityLabelStyle = () => {
    if (hoveredCity) return 'text-blossom-deep'
    if (selectedCity) return 'text-sunlit-deep'
    return 'text-shade-soft'
  }

  return (
    <div className="w-full h-full relative bg-breeze/10">
      <div className="absolute top-2 right-2 z-10 border-2 border-slate-900 bg-background/90 rounded-lg px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)]">
        <span className={`font-black text-xs ${getCityLabelStyle()}`}>
          {labelCity || 'Uzerine gel'}
        </span>
      </div>

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
              {({ geographies }) =>
                geographies.map((geo) => {
                  const cityName = geo.properties.name
                  const isSelected = selectedCity === cityName
                  const isHovered = hoveredCity === cityName

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCity(cityName)}
                      onMouseLeave={() => setHoveredCity('')}
                      onClick={() => onSelectCity(cityName)}
                      style={{
                        default: {
                          fill: getMapFill({ isSelected, isHovered }),
                          stroke: '#2A2A33',
                          strokeWidth: isSelected ? 1.8 : 0.9,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        hover: {
                          fill: '#FF8FB3',
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
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>
    </div>
  )
}

export default TurkeyMap