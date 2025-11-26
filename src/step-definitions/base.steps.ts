import { When } from "@cucumber/cucumber";
import { CucumberWorld } from "./world/cucumber.world";


When("I switch to the new brrower tab", async function (this: CucumberWorld) {
   await this.basePage.switchToNewTab();
});
