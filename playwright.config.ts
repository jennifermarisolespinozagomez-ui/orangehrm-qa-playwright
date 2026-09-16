import { defineConfig, devices } from "@playwright/test";

/**
 * Configuracion de Playwright para la evaluacion E2E de OrangeHRM.
 *
 * DECISION TECNICA IMPORTANTE:
 * En el entorno de ejecucion el CDN de descargas de Playwright
 * (cdn.playwright.dev) esta bloqueado por la red, por lo que no fue
 * posible descargar el Chromium empaquetado. La solucion adoptada es
 * usar el navegador Google Chrome ya instalado en el sistema mediante
 * la opcion channel: "chrome". Es una capacidad oficial de Playwright
 * y no afecta la validez de las pruebas.
 */
export default defineConfig({
  // Carpeta donde viven los tests (specs).
  testDir: "./tests",

  // Tiempo maximo por test y por asercion (el sitio demo puede ir lento).
  timeout: 90 * 1000,
  expect: { timeout: 15 * 1000 },

  // Ejecucion secuencial: los flujos comparten estado en la demo publica,
  // por eso NO se corren en paralelo (evita choques de datos).
  fullyParallel: false,
  workers: 1,
  retries: 0,

  // Reporte de ejecucion en HTML (entregable "reporte de ejecucion").
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    // URL base del sitio de pruebas de la evaluacion.
    baseURL: "https://opensource-demo.orangehrmlive.com",

    // Usa el Google Chrome instalado en el sistema.
    channel: "chrome",
    headless: false,

    // slowMo: ralentiza cada accion (en milisegundos) para poder ver el
    // navegador con calma al grabar el video. Para ejecucion normal se
    // puede poner en 0. 800 ms es un buen ritmo para grabar.
    launchOptions: {
      slowMo: 800,
    },

    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true,

    // Evidencias para el reporte y para depurar.
    // NOTA: el video interno de Playwright requiere ffmpeg (bloqueado por
    // la red en este entorno), y ademas el video explicativo se graba
    // aparte con OBS. Por eso se deja "off" y se usan screenshots + trace,
    // que no requieren descargas externas.
    screenshot: "only-on-failure",
    video: "off",
    // Trace desactivado: la carpeta del proyecto esta en OneDrive y su
    // sincronizacion provoca errores ENOENT al escribir el archivo .trace.
    // Las evidencias se cubren con screenshots y el reporte HTML.
    trace: "off",

    actionTimeout: 15 * 1000,
    navigationTimeout: 60 * 1000,
  },

  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
});
