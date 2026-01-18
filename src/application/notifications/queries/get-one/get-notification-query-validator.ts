import { z } from "zod";
import { AbstractValidator, ValidationResultType } from "@shared-kernel/abstract-validator.js";
import { GetNotificationQuery } from "./get-notification-query.js";

export class GetNotificationQueryValidator extends AbstractValidator<GetNotificationQuery> {
  private readonly schema = z.object({
    notificationId: z.string().trim()
  });

  public validate(request: GetNotificationQuery): ValidationResultType<GetNotificationQuery> {
    const result = this.schema.safeParse(request);
    return this.mapToValidationResult(result);
  }
}
