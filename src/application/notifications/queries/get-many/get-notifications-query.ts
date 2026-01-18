export class GetNotificationsQuery {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly channel?: string,
    public readonly status?: string
  ) {}
}
