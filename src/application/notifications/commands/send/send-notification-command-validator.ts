import { Lifecycle, scoped } from "tsyringe";
import { z } from "zod";
import { SendNotificationCommand } from "./send-notification-command";
import { NotificationChannel } from "@domain/notifications";
import { AbstractValidator, ValidationResultType } from "@shared-kernel/abstract-validator";

@scoped(Lifecycle.ResolutionScoped)
export class SendNotificationCommandValidator extends AbstractValidator<SendNotificationCommand> {
  public validate(command: SendNotificationCommand): ValidationResultType<SendNotificationCommand> {
    const isBuffer = (value: unknown): value is Buffer => Buffer.isBuffer(value);

    const emailDataSchema = z.object({
      alias: z.string().trim().min(3).max(30),
      from: z.string().trim().min(1).email(),
      to: z.string().trim().min(1).email(),
      subject: z.string().trim().min(3).max(100),
      body: z.string().trim().min(1).max(2_000),
      attachments: z
        .array(z.object({ filename: z.string(), content: z.custom<Buffer>(isBuffer) }))
        .min(1)
        .optional()
    });

    const smsDataSchema = z.object({
      to: z
        .string()
        .trim()
        .regex(/^\+234[7-9]{1}[0-9]{9}$/, {
          message:
            "Invalid recipient phone number. Phone number is expected in international format."
        }),
      body: z.string().trim().min(1)
    });

    const pushDataSchema = z.object({
      deviceToken: z.string().trim().min(1),
      title: z.string().trim().min(1).max(100),
      body: z.string().trim().min(1),
      imageUrl: z.string().url({ message: "Invalid url" }).optional()
    });

    const dataSchema = z.union([emailDataSchema, smsDataSchema, pushDataSchema]);

    const schema = z.object({
      channel: z.nativeEnum(NotificationChannel),
      data: dataSchema
    });

    const result = schema.safeParse(command);

    return this.mapToValidationResult(result);
  }
}
