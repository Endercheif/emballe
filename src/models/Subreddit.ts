import type Reddit from "..";
import type Submission from "./Submission";
import BaseModel from "./Base";
import BaseListing from "./BaseListing";
import endpoint from "../endpoints";

export default interface Subreddit {
  kind: "t5";
  user_flair_background_color: string;
  submit_text_html: string;
  restrict_posting: boolean;
  user_is_banned: boolean;
  free_form_reports: boolean;
  wiki_enabled: boolean;
  user_is_muted: boolean;
  user_can_flair_in_sr: boolean;
  display_name: string;
  header_img: string | null;
  title: string;
  allow_galleries: boolean;
  icon_size: number[];
  primary_color: string;
  active_user_count: number;
  icon_img: string;
  display_name_prefixed: string;
  accounts_active: number;
  public_traffic: boolean;
  subscribers: number;
  user_flair_richtext: {
    e: string;
    t: string;
  }[];
  name: string;
  quarantine: boolean;
  hide_ads: boolean;
  prediction_leaderboard_entry_type: string;
  emojis_enabled: boolean;
  advertiser_category: string;
  public_description: string;
  comment_score_hide_mins: number;
  allow_predictions: boolean;
  user_has_favorited: boolean;
  user_flair_template_id: string;
  community_icon: string;
  banner_background_image: string;
  original_content_tag_enabled: boolean;
  community_reviewed: boolean;
  submit_text: string;
  description_html: string;
  spoilers_enabled: boolean;
  header_title: string;
  header_size: string | null;
  user_flair_position: string;
  all_original_content: boolean;
  has_menu_widget: boolean;
  is_enrolled_in_new_modmail: string | null;
  key_color: string;
  can_assign_user_flair: boolean;
  created: number;
  wls: number;
  show_media_preview: boolean;
  submission_type: string;
  user_is_subscriber: boolean;
  disable_contributor_requests: boolean;
  allow_videogifs: boolean;
  user_flair_type: string;
  allow_polls: boolean;
  collapse_deleted_comments: boolean;
  emojis_custom_size: string | null;
  public_description_html: string;
  allow_videos: boolean;
  is_crosspostable_subreddit: string | null;
  notification_level: string | null;
  can_assign_link_flair: boolean;
  accounts_active_is_fuzzed: boolean;
  submit_text_label: string;
  link_flair_position: string;
  user_sr_flair_enabled: boolean;
  user_flair_enabled_in_sr: boolean;
  allow_discovery: boolean;
  user_sr_theme_enabled: boolean;
  link_flair_enabled: boolean;
  subreddit_type: string;
  suggested_comment_sort: string | null;
  banner_img: string;
  user_flair_text: string;
  banner_background_color: string;
  show_media: boolean;
  id: string;
  user_is_moderator: boolean;
  over18: boolean;
  description: string;
  submit_link_label: string;
  user_flair_text_color: string;
  restrict_commenting: boolean;
  user_flair_css_class: string | null;
  allow_images: boolean;
  lang: string;
  whitelist_status: string;
  url: string;
  created_utc: number;
  banner_size: string | null;
  mobile_banner_image: string;
  user_is_contributor: boolean;
  allow_predictions_tournament: boolean;
  subscribe: Promise<void>;
}

export default class Subreddit extends BaseModel<Subreddit> {
  readonly #subreddit: string;
  readonly #special?: boolean;
  constructor(reddit: Reddit, subreddit: string, data?: Subreddit) {
    super(reddit, data);
    this.#subreddit = subreddit;

    if (
      ["all", "popular"].includes(this.#subreddit) ||
      subreddit.includes("+") ||
      subreddit.includes("-")
    ) {
      this.fetched = true;
      this.display_name = this.#subreddit;
      this.#special = true;
    }

  }


  async fetch() {
    if (!this.fetched) {
      const _data = (await this.getData(
        endpoint["subreddit_about"]!.replace("{subreddit}", this.#subreddit),
        "GET"
      ).catch(this.reddit.errorFunc)) || { data: {}, kind: "" };

      const data = {
        ..._data.data,
        _kind: _data.kind,
        subscribe: async (action: "sub" | "unsub") => {
          return await this.getData(endpoint["subscribe"], "POST", {
            params: action,
          });
        },
      } as Subreddit;
      Object.assign<this, Subreddit>(this, data);
      this.data = data;
      this.fullname = `${this._kind}${this.id}`
    }
    return this;
  }

  async banned() {
    return await this.getData(
      endpoint["list_banned"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }

  get({
    type = "hot",
    limit,
  }: {
    type?: "hot" | "new" | "top" | "controvertial" | string;
    limit?: number;
  }) {
    if (
      !["hot", "new", "top", "controvertial"].includes(type) &&
      !this.#special
    ) {
      throw Error("wrong type");
    }

    if (this.#special) {
      type = type !== "hot" ? `/${type}` : "";

      return new BaseListing<Submission>(
        this.reddit,
        `r/${this.display_name}${type}`,
        limit,
        {}
      ).iter();
    }

    return new BaseListing<Submission>(
      this.reddit,
      `r/${this.display_name}/${type}`,
      limit,
      {},
      { subreddit: this }
    ).iter();
  }

  //#region stuff
  async muted() {
    return await this.getData(
      endpoint["list_muted"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }
  async wikibanned() {
    return await this.getData(
      endpoint["list_wikibanned"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }
  async contributers() {
    return await this.getData(
      endpoint["list_contributor"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }
  async wikicontributors() {
    return await this.getData(
      endpoint["list_wikicontributor"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }
  async moderators() {
    return await this.getData(
      endpoint["list_moderator"].replace("{subreddit}", this.#subreddit),
      "GET"
    );
  }
}
//#endregion
