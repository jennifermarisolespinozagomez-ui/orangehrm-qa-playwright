import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface DatosCandidato {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  hojaDeVida: string;
  keywords: string;
  notes: string;
  consentToKeepData: boolean;
}

export interface DatosVacante {
  vacancyName: string;
  jobTitle: string;
  hiringManager: string;
  numberOfPositions: string;
  description: string;
}

export class RecruitmentPage extends BasePage {
  /** Abre el formulario de nuevo candidato. */
  async abrirAgregarCandidato(): Promise<void> {
    await this.irA("/web/index.php/recruitment/addCandidate");
    await expect(this.page.locator('input[name="firstName"]')).toBeVisible();
  }

  /** Crea un candidato llenando todos los campos y subiendo la hoja de vida. */
  async crearCandidato(datos: DatosCandidato, rutaResume: string): Promise<void> {
    await this.page.locator('input[name="firstName"]').fill(datos.firstName);
    await this.page.locator('input[name="middleName"]').fill(datos.middleName);
    await this.page.locator('input[name="lastName"]').fill(datos.lastName);

    await this.llenarPorLabel("Email", datos.email);
    await this.llenarPorLabel("Contact Number", datos.contactNumber);
    await this.llenarPorLabel("Keywords", datos.keywords);

    // Subida de la hoja de vida .
    const inputFile = this.page.locator('input[type="file"]');
    await inputFile.setInputFiles(rutaResume);

    // Notas (textarea).
    await this.page.locator("textarea").first().fill(datos.notes);

    // Consent to keep data (checkbox).
    if (datos.consentToKeepData) {
      await this.page.locator(".oxd-checkbox-input").click();
    }

    await this.clickBoton("Save");
    await this.esperarToastExito();
  }

  /** Abre el formulario de nueva vacante. */
  async abrirAgregarVacante(): Promise<void> {
    await this.irA("/web/index.php/recruitment/addJobVacancy");
    await expect(
      this.page.locator(".oxd-input-group", { hasText: "Vacancy Name" })
    ).toBeVisible();
  }

  /** Crea una vacante llenando todos los campos. */
  async crearVacante(datos: DatosVacante): Promise<void> {
    await this.llenarPorLabel("Vacancy Name", datos.vacancyName);

    // Job Title es un dropdown.
    await this.seleccionarDropdownPorLabel("Job Title", datos.jobTitle);

    // Description (textarea).
    await this.page.locator("textarea").first().fill(datos.description);

    // Hiring Manager es un autocompletar: exige elegir un empleado
    // existente de la lista (si se deja texto libre marca "Invalid").
    const manager = this.page
      .locator(".oxd-input-group", { hasText: "Hiring Manager" })
      .locator("input");
    await manager.click();
    await manager.fill(datos.hiringManager);

    const dropdown = this.page.locator(".oxd-autocomplete-dropdown");
    await dropdown.waitFor({ state: "visible", timeout: 10000 });
    const opcion = dropdown
      .locator('[role="option"]')
      .filter({ hasNotText: /Searching|No Records/i })
      .first();
    await opcion.waitFor({ state: "visible", timeout: 10000 });
    await opcion.click();

    await this.llenarPorLabel("Number of Positions", datos.numberOfPositions);

    await this.clickBoton("Save");
    await this.esperarToastExito();
  }
}
