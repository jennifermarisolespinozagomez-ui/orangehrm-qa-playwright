import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { BuzzPage } from "../pages/BuzzPage";
import { leerJson } from "../utils/gestorDatos";

/**
 * FLUJO 4 - BUZZ NEWSFEED
 * -----------------------------------------------------------
 * 1. Crear una nueva publicacion de video.
 * 2. Organizar el feed por "Most Commented Posts".
 * 3. Comentar el post mas popular (el primero tras ordenar).
 *
 * Datos desde data/buzz.json (manejo de archivos).
 */
const usuario = leerJson("usuario.json");
const buzz = leerJson("buzz.json");

test.describe("Flujo 4 - Buzz Newsfeed", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    await login.abrir();
    await login.iniciarSesion(usuario.admin.username, usuario.admin.password);
    await dashboard.verificarAccesoCorrecto();
  });

  test("publicar video, ordenar por mas comentados y comentar el mas popular", async ({
    page,
  }) => {
    const buzzPage = new BuzzPage(page);

    // 1. Crear publicacion de video
    await buzzPage.abrir();
    await buzzPage.publicarVideo(buzz.videoPost.texto, buzz.videoPost.videoUrl);

    // 2. Ordenar por mas comentados
    await buzzPage.ordenarPorMasComentados();

    // 3. Comentar el post mas popular
    await buzzPage.comentarPrimerPost(buzz.comentario);
  });
});
