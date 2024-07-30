import { singleton } from "tsyringe";
import { IDateTimeProvider } from "@shared-kernel/date-time-provider-interface";

@singleton()
export class DateTimeProvider implements IDateTimeProvider {
  public utcNow<T extends boolean = true>(
    options: { inDateFormat?: T } = {}
  ): T extends true ? Date : number {
    options.inDateFormat ??= true as T;

    const dateTimeInUTC = new Date(new Date().toISOString());

    return (
      options.inDateFormat === false ? dateTimeInUTC.getTime() : dateTimeInUTC
    ) as T extends true ? Date : number;
  }

  public addDays<T extends boolean = true>(
    days: number,
    startDate: Date = new Date(),
    options: { inDateFormat?: T } = {}
  ): T extends true ? Date : number {
    options.inDateFormat ??= true as T;

    const ONE_DAY_IN_MILLISECONDS = 86_400_000;

    const startDateInMs = startDate.getTime();
    const daysInMs = days * ONE_DAY_IN_MILLISECONDS;

    const futureDate = new Date(startDateInMs + daysInMs);

    return (options.inDateFormat === true ? futureDate : futureDate.getTime()) as T extends true
      ? Date
      : number;
  }
}

const d = new DateTimeProvider();

const res = d.addDays(2, new Date());

res;
