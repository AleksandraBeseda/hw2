import { PostViewModel, db } from "../db/db";
import { blogsRepository } from "./blogsRepository";

export const postsRepository = {
    findPosts(){
        return db.posts;
    },

    findPostById(id: string){
        const foundPost = db.posts.find(post => post.id === id);
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
            db.posts.push(createdPost);
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
    for(let i = 0; i < db.posts.length; i++){
        if(db.posts[i].id===id){
            db.posts.splice(i, 1);
            return true;
        }
    }
    return false;
},
deleteAllPosts(){
    db.posts.length = 0;
}

}

