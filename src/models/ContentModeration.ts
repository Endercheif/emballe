import BaseModel from "./Base";
import type Reddit from "..";
import endpoint from "../endpoints";
import UserContent from "./UserContent";

export default class ContentModeration<T extends UserContent<T>> extends BaseModel<T> {
    id: string;

    constructor(reddit: Reddit, public content: T) {
        super(reddit);
        this.id = this.content.id;
        this.fullname = this.content.fullname;
    }


    async fetch({}: { refetch: boolean }) {
        return this
    }

    async approve() {
        return await this.getData(endpoint.approve, "POST", {
            params: {id: this.id},
        });
    }

    async remove({spam = false}) {
        return await this.getData(endpoint.remove, "POST", {
            params: {spam, id: this.id},
        });
    }

    async ignoreReports() {
        return await this.getData(endpoint.ignore_reports, "POST", {
            params: {id: this.id},
        });
    }

    async unignoreReports() {
        return await this.getData(endpoint.unignore_reports, "POST", {
            params: {id: this.id},
        });
    }

    async snoozeReports(reason: string) {
        return await this.getData("api/snooze_reports", "POST", {
            params: {id: this.id, reason},
        });
    }

    async unsnoozeReports(reason: string) {
        return await this.getData("api/unsnooze_reports", "POST", {
            params: {id: this.id, reason},
        });
    }

    async lock() {
        return (await this.getData(endpoint.lock, "POST", {params: {id: this.fullname}}))
    }

    /*
    * the following methods are for links only.
    * the methods above can be used on any content.
    */

    async setContestMode(state: boolean) {
        return (await this.getData(endpoint.contest_mode, "POST", {params: {id: this.fullname, state}}))
    }

    async setSuggestedSort(sort: "confidence" | "top" | "new" | "controversial" | "old" | "qa" | "live" | "blank") {
        return (await this.getData(endpoint.suggested_sort, "POST", {params: {id: this.fullname, sort}}))
    }


}
