export class Content{
    title: string;
    index: string;
    videoDomain: string;
    videoUrl: string;
    director: string;
    starnames: string[];
    genres: string[];
    studio: string;
    duration: number;
    imgSummaryUrl: string;
    favorite: number;
    rating: number;
    view: number;
    _id: string;
    releaseDate: string;
}
export class SessionContents{
    sessionid: string;
    contents: Content[];
}
export class SessionContent{
    sessionid: string;
    content: Content;
}