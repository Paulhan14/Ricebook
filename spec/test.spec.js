/*
 * Test suite for auth
 */
require("es6-promise").polyfill();
require("isomorphic-fetch");

const url = (path) => `http://localhost:4200${path}`;
let cookie;
let oneID;
let cmtID;

describe("Validate Functionality", () => {

	it("should register a user", (done) => {
		fetch(url("/register"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: "testUser",
				password: "123",
				dob: "1998-05-29",
				email: "tu111@rice.edu",
				zipcode: "77005",
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				expect(res.username).toEqual("testUser");
				expect(res.result).toEqual("success");
				done();
			});
	});

	it("should login the user", (done) => {
		let loginUser = { username: "testUser", password: "123" };
		fetch(url("/login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(loginUser),
		})
			.then((res) => {
                cookie = res.headers.get("set-cookie");
				return res.json();
			})
			.then((res) => {
				expect(res.username).toEqual("testUser");
				expect(res.result).toEqual("success");
				done();
			});
	});

	it("should add new article", (done) => {
		let post = { text: "a new article" };
		fetch(url("/article"), {
			method: "POST",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
			body: JSON.stringify(post),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
					expect(res.articles[0].author).toEqual("testUser");
					expect(res.articles[0].text).toEqual("a new article");
					oneID = res.articles[0]._id;
				}
				done();
			});
	});

	it("should add another new article", (done) => {
		let post = { text: "another new article" };
		fetch(url("/article"), {
			method: "POST",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
			body: JSON.stringify(post),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
					expect(res.articles[1].author).toEqual("testUser");
					expect(res.articles[1].text).toEqual("another new article");
				}
				done();
			});
	});

	it("should give me two or more articles", (done) => {
		fetch(url("/articles"), {
			method: "GET",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
					expect(res.articles.length).toBeGreaterThan(1);
				} 
				done();
			});
	});

	it("should return an article with a specified id", (done) => {
		fetch(url("/articles/" + oneID), {
			method: "GET",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
                    expect(res.articles.length).toBe(1);
                    expect(res.articles[0].author).toEqual("testUser");
                }
				done();
			});
	});

	it("should return articles with a specified user name", (done) => {
		fetch(url("/articles/testUser"), {
			method: "GET",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
                    expect(res.articles.length).toBeGreaterThan(1);
                    expect(res.articles[0].author).toEqual("testUser");
					expect(res.articles[1].author).toEqual("testUser");
                }
				done();
			});
	});

	it("should add a new comment", (done) => {
		let comment = { text: "this is a comment", commentId: "-1" };
		fetch(url("/articles/" + oneID), {
			method: "PUT",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
			body: JSON.stringify(comment),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
                    expect(res.articles.length).toBeGreaterThan(1);
                    expect(res.articles[0].author).toEqual("testUser");
					if (res.articles[0].comments instanceof Array) {
						expect(res.articles[0].comments.length).toBeGreaterThan(0);
						cmtID = res.articles[0].comments[0];
					}
                }
				done();
			});
	});

	it("should update a comment", (done) => {
		let comment = { text: "this is a updated comment", commentId: cmtID };
		fetch(url("/articles/" + oneID), {
			method: "PUT",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
			body: JSON.stringify(comment),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.articles instanceof Array) {
                    expect(res.articles.length).toBeGreaterThan(1);
                    expect(res.articles[0].author).toEqual("testUser");
                }
				done();
			});
	});

	it("should put headline", (done) => {
		let headline = { headline: "Happy" };
		fetch(url("/headline"), {
			method: "PUT",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
			body: JSON.stringify(headline),
		})
			.then((res) => res.json())
			.then((res) => {
				expect(res.username).toEqual("testUser");
				expect(res.headline).toEqual("Happy");
				done();
			});
	});
    
	it("should get headline", (done) => {
		fetch(url("/headline"), {
			method: "GET",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				expect(res.username).toEqual("testUser");
				expect(res.headline).toEqual("Happy");
				done();
			});
	});

    it("should get headline, given userName", (done) => {
		fetch(url("/headline/testUser"), {
			method: "GET",
			headers: { "Content-Type": "application/json", "Cookie": cookie },
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				expect(res.username).toEqual("testUser");
				expect(res.headline).toEqual("Happy");
				done();
			});
	});

    it("should logout the user", (done) => {
		fetch(url("/logout"), {
			method: "PUT",
			headers: { "Content-Type": "application/json", "Cookie": cookie},
		})
			.then((res) => {
                expect(res.status).toEqual(200)
                done();
			})
	});
});
