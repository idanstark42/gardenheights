import React , { useState } from 'react'

import './App.css'

import Map from './components/map'
import Spyglass from './components/spyglass'

const TOOLS = {
  map: { Component: Map },
  spyglass: { Component: Spyglass },
}

export default function App() {
  return <Spyglass />
}
