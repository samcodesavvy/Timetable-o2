import React from 'react'
import { motion } from 'framer-motion'

type Item = { time: string, title: string, location?: string, start?: string, end?: string }

export default function DayView({ day, items }:{day:string, items?: Item[]}){
  const safeItems = items ?? []
  if(safeItems.length===0){
    return <div className="empty">No classes scheduled for {day}</div>
  }

  // compute status relative to the viewed day
  const weekdayMap: Record<string, number> = { SUNDAY:0, MONDAY:1, TUESDAY:2, WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6 }
  const base = (()=>{
    const ref = new Date()
    const target = weekdayMap[day] ?? ref.getDay()
    const delta = target - ref.getDay()
    const d = new Date(ref)
    d.setDate(ref.getDate() + delta)
    d.setHours(0,0,0,0)
    return d
  })()

  const now = new Date().getTime()
  const enriched = safeItems.map(it=>{
    const start = it.start ? (()=>{const d=new Date(base); const [h,m]=it.start.split(':').map(Number); d.setHours(h,m,0,0); return d})() : null
    const end = it.end ? (()=>{const d=new Date(base); const [h,m]=it.end.split(':').map(Number); d.setHours(h,m,0,0); return d})() : null
    let status: 'upcoming'|'current'|'past' = 'upcoming'
    if(start && end){
      if(now >= start.getTime() && now < end.getTime()) status = 'current'
      else if(now >= end.getTime()) status = 'past'
      else status = 'upcoming'
    }
    return {...it, start, end, status}
  })

  return (
    <section className="day-view">
      <h2 className="day-title">{day}</h2>
      <div className="items">
        {enriched.map((it, idx)=> (
          <motion.div key={idx} className={`item ${it.status==='current'? 'now': it.status==='upcoming'? 'next':''}`} whileHover={{scale:1.02}} transition={{type:'spring', stiffness:300}}>
            <div className="time">{it.time}</div>
            <div className="meta">
              <div className="title">{it.title} {it.status==='current' && <span className="badge now">Now</span>}{it.status==='upcoming' && <span className="badge next">Next</span>}</div>
              {it.location && <div className="loc">{it.location}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
