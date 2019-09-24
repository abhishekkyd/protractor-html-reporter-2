
var jasmineReporters = require('jasmine-reporters');
var htmlReporter = require('../lib/protractor-xml2html-reporter');
var fs = require('fs-extra');

const capitalize = (s) => {
  if (typeof s !== 'string') {
    return ''
  } else {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}

exports.config = {
	
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    framework: 'jasmine2',

    onPrepare: function () {
        // Default window size
        browser.driver.manage().window().maximize();
        // Default implicit wait
        browser.manage().timeouts().implicitlyWait(60000);
        // Angular sync for non angular apps
        browser.ignoreSynchronization = true;

        fs.emptyDir('./reports/xml/', function (err) {
            console.log(err);
        });

        fs.emptyDir('./reports/screenshots/', function (err) {
            console.log(err);
        });

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './reports/xml/',
            filePrefix: 'xmlresults'
        }));

        jasmine.getEnv().addReporter({
            specDone: function (result) {
                //if (result.status == 'failed') {
					browser.getCapabilities().then(function (caps) {
						var browserName = caps.get('browserName');

						browser.takeScreenshot().then(function (png) {
							var stream = fs.createWriteStream('./reports/screenshots/' + capitalize(browserName) + '-' + result.fullName + '.png');
							stream.write(new Buffer(png, 'base64'));
							stream.end();
						});
					});
                //}
            }
        });
    },

    onComplete: function () {
        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');

            if (typeof caps.get('browserVersion') === 'undefined') {
                browserVersion = caps.get('Version')
            } else {
                browserVersion = caps.get('browserVersion')
            }

            if (typeof caps.get('platform') === 'undefined') {
                platform = caps.get('platformName')
            } else{
                platform = caps.get('platform')
            }

            testConfig = {
                appVersion: 'someVersion',
                reportTitle: 'Protractor Test Execution Report',
                outputPath: './reports/',
                outputFilename: 'ProtractorTestReport',
                screenshotPath: './screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: false,
                testPlatform: platform
            };
            new htmlReporter().from('./reports/xml/xmlresults.xml', testConfig);
        });
    },

    allScriptsTimeout: 120000,
    getPageTimeout: 120000,
    maxSessions: 1,

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        onComplete: null,
        // If true, display spec names.
        isVerbose: false,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 120000
    }
};
