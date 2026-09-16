import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * LoginPage
 * -----------------------------------------------------------
 * Page Object de la pantalla de inicio de sesion.
 */
export class LoginPage extends BasePage {
  private readonly inputUsuario: Locator;
  private readonly inputPassword: Locator;
  private readonly botonLogin: Locator;
  private readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    // Selectores
    this.inputUsuario = page.getByRole("textbox", { name: "Username" });
    this.inputPassword = page.locator('input[name="password"]');
    this.botonLogin = page.getByRole("button", { name: "Login" });
    this.mensajeError = page.locator(".oxd-alert-content-text");
  }

  /** Abre la pagina de login. */
  async abrir(): Promise<void> {
    await this.irA("/web/index.php/auth/login");
    await expect(this.inputUsuario).toBeVisible();
  }

  /** Inicia sesion con las credenciales . */
  async iniciarSesion(usuario: string, password: string): Promise<void> {
    await this.inputUsuario.fill(usuario);
    await this.inputPassword.fill(password);
    await this.botonLogin.click();
    // Se espera a salir de la pantalla de login (a que se procese el envio).
    await this.page.waitForLoadState("networkidle");
  }

  /** Devuelve el locator del mensaje de error (para validaciones negativas). */
  get error(): Locator {
    return this.mensajeError;
  }
}
