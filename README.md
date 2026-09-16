# Automatización E2E — OrangeHRM

Automatización de pruebas funcionales end-to-end del sitio OrangeHRM
(https://opensource-demo.orangehrmlive.com/) con Playwright y TypeScript,
usando Page Object Model.

Autora: Jenniffer Marisol Espinoza Gomez

## Flujos automatizados

1. Login: crea un usuario en Admin, inicia sesión con él y verifica el menú.
2. PIM: añade un empleado, sube imagen y edita todos sus campos.
3. Recruitment: crea un candidato con hoja de vida y una vacante.
4. Buzz: publica un video, ordena por más comentados y comenta el más popular.

## Requisitos

- Node.js 18 o superior
- Google Chrome instalado

## Instalación

```bash
npm install
```

## Ejecutar las pruebas

```bash
npm test                 # ejecuta toda la suite
npm run test:headed      # ejecuta con el navegador visible
npm run report           # abre el reporte HTML de la última ejecución
```

## Estructura del proyecto

```
data/     Datos de prueba en JSON
assets/   Archivos que se suben (imagen y hoja de vida)
utils/    Utilidad para leer los datos
pages/    Page Objects (una clase por página)
tests/    Pruebas E2E, una por flujo
```

## Entregables

- Repositorio (código): https://github.com/jennifermarisolespinozagomez-ui/orangehrm-qa-playwright
- Documentación (plan de pruebas, casos de uso, defectos y madurez): https://drive.google.com/file/d/1PSTiF0qJxQHSwISVxackQnhRHnfwM7G7/view?usp=sharing
- Video 1 — Automatización E2E: https://1drv.ms/v/c/a0be919eafbe4ad7/IQAZa9pYhJznQbKIfYk99u0UAUrQt2ImdxFjVQj02i-pIAM?e=hMVbU0
- Video 2 — Evaluación analítica: https://1drv.ms/v/c/a0be919eafbe4ad7/IQACLjn_2_9gQLKmKS4XhSxxAcvW8aZ-_yVio9GoTFUvasg?e=eVS6Hq
- Reporte de ejecución: se genera ejecutando `npm run report` (se muestra también en el video).

USO DE IA 

Respecto al uso de inteligencia artificial, la utilicé como apoyo para acelerar la estructura y consultar buenas prácticas, pero validé todo ejecutando las pruebas contra el sitio real, y los datos utilizados son míos. Gracias.
