import { z } from "zod";
import { AbstractValidator, ValidationResultType } from "@shared-kernel/abstract-validator";
import { GetNotificationByIdQuery } from "./get-notification-by-id-query";

export class GetNotificationByIdQueryValidator extends AbstractValidator<GetNotificationByIdQuery> {
  public validate(
    request: GetNotificationByIdQuery
  ): ValidationResultType<GetNotificationByIdQuery> {
    const schema = z.object({
      notificationId: z.string().trim()
    });

    const result = schema.safeParse(request);

    return this.mapToValidationResult(result);
  }
}
