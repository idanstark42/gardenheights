import React , { useState } from 'react'

import Map from './components/map'
import Spyglass from './components/spyglass'

const TOOLS = {
  map: { Component: Map },
  spyglass: { Component: Spyglass },
}

export default function App() {
  const [tool, setTool] = useState('spyglass')

  return <tool.Component />
}
