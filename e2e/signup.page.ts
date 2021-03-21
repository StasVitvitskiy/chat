import {Page} from "./page";
import {chromeUser, ffUser, userPassword} from "./users";

export class SignupPage extends Page {
    async navigate() {
        await super.open("")
        await (await this.getSignUpLink()).click()
    }

    getSignUpLink() {
        return this.getElem('a[href="/sign-up"]')
    }

    async signUp() {
        const chromeEmail = await this.getEmailInput(myChromeBrowser)
        const ffEmail = await this.getEmailInput(myFirefoxBrowser)
        const password = await this.getPasswordInput()
        const confirmPassword = await this.getConfirmPasswordInput()
        const signupBtn = await this.getSubmitBtn()

        await chromeEmail.addValue(chromeUser.email)
        await ffEmail.addValue(ffUser.email)

        await password.addValue(userPassword)
        await confirmPassword.addValue(userPassword)

        await signupBtn.click()
    }

    async fillPersonalInfo() {
        const chromeName = await this.getNameInput(myChromeBrowser)
        const ffName = await this.getNameInput(myFirefoxBrowser)
        const chromeLastName = await this.getLastNameInput(myChromeBrowser)
        const ffLastName = await this.getLastNameInput(myFirefoxBrowser)
        const submitBtn = await this.getSubmitBtn()

        await chromeName.addValue(chromeUser.name)
        await ffName.addValue(ffUser.name)

        await chromeLastName.addValue(chromeUser.lastName)
        await ffLastName.addValue(ffUser.lastName)

        await submitBtn.click()
    }

    getEmailInput(browserInstance: WebdriverIO.Browser = browser) {
        return this.getElem('#email', browserInstance)
    }

    getNameInput(browserInstance: WebdriverIO.Browser = browser) {
        return this.getElem('#name', browserInstance)
    }

    getLastNameInput(browserInstance: WebdriverIO.Browser = browser) {
        return this.getElem('#lastName', browserInstance)
    }

    getPasswordInput(browserInstance: WebdriverIO.Browser = browser) {
        return this.getElem('#password', browserInstance)
    }

    getConfirmPasswordInput(browserInstance: WebdriverIO.Browser = browser) {
        return this.getElem('#passwordConfirm', browserInstance)
    }

    getSubmitBtn() {
        return this.getElem('[type="submit"]')
    }
}