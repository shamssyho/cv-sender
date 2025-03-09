import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

@Injectable()
export class AutomationService {
  async apply(platform: string, jobTitle: string, cvPath: string) {
    console.log('Démarrage de Selenium...');

    const service = new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH);
    const options = new chrome.Options();

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    try {
      console.log('Ouverture de LinkedIn...');
      await driver.get('https://www.linkedin.com/login');
      await driver
        .findElement(By.id('username'))
        .sendKeys(process.env.LINKEDIN_EMAIL);
      await driver
        .findElement(By.id('password'))
        .sendKeys(process.env.LINKEDIN_PASSWORD, Key.RETURN);
      await driver.wait(until.urlContains('/feed'), 10000);
      console.log('✅ Connexion réussie');

      console.log("Ouverture de la page des offres d'emploi...");
      await driver.get('https://www.linkedin.com/jobs');
      await driver.sleep(5000);

      console.log('Sélection du champ de recherche et saisie du job...');
      const searchBox = await driver.findElement(
        By.css('input.jobs-search-box__text-input'),
      );
      await searchBox.sendKeys(jobTitle, Key.RETURN);
      console.log('✅ Recherche lancée pour :', jobTitle);
      await driver.sleep(5000);

      console.log("Filtrage uniquement sur 'Candidature simplifiée'...");
      const easyApplyFilter = await driver.findElements(
        By.xpath("//button[contains(text(),'Candidature simplifiée')]"),
      );
      if (easyApplyFilter.length > 0) {
        await easyApplyFilter[0].click();
        console.log("✅ Filtre 'Candidature simplifiée' appliqué.");
        await driver.sleep(5000);
      } else {
        console.log(
          "❌ Impossible de trouver le filtre 'Candidature simplifiée'.",
        );
        return { success: false, jobTitle: 'Filtre non trouvé' };
      }

      console.log('Attente des résultats filtrés...');
      await driver.wait(
        until.elementsLocated(By.className('job-card-container')),
        10000,
      );
      const jobs = await driver.findElements(
        By.className('job-card-container'),
      );
      if (jobs.length > 0) {
        await jobs[0].click();
        console.log(
          "✅ Premier job avec 'Candidature simplifiée' sélectionné.",
        );
        await driver.sleep(5000);
      } else {
        console.log("❌ Aucun job avec 'Candidature simplifiée' trouvé.");
        return { success: false, jobTitle: 'Aucun job avec Easy Apply' };
      }

      console.log("Vérification du bouton 'Postuler'");
      await driver.sleep(5000);
      const applyButton = await driver.findElements(
        By.className('jobs-apply-button'),
      );
      if (applyButton.length > 0) {
        await driver.wait(until.elementIsVisible(applyButton[0]), 10000);
        await driver.wait(until.elementIsEnabled(applyButton[0]), 10000);
        await driver.executeScript(
          'arguments[0].scrollIntoView();',
          applyButton[0],
        );
        await driver.sleep(3000);
        await applyButton[0].click();
        console.log('✅ Formulaire de candidature ouvert.');
      } else {
        console.log("❌ Aucun bouton 'Postuler' trouvé.");
        return {
          success: false,
          jobTitle: 'Aucune candidature rapide disponible',
        };
      }

      console.log('Remplissage du formulaire de candidature...');
      await driver.sleep(5000);
      const phoneField = await driver.findElement(
        By.css("input[aria-label='Mobile phone number']"),
      );
      await phoneField.clear();
      await phoneField.sendKeys('0783154623');
      console.log('✅ Numéro de téléphone rempli.');

      const nextButton = await driver.findElement(
        By.css("button[aria-label='Next']"),
      );
      await nextButton.click();
      console.log("✅ Passage à l'étape suivante.");
      await driver.sleep(5000);

      console.log('Sélection et validation du CV...');
      const cvSelection = await driver.findElements(
        By.css("input[type='radio']"),
      );
      if (cvSelection.length > 0) {
        await cvSelection[0].click();
        console.log('✅ CV sélectionné.');
      }
      await nextButton.click();
      await driver.sleep(5000);

      console.log('Réponses aux questions supplémentaires...');
      const inputFields = await driver.findElements(
        By.css("input[type='text']"),
      );
      for (let field of inputFields) {
        await field.sendKeys('4');
      }
      console.log('✅ Questions répondues.');
      await driver.sleep(3000);

      const reviewButton = await driver.findElement(
        By.css("button[aria-label='Review']"),
      );
      await reviewButton.click();
      console.log('✅ Passage à la revue finale.');
      await driver.sleep(5000);

      const submitButton = await driver.findElement(
        By.css("button[aria-label='Submit application']"),
      );
      await submitButton.click();
      console.log('✅ Candidature envoyée avec succès !');
      return { success: true, jobTitle: 'Candidature envoyée' };
    } catch (error) {
      console.error('❌ Erreur Selenium :', error);
      return { success: false, jobTitle: 'Erreur' };
    } finally {
      await driver.sleep(3000);
      await driver.quit();
      console.log('✅ Navigateur fermé.');
    }
  }
}
