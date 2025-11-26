@login @regression
Feature: Webdriveruniversity - Login Page

    Background: Pre conditions
        Given I navigate to webdriveruniversity homepage
        When I click on the login portal button
        And I switch to the new brrower tab

    Scenario Outline: Validate valid & invalid login
        And I type a username <username>
        And I type a password <password>
        And I click on the login button
        Then I should be presented with an alert box which contains text '<expectedAlertText>'

        Examples:
            | username  | password       | expectedAlertText    |
            | webdriver | webdriver123   | validation succeeded |
            | webdriver | webdriver12345 | validation failed    |