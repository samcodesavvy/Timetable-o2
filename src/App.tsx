import React, { useMemo, useState } from 'react'
import { schedule } from './data/schedule'
import DayView from './components/DayView'
import { motion } from 'framer-motion'
import StatusBar from './components/StatusBar'

const days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']

export default function App(){
  const todayIdx = useMemo(()=>{
    const idx = new Date().getDay() // 0 Sun ... 6 Sat
    // Map Sunday to 6 (index of SUNDAY in days array)
    if(idx === 0) return 6
    return idx - 1
  },[])

  const [active, setActive] = useState<number>(todayIdx)
  // when user manually selects a day, enable manual mode to prevent live polling from forcing the view back
  const [manualMode, setManualMode] = useState<boolean>(false)

  // Auto-update the active day at midnight or when the system date changes
  React.useEffect(()=>{
    // schedule an update at the next midnight boundary so the displayed day updates precisely
    const scheduleNextMidnight = ()=>{
      const now = new Date()
      const next = new Date(now)
      next.setDate(now.getDate()+1)
      next.setHours(0,0,1,0) // just after midnight
      const ms = next.getTime() - now.getTime()
      return setTimeout(()=>{
        const idx = new Date().getDay()
        const mapped = idx === 0 ? 6 : idx-1 // Sunday -> 6
        setActive(mapped)
        scheduleNextMidnight()
      }, ms)
    }
    const t = scheduleNextMidnight()
    return ()=> clearTimeout(t)
  },[])

  // backup: poll every 1s to ensure active day and real-time UI updates.
  // Do not override when user is in manualMode (viewing another day).
  React.useEffect(()=>{
    const i = setInterval(()=>{
      if(manualMode) return
      const idx = new Date().getDay()
      const mapped = idx === 0 ? 6 : idx-1
      setActive(mapped)
    }, 1_000)
    return ()=> clearInterval(i)
  },[manualMode])

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <h1>TIETABLE</h1>
          <p className="tag">Your daily timetable — PWA</p>
        </div>
        <nav className="day-nav">
          {days.map((d, i)=> (
            <button key={d} className={`day-btn ${i===active? 'active':''}`} onClick={()=>{ setActive(i); setManualMode(true) }}>
              {d.slice(0,3)}
            </button>
          ))}
        </nav>
      </header>

      <StatusBar today={days[active]} items={schedule[days[active]]} />
      <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
        {manualMode ? (
          <button className="return-today" onClick={()=>{ setManualMode(false); const idx = new Date().getDay(); const mapped = idx===0?6:idx-1; setActive(mapped) }}>
            Return to Today
          </button>
        ) : null}
      </div>
      <main className="main-area">
        <motion.div key={active} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.35}}>
          <DayView day={days[active]} items={schedule[days[active]]} />
        </motion.div>
      </main>

      <footer className="app-footer">
        <small>Accent: Blue & Golden — Primary: White</small>
      </footer>
    </div>
  )
}
