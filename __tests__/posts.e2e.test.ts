import { app } from './../src/app';
import request from "supertest";
import { HTTP_STATUSES } from "../src/utils";

describe("Posts requests", () => {

    beforeAll(async() => {
        await request(app).delete('/testing/all-data');
      });

      it("should return empty Posts array", async () => {
        await request(app)
        .get("/posts")
        .expect(HTTP_STATUSES.OK_200, [])
      });
        
      it("should return 404 for not existing post", async() => {
        await request(app)
        .get("/blogs/234")
        .expect(HTTP_STATUSES.NOT_FOUND_404)          
      });
})