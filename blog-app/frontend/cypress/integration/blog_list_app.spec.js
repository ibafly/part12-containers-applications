describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function () {
    cy.get("form").contains("login")
  })

  describe("Login", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3003/api/users", {
        name: "Superuser",
        username: "root",
        password: "himitsu",
      }).then(res => {
        expect(res.body).to.have.property("username", "root")
      })
    })

    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root")
      cy.get("#password").type("himitsu")
      cy.get("form").contains("login").click()

      cy.get("html").contains("Superuser logged in")
    })

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root")
      cy.get("#password").type("wrong")
      cy.get("form").contains("login").click()

      cy.get("html").should("not.contain", "root logged in")
      cy.get(".notification")
        .should("contain", "wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)") // mind the space in rgb()
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3003/api/users", {
        name: "Superuser",
        username: "root",
        password: "himitsu",
      }).then(res => {
        expect(res.body).to.have.property("username", "root")
      })
      cy.login({ username: "root", password: "himitsu" })
      cy.createBlog({
        title: "Blog created during initialization",
        author: "Robo",
        url: "https://from.before.each",
      })
    })

    it("a blog can be created", function () {
      cy.get("li").should("have.length", 1)
      cy.createBlog({
        title: "Awesome title",
        author: "Some Guy",
        url: "https://from.some.space",
      })

      cy.get("li")
        .should("have.length", 2)
        .and("contain", "Awesome title Some Guy")
    })

    it("a blog can be liked", function () {
      cy.get(".likes").parent().should("contain", "likes: 0")

      cy.get(".toggle").click()
      cy.get(".likes").click()

      cy.get(".likes").parent().should("contain", "likes: 1")
    })

    it("a blog can be deleted by its creator", function () {
      cy.get("html").should("contain", "Blog created during initialization")
      cy.get(".toggle").click()
      cy.get(".remove").parent().should("contain", "Superuser")
      cy.get(".remove").click()
      cy.get("html").should("not.contain", "Blog created during initialization")
    })

    it("but can not be deleted by other users", function () {
      cy.request("POST", "http://localhost:3003/api/users", {
        name: "Another User",
        username: "wheel",
        password: "wheelpwd",
      }).then(res => {
        expect(res.body).to.have.property("username", "wheel")
      })

      cy.login({ username: "wheel", password: "wheelpwd" })

      cy.get(".remove").should("not.exist")
    })

    it("blogs are listed according to likes with the most being first", function () {
      cy.createBlog({
        title: "One blog",
        author: "Robo",
        url: "https://from.order.test",
      })
      cy.createBlog({
        title: "Another blog",
        author: "Robo",
        url: "https://from.order.test",
      })

      cy.contains("One blog").find(".toggle").click()
      cy.contains("One blog").find(".likes").click().wait(3000)
      cy.contains("One blog").find(".likes").click().wait(3000)

      cy.contains("Another blog").find(".toggle").click()
      cy.contains("Another blog").find(".likes").click().wait(3000)

      cy.get(".likes")
        .parent()
        .then(elements => {
          const likesOrder = elements
            .map((idx, ele) => Number(ele.innerText.slice(7, -4)))
            .toArray()
          expect(likesOrder).to.deep.equal([2, 1, 0])
        })
    })
  })
})
