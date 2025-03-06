import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';

@Injectable()
export class SeleniumService implements OnModuleDestroy {
  private driver: WebDriver;

  async initBrowser() {
    this.driver = await new Builder().forBrowser('chrome').build();
    console.log('Chrome WebDriver lancé !');
  }

  async openGoogle() {
    if (!this.driver) await this.initBrowser();
    await this.driver.get('https://www.google.com');
    console.log('Google est ouvert');

    await this.driver.sleep(3000); // Attendre 3 secondes

    await this.driver.quit();
    console.log('Chrome WebDriver fermé !');

    return { message: 'Google ouvert et fermé avec succès' }; // ✅ Ajout de la réponse
  }

  async searchGoogle(query: string) {
    if (!this.driver) await this.initBrowser();
    await this.driver.get('https://www.google.com');
    const searchBox = await this.driver.findElement(By.name('q'));
    await searchBox.sendKeys(query, Key.RETURN);
    await this.driver.wait(until.elementLocated(By.id('search')), 5000);
    console.log(`Recherche "${query}" effectuée`);
    await this.driver.quit();
  }

  onModuleDestroy() {
    if (this.driver) {
      this.driver.quit();
    }
  }
}
