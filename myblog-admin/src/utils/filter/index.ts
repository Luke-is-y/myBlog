import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const dateFormat = (dateUtc: string, format: string = DATE_TIME_FORMAT): string => {
  return dayjs.utc(dateUtc).format(format)
}
