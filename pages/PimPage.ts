import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * PimPage
 * -----------------------------------------------------------
 * Cubre: anadir empleado, subir imagen y editar los detalles personales
 * y de contacto (llenar todos los campos).
 */
export interface DatosEmpleado {
  nombres: { firstName: string; middleName: string; lastName: string };
  imagen: string;
  detallesPersonales: {
    otherId: string;
    driversLicense: string;
    nationality: string;
    maritalStatus: string;
    fechaNacimiento: string;
    genero: string;
  };
  contacto: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    pais: string;
    homePhone: string;
    mobile: string;
    workPhone: string;
    workEmail: string;
    otherEmail: string;
  };
}

export class PimPage extends BasePage {
  /** Abre el formulario para anadir un empleado. */
  async abrirAgregarEmpleado(): Promise<void> {
    await this.irA("/web/index.php/pim/addEmployee");
    await expect(this.page.locator('input[name="firstName"]')).toBeVisible();
  }

  /** Anade un empleado con su nombre e imagen. Devuelve nada; deja abierto el perfil. */
  async agregarEmpleadoConImagen(
    datos: DatosEmpleado,
    rutaImagen: string
  ): Promise<void> {
    await this.page.locator('input[name="firstName"]').fill(datos.nombres.firstName);
    await this.page.locator('input[name="middleName"]').fill(datos.nombres.middleName);
    await this.page.locator('input[name="lastName"]').fill(datos.nombres.lastName);

    // Employee Id: OrangeHRM autogenera uno, pero al repetir la prueba ese
    // Id puede quedar duplicado y el sitio muestra "Employee Id already
    // exists". Para garantizar unicidad en cada corrida, lo sobrescribimos
    // con un valor unico basado en la hora.
    const idUnico = Date.now().toString().slice(-7);
    const inputId = this.page.locator(".oxd-input-group", { hasText: "Employee Id" })
      .locator("input");
    await inputId.fill(idUnico);

    // Subida de imagen: el input file esta oculto, se le asigna el archivo.
    const inputFile = this.page.locator('input[type="file"]');
    await inputFile.setInputFiles(rutaImagen);
    // Pequena espera para que la imagen termine de cargarse antes de guardar.
    await this.page.waitForTimeout(1500);

    const headingDetalle = this.page.getByRole("heading", { name: "Personal Details" });

    // Se guarda. Si por lentitud de la demo no navega al detalle, se
    // reintenta el guardado una vez mas antes de esperar con timeout amplio.
    await this.clickBoton("Save");
    try {
      await expect(headingDetalle).toBeVisible({ timeout: 15000 });
    } catch {
      await this.clickBoton("Save");
      await expect(headingDetalle).toBeVisible({ timeout: 30000 });
    }
  }

  /**
   * Edita los detalles personales del empleado ya creado.
   * Los inputs de esta pantalla NO tienen atributo name, por eso se
   * ubican por su etiqueta (label) usando el helper llenarPorLabel.
   */
  async editarDetallesPersonales(datos: DatosEmpleado): Promise<void> {
    const dp = datos.detallesPersonales;

    await this.llenarPorLabel("Other Id", dp.otherId);
    await this.llenarPorLabel("Driver's License Number", dp.driversLicense);


    await this.seleccionarDropdownPorLabel("Nationality", dp.nationality);
    await this.seleccionarDropdownPorLabel("Marital Status", dp.maritalStatus);

    // Fecha de nacimiento.
    const fecha = this.page.locator(".oxd-date-input input").first();
    await fecha.fill(dp.fechaNacimiento);
    await this.page.keyboard.press("Escape");

    // Genero.
    await this.page.getByText(dp.genero, { exact: true }).click();

    // El bloque de detalles personales .
    await this.page.getByRole("button", { name: "Save" }).first().click();
    await this.esperarToastExito();
  }

  /**
   * Va a la pestana Contact Details y llena todos los campos.
   * Como los inputs no tienen name, se ubican por el texto de su label.
   */
  async editarContacto(datos: DatosEmpleado): Promise<void> {
    const c = datos.contacto;
    await this.page.getByRole("link", { name: "Contact Details" }).click();

    // Se espera a que cargue el formulario de direccion.
    await expect(this.page.getByText("Street 1")).toBeVisible({ timeout: 20000 });

    await this.llenarPorLabel("Street 1", c.street1);
    await this.llenarPorLabel("Street 2", c.street2);
    await this.llenarPorLabel("City", c.city);
    await this.llenarPorLabel("State/Province", c.state);
    await this.llenarPorLabel("Zip/Postal Code", c.zip);
    await this.seleccionarDropdownPorLabel("Country", c.pais);

    // Telefonos: "Home", "Mobile" y "Work" son labels exactos.
    await this.llenarPorLabelExacto("Home", c.homePhone);
    await this.llenarPorLabelExacto("Mobile", c.mobile);
    await this.llenarPorLabelExacto("Work", c.workPhone);

    // Correos.
    await this.llenarPorLabelExacto("Work Email", c.workEmail);
    await this.llenarPorLabelExacto("Other Email", c.otherEmail);

    await this.page.getByRole("button", { name: "Save" }).click();
    await this.esperarToastExito();
  }
}
