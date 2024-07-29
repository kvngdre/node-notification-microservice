export class CreateNotificationCommand {
  constructor(
    public readonly channel: string,
    public readonly data: string
  ) {}
}
