import { runA11yTest } from '../../../src/a11y/a11y-runner';
import { PageManager } from '../../../src/page-objects/base/page-manager';

runA11yTest({
  name: 'Login Page',
  open: async (page) => {
    const pageManager = new PageManager(page);
    const loginPage = pageManager.createLoginPage();
    await loginPage.openDirectly();
  },
});