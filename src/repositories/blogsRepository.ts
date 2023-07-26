
export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string
}

let blogs: BlogViewModel[] =[
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

export const blogsRepository = {
    findBlogs(){
        return blogs;
    },

    findBlogById(id: string){
        const foundBlog = blogs.find(blog => blog.id === id);
        return foundBlog;
    },
    
    createBlog(name: string, description: string, websiteUrl: string){
        const createdBlog: BlogViewModel = {
            id: String(+(new Date())),
            name,
            description,
            websiteUrl
        };
        blogs.push(createdBlog);
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
        for(let i = 0; i< blogs.length; i++){
            if(blogs[i].id===id){
                blogs.splice(i, 1);
              return true;
            }
          }
          return false;
    },

    deleteAllBlogs(){
        blogs.length = 0;
     }

};