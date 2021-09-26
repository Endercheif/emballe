import {Base, Subreddit} from ".";
import Reddit from "..";

export default class BaseListing<T> extends Base<T> {
    #iterNum: number;

    constructor(
        reddit: Reddit,
        public url: string,
        public limit: number = 100,
        public _params: any,
        public modification: any = {}
    ) {
        super(reddit);
        this.#iterNum = 0;
    }

    async* [Symbol.iterator]() {
        yield* this.iter();
    }


    async* iter(): AsyncGenerator<T, void, undefined> {
        const payload: { before?: string; after?: string } = {};

        while (this.limit !== -1 && this.limit > this.#iterNum++) {
            let {
                data,
                kind,
            }: {
                kind: `${Kind}${string}`;
                data: {
                    after: string | null;
                    dist: number;
                    modhash: string | null;
                    children: { kind: `${Kind}${string}`; data: T }[];
                    before: string | null;
                };
            } = await this.getData(this.url, "GET", {params: payload});

            payload.before = data.before ?? payload.before;
            payload.after = data.after ?? payload.after;

            // @ts-ignore
            let children: T[] = data.children.map((item) => {
                let d = item.data;


                switch (kind.slice(0, 3) as Kind) {
                    case "t3_":
                        // @ts-ignore
                        return new Subreddit(this.reddit, d!.subreddit);
                    default:
                        break;
                }


                // @ts-ignore
                if (d.subreddit) {
                    // @ts-ignore
                    d.subreddit = new Subreddit(this.reddit, d.subreddit);
                }

                Object.keys(this.modification).forEach((mod) => {
                    // @ts-ignore
                    d[mod] = this.modification[mod];
                });


                if (kind.startsWith("t2_")) {
                    return d as T;
                }

                return d as T;
            });

            for (let child of children) {
                if (this.limit >= this.#iterNum++) yield child;
                else break;
            }
        }
    }
}
