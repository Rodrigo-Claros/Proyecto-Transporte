// Función que llama y muestra la página web principal
function doGet() {
  var principal = HtmlService.createTemplateFromFile('index');
  var mostrarweb = principal.evaluate();
  mostrarweb.setTitle('Transporte');
  return mostrarweb;
}

//Función que Permite hacer las incluciones de código css y JavaScript en el html
function include(Filename) {
  return HtmlService.createHtmlOutputFromFile(Filename).getContent();
}
// Función para obtener cualquier hoja o tabla de sheets
function dataTable(tbl) {
  return SpreadsheetApp.getActive().getSheetByName(tbl);
}


//Función que verifica usuario que pretende hacer logueo
function verificarUsuario(usuario, password) {
  const datos = dataTable("Tbl_Users").getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    // fila[1]=User, fila[2]=Password, fila[13]=Estado
    if (
      String(fila[1]) === String(usuario) &&
      String(fila[2]) === String(password) &&
      Number(fila[13]) === 1    // columna N, Estado = 1
    ) {
      // Registrar marca de fecha y hora en login exitoso
      const hoja = dataTable("Tbl_Users");
      hoja.getRange(i + 1, 17).setValue(new Date());
      return {
        Id: fila[0],
        User: fila[1],
        Password: fila[2],
        TUser: fila[3],
        Nombre: fila[4],
        Cargo: fila[5],
        Area: fila[6],
        Establecimiento: fila[7],
        Distrito: fila[8],
        Municipio: fila[9],
        SIBASI: fila[10],
        Departamento: fila[11],
        Regional: fila[12],
        Estado: fila[13],
        FecInac: fila[14],
        Comentario: fila[15]
      };
    }
  }
  return null;
}

// FUNCIONES DE USUARIOS
function guardarUsuarioEnHoja(usuario) {
  const hoja = dataTable("Tbl_Users");
  const ultimaFila = hoja.getLastRow();
  const nuevaFilaIndex = ultimaFila + 1;

  const nuevaFila = [
    ultimaFila,
    usuario.User,
    usuario.Password,
    usuario.TUser,
    usuario.Nombre,
    usuario.Cargo,
    usuario.Area,
    usuario.Establecimiento,
    usuario.Distrito,
    usuario.Municipio,
    usuario.SIBASI,
    usuario.Departamento,
    usuario.Regional,
    usuario.Estado
  ];

  hoja.getRange(nuevaFilaIndex, 1, 1, nuevaFila.length).setValues([nuevaFila]);
}

function actualizarUsuarioEnHoja(usuario, rowIndex) {
  const hoja = dataTable("Tbl_Users");
  hoja.getRange(rowIndex, 2, 1, 13).setValues([[
    usuario.User,
    usuario.Password,
    usuario.TUser,
    usuario.Nombre,
    usuario.Cargo,
    usuario.Area,
    usuario.Establecimiento,
    usuario.Distrito,
    usuario.Municipio,
    usuario.SIBASI,
    usuario.Departamento,
    usuario.Regional,
    usuario.Estado
  ]]);
}

function obtenerUsuariosJSON() {
  const hoja = dataTable("Tbl_Users");
  const datos = hoja.getDataRange().getValues();
  const usuarios = [];
  const encabezados = datos[0];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    let usuario = {};
    for (let j = 0; j < encabezados.length; j++) {
      usuario[encabezados[j]] = fila[j];
    }
    usuarios.push(usuario);
  }

  return JSON.stringify(usuarios);
}

function obtenerEstablecimientosCompletos() {
  const hoja = SpreadsheetApp.getActive().getSheetByName("Tbl_establecimiento");
  const datos = hoja.getDataRange().getValues();
  const establecimientos = [];

  for (let i = 1; i < datos.length; i++) {
    const establecimiento = {
      Establecimiento: datos[i][1],
      Distrito: datos[i][2],
      Municipio: datos[i][3],
      Departamento: datos[i][4],
      SIBASI: datos[i][5],
      Regional: datos[i][6]
    };
    if (establecimiento.Establecimiento) {
      establecimientos.push(establecimiento);
    }
  }
  return JSON.stringify(establecimientos);
}
/-------------------------------------------------------------------------------------------------------------------/


//FUNCIONES DE MOTORISTAS

//FUNCIONES DE MOTORISTAS
function guardarMotoristaEnHoja(motorista) {
  const hoja = dataTable("Tbl_Motorista");

  // Calcular la siguiente fila vacía (suponiendo que A1 tiene encabezados)
  const ultimaFila = hoja.getLastRow(); // incluye la fila del encabezado
  const nuevaFilaIndex = ultimaFila + 1;

  // Construir los datos en el orden de las columnas
  const nuevaFila = [
    ultimaFila, // ID generado como número de fila actual 
    motorista.Nombre,
    motorista.Fechnat,
    motorista.Fechingre,
    motorista.Tlicencia,
    motorista.Nlicencia,
    motorista.DUI,
    motorista.FECHVENLIC,
    motorista.Tsangre,
    motorista.EnfeCroc,
    motorista.Estado,
    motorista.FamEmerger,
    motorista.NumEMer,
    motorista.Establecimiento
  ];

  // Escribir la fila directamente en el rango correcto
  hoja.getRange(nuevaFilaIndex, 1, 1, nuevaFila.length).setValues([nuevaFila]);
}


function actualizarMotoristaEnHoja(motorista, rowIndex) {
  const hoja = dataTable("Tbl_Motorista");
  hoja.getRange(rowIndex, 2, 1, 13).setValues([[
    motorista.Nombre,
    motorista.Fechnat,
    motorista.Fechingre,
    motorista.Tlicencia,
    motorista.Nlicencia,
    motorista.DUI,
    motorista.FECHVENLIC,
    motorista.Tsangre,
    motorista.EnfeCroc,
    motorista.Estado,
    motorista.FamEmerger,
    motorista.NumEMer,
    motorista.Establecimiento
  ]]);
}

// Función que obtiene en formato JSON todos los motoristas- ACTUALIZADO
function obtenerMotoristasJSON() {
  const hoja = dataTable("Tbl_Motorista");
  const datos = hoja.getDataRange().getValues();
  const motoristas = [];
  const encabezados = datos[0]; // Títulos de columnas

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    let motorista = {};
    for (let j = 0; j < encabezados.length; j++) {
      // Formatear fechas correctamente
      if (encabezados[j] === "Fechnat" || encabezados[j] === "Fechingre" || encabezados[j] === "FECHVENLIC") {
        if (fila[j] instanceof Date) {
          // Convertir fecha de Google Sheets a formato ISO (YYYY-MM-DD)
          motorista[encabezados[j]] = Utilities.formatDate(fila[j], Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else if (fila[j]) {
          // Si no es Date pero tiene valor, intentar convertir
          try {
            const fecha = new Date(fila[j]);
            motorista[encabezados[j]] = Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM-dd");
          } catch (e) {
            motorista[encabezados[j]] = fila[j]; // Mantener el valor original si no se puede convertir
          }
        } else {
          motorista[encabezados[j]] = ""; // Valor vacío si no hay fecha
        }
      } else {
        // Para campos que no son fechas
        motorista[encabezados[j]] = fila[j];
      }
    }
    motoristas.push(motorista);
  }

  return JSON.stringify(motoristas);
}

function obtenerMotoristasCompletos() {
  const hoja = SpreadsheetApp.getActive().getSheetByName("Tbl_Motorista");
  const datos = hoja.getDataRange().getValues();
  const motoristas = [];

  for (let i = 1; i < datos.length; i++) {
    const motorista = {
      Nombre: datos[i][1],
      Fechnat: datos[i][2],
      Fechingre: datos[i][3],
      Tlicencia: datos[i][4],
      Nlicencia: datos[i][5],
      DUI: datos[i][6],
      FECHVENLIC: datos[i][7],
      Tsangre: datos[i][8],
      Enfe: datos[i][9],
      Croc: datos[i][10],
      Estado: datos[i][11],
      Fam: datos[i][12],
      EmergerNum: datos[i][13],
      EMer: datos[i][14],
      Establecimiento: datos[i][15]
    };
    if (motorista.Nombre) {
      motoristas.push(motorista);
    }
  }
  return JSON.stringify(motoristas);
}
/-------------------------------------------------------------------------------------------------------------------/

// ESTABLECIMIENTOS:

// SECCION DE EMPLEADOS_________________________________________________________________________
//=========================================================================

// VARIABLES DE CONTROL PARA EVITAR DOBLE CLIC
let guardandoEmpleado = false;
let actualizandoEmpleado = false;

function guardarEmpleadoEnHoja(empleado) {
  // PREVENIR DOBLE CLIC CON ALERT
  if (guardandoEmpleado) {
    alert('Ya se está guardando un empleado. Por favor, espere...');
    return;
  }

  guardandoEmpleado = true; // Bloquear nuevas ejecuciones

  try {
    const hoja = dataTable("Tbl_Empleado");

    // CORREGIDO: Generar ID correctamente
    const ultimaFila = hoja.getLastRow();
    const nuevoId = ultimaFila > 1 ? ultimaFila : 1; // Si no hay datos, empezar en 1

    const nuevaFila = [
      nuevoId, // ID autogenerado
      empleado.Nombre,
      empleado.departamento,
      empleado.establecimiento,
      parseInt(empleado.Estado) // Asegurar que sea número
    ];

    hoja.appendRow(nuevaFila);

    // Liberar el bloqueo después del éxito
    guardandoEmpleado = false;
    return true;

  } catch (error) {
    // Liberar el bloqueo en caso de error
    guardandoEmpleado = false;
    console.error('Error al guardar empleado:', error);
    throw new Error('Error al guardar empleado: ' + error.message);
  }
}

function actualizarEmpleadoEnHoja(empleado, rowIndex) {
  // PREVENIR DOBLE CLIC CON ALERT
  if (actualizandoEmpleado) {
    alert('Ya se está actualizando un empleado. Por favor, espere...');
    return;
  }

  actualizandoEmpleado = true; // Bloquear nuevas ejecuciones

  try {
    const hoja = dataTable("Tbl_Empleado");

    // CORREGIDO: Validar que rowIndex sea válido
    if (!rowIndex || rowIndex < 2) {
      actualizandoEmpleado = false; // Liberar bloqueo
      throw new Error('Índice de fila inválido');
    }

    // Actualizar solo las columnas de datos (no el ID)
    hoja.getRange(rowIndex, 2, 1, 4).setValues([[
      empleado.Nombre,
      empleado.departamento,
      empleado.establecimiento,
      parseInt(empleado.Estado) // Asegurar que sea número
    ]]);

    // Liberar el bloqueo después del éxito
    actualizandoEmpleado = false;
    return true;

  } catch (error) {
    // Liberar el bloqueo en caso de error
    actualizandoEmpleado = false;
    console.error('Error al actualizar empleado:', error);
    throw new Error('Error al actualizar empleado: ' + error.message);
  }
}

function obtenerEmpleadosJSON() {
  try {
    const hoja = dataTable("Tbl_Empleado");

    // CORREGIDO: Verificar que la hoja tenga datos
    if (hoja.getLastRow() < 2) {
      return JSON.stringify([]); // Devolver array vacío si no hay datos
    }

    const datos = hoja.getDataRange().getValues();
    const empleados = [];
    const encabezados = datos[0];

    // CORREGIDO: Validar que los encabezados existan
    if (!encabezados || encabezados.length === 0) {
      throw new Error('No se encontraron encabezados en la hoja');
    }

    // Procesar cada fila de datos (saltando la primera que son los encabezados)
    for (let i = 1; i < datos.length; i++) {
      let empleado = {};

      // CORREGIDO: Mapear correctamente los datos con los encabezados
      for (let j = 0; j < encabezados.length; j++) {
        let valor = datos[i][j];

        // CORREGIDO: Manejar valores vacíos o undefined
        if (valor === undefined || valor === null) {
          valor = '';
        }

        // CORREGIDO: Convertir el estado a texto legible si es necesario
        if (encabezados[j] === 'Estado') {
          // Si el estado viene como número, convertirlo
          if (valor === 1 || valor === '1') {
            valor = 1; // Mantener como 1 para el procesamiento
          } else if (valor === 0 || valor === '0') {
            valor = 0; // Mantener como 0 para el procesamiento
          }
        }

        empleado[encabezados[j]] = valor;
      }

      empleados.push(empleado);
    }

    console.log('Empleados obtenidos:', empleados.length);
    return JSON.stringify(empleados);

  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw new Error('Error al obtener empleados: ' + error.message);
  }
}

// FUNCIÓN AUXILIAR: Verificar estructura de la hoja
function verificarEstructuraEmpleados() {
  try {
    const hoja = dataTable("Tbl_Empleado");
    const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];

    console.log('Encabezados encontrados:', encabezados);
    console.log('Total de filas:', hoja.getLastRow());
    console.log('Total de columnas:', hoja.getLastColumn());

    return {
      encabezados: encabezados,
      totalFilas: hoja.getLastRow(),
      totalColumnas: hoja.getLastColumn()
    };
  } catch (error) {
    console.error('Error al verificar estructura:', error);
    return null;
  }
}

// FUNCIÓN AUXILIAR: Resetear flags en caso de emergencia
function resetearFlagsEmpleados() {
  guardandoEmpleado = false;
  actualizandoEmpleado = false;
  console.log('Flags de empleados reseteados');
}
//___________________________________________________________vehiculo________________________________
function guardarVehiculoEnHoja(vehiculo) {
  try {
    console.log('Guardando vehículo en la hoja:', vehiculo);

    const hoja = dataTable("Tbl_Vehiculo");

    // Verificar si la placa ya existe
    const datosExistentes = hoja.getDataRange().getValues();
    for (let i = 1; i < datosExistentes.length; i++) { // Empezar en 1 para saltar encabezados
      if (datosExistentes[i][1] && datosExistentes[i][1].toString().toLowerCase() === vehiculo.Placa.toLowerCase()) {
        throw new Error('La placa ya existe en el sistema');
      }
    }

    // Generar ID automático (siguiente número después del último)
    const ultimaFila = hoja.getLastRow();
    let nuevoId = 1;

    if (ultimaFila > 1) {
      // Obtener el último ID y sumar 1
      const ultimoId = hoja.getRange(ultimaFila, 1).getValue();
      nuevoId = (typeof ultimoId === 'number' ? ultimoId : 0) + 1;
    }

    const nuevaFila = [
      nuevoId, // ID autogenerado
      vehiculo.Placa,
      vehiculo.tipovehiculo,
      vehiculo.tipogasolina,
      vehiculo.Estado,
      vehiculo.Comentario,
      vehiculo.aniovehiculo,
      vehiculo.Establecimiento,
      vehiculo.marca,
      vehiculo.Modelo,
      vehiculo.ult_fechmantenimiento,
      vehiculo.costmante
    ];

    hoja.appendRow(nuevaFila);

    console.log('✅ Vehículo guardado exitosamente con ID:', nuevoId);
    return {
      success: true,
      id: nuevoId,
      mensaje: 'Vehículo guardado correctamente'
    };

  } catch (error) {
    console.error('❌ Error al guardar vehículo:', error);
    throw new Error(error.message);
  }
}

function actualizarVehiculoEnHoja(vehiculo, rowIndex) {
  try {
    console.log('Actualizando vehículo en fila:', rowIndex, vehiculo);

    const hoja = dataTable("Tbl_Vehiculo");

    // Verificar que la fila existe
    if (rowIndex < 2 || rowIndex > hoja.getLastRow()) {
      throw new Error('Fila inválida para actualizar');
    }

    // Actualizar desde columna 2 hasta la 12 (porque columna 1 es ID)
    const valoresActualizar = [
      vehiculo.Placa,
      vehiculo.tipovehiculo,
      vehiculo.tipogasolina,
      vehiculo.Estado,
      vehiculo.Comentario,
      vehiculo.aniovehiculo,
      vehiculo.Establecimiento,
      vehiculo.marca,
      vehiculo.Modelo,
      vehiculo.ult_fechmantenimiento,
      vehiculo.costmante
    ];

    hoja.getRange(rowIndex, 2, 1, 11).setValues([valoresActualizar]);

    console.log('✅ Vehículo actualizado exitosamente');
    return {
      success: true,
      mensaje: 'Vehículo actualizado correctamente'
    };

  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error);
    throw new Error(error.message);
  }
}

function obtenerVehiculosJSON() {
  try {
    console.log('Obteniendo lista de vehículos...');

    const hoja = dataTable("Tbl_Vehiculo");
    const datos = hoja.getDataRange().getValues();

    if (datos.length <= 1) {
      console.log('No hay vehículos registrados');
      return JSON.stringify([]);
    }

    const vehiculos = [];
    const encabezados = datos[0];

    // Crear objetos de vehículos
    for (let i = 1; i < datos.length; i++) {
      let vehiculo = {};
      for (let j = 0; j < encabezados.length; j++) {
        // Convertir valores vacios o null a string vacío
        let valor = datos[i][j];
        if (valor === null || valor === undefined) {
          valor = '';
        }
        vehiculo[encabezados[j]] = valor;
      }
      vehiculos.push(vehiculo);
    }

    console.log(' Se obtuvieron', vehiculos.length, 'vehículos');
    return JSON.stringify(vehiculos);

  } catch (error) {
    console.error(' Error al obtener vehículos:', error);
    throw new Error('No se pudieron obtener los vehículos: ' + error.message);
  }
}


// FUNCIONES DE AUTOMÓVILES
function guardarAutomovilEnHoja(automovil) {
  const hoja = dataTable("Tbl_Vehiculo");

  // Calcular la siguiente fila vacía
  const ultimaFila = hoja.getLastRow();
  const nuevaFilaIndex = ultimaFila + 1;

  // Construir los datos en el orden de las columnas
  const nuevaFila = [
    ultimaFila, // ID generado como número de fila actual
    automovil.Placa,
    automovil.tipovehiculo,
    automovil.tipogasolina,
    automovil.Estado,
    automovil.Comentario,
    automovil.aniovehiculo,
    automovil.Establecimiento,
    automovil.marca,
    automovil.Modelo,
    automovil.ult_fechmantenimiento,
    automovil.costmante
  ];

  // Escribir la fila directamente en el rango correcto
  hoja.getRange(nuevaFilaIndex, 1, 1, nuevaFila.length).setValues([nuevaFila]);
}

function actualizarAutomovilEnHoja(automovil, rowIndex) {
  const hoja = dataTable("Tbl_Vehiculo");
  hoja.getRange(rowIndex, 2, 1, 11).setValues([[
    automovil.Placa,
    automovil.tipovehiculo,
    automovil.tipogasolina,
    automovil.Estado,
    automovil.Comentario,
    automovil.aniovehiculo,
    automovil.Establecimiento,
    automovil.marca,
    automovil.Modelo,
    automovil.ult_fechmantenimiento,
    automovil.costmante
  ]]);
}

// Función que obtiene en formato JSON todos los automóviles
function obtenerAutomovilesJSON() {
  const hoja = dataTable("Tbl_Vehiculo");
  const datos = hoja.getDataRange().getValues();
  const automoviles = [];
  const encabezados = datos[0]; // Títulos de columnas

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    let automovil = {};
    for (let j = 0; j < encabezados.length; j++) {
      // Formatear fechas correctamente para ult_fechmantenimiento
      if (encabezados[j] === "ult_fechmantenimiento") {
        if (fila[j] instanceof Date) {
          automovil[encabezados[j]] = Utilities.formatDate(fila[j], Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else if (fila[j]) {
          try {
            const fecha = new Date(fila[j]);
            automovil[encabezados[j]] = Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM-dd");
          } catch (e) {
            automovil[encabezados[j]] = fila[j];
          }
        } else {
          automovil[encabezados[j]] = "";
        }
      } else {
        automovil[encabezados[j]] = fila[j];
      }
    }
    automoviles.push(automovil);
  }

  return JSON.stringify(automoviles);
}


// FUNCION PARA SOLICITUDES

//OBTENER SOLICITUD
function obtenerSolicitudesJSON() {
  const hoja = dataTable("Tbl_solicitudes");
  const datos = hoja.getDataRange().getValues();

  const solicitudes = [];
  const encabezados = datos[0];

  for (let i = 1; i < datos.length; i++) {
    let solicitud = {};
    for (let j = 0; j < encabezados.length; j++) {
      const campo = encabezados[j];

      // Detectar campos de FECHA
      if (campo === "Fecsol" || campo === "Fecsal") {
        if (datos[i][j] instanceof Date) {
          solicitud[campo] = Utilities.formatDate(
            datos[i][j],
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          );
        } else if (datos[i][j]) {
          try {
            const fecha = new Date(datos[i][j]);
            solicitud[campo] = Utilities.formatDate(
              fecha,
              Session.getScriptTimeZone(),
              "yyyy-MM-dd"
            );
          } catch (e) {
            solicitud[campo] = datos[i][j];
          }
        } else {
          solicitud[campo] = "";
        }

        // Detectar campos de HORA
      } else if (campo === "HoraSal" || campo === "HoraRegre") {
        if (datos[i][j] instanceof Date) {
          solicitud[campo] = Utilities.formatDate(
            datos[i][j],
            Session.getScriptTimeZone(),
            "HH:mm"
          );
        } else if (datos[i][j]) {
          try {
            const hora = new Date(datos[i][j]);
            solicitud[campo] = Utilities.formatDate(
              hora,
              Session.getScriptTimeZone(),
              "HH:mm"
            );
          } catch (e) {
            solicitud[campo] = datos[i][j];
          }
        } else {
          solicitud[campo] = "";
        }

        // Otros campos normales
      } else {
        solicitud[campo] = datos[i][j];
      }
    }
    solicitudes.push(solicitud);
  }

  return JSON.stringify(solicitudes); // ¡Obligatorio!
}




// GUARDAR SOLICITUDES

function guardarSolicitudesEnHoja(solicitud) {
  const hoja = dataTable("Tbl_solicitudes");
  const nuevaFila = [
    hoja.getLastRow(),
    solicitud.User || "",
    solicitud.Fecsol || "",
    solicitud.Fecsal || "",
    solicitud.HoraSal || "",
    solicitud.HoraRegre || "",
    solicitud.RRHH || "",
    solicitud.Motivo || "",
    solicitud.lugares || "",
    solicitud.Estado || "",
    solicitud.placa || "",
    solicitud.motorista || "",
    solicitud.Tgas || "",
    solicitud.justsoli || "",
    solicitud.newlugar || "",
    solicitud.justcambio || "",
    solicitud.Idsolicitud || "",
    solicitud.UnSolicitante || "",
    solicitud.OrdSuministro || "",
    solicitud.Ncupones || "",
    solicitud.SerieIni || "",
    solicitud.SerieFin || "",
    solicitud.CantAsing || "",
    solicitud.Authorizado || "",
    solicitud.Recibido || "",
    solicitud.marca || ""
  ];
  hoja.appendRow(nuevaFila);
}

function actualizarSolicitudEnHoja(solicitud, rowIndex) {
  const hoja = dataTable("Tbl_solicitudes");
  // Desde columna 2 hasta la 12 (porque columna 1 es ID)
  hoja.getRange(rowIndex, 2, 1, 25).setValues([[
    solicitud.User,
    solicitud.Fecsol,
    solicitud.Fecsal,
    solicitud.HoraSal,
    solicitud.HoraRegre,
    solicitud.RRHH,
    solicitud.Motivo,
    solicitud.lugares,
    solicitud.Estado,
    solicitud.placa,
    solicitud.motorista,
    solicitud.Tgas,
    solicitud.justsoli,
    solicitud.newlugar,
    solicitud.justcambio,
    solicitud.Idsolicitud,
    solicitud.UnSolicitante,
    solicitud.OrdSuministro,
    solicitud.Ncupones,
    solicitud.SerieIni,
    solicitud.SerieFin,
    solicitud.CantAsing,
    solicitud.Authorizado,
    solicitud.Recibido,
    solicitud.marca
  ]]);
}

// Nueva función para actualizar solicitud por ID (más segura)
function actualizarSolicitudPorId(solicitud) {
  try {
    const hoja = dataTable("Tbl_solicitudes");
    const datos = hoja.getDataRange().getValues();
    
    Logger.log("Buscando solicitud con ID: " + solicitud.Idsolicitud);
    Logger.log("Total de filas en la hoja: " + datos.length);
    
    // Buscar la fila que coincida con el Idsolicitud
    // datos[0] son los headers
    // datos[1] en adelante son los datos
    for (let i = 1; i < datos.length; i++) {
      Logger.log("Fila " + i + ", Idsolicitud en datos[i][16]: " + datos[i][16]);
      
      // El Idsolicitud está en la columna 17 (índice 16 en el array)
      if (datos[i][16] && String(datos[i][16]).trim() === String(solicitud.Idsolicitud).trim()) {
        Logger.log("✅ Solicitud encontrada en fila: " + (i + 1));
        
        // Encontrada la fila, actualizar desde la columna 2 (índice 1)
        // i en el array = i+1 en la hoja (porque fila 1 es headers)
        hoja.getRange(i + 1, 2, 1, 25).setValues([[
          solicitud.User,
          solicitud.Fecsol,
          solicitud.Fecsal,
          solicitud.HoraSal,
          solicitud.HoraRegre,
          solicitud.RRHH,
          solicitud.Motivo,
          solicitud.lugares,
          solicitud.Estado,
          solicitud.placa,
          solicitud.motorista,
          solicitud.Tgas,
          solicitud.justsoli,
          solicitud.newlugar,
          solicitud.justcambio,
          solicitud.Idsolicitud,
          solicitud.UnSolicitante,
          solicitud.OrdSuministro,
          solicitud.Ncupones,
          solicitud.SerieIni,
          solicitud.SerieFin,
          solicitud.CantAsing,
          solicitud.Authorizado,
          solicitud.Recibido,
          solicitud.marca
        ]]);
        return true; // Indicar que se actualizó exitosamente
      }
    }
    
    Logger.log("❌ Solicitud no encontrada. ID buscado: " + solicitud.Idsolicitud);
    throw new Error('Solicitud con ID ' + solicitud.Idsolicitud + ' no encontrada');
  } catch (error) {
    Logger.log("Error en actualizarSolicitudPorId: " + error.message);
    throw error;
  }
}



// Función específica para obtener solo los nombres de establecimientos (para el select)
function obtenerEstablecimientos() {
  const hoja = SpreadsheetApp.getActive().getSheetByName("Tbl_establecimiento");
  const datos = hoja.getDataRange().getValues();
  const lista = [];

  for (let i = 1; i < datos.length; i++) {
    const establecimiento = datos[i][1]; // Asume que la columna 1 (índice 1) es "Establecimiento"
    if (establecimiento) {
      lista.push(establecimiento);
    }
  }

  return JSON.stringify(lista);
}






