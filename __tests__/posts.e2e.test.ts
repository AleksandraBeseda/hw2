import { RouterPaths, app } from './../src/app';
import request from "supertest";
import { HTTP_STATUSES } from "../src/utils";
import { authHeader } from './blogs.e2e.test';

describe("Posts requests", () => {

    beforeAll(async() => {
        await request(app).delete(RouterPaths.testing);
      });

      it("should return empty Posts array", async () => {
        await request(app)
        .get(RouterPaths.posts)
        .expect(HTTP_STATUSES.OK_200, [])
      });
        
      it("should return 404 for not existing Post", async() => {
        await request(app)
        .get(RouterPaths.blogs + `/` + 234)
        .expect(HTTP_STATUSES.NOT_FOUND_404)          
      });

      it("shouldn't create new Post because NO AUTH", async () => {
        await request(app)
        .post(RouterPaths.posts)
        .expect(HTTP_STATUSES.UNAUTHORIZED_401)
      });


      const mockDataBLOGCorrectParam = {
        name: "Zazie",
        description: "Zazie responds rarely",
        websiteUrl: "https://www.zazie.com"
      };

      let createdBlog: any = null;
      it("should create BLOG because AUTH and correct object", async () => {
        const response = await request(app)
        .post(RouterPaths.blogs)
        .set(authHeader)
        .send(mockDataBLOGCorrectParam)
        .expect(HTTP_STATUSES.CREATED_201);
    
        createdBlog = response.body;
    
        await request(app)
        .get(RouterPaths.blogs)
        .expect(HTTP_STATUSES.OK_200, [createdBlog]);

        await request(app)
        .get(RouterPaths.blogs + `/`+ createdBlog.id)
        .expect(HTTP_STATUSES.OK_200, createdBlog)
      });

      
      const mockIncorrectPost1 = {
        title: "Ok",
        shortDescription: "Ok",
        content: "Ok",
        blogId: "1000000"
      };
      const errorIncorrectBlogId =  {
        errorsMessages: [ { message: 'Blog is not found in DB', field: 'blogId' } ]
      } 
      it("shouldn't create POST because incorrect blogId", async () => {
        await request(app)
        .post(RouterPaths.posts)
        .set(authHeader)
        .send(mockIncorrectPost1)
        .expect(HTTP_STATUSES.BAD_REQUEST_400, errorIncorrectBlogId)
      });

      const mockIncorrectPost2 = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: "0"
      };

      const errorIncorrectParams = {
        errorsMessages: [
          { message: 'title is incorect or wrong format', field: 'title' },
          {
            message: 'shortDescription is incorect or wrong format',
            field: 'shortDescription'
          },
          {
            message: 'content is incorect or wrong format',
            field: 'content'
          },
          { message: 'Blog is not found in DB', field: 'blogId' }
        ]
      }

      it("shouldn't create POST because incorrect params", async () => {
        await request(app)
        .post(RouterPaths.posts)
        .set(authHeader)
        .send(mockIncorrectPost2)
        .expect(HTTP_STATUSES.BAD_REQUEST_400,  errorIncorrectParams)
      });

      let newPost1: any = null;
      it("should create new Post1", async() => {

        const response1 = await request(app)
        .get(RouterPaths.blogs + `/`+ createdBlog?.id)
        .expect(HTTP_STATUSES.OK_200, createdBlog);

        const blogId = response1.body.id;

        const dataPost = {
          title: "Okw",
          shortDescription: "Okw",
          content: "Okw",
          blogId: blogId
        }

        const response2 = await request(app)
        .post(RouterPaths.posts)
        .set(authHeader)
        .send(dataPost)
        .expect(HTTP_STATUSES.CREATED_201);

        newPost1 = response2.body;

        await request(app)
        .get(RouterPaths.posts + '/' + newPost1.id)
        .expect(HTTP_STATUSES.OK_200, newPost1);   
      });

       it("shouldn't update new post because UNAUTH", async() => {
        await request(app)
        .put(RouterPaths.posts + '/' + createdBlog?.id)
        .expect(HTTP_STATUSES.UNAUTHORIZED_401);
      });

      let newPost2: any = null;
      it("should create new Post2", async() => {

        const dataPost = {
          title: "Okw2",
          shortDescription: "Okw2",
          content: "Okw2",
          blogId: createdBlog.id
        }

        const response2 = await request(app)
        .post(RouterPaths.posts)
        .set(authHeader)
        .send(dataPost)
        .expect(HTTP_STATUSES.CREATED_201);

        newPost2 = response2.body;
  
      await request(app)
      .get(RouterPaths.posts)
      .expect(HTTP_STATUSES.OK_200, [newPost1, newPost2]);   
    });

    it("shouldn't update newPost2 because incorrect params", async() => {

      const incorrectUpdateDataPost = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: "1231"
      };

      await request(app)
      .put(RouterPaths.posts + '/' + newPost2.id)
      .set(authHeader)
      .send(incorrectUpdateDataPost)
      .expect(HTTP_STATUSES.BAD_REQUEST_400, errorIncorrectParams)

    });

    it("shouldn't update newPost2 because such PostID doesn exist", async() => {

      const correctUpdateDataPost = {
        title: "Test",
        shortDescription: "test",
        content: "test",
        blogId: createdBlog.id
      };

      await request(app)
      .put(RouterPaths.posts + '/' +"fhdbjfblalsn93ueud")
      .set(authHeader)
      .send(correctUpdateDataPost)
      .expect(HTTP_STATUSES.NOT_FOUND_404)

    });

  
    let updatedPost2: any = null;
    it("should update newPost2 ", async() => {

      await request(app)
      .get(RouterPaths.posts)
      .expect(HTTP_STATUSES.OK_200, [newPost1, newPost2]);

     const dataPostUpdate = {
      title: "little",
      shortDescription: "honey",
      content: "compensation",
      blogId: createdBlog.id
    };

     await request(app)
     .put(RouterPaths.posts + '/' + newPost2.id)
     .set(authHeader)
     .send(dataPostUpdate)
     .expect(HTTP_STATUSES.NO_CONTENT_204)

     const response = await request(app)
     .get(RouterPaths.posts + '/' + newPost2.id);

     updatedPost2 = response.body;

      expect(updatedPost2).toEqual({
      id: newPost2.id,
      title: dataPostUpdate.title,
      shortDescription: dataPostUpdate.shortDescription,
      content: dataPostUpdate.content,
      blogId: createdBlog.id,
      blogName: createdBlog.name
    }); 

  }); 

   it("delete post by id", async () => {
    await request(app)
    .get(RouterPaths.posts)
    .expect(HTTP_STATUSES.OK_200, [newPost1, updatedPost2]);

    await request(app)
    .delete(RouterPaths.posts + '/' + updatedPost2.id)
    .set(authHeader)
    .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
    .get(RouterPaths.posts)
    .expect(HTTP_STATUSES.OK_200, [newPost1]);
  });

  it("delete all data", async () =>{
    await request(app)
    .delete(RouterPaths.testing)
    .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
    .get(RouterPaths.posts)
    .expect(HTTP_STATUSES.OK_200, []); 

  });  

  
})