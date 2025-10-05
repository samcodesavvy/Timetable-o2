export const schedule: Record<string, {time:string,title:string,location?:string,start:string,end:string}[]> = {
  MONDAY: [
    {time:'8:00–9:00 AM', title:'PS', start:'08:00', end:'09:00'},
    {time:'9:00–10:00 AM', title:'PS', start:'09:00', end:'10:00'},
    {time:'10:00–11:00 AM', title:'IM', start:'10:00', end:'11:00'},
    {time:'11:00 AM–1:00 Noon', title:'DLD LAB', location:'E-308', start:'11:00', end:'13:00'}
  ],
  TUESDAY: [
    {time:'8:00–10:00 AM', title:'CSW1', location:'CL-402', start:'08:00', end:'10:00'},
    {time:'10:00 AM–12:00 Noon', title:'AD1 LAB', location:'CL-402', start:'10:00', end:'12:00'}
  ],
  WEDNESDAY: [
    {time:'2:00–3:00 PM', title:'IM', start:'14:00', end:'15:00'},
    {time:'3:00–4:00 PM', title:'IES', start:'15:00', end:'16:00'},
    {time:'4:00–5:00 PM', title:'IES', start:'16:00', end:'17:00'},
    {time:'5:00–6:00 PM', title:'PS', start:'17:00', end:'18:00'}
  ],
  THURSDAY: [
    {time:'2:00–4:00 PM', title:'AD1', location:'CL-402', start:'14:00', end:'16:00'},
    {time:'4:00–5:00 PM', title:'CSW1', location:'CL-402', start:'16:00', end:'17:00'},
    {time:'5:00–6:00 PM', title:'DLD', location:'CL-402', start:'17:00', end:'18:00'}
  ],
  FRIDAY: [
    {time:'8:00–9:00 AM', title:'AD1', location:'CL-402', start:'08:00', end:'09:00'},
    {time:'9:00–12:00 PM', title:'CSW1', location:'CL-402', start:'09:00', end:'12:00'},
    {time:'12:00–1:00 PM', title:'DLD', location:'CL-402', start:'12:00', end:'13:00'}
  ],
  SATURDAY: [
    {time:'2:00–3:00 PM', title:'PS', start:'14:00', end:'15:00'},
    {time:'3:00–4:00 PM', title:'IM', start:'15:00', end:'16:00'},
    {time:'4:00–5:00 PM', title:'DLD', start:'16:00', end:'17:00'},
    {time:'5:00–6:00 PM', title:'DLD', start:'17:00', end:'18:00'}
  ]
  ,
  SUNDAY: []
}
