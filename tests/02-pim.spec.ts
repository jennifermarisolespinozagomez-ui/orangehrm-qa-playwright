import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PimPage, DatosEmpleado } from "../pages/PimPage";
import { leerJson, rutaArchivo } from "../utils/gestorDatos";

/**
 * FLUJO 2 - PIM
 * -----------------------------------------------------------
 * 1. Anadir un nuevo empleado (con subida de imagen).
 * 2. Editar el empleado: detalles personales y de contacto (todos los campos).
 *
 * Datos desde data/empleado.json; imagen desde assets/ (manejo de archivos).
 */
const usuario = leerJson("usuario.json");
const empleado = leerJson<DatosEmpleado>("empleado.json");

test.describe("Flujo 2 - PIM", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    await login.abrir();
    await login.iniciarSesion(usuario.admin.username, usuario.admin.password);
    await dashboard.verificarAccesoCorrecto();
  });

  test("anadir un empleado con imagen y editar todos sus campos", async ({ page }) => {
    const pim = new PimPage(page);

    // 1. Anadir empleado + imagen
    await pim.abrirAgregarEmpleado();
    await pim.agregarEmpleadoConImagen(empleado, rutaArchivo(empleado.imagen));

    // 2. Editar detalles personales
    await pim.editarDetallesPersonales(empleado);

    // 3. Editar detalles de contacto (todos los campos)
    await pim.editarContacto(empleado);
  });
});
