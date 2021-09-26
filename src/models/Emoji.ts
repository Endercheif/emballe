import type Reddit from "../index";
import BaseModel from "./Base";
import Subreddit from "./Subreddit";

// export default interface Emoji {}

export default class Emoji extends BaseModel {
    constructor(reddit: Reddit, public subreddit: Subreddit, data?: any){
        super(reddit, data);
    }


}
