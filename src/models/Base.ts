import axios, {AxiosRequestConfig} from "axios";
import type Reddit from "..";

// base class for all models

export default abstract class BaseModel<T = { [index: string]: any }> {
    params: AuthParams;
    fetched: boolean;
    readonly #config: (endpoint: string, method: "POST" | "GET") => AxiosRequestConfig;
    protected _data: T | undefined;

    [index: string]: any;

    protected constructor(public readonly reddit: Reddit, data?: T) {
        this.params = reddit.params;
        this.fetched = !!data;

        this.#config = (endpoint: string, method: "POST" | "GET") => {
            return {
                url: `https://oauth.reddit.com/${endpoint}`,
                method: method,
                headers: {
                    "User-Agent": this.params.userAgent,
                    "Authorization": `Bearer ${this.reddit.token.access_token}`,
                } as AxiosRequestConfig,
            };
        };

        if (data) this.data = data;
    }

    async getData(
        endpoint: string,
        method: "POST" | "GET",
        args: AxiosRequestConfig = {}
    ) {
        const config = this.#config(endpoint, method);

        return (await axios({...config, ...args})).data;
    }

    get data() {
        if (this.fetched && this._data) {
            return this._data;
        } else {
            throw Error(
                `Data for Model has not been fetched. Try \`await model.fetch({refetch: true})\``
            );
        }
    }

    set data(value: T) {
        this._data = value;
    }


    equals(other: T): boolean {
        return typeof other === typeof this;

    }

}


