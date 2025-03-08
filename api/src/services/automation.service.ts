import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until } from 'selenium-webdriver';
import * as webdriver from 'selenium-webdriver';

@Injectable()
export class AutomationService {
  async loginLinkedIn(driver: webdriver.WebDriver) {
    await driver.get('https://www.linkedin.com/login');
    await driver
      .findElement(By.id('username'))
      .sendKeys(process.env.LINKEDIN_EMAIL);
    await driver
      .findElement(By.id('password'))
      .sendKeys(process.env.LINKEDIN_PASSWORD, Key.RETURN);
    await driver.wait(until.urlContains('/feed'), 10000);
  }

  async applyForJob(
    driver: webdriver.WebDriver,
    jobTitle: string,
    cvPath: string,
  ) {
    await driver.get('https://www.linkedin.com/jobs/');
    await driver.sleep(2000);

    const searchBox = await driver.findElement(
      By.className('jobs-search-box__text-input'),
    );
    await searchBox.sendKeys(jobTitle, Key.RETURN);
    await driver.sleep(3000);

    const jobs = await driver.findElements(By.className('job-card-container'));
    if (jobs.length > 0) {
      await jobs[0].click();
      await driver.sleep(2000);
    } else {
      console.log('❌ Aucune offre trouvée.');
      return { success: false, jobTitle: jobTitle };
    }

    try {
      const applyButton = await driver.findElement(
        By.className('jobs-apply-button'),
      );
      await applyButton.click();
      await driver.sleep(2000);
    } catch {
      console.log("❌ Le bouton de candidature rapide n'est pas disponible.");
      return { success: false, jobTitle: jobTitle };
    }

    try {
      // ✅ Recherche du champ pour uploader un CV (input file)
      const fileInput = await driver.findElement(By.css("input[type='file']"));
      await fileInput.sendKeys(cvPath); // ✅ Envoi du fichier CV

      await driver.sleep(2000); // Laisse le temps à l'upload de se terminer

      // ✅ Soumission du formulaire
      const submitButton = await driver.findElement(
        By.css("button[aria-label='Envoyer la candidature']"),
      );
      await submitButton.click();

      console.log('✅ Candidature envoyée avec succès !');
      return { success: true, jobTitle: jobTitle };
    } catch (error) {
      console.log("❌ Erreur lors de l'envoi de la candidature :", error);
      return { success: false, jobTitle: jobTitle };
    }
  }

  async apply(platform: string, jobUrl: string, cvPath: string) {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
      await this.loginLinkedIn(driver);
      const result = await this.applyForJob(driver, jobUrl, cvPath); // ✅ Ajout de `cvPath`
      return result;
    } catch (error) {
      console.error("❌ Erreur pendant l'automatisation :", error);
      return { success: false, jobTitle: 'Erreur' };
    } finally {
      await driver.quit();
    }
  }
}
