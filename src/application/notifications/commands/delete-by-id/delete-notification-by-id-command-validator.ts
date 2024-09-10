import { z } from "zod";
import { AbstractValidator, ValidationResultType } from "@shared-kernel/abstract-validator";
import { DeleteNotificationByIdCommand } from "./delete-notification-by-id-command";

export class DeleteNotificationByIdCommandValidator extends AbstractValidator<DeleteNotificationByIdCommand> {
  public validate(
    request: DeleteNotificationByIdCommand
  ): ValidationResultType<DeleteNotificationByIdCommand> {
    const schema = z.object({
      notificationId: z.string().trim()
    });

    const result = schema.safeParse(request);

    return this.mapToValidationResult(result);
  }
}
