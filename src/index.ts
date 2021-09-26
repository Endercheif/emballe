import * as models from "./models/index";

export default class Reddit {
  errorFunc: (e: Error) => void;

  error(err: any): any {
    throw new Error(`Method not implemented.\n${err}`);
  }

  auth: models.Auth;
  token!: AuthResponse;
  params: AuthParams;
  ready: boolean;

  constructor(params: AuthParams) {
    this.auth = new models.Auth(this, params);
    this.params = params;
    this.ready = false;

    this.errorFunc = (e: Error) => {
      throw e;
    };
  }

  subreddit(subreddit: string): models.Subreddit {
    return new models.Subreddit(this, subreddit);
  }

  private async init() {
    this.token = (await this.auth.authorize()).data;
  }

  onReady(func: () => Promise<void>) {
    if (!this.ready) {
      this.init().then(async () => {
        await func();
        return;
      });
    }
  }

  onError(func: (e: any) => Promise<void>) {
    this.errorFunc = (e: any) => {
      func(e).then();
    };
  }
}
