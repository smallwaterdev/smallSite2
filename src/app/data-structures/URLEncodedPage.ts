export class URLEncodedPage{
    /*  list, search, meta, content
        category, pornstar, director, studio, 
        waterlater
    */
    type: string;
    /*
        list: null,
        content: id
        search: **value** e.g. big tits
        meta: [pornstar, category, studio, director], 
        category: **value**, e.g. big-tits
        pornstar: **value**, .e.g ai-mukai
        director: **value**, e.g. unknown
        studio: **value**, e.g. afro-film
        waterlater: null
    */
    value: string;
    /*
        sort value can be releaseDate, rating, view, and duration
        list, category, pornstar, director, studio can be sorted
    */ 
    sort: string;
    /*
        page
        list, search, meta, category, pornstar, director, studio can have page
    */
    page: number;
}