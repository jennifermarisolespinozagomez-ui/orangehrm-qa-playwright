import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * AdminPage
 * -----------------------------------------------------------
 * Page Object del modulo Admin > User Management.
 * Permite crear el usuario nuevo con el que luego se inicia sesion.
 */
export interface DatosUsuarioNuevo {
  rol: string;
  estado: string;
  empleadoAsociado: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class AdminPage extends BasePage {
  private readonly botonAdd: Locator;

  constructor(page: Page) {
    super(page);
    this.botonAdd = page.getByRole("button", { name: "Add" });
  }

  /** Abre directamente el formulario de creacion de usuario. */
  async abrirFormularioNuevoUsuario(): Promise<void> {
    await this.irA("/web/index.php/admin/saveSystemUser");
    await expect(
      this.page.locator(".oxd-input-group", { hasText: "Username" })
    ).toBeVisible();
  }

  /** Rellena y guarda el formulario de nuevo usuario. */
  async crearUsuario(datos: DatosUsuarioNuevo): Promise<void> {
    // User Role (dropdown)
    await this.seleccionarDropdownPorLabel("User Role", datos.rol);

    // Employee Name (autocompletar): OrangeHRM exige elegir un empleado
    // EXISTENTE de la lista de sugerencias; si se deja texto libre marca
    // "Invalid" y no permite guardar. Por eso se escribe y se espera a que
    // aparezcan las opciones reales para hacer clic en la primera.
    const empleado = this.page
      .getByRole("textbox", { name: "Type for hints..." });
    await empleado.click();
    await empleado.fill(datos.empleadoAsociado);
    await this.seleccionarPrimeraSugerenciaValida();

    // Status (dropdown)
    await this.seleccionarDropdownPorLabel("Status", datos.estado);

    // Username
    await this.llenarPorLabel("Username", datos.username);

    // Password / Confirm Password (hay dos inputs password en el form)
    const passwords = this.page.locator('input[type="password"]');
    await passwords.nth(0).fill(datos.password);
    await passwords.nth(1).fill(datos.confirmPassword);

    await this.clickBoton("Save");

    // Confirmacion fiable de que el usuario se creo: OrangeHRM redirige a
    // la lista de usuarios del sistema tras guardar correctamente.
    await this.page.waitForURL(/viewSystemUsers/, { timeout: 20000 });
  }

 
  private async seleccionarPrimeraSugerenciaValida(): Promise<void> {
    const dropdown = this.page.locator(".oxd-autocomplete-dropdown");
    await dropdown.waitFor({ state: "visible", timeout: 10000 });

    // La demo publica se resetea, por eso NO se depende de un empleado con
    // nombre fijo. Se toma la primera sugerencia real (ignorando los estados
    // "Searching..." y "No Records Found"), sea cual sea el empleado.
    const opcion = dropdown
      .getByRole("option")
      .filter({ hasNotText: /Searching|No Records/i })
      .first();
    await opcion.waitFor({ state: "visible", timeout: 10000 });
    await opcion.click();

    // Se confirma que el campo quedo valido (sin el mensaje "Invalid").
    await expect(
      this.page.getByText("Invalid", { exact: true })
    ).toHaveCount(0, { timeout: 5000 });
  }
}
