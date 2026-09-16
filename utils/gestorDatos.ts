import * as fs from "fs";
import * as path from "path";

/**
 * gestorDatos.ts
 * -----------------------------------------------------------
 * Utilidad de MANEJO DE ARCHIVOS de la suite.
 *
 * Centraliza la lectura de los datos de prueba (archivos JSON en /data)
 * y la resolucion de rutas de los archivos a subir (imagen, hoja de vida
 * en /assets). De esta forma los tests NO tienen datos "quemados": leen
 * todo desde archivos, cumpliendo el requisito "utilizar manejo de archivos".
 */

// Raiz del proyecto (una carpeta arriba de /utils).
const RAIZ = path.resolve(__dirname, "..");

/**
 * Lee un archivo JSON de la carpeta /data y lo devuelve tipado.
 * @param nombreArchivo por ejemplo "empleado.json"
 */
export function leerJson<T = any>(nombreArchivo: string): T {
  const ruta = path.join(RAIZ, "data", nombreArchivo);
  if (!fs.existsSync(ruta)) {
    throw new Error(`No se encontro el archivo de datos: ${ruta}`);
  }
  const contenido = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(contenido) as T;
}

/**
 * Devuelve la ruta absoluta de un archivo dentro del proyecto
 * (por ejemplo un asset a subir). Valida que exista.
 * @param rutaRelativa por ejemplo "assets/empleado.png"
 */
export function rutaArchivo(rutaRelativa: string): string {
  const ruta = path.join(RAIZ, rutaRelativa);
  if (!fs.existsSync(ruta)) {
    throw new Error(`No se encontro el archivo a subir: ${ruta}`);
  }
  return ruta;
}

/**
 * Genera un sufijo unico basado en la hora, para evitar choques de datos
 * (por ejemplo nombres de usuario o vacantes repetidos) en la demo publica.
 */
export function sufijoUnico(): string {
  return Date.now().toString().slice(-6);
}
