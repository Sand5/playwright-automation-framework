@regression  @contact-us
Feature: WebdriverUniversity.com - Contact Us Page

    Background: Precondition
        Given I navigate to webdriveruniversity homepage
        When I click on the contact us button
        And I switch to the new brrower tab

    Scenario: Vaild Contact Us Form Submission - Using fixed data In the step definitions file
        And I type a first name
        And I type a last name
        And I enter an email address
        And I type a comment
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    Scenario: Invaild Contact Us Form Submission - Using fixed data In the step definitions file
        And I type a first name
        And I type a last name
        And I type a comment
        And I click on the submit button
        Then I should be presented with a unsuccessful contact us submission message

    Scenario: Vaild Contact Us Form Submission - Using specific data in the feature file
        And I type a specific first name "Paul"
        And I type a specific last name "Jones"
        And I enter a specific email address "paul_smith@exmaple.com"
        And I type specific comment "This is a specific comment" and a number 2 within the comment iput field
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    Scenario: Vaild Contact Us Form Submission - Using fakerjs to generate random data
        And I type a random first name
        And I type a random last name
        And I enter a random email address
        And I type a comment
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    Scenario Outline: Validate Contact Us Page
        And I type a first name "<firstName>" and a last name "<lastName>"
        And I type a email address "<emailAddress>" and a comment "<comment>"
        And I click on the submit button
        Then I should be presented with header text "<message>"

        Examples:
            | firstName | lastName | emailAddress           | comment         | message                                                       |
            | Paul      | Smith    | paul_smith@exmaple.com | Just some text  | Thank You for your Message!                                   |
            | Mya       | Smith    | mya_smith@exmaple.com  | Just some text  | Thank You for your Message!                                   |
            |           |          |                        |                 | Error: all fields are required \nError: Invalid email address |
            | Sam       | Davis    | sam_davis              | This is comment | Error: Invalid email address                                  |
