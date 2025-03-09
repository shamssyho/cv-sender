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

      console.log('Sélection du champ de recherche...');
      const searchBox = await driver.findElement(
        By.css('input.jobs-search-box__text-input'),
      );
      await searchBox.sendKeys(jobTitle, Key.RETURN);
      console.log('✅ Recherche de jobs lancée pour :', jobTitle);
      await driver.sleep(5000);

      console.log("Filtrage des offres avec 'Candidature simplifiée'...");
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
      }

      console.log('Attente des résultats...');
      await driver.wait(
        until.elementsLocated(By.className('job-card-container')),
        10000,
      );
      const jobs = await driver.findElements(
        By.className('job-card-container'),
      );
      if (jobs.length > 0) {
        await jobs[0].click();
        console.log('✅ Premier job sélectionné.');
        await driver.sleep(5000);
      } else {
        console.log('❌ Aucun job trouvé.');
        return { success: false, jobTitle: 'Aucun job trouvé' };
      }

      console.log("Vérification du bouton 'Postuler'");
      await driver.sleep(5000);
      const buttons = await driver.findElements(
        By.className('jobs-apply-button'),
      );
      if (buttons.length > 0) {
        await driver.wait(until.elementIsVisible(buttons[0]), 10000);
        await driver.wait(until.elementIsEnabled(buttons[0]), 10000);
        await driver.executeScript(
          'arguments[0].scrollIntoView();',
          buttons[0],
        );
        await driver.sleep(3000);
        await buttons[0].click();
        console.log("✅ Bouton 'Postuler' cliqué.");
      } else {
        console.log(
          "❌ Aucun bouton 'Postuler' trouvé. L'offre ne permet peut-être pas la candidature rapide.",
        );
        return {
          success: false,
          jobTitle: 'Aucune candidature rapide disponible',
        };
      }

      console.log('Ajout du CV...');
      await driver.sleep(5000);
      const fileInput = await driver.findElements(By.css("input[type='file']"));
      if (fileInput.length > 0) {
        await fileInput[0].sendKeys(cvPath);
        console.log('✅ CV ajouté.');
      } else {
        console.log('❌ Champ de téléchargement du CV non trouvé.');
        return { success: false, jobTitle: 'Champ CV introuvable' };
      }

      console.log('Envoi de la candidature...');
      await driver.sleep(5000);
      const submitButtons = await driver.findElements(
        By.css("button[aria-label='Envoyer la candidature']"),
      );
      if (submitButtons.length > 0) {
        await submitButtons[0].click();
        console.log('✅ Candidature envoyée !');
        return { success: true, jobTitle: 'Candidature envoyée' };
      } else {
        console.log("❌ Bouton 'Envoyer la candidature' introuvable.");
        return { success: false, jobTitle: "Bouton d'envoi introuvable" };
      }
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
