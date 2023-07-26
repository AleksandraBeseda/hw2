import { blogsRepository } from "./blogsRepository";

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
};

let posts: PostViewModel[] = [
    {
        id: "10",
        title: "Microservices sap",
        shortDescription: "No infirmation, only magic",
        content: "some pictures, no examples",
        blogId: "321",
        blogName: "sap destination services"
    }
];

export const postsRepository = {
    findPosts(){
        return posts;
    },

    findPostById(id: string){
        const foundPost = posts.find(post => post.id === id);
        return foundPost;
    },

    createPost(title: string, shortDescription: string, content: string, blogId: string){
        const existingBlog = blogsRepository.findBlogById(blogId);
        if(existingBlog){
            const createdPost: PostViewModel = {
                id: String(+new Date()),
                title,
                shortDescription,
                content,
                blogId: existingBlog.id,
                blogName: existingBlog.name
            };
            posts.push(createdPost);
        return createdPost;
    };
    return null;
},

updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string){
    const existingBlog = blogsRepository.findBlogById(blogId);
    let foundPost = postsRepository.findPostById(postId);
    if(existingBlog && foundPost){
        foundPost.title = title;
        foundPost.shortDescription = shortDescription;
        foundPost.content = content;
        foundPost.blogId = blogId;
    return true;
};
return false;
},



    deletePost(id: string){
        for(let i = 0; i< posts.length; i++){
            if(posts[i].id===id){
                posts.splice(i, 1);
              return true;
            }
          }
          return false;
    },

    deleteAllPosts(){
        posts.length = 0
    }
}

