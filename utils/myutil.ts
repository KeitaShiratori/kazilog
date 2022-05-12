export const deepCopy = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

export const WEEKS = {
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
}
export const dateFormat = (date: Date, format: String) => {
  format = format.replace(/yyyy/, String(date.getFullYear()))
  format = format.replace(/MM/, ('0' + String(date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/, ('0' + String(date.getDate())).slice(-2))
  format = format.replace(/aaa/, WEEKS.ja[date.getDay()])
  format = format.replace(/hh/, ('0' + String(date.getHours())).slice(-2))
  format = format.replace(/mm/, ('0' + String(date.getMinutes())).slice(-2))
  format = format.replace(/ss/, ('0' + String(date.getSeconds())).slice(-2))
  format = format.replace(
    /xxx/,
    ('0' + String(date.getMilliseconds())).slice(-3)
  )
  return format
}
