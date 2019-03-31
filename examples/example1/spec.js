describe('Simple Protractor Test', function() {
	
  it('Open Google Search page', function () {
        browser.get('https://www.google.co.in');
        expect(browser.getCurrentUrl()).toContain('www.google.co.in');
    });

    it('search Hello Selenium', function () {
		element(by.name('q')).clear();
		element(by.name('q')).sendKeys('hello selenium');
		element(by.name('btnK')).click();
        expect(browser.getCurrentUrl()).toContain('hello selenium'.replace(new RegExp(" ", 'g'), "+"));
    });

    it('Open Hello Selenium Result Page', function () {
		element(by.xpath("//div[@id='res']//div[@class='_NId'][1]//h3[@class='r']")).click();
        expect(browser.getCurrentUrl()).toContain('www.helloselenium.com');
    });
	
});
