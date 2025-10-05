import React from 'react'

function toTodayDate(time24:string, base = new Date()){
  try{
    const [h,m] = time24.split(':').map(Number)
    const d = new Date(base)
    d.setHours(Number.isFinite(h)?h:0, Number.isFinite(m)?m:0, 0, 0)
    return d
  }catch(e){
    return new Date(base)
  }
}

function formatDuration(ms:number){
  if(ms<=0) return '00:00:00'
  const s = Math.floor(ms/1000)
  const h = Math.floor(s/3600)
  const m = Math.floor((s%3600)/60)
  const sec = s%60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function StatusBar({today, items}:{today:string, items?: any[]}){
  const [now, setNow] = React.useState(()=>new Date())

  React.useEffect(()=>{
    const t = setInterval(()=> setNow(new Date()), 1000)
    return ()=> clearInterval(t)
  },[])

  // find next class (today)
  const safeItems = items ?? []

  // Helper: map day name (MONDAY...) to a Date object in the current week for that weekday
  const weekdayMap: Record<string, number> = { SUNDAY:0, MONDAY:1, TUESDAY:2, WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6 }
  const baseDayDate = React.useMemo(()=>{
    const ref = new Date()
    const target = weekdayMap[today] ?? ref.getDay()
    const delta = target - ref.getDay()
    const d = new Date(ref)
    d.setDate(ref.getDate() + delta)
    d.setHours(0,0,0,0)
    return d
  },[today])

  // Build events with start/end ms (relative to the selected day) and sort by start
  const events = React.useMemo(()=>{
    return safeItems.map(it=>{
      const start = it.start ? toTodayDate(it.start, baseDayDate) : null
      const end = it.end ? toTodayDate(it.end, baseDayDate) : null
      return {...it, start, end, startMs: start? start.getTime(): Infinity, endMs: end? end.getTime(): -Infinity}
    }).filter(e=>e.start && e.end).sort((a,b)=>a.startMs - b.startMs)
  },[safeItems, baseDayDate])

  const next = React.useMemo(()=>{
    if(events.length===0) return null
    const nowTs = now.getTime()
    // find current
    const current = events.find(e => e.startMs <= nowTs && nowTs < e.endMs)
    if(current) return {...current, status:'current'}
    // otherwise next upcoming
    const upcoming = events.find(e => e.startMs > nowTs)
    if(upcoming) return {...upcoming, status:'upcoming'}
    return null
  },[events, now])

  const untilNext = next ? Math.max(0, (next.status === 'current' ? next.end.getTime() : next.start.getTime()) - now.getTime()) : null

  // time until next day (midnight)
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate()+1)
  tomorrow.setHours(0,0,0,0)
  const untilMidnight = Math.max(0, tomorrow.getTime() - now.getTime())

  // progress across today's schedule span (from first start to last end)
  const progress = React.useMemo(()=>{
    if(!items || items.length===0) return 0
    const first = toTodayDate(items[0].start, now)
    const last = toTodayDate(items[items.length-1].end, now)
    const total = Math.max(1, last.getTime() - first.getTime())
    const elapsed = Math.min(total, Math.max(0, now.getTime() - first.getTime()))
    return Math.max(0, Math.min(1, elapsed/total))
  },[items, now])

  const imminent = untilNext !== null && untilNext <= 15 * 60 * 1000 // 15 minutes

  return (
    <div className={`status-bar ${imminent? 'imminent':''}`} role="status">
      <div className="status-left">
        {next ? (
          <>
            {next.status === 'current' ? (
              <>
                <div className="label">Now: <strong>{next.title}</strong> • {next.time}</div>
                <div className="count">Ends in {formatDuration(untilNext!)}</div>
              </>
            ) : (
              <>
                <div className="label">Next: <strong>{next.title}</strong> • {next.time}</div>
                <div className="count">Starts in {formatDuration(untilNext!)}</div>
              </>
            )}
          </>
        ) : (
          <div className="label">No more classes today</div>
        )}
      </div>

      <div className="status-right">
        <div className="clock">Until next day: {formatDuration(untilMidnight)}</div>
        <div className="progress" aria-hidden>
          <div className="bar" style={{transform:`scaleX(${progress})`, transformOrigin:'left'}} />
        </div>
      </div>
    </div>
  )
}
