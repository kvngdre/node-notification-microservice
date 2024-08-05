import { Lifecycle, scoped } from "tsyringe";
import { z } from "zod";
import { AbstractValidator, ValidationResultType } from "@shared-kernel/abstract-validator";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationChannel, NotificationStatus } from "@domain/notifications";

@scoped(Lifecycle.ResolutionScoped)
export class CreateNotificationCommandValidator extends AbstractValidator<CreateNotificationCommand> {
  public validate(
    request: CreateNotificationCommand
  ): ValidationResultType<CreateNotificationCommand> {
    const schema = z.object({
      channel: z.nativeEnum(NotificationChannel),
      data: z.string().trim().min(1).max(1086),
      retryCount: z.number().min(0).max(3).optional(),
      status: z.nativeEnum(NotificationStatus).optional()
    });

    const result = schema.safeParse(request);

    return this.mapToValidationResult(result);
  }
}
