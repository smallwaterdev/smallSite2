export class Meta{
    field: string;
    name: string;
    profile_url: string;
    intro: string;
    counter: number;
}
export class SessionMeta{
    sessionid: string;
    meta: Meta;
}
export class SessionMetas{
    sessionid: string;
    metas: Meta[];
}

