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
        const blog = blogsRepository.findBlogById(blogId);
    
        const createdPost: PostViewModel = {
                id: String(+new Date()),
                title,
                shortDescription,
                content,
                blogId: blog!.id,
                blogName: blog!.name
        }
         
        db.posts.push(createdPost);
        return createdPost;
},

updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string){
    let foundPost = this.findPostById(postId);

    if(foundPost){
        foundPost.title = title;
        foundPost.shortDescription = shortDescription;
        foundPost.content = content;
        foundPost.blogId = blogId;

        return true;
    }

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

