import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until } from 'selenium-webdriver';

@Injectable()
export class SeleniumService {
  async applyForJob(platform: string, jobTitle: string) {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
      await driver.get('https://www.linkedin.com/login');
      await driver
        .findElement(By.id('username'))
        .sendKeys('ton.email@gmail.com');
      await driver
        .findElement(By.id('password'))
        .sendKeys('tonMotDePasse', Key.RETURN);

      await driver.wait(
        until.elementLocated(By.className('search-global-typeahead__input')),
        5000,
      );
      await driver
        .findElement(By.className('search-global-typeahead__input'))
        .sendKeys(jobTitle, Key.RETURN);

      await driver.sleep(2000); // Attente pour le chargement

      const jobs = await driver.findElements(
        By.className('job-card-container'),
      );
      if (jobs.length > 0) {
        await jobs[0].click();
        await driver.findElement(By.className('jobs-apply-button')).click();
      }
    } catch (error) {
      console.error('Erreur :', error);
    } finally {
      await driver.quit();
    }
  }
}
