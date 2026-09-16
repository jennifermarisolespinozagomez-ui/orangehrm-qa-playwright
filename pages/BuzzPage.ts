import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";


export class BuzzPage extends BasePage {
  /** Abre el newsfeed de Buzz. */
  async abrir(): Promise<void> {
    await this.irA("/web/index.php/buzz/viewBuzz");
    await expect(
      this.page.getByPlaceholder("What's on your mind?")
    ).toBeVisible({ timeout: 20000 });
  }

 
  async publicarVideo(texto: string, videoUrl: string): Promise<void> {
    const botonShareVideo = this.page.getByRole("button", { name: /Share Video/i });
    const inputUrl = this.page.getByPlaceholder("Paste Video URL");


    await botonShareVideo.click();
    try {
      await inputUrl.waitFor({ state: "visible", timeout: 8000 });
    } catch {
      await botonShareVideo.click();
    }
    await inputUrl.waitFor({ state: "visible", timeout: 25000 });
    await inputUrl.fill(videoUrl);

    // Texto del post: el textarea "What's on your mind?" dentro del modal.
    const textarea = this.page.getByPlaceholder("What's on your mind?").last();
    await textarea.fill(texto);

    // Boton para publicar dentro del modal.
    await this.page.getByRole("button", { name: /^\s*Share\s*$/ }).click();
    await this.esperarToastExito();
  }

  /**
   * Ordena el feed por "Most Commented Posts".
   * En el feed de Buzz las opciones de orden son botones visibles
   * ("Most Recent Posts", "Most Liked Posts", "Most Commented Posts").
   */
  async ordenarPorMasComentados(): Promise<void> {
    await this.page
      .getByRole("button", { name: /Most Commented Posts/i })
      .click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Comenta el primer post del feed (el mas popular tras ordenar).
   * El contenedor real de un post es ".orangehrm-buzz-post" y el icono de
   * comentar es "bi-chat-dots-fill". El campo de comentario aparece SOLO
   * tras pulsar ese icono.
   */
  async comentarPrimerPost(comentario: string): Promise<void> {
    // Para abrir la caja de comentarios se hace clic en el contador
    // "N Comments". Tras ordenar por "Most Commented", el primero de la
    // lista es el post mas popular, por eso se toma el primer contador
    // de comentarios de toda la pagina.
    const contadorComentarios = this.page
      .locator("p.orangehrm-buzz-stats-active", { hasText: /Comment/i })
      .first();
    await contadorComentarios.scrollIntoViewIfNeeded();
    await contadorComentarios.click();

    // Tras hacer clic aparece un campo de comentario (input o textarea).
    const inputComentario = this.page
      .getByPlaceholder(/Write your comment|comment/i)
      .first();
    await inputComentario.waitFor({ state: "visible", timeout: 10000 });
    await inputComentario.fill(comentario);
    await inputComentario.press("Enter");

    // Se espera un instante a que el comentario se registre.
    await this.page.waitForTimeout(2000);
  }
}
