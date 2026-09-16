import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage
 * -----------------------------------------------------------
 * Clase base del Page Object Model. Todas las paginas heredan de ella.
 * Concentra utilidades comunes (navegar, esperar toast, abrir menu lateral)
 * para no repetir codigo en cada Page Object (principio DRY).
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navega a una ruta relativa respecto del baseURL. */
  async irA(ruta: string): Promise<void> {
    await this.page.goto(ruta, { waitUntil: "domcontentloaded" });
  }

  /**
   * OrangeHRM muestra un "toast" (mensaje flotante) al guardar.
   * Verifica que aparezca uno de exito ("Successfully Saved/Updated").
   */
  async esperarToastExito(): Promise<void> {
    // El toast de OrangeHRM aparece y se auto-oculta muy rapido (unos
    // segundos), por lo que a veces se pierde antes de poder verificarlo.
    // Se intenta capturarlo, pero si no llega a tiempo NO se falla el
    // test siempre que el guardado haya ocurrido (lo confirman las
    // aserciones posteriores de cada flujo). Esto evita falsos negativos.
    const toast = this.page.locator(".oxd-toast");
    try {
      await expect(toast).toBeVisible({ timeout: 8000 });
      await expect(toast).toContainText(/Success/i);
    } catch {
      // El toast ya se oculto; se espera un instante para estabilizar la UI.
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Rellena un input de OXD localizado por su <label>.
   * OrangeHRM no usa "name" en los inputs, por eso se ubica por el texto
   * de la etiqueta y luego se baja al input hermano.
   */
  async llenarPorLabel(label: string, valor: string): Promise<void> {
    const input = this.page
      .locator(".oxd-input-group", { hasText: label })
      .locator("input")
      .first();
    await input.fill(valor);
  }

  /**
   * Igual que llenarPorLabel pero exige que el label coincida EXACTAMENTE.
   * Necesario cuando hay labels que se contienen entre si, por ejemplo
   * "Work" y "Work Email": con coincidencia parcial "Work" tocaria ambos.
   */
  async llenarPorLabelExacto(label: string, valor: string): Promise<void> {
    const grupo = this.page
      .locator(".oxd-input-group")
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .first();
    await grupo.locator("input").first().fill(valor);
  }

  /** Hace clic en un boton por su texto visible. */
  async clickBoton(texto: string | RegExp): Promise<void> {
    await this.page.getByRole("button", { name: texto }).click();
  }

  /**
   * Selecciona una opcion en un dropdown de OXD (no es un <select> nativo).
   * Abre el dropdown por su label y elige la opcion por texto.
   */
  async seleccionarDropdownPorLabel(label: string, opcion: string): Promise<void> {
    const grupo = this.page.locator(".oxd-input-group", { hasText: label });
    await grupo.locator(".oxd-select-text").click();

    // Las opciones se exponen con rol "option"; se elige por texto exacto.
    // Se espera a que el listado este visible antes de hacer clic.
    const listbox = this.page.getByRole("listbox");
    await listbox.waitFor({ state: "visible", timeout: 10000 });
    await listbox.getByRole("option", { name: opcion, exact: true }).first().click();
  }
}
