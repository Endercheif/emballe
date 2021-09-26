import type Reddit from "..";
import Subreddit from "./Subreddit";
import endpoint from "../endpoints";
import ContentModeration from "./ContentModeration";
import UserContent from "./UserContent";

export default interface Submission {
    // fetch({}: { refetch: boolean }): Promise<void>;
    // mod(): Promise<ContentModeration>;
    approved_at_utc?: any;
    subreddit: Subreddit;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title?: any;
    gilded: number;
    clicked: boolean;
    title: string;
    link_flair_richtext: {
        e: string;
        t: string;
    }[];
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: number;
    link_flair_css_class: string;
    downs: number;
    thumbnail_height: number;
    top_awarded_type?: any;
    hide_score: boolean;
    name: string;
    quarantine: boolean;
    link_flair_text_color: string;
    upvote_ratio: number;
    author_flair_background_color?: any;
    ups: number;
    total_awards_received: number;
    media_embed: object;
    thumbnail_width: number;
    author_flair_template_id?: any;
    is_original_content: boolean;
    user_reports: any[];
    secure_media?: any;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category?: any;
    secure_media_embed: object;
    link_flair_text: string;
    can_mod_post: boolean;
    score: number;
    approved_by?: any;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean;
    author_flair_css_class?: any;
    author_flair_richtext: any[];
    gildings: unknown;
    post_hint: string;
    content_categories?: any;
    is_self: boolean;
    subreddit_type: string;
    created: number;
    link_flair_type: string;
    wls: number;
    removed_by_category?: any;
    banned_by?: any;
    author_flair_type: string;
    domain: string;
    allow_live_comments: boolean;
    selftext_html?: any;
    likes?: any;
    suggested_sort?: any;
    banned_at_utc?: any;
    url_overridden_by_dest: string;
    view_count?: any;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    preview: Preview;
    all_awardings: Allawarding[];
    awarders: any[];
    media_only: boolean;
    link_flair_template_id: string;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text?: any;
    treatment_tags: any[];
    visited: boolean;
    removed_by?: any;
    mod_note?: any;
    distinguished?: any;
    subreddit_id: string;
    author_is_blocked: boolean;
    mod_reason_by?: any;
    num_reports?: any;
    removal_reason?: any;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons?: any;
    author: string;
    discussion_type?: any;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: string;
    contest_mode: boolean;
    mod_reports: any[];
    author_patreon_flair: boolean;
    author_flair_text_color?: any;
    permalink: string;
    parent_whitelist_status: string;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media?: any;
    is_video: boolean;
}

interface Allawarding {
    giver_coin_reward?: number;
    subreddit_id?: string;
    is_new: boolean;
    days_of_drip_extension: number;
    coin_price: number;
    id: string;
    penny_donate?: number;
    award_sub_type: string;
    coin_reward: number;
    icon_url: string;
    days_of_premium: number;
    tiers_by_required_awardings?: unknown;
    resized_icons: Source[];
    icon_width: number;
    static_icon_width: number;
    start_date?: any;
    is_enabled: boolean;
    awardings_required_to_grant_benefits?: number;
    description: string;
    end_date?: any;
    subreddit_coin_reward: number;
    count: number;
    static_icon_height: number;
    name: string;
    resized_static_icons: Source[];
    icon_format?: string;
    icon_height: number;
    penny_price?: number;
    award_type: string;
    static_icon_url: string;
}

interface Preview {
    images: Image[];
    enabled: boolean;
}

interface Image {
    source: Source;
    resolutions: Source[];
    variants: object;
    id: string;
}

interface Source {
    url: string;
    width: number;
    height: number;
}

export default // @ts-ignore
class Submission extends UserContent<Submission> {
    constructor(reddit: Reddit, public id: string, data?: Submission) {
        super(reddit, data);
    }

    async fetch({refetch = false}: { refetch: boolean }) {
        if (!this.fetch || refetch) {
            let data = (
                await this.getData(endpoint.submission.replace("{id}", this.id), "GET")
            ).data;
            this.fetched = true;

            Object.assign<this, Submission>(this, data);

        }
        return this;
    }

    async mod(): Promise<ContentModeration<T = Submission>> {
        return new ContentModeration<Submission>(this.reddit, this);
    }

    async marknsfw() {
        return (await this.getData(endpoint.marknsfw, "POST", {params: {id: this.fullname}}))
    }
}
