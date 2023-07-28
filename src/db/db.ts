export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
};

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string
};

export type DBViewModel = {
    posts: PostViewModel[],
    blogs: BlogViewModel []
};


export const db: DBViewModel = {
    posts: [
        {
            id: "10",
            title: "Microservices sap",
            shortDescription: "No infirmation, only magic",
            content: "some pictures, no examples",
            blogId: "1",
            blogName: "Marshal"
        }
    ],
    blogs: [
        {
            id: "1",
            name: "Marshal",
            description: "little clever mouse",
            websiteUrl: "https//notice.com"
        },
        {
            id: "2",
            name: "Witch",
            description: "elementary level",
            websiteUrl: "https://www.youtube.com"
        }
    ]
}