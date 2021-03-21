import {SignupPage} from "./signup.page";

describe("signup page", () => {
    it("creates new user", async () => {
        const page = new SignupPage()
        await page.navigate()
        await page.signUp()
        await page.fillPersonalInfo()
        await page.signOut()
    })
})