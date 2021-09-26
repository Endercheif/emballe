import BaseModel from "./Base";
import type Reddit from "../index";
import endpoint from "../endpoints";


export default abstract class UserContent<T> extends BaseModel<T> {
    protected constructor(reddit: Reddit, data?: T) {
        super(reddit, data);
    }

    abstract fetch({refetch}: { refetch: boolean }): Promise<T>

    async reply(text: string) {
        return (await this.getData(endpoint.comment, "POST", {params: {thing_id: this.fullname, text}}))
    }

    async delete(): Promise<void> {
     return (await this.getData(endpoint.del, "POST", {params: {id: this.fullname}}))
    }

    async editUserText(text: string) {
        return (await  this.getData(endpoint.edit, "POST", {params: {thing_id: this.fullname, text}}))
    }

    async hide() {
        return (await this.getData(endpoint.hide, "POST", {params: {id: this.fullname}}))
    }
    async unhide() {
        return (await this.getData(endpoint.unhide, "POST", {params: {id: this.fullname}}))
    }

    async report(reason: string) {
        if (reason.length > 100) {
            throw Error('reason.length > 100')
        }
        return (await this.getData(endpoint.report, "POST", {params: {thing_id: this.fullname, reason}}))
    }

    async save() {
        return (await this.getData(endpoint.save, "POST", {params: {id: this.fullname}}))
    }

    async sendreplies(state: boolean) {
        return (await this.getData(endpoint.sendreplies, "POST", {params: {id: this.fullname, state}}))
    }






}
