import AxeBuilder from '@axe-core/playwright';
import { Page } from 'playwright';

export async function runAxe(page: Page) {
  return await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
}