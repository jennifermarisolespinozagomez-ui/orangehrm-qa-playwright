import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { AdminPage } from "../pages/AdminPage";
import { leerJson, sufijoUnico } from "../utils/gestorDatos";

/**
 * FLUJO 1 - INICIO DE SESION
 * -----------------------------------------------------------
 * 1. Se inicia sesion como Admin para poder crear un usuario nuevo.
 * 2. Se crea el usuario nuevo en Admin > User Management.
 * 3. Se cierra sesion y se inicia con el usuario RECIEN CREADO.
 * 4. Se verifica el acceso correcto a la cinta de opciones (menu lateral).
 *
 * Los datos se leen del archivo data/usuario.json (manejo de archivos).
 */
const datos = leerJson("usuario.json");

test.describe("Flujo 1 - Inicio de sesion", () => {
  test("crear usuario nuevo e iniciar sesion con el", async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const admin = new AdminPage(page);

    // 1. Login como Admin
    await login.abrir();
    await login.iniciarSesion(datos.admin.username, datos.admin.password);
    await dashboard.verificarAccesoCorrecto();

    const usuarioNuevo = {
      ...datos.usuarioNuevo,
      username: `${datos.usuarioNuevo.username}_${sufijoUnico()}`,
    };
    await admin.abrirFormularioNuevoUsuario();
    await admin.crearUsuario(usuarioNuevo);

    // 3. Cerrar sesion (logout) y entrar con el usuario nuevo
    await page.goto("/web/index.php/auth/logout");
    await login.abrir();
    await login.iniciarSesion(usuarioNuevo.username, usuarioNuevo.password);

    // 4. Verificar acceso correcto a la cinta de opciones del usuario
    await dashboard.verificarAccesoCorrecto();
  });
});
