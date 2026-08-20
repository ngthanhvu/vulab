declare module 'imapflow' {
  export interface ImapFlowOptions {
    host: string
    port: number
    secure?: boolean
    auth: {
      user: string
      pass: string
    }
    logger?: false | import('pino').Logger
    tls?: {
      rejectUnauthorized?: boolean
    }
  }

  export interface FetchMessageObject {
    uid: number
    source: Buffer
    flags?: Set<string>
  }

  export interface MailboxObject {
    exists: number
  }

  export class ImapFlow {
    constructor(options: ImapFlowOptions)
    on(event: 'exists', listener: () => void): this
    on(event: 'error', listener: (err: Error) => void): this
    connect(): Promise<void>
    mailboxOpen(path: string): Promise<MailboxObject>
    fetch(
      query: { seq: string },
      options: { source: true; uid: true; flags: true }
    ): AsyncIterable<FetchMessageObject>
  }
}
