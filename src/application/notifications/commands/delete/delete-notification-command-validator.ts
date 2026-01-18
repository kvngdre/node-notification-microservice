import { z } from "zod";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import { DeleteNotificationCommand } from "./delete-notification-command";

export class DeleteNotificationCommandValidator extends AbstractValidator<DeleteNotificationCommand> {
  private readonly schema = z.object({
    notificationId: z.string().trim()
  });

  public validate(request: DeleteNotificationCommand) {
    const result = this.schema.safeParse(request);
    return this.mapToValidationResult(result);
  }
}
