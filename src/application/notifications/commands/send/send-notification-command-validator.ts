import { injectable } from "inversify";
import { z } from "zod";
import { SendNotificationCommand } from "./send-notification-command";
import { NotificationChannel } from "@domain/notification/types/index";
import { AbstractValidator } from "@shared-kernel/abstract-validator";

@injectable()
export class SendNotificationCommandValidator extends AbstractValidator<SendNotificationCommand> {
  private readonly isBuffer = (value: unknown): value is Buffer => Buffer.isBuffer(value);

  private readonly emailCommandSchema = z.object({
    channel: z.literal(NotificationChannel.EMAIL),
    data: z.object({
      alias: z.string().trim().min(3).max(30),
      from: z.string().trim().min(1).email(),
      to: z.string().trim().min(1).email(),
      subject: z.string().trim().min(3).max(100),
      body: z.string().trim().min(1).max(2_000),
      attachments: z
        .array(
          z.object({
            filename: z.string(),
            content: z.custom<Buffer>(this.isBuffer)
          })
        )
        .optional()
    })
  });

  private readonly smsCommandSchema = z.object({
    channel: z.literal(NotificationChannel.SMS),
    data: z.object({
      to: z
        .string()
        .trim()
        .regex(/^\+234[7-9]{1}[0-9]{9}$/, {
          message:
            "Invalid recipient phone number. Phone number is expected in international format."
        }),
      body: z.string().trim().min(1)
    })
  });

  private readonly pushCommandSchema = z.object({
    channel: z.literal(NotificationChannel.PUSH),
    data: z.object({
      deviceToken: z.string().trim().min(1),
      title: z.string().trim().min(1).max(100),
      body: z.string().trim().min(1),
      imageUrl: z.string().url({ message: "Invalid url" }).optional()
    })
  });

  private readonly schema = z.discriminatedUnion("channel", [
    this.emailCommandSchema,
    this.smsCommandSchema,
    this.pushCommandSchema
  ]);

  public validate(command: SendNotificationCommand) {
    const result = this.schema.safeParse(command);
    return this.mapToValidationResult(result);
  }
}
