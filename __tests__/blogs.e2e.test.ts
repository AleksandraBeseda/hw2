import { RouterPaths, app } from './../src/app';
import request from "supertest";
import { HTTP_STATUSES } from "../src/utils";
import { BlogViewModel } from '../src/db/db';

 export const invalidbjWithAllParams = {
  "errorsMessages": [
    {
      "message": "Name should be less then 15 letters",
      "field": "name"
    },
    {
      "message": "Description should be less then 500 letters",
      "field": "description"
    },
    {
      "message": "Invalid value",
      "field": "websiteUrl"
      }
  ]
};


export const authHeader = {Authorization : `Basic ` + btoa("admin:qwerty")};

describe("Blogs requests", () => {
  
  beforeAll(async() => {
    await request(app).delete(RouterPaths.testing);
  });
  
  it("should return empty Blogs array", async () => {
    await request(app)
    .get(RouterPaths.blogs)
    .expect(HTTP_STATUSES.OK_200, [])
  });
    
  it("should return 404 for not existing Blog", async() => {
    await request(app)
    .get("/posts/234")
    .expect(HTTP_STATUSES.NOT_FOUND_404)          
  });

  const mockDataCorrectParamBlog1 = {
    id: "0",
    name: "Zazie",
    description: "Zazie responds rarely",
    websiteUrl: "https://www.zazie.com"
  };

  it("shouldn't create new Blog because NO AUTH", async () => {
    await request(app)
    .post(RouterPaths.blogs)
    .send(mockDataCorrectParamBlog1)
    .expect(HTTP_STATUSES.UNAUTHORIZED_401)
  });

  let createdBlog1: any | BlogViewModel = null;
  it("should create new Blog 1 because AUTH and correct object", async () => {
    const response = await request(app)
    .post(RouterPaths.blogs)
    .set(authHeader)
    .send(mockDataCorrectParamBlog1)
    .expect(HTTP_STATUSES.CREATED_201);

    createdBlog1 = response.body;

    await request(app)
    .get(RouterPaths.blogs)
    .expect(HTTP_STATUSES.OK_200, [createdBlog1])

  });

  const mockDataIncorrectParamBlog = {
    name: "",
    description: "",
    websiteUrl: ""
  };

  it("shouldn't create new blog because of wrong params", async() => {
    await request(app)
    .post(RouterPaths.blogs)
    .set(authHeader)
    .send(mockDataIncorrectParamBlog)
    .expect(HTTP_STATUSES.BAD_REQUEST_400, invalidbjWithAllParams);

    await request(app)
    .get(RouterPaths.blogs)
    .expect(HTTP_STATUSES.OK_200, [createdBlog1])
  });

  const mockDataCorrectParamBlog2 = {
    id: "0",
    name: "Zazie",
    description: "Zazie responds rarely",
    websiteUrl: "https://www.zazie.com"
  };

  let createdBlog2: any | BlogViewModel = null;
  it("should create new blog 2 because AUTH and correct object", async () => {
    const response = await request(app)
    .post(RouterPaths.blogs)
    .set(authHeader)
    .send(mockDataCorrectParamBlog2)
    .expect(HTTP_STATUSES.CREATED_201);

    createdBlog2 = response.body;

    await request(app)
    .get(RouterPaths.blogs)
    .expect(HTTP_STATUSES.OK_200, [createdBlog1, createdBlog2])

  });
  
let mockDataUpdateBlog1 = {
  name: "Arturs", 
  description: "Good man", 
  websiteUrl: "https://arturs.ru"};

let updatedBlog1: any = null; 
  it("should update createdBlog1", async () => {
     await request(app)
    .put(RouterPaths.blogs+'/'+ createdBlog1.id)
    .set(authHeader)
    .send(mockDataUpdateBlog1)
    .expect(HTTP_STATUSES.NO_CONTENT_204)

    updatedBlog1 = {
      id: createdBlog1.id,
      name: mockDataUpdateBlog1.name,
      description: mockDataUpdateBlog1.description,
      websiteUrl: mockDataUpdateBlog1.websiteUrl
    };

    await request(app)
    .get(RouterPaths.blogs + `/`+ createdBlog1.id)
    .expect(HTTP_STATUSES.OK_200, updatedBlog1)

    await request(app)
    .get(RouterPaths.blogs)
    .expect(HTTP_STATUSES.OK_200, [updatedBlog1, createdBlog2])

  });

  it("shouldn't update blog because of incorrect ID ", async () => {
    await request(app)
   .put(RouterPaths.blogs + `/`+ 1028324)
   .set(authHeader)
   .send(mockDataUpdateBlog1)
   .expect(HTTP_STATUSES.NOT_FOUND_404)

   await request(app)
   .get(RouterPaths.blogs)
   .expect(HTTP_STATUSES.OK_200, [updatedBlog1, createdBlog2])

 });

 it("shouldn't update blog because of incorrect body params ", async () => {
  await request(app)
 .put(RouterPaths.blogs + `/`+ createdBlog2.id)
 .set(authHeader)
 .send(mockDataIncorrectParamBlog)
 .expect(HTTP_STATUSES.BAD_REQUEST_400, invalidbjWithAllParams);

 await request(app)
 .get(RouterPaths.blogs)
 .expect(HTTP_STATUSES.OK_200, [updatedBlog1, createdBlog2])

});

 it("should delete blog by ID", async() => {
  await request(app)
  .delete(RouterPaths.blogs + `/`+createdBlog1.id)
  .set(authHeader)
  .expect(HTTP_STATUSES.NO_CONTENT_204);

  await request(app)
  .get(RouterPaths.blogs)
  .expect(HTTP_STATUSES.OK_200, [createdBlog2])
 });

 it("shouldn't delete blog because such ID doesn't exist", async() => {
  await request(app)
  .delete(RouterPaths.blogs + `/`+1234567890)
  .set(authHeader)
  .expect(HTTP_STATUSES.NOT_FOUND_404)

 });

 it("should delete all data", async() => {
  await request(app)
  .delete(RouterPaths.testing)
  .expect(HTTP_STATUSES.NO_CONTENT_204);

  await request(app)
  .get(RouterPaths.blogs)
  .expect(HTTP_STATUSES.OK_200, [])

 });

});