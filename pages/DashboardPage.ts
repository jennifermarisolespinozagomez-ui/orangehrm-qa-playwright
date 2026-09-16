import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * DashboardPage
 * -----------------------------------------------------------
 * Page Object del panel principal tras iniciar sesion.
 * Se usa para verificar el acceso correcto y navegar por el menu lateral
 */
export class DashboardPage extends BasePage {
  private readonly encabezado: Locator;
  private readonly menuLateral: Locator;
  private readonly menuUsuario: Locator;

  constructor(page: Page) {
    super(page);
    this.encabezado = page.locator("h6.oxd-topbar-header-breadcrumb-module");
    this.menuLateral = page.locator(".oxd-sidepanel");
    this.menuUsuario = page.locator(".oxd-userdropdown-tab");
  }

  /** Verifica que el dashboard cargo y que el menu lateral esta visible. */
  async verificarAccesoCorrecto(): Promise<void> {
    await expect(this.encabezado).toHaveText(/Dashboard/i);
    await expect(this.menuLateral).toBeVisible();
    await expect(this.menuUsuario).toBeVisible();
  }

  /** Navega a un modulo del menu lateral por su nombre (PIM, Recruitment, Buzz, Admin). */
  async irAModulo(nombre: string): Promise<void> {
    await this.page.getByRole("link", { name: nombre }).click();
  }
}
