import { BlogViewModel, db } from "../db/db";

export const blogsRepository = {
    findBlogs(){
        return db.blogs;
    },

    findBlogById(id: string){
        const foundBlog = db.blogs.find(blog => blog.id === id);
        return foundBlog;
    },
    
    createBlog(name: string, description: string, websiteUrl: string){
        const createdBlog: BlogViewModel = {
            id: String(+(new Date())),
            name,
            description,
            websiteUrl
        };
        db.blogs.push(createdBlog);
        return createdBlog;
    },

    updateBlog(id: string, name: string, description: string, websiteUrl: string){
        const foundBlog = blogsRepository.findBlogById(id);
        if(foundBlog){
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    },

    deleteBlog(id: string){
        for(let i = 0; i < db.blogs.length; i++){
            if(db.blogs[i].id===id){
                db.blogs.splice(i, 1);
              return true;
            }
          }
          return false;
    },

    deleteAllBlogs(){
        db.blogs.length = 0;
     }

};