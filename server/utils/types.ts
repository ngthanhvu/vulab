export interface Email {
  uid: number
  subject: string
  from: string
  to: string
  date: Date
  text: string
  html: string
  seen: boolean
}