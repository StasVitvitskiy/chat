declare global {
    const myChromeBrowser: WebdriverIO.Browser
    const myFirefoxBrowser: WebdriverIO.Browser
}

export class Page {
    open (path: string) {
        return browser.url(`http://localhost:5000/${path}`)
    }

    async getElem(selector: string, browserInstance: WebdriverIO.Browser = browser) {
        const elem = await browserInstance.$(selector)
        await elem.waitForExist()
        return elem
    }

    async signOut() {
        const accountIcon = await this.getAccountIcon()
        await accountIcon.click()

        const signOutBtn = await this.getSignOutBtn()
        await signOutBtn.click()
    }

    getAccountIcon() {
        return this.getElem('[data-testid="account-icon"]')
    }

    getSignOutBtn() {
        return this.getElem('[data-testid="sign-out"]')
    }
}