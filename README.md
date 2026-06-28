# Sistema de Transporte 

Descripción
-----------

Este repositorio contiene una aplicación web desarrollada con Google Apps Script (HTML + servidor GAS) diseñada para gestionar vehículos, motoristas, usuarios y solicitudes de transporte para la institución. La interfaz de usuario está construida en HTML/CSS/Bootstrap y la lógica de servidor se implementa en `Backend.js`, interactuando con una hoja de cálculo de Google Sheets como almacenamiento principal.

Contenido del repositorio
-------------------------

- `Backend.js`: Código del servidor (Google Apps Script). Contiene funciones para autenticación, CRUD de usuarios, vehículos, motoristas, empleados y solicitudes.
- `index.html`: Interfaz principal de la aplicación (pantalla de login, panel, modales y tablas para gestionar datos).
- `js.html`: Fragmento que incluye los scripts cliente (control de UI, llamadas a `google.script.run`).
- `style.html`: Fragmento con estilos CSS y dependencias (Bootstrap, iconos).
- `corrreo.html`: Plantilla de correo (si aplica) usada para notificaciones.
- `appsscript.json`: Configuración del proyecto Apps Script y permisos.
- `.gitignore`: Archivos ignorados por git.

Características principales
-------------------------

- Autenticación: `verificarUsuario(usuario, password)` valida credenciales contra la hoja `Tbl_Users` y registra la marca de fecha de último login.
- Gestión de Usuarios: crear, actualizar y listar usuarios (`guardarUsuarioEnHoja`, `actualizarUsuarioEnHoja`, `obtenerUsuariosJSON`).
- Gestión de Vehículos/Automóviles: agregar, actualizar y listar vehículos y automóviles (`guardarVehiculoEnHoja`, `actualizarVehiculoEnHoja`, `obtenerVehiculosJSON`, `guardarAutomovilEnHoja`, `actualizarAutomovilEnHoja`, `obtenerAutomovilesJSON`).
- Gestión de Motoristas: agregar, actualizar y exportar JSON de motoristas (`guardarMotoristaEnHoja`, `actualizarMotoristaEnHoja`, `obtenerMotoristasJSON`, `obtenerMotoristasCompletos`).
- Gestión de Empleados: agregar, actualizar, listar y utilidades de verificación (`guardarEmpleadoEnHoja`, `actualizarEmpleadoEnHoja`, `obtenerEmpleadosJSON`, `verificarEstructuraEmpleados`, `resetearFlagsEmpleados`).
- Solicitudes de Transporte: crear, actualizar y listar solicitudes con manejo de fechas y horas (`guardarSolicitudesEnHoja`, `actualizarSolicitudEnHoja`, `actualizarSolicitudPorId`, `obtenerSolicitudesJSON`).
- Catálogos: obtener lista de establecimientos y datos completos (`obtenerEstablecimientos`, `obtenerEstablecimientosCompletos`).
- Frontend: panel con sidebar, tablas responsivas y modales para CRUD (usuarios, vehículos, motoristas, solicitudes). Validaciones HTML y formatos para fechas/horas.

Hojas de cálculo (Google Sheets) esperadas
-----------------------------------------

El sistema espera una hoja de cálculo con pestañas (sheets) con los siguientes nombres y columnas (resumen):

- `Tbl_Users`: columnas para Id, User, Password, TUser, Nombre, Cargo, Area, Establecimiento, Distrito, Municipio, SIBASI, Departamento, Regional, Estado, FecInac, Comentario, FechaLogin (u otras posiciones conforme al código).
- `Tbl_Motorista`: columnas que contienen Nombre, Fechnat, Fechingre, Tlicencia, Nlicencia, DUI, FECHVENLIC, Tsangre, EnfeCroc, Estado, FamEmerger, NumEMer, Establecimiento, etc.
- `Tbl_Vehiculo`: columnas para Id, Placa, tipovehiculo, tipogasolina, Estado, Comentario, aniovehiculo, Establecimiento, marca, Modelo, ult_fechmantenimiento, costmante, etc.
- `Tbl_Empleado`: columnas para Id, Nombre, departamento, establecimiento, Estado, etc.
- `Tbl_solicitudes`: columnas para Id, User, Fecsol, Fecsal, HoraSal, HoraRegre, RRHH, Motivo, lugares, Estado, placa, motorista, Tgas, justsoli, newlugar, justcambio, Idsolicitud, UnSolicitante, OrdSuministro, Ncupones, SerieIni, SerieFin, CantAsing, Authorizado, Recibido, marca, etc.
- `Tbl_establecimiento`: lista de establecimientos con campos: Establecimiento, Distrito, Municipio, Departamento, SIBASI, Regional.

Despliegue (resumen)
---------------------

1. Abrir el proyecto en el editor de Google Apps Script (vinculado a la hoja de cálculo que actuará como BD).
2. Ajustar `appsscript.json` y las autorizaciones necesarias (acceso a Spreadsheet, ejecución como usuario, publicar como Web App si aplica).
3. Implementar/guardar el script y desplegar como Web App (URL pública interna de la organización).
4. Verificar que las pestañas de la hoja existan con los nombres esperados y que los encabezados correspondan al orden esperado por el código.

Uso y flujo principal
---------------------

- Acceso: el usuario ingresa credenciales en `index.html`; el cliente llama a `verificarUsuario` en el servidor.
- Al autenticarse, la interfaz muestra el menú lateral con entradas para Usuarios, Vehículos, Motoristas, Solicitudes, Consultas, Ayuda y Acerca.
- Cada sección muestra una tabla con datos cargados desde las funciones `obtener*JSON()` y permite abrir modales para crear/editar registros.
- Las operaciones de guardar/actualizar se realizan mediante llamadas a funciones del servidor que escriben en la fila correspondiente de la hoja.

Consideraciones técnicas y notas
--------------------------------

- Formatos de fecha y hora: varias funciones convierten valores Date a formato `yyyy-MM-dd` o `HH:mm` antes de devolver JSON.
- Control de duplicados: `guardarVehiculoEnHoja` valida que la placa no exista antes de insertar.
- Prevención de doble envío: hay flags (`guardandoEmpleado`, `actualizandoEmpleado`) para evitar doble clic al guardar/actualizar empleados.
- Errores: algunas funciones lanzan `throw new Error(...)` con mensajes claros; revisar logs de Apps Script cuando ocurra un fallo.

Extensiones y próximos pasos sugeridos
------------------------------------

- Añadir autenticación robusta (OAuth2 / Google Sign-In) si se requiere seguridad mejorada.
- Añadir paginación y filtros en tablas para mejorar rendimiento con muchos registros.
- Registrar auditoría de cambios (quién modifica qué y cuándo) en hojas separadas.

Contacto
-------

Para dudas o mejoras, edite el repositorio o contacte al equipo desarrollador responsable del Proyecto.

Archivo principal
-----------------

La interfaz principal se encuentra en [index.html](index.html) y la lógica de servidor en [Backend.js](Backend.js).
