import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

@Injectable()
export class AutomationService {
  async apply(platform: string, jobUrl: string, cvPath: string) {
    console.log('Démarrage de Selenium...');

    const service = new chrome.ServiceBuilder(
      'E:/vscode/test/chromedriver.exe',
    ); // Remplace par ton chemin exact
    const options = new chrome.Options();

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    try {
      console.log('Ouverture de LinkedIn...');
      await driver.get('https://www.linkedin.com/login');
      console.log('✅ LinkedIn ouvert avec succès');

      await driver
        .findElement(By.id('username'))
        .sendKeys(process.env.LINKEDIN_EMAIL);
      await driver
        .findElement(By.id('password'))
        .sendKeys(process.env.LINKEDIN_PASSWORD, Key.RETURN);
      await driver.wait(until.urlContains('/feed'), 10000);

      console.log("Navigateur prêt pour l'application...");
      await driver.get(jobUrl);
      console.log("✅ Page de l'offre chargée.");

      const applyButton = await driver.findElement(
        By.className('jobs-apply-button'),
      );
      await applyButton.click();
      console.log("✅ Bouton 'Postuler' cliqué.");

      const fileInput = await driver.findElement(By.css("input[type='file']"));
      await fileInput.sendKeys(cvPath);
      console.log('✅ CV envoyé.');

      const submitButton = await driver.findElement(
        By.css("button[aria-label='Envoyer la candidature']"),
      );
      await submitButton.click();
      console.log('✅ Candidature envoyée avec succès !');

      return { success: true, jobTitle: 'Candidature envoyée' };
    } catch (error) {
      console.error('❌ Erreur Selenium :', error);
      return { success: false, jobTitle: 'Erreur' };
    } finally {
      await driver.quit();
      console.log('✅ Navigateur fermé.');
    }
  }
}
