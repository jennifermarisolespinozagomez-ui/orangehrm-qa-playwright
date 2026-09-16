import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import {
  RecruitmentPage,
  DatosCandidato,
  DatosVacante,
} from "../pages/RecruitmentPage";
import { leerJson, rutaArchivo, sufijoUnico } from "../utils/gestorDatos";

/**
 * FLUJO 3 - RECRUITMENT
 * -----------------------------------------------------------
 * 1. Crear un nuevo candidato (con subida de hoja de vida).
 * 2. Crear una nueva vacante.
 * Ambas creaciones llenan todos los campos.
 *
 * Datos desde data/candidato.json y data/vacante.json (manejo de archivos).
 */
const usuario = leerJson("usuario.json");
const candidato = leerJson<DatosCandidato>("candidato.json");
const vacante = leerJson<DatosVacante>("vacante.json");

test.describe("Flujo 3 - Recruitment", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    await login.abrir();
    await login.iniciarSesion(usuario.admin.username, usuario.admin.password);
    await dashboard.verificarAccesoCorrecto();
  });

  test("crear un candidato con todos los campos", async ({ page }) => {
    const recruitment = new RecruitmentPage(page);
    await recruitment.abrirAgregarCandidato();
    await recruitment.crearCandidato(candidato, rutaArchivo(candidato.hojaDeVida));
  });

  test("crear una vacante con todos los campos", async ({ page }) => {
    const recruitment = new RecruitmentPage(page);
    // Nombre unico para evitar choques de datos en la demo publica.
    const datosVacante: DatosVacante = {
      ...vacante,
      vacancyName: `${vacante.vacancyName} ${sufijoUnico()}`,
    };
    await recruitment.abrirAgregarVacante();
    await recruitment.crearVacante(datosVacante);
  });
});
