export interface IDateTimeProvider {
  utcNow<T extends boolean = true>(options?: { inDateFormat?: T }): T extends true ? Date : number;
  addDays<T extends boolean = true>(
    days: number,
    startDate?: Date,
    options?: { inDateFormat?: T }
  ): T extends true ? Date : number;
}
