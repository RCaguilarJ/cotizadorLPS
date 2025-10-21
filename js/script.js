document.addEventListener("DOMContentLoaded", function () {
    const selectPlan = document.getElementById("plan-select");
    const tituloHeader = document.getElementById("titulo-header");

    const campoInversion = document.getElementById("campo-inversion");
    const campoEdad = document.getElementById("campo-edad");
    const campoEdadRetiro = document.getElementById("campo-edad-retiro");
    const campoBoton = document.getElementById("campo-boton");
    const campoAniosPago = document.getElementById("campo-anios-pago");

    const bloqueSuma = document.getElementById("bloque-suma");
    const sumaLabel = document.getElementById("suma-asegurada-label");

    const inputInversion = document.getElementById("inversion");
    const inputEdad = document.getElementById("edad");
    const selectEdadRetiro = document.getElementById("edad-retiro");

    //const resultadoDtotal = document.getElementById("resultado-dtotal");
    const tablaDtotalContainer = document.getElementById("tabla-dtotal-container");
    const tablaDtotal = document.getElementById("tabla-dtotal");
    const calculosFinales = document.getElementById("calculos-finales");

    const tablaRetiroContainer = document.getElementById("tabla-retiro-container");
    const tablaRetiro = document.getElementById("tabla-retiro");
    const calculosFinalesRetiro = document.getElementById("calculos-finales-retiro");

    const tablaVidaContainer = document.getElementById("tabla-vida-container");
    const tablaVida = document.getElementById("tabla-vida");
    const calculosFinalesVida = document.getElementById("calculos-finales-vida");

    const tablaFideicomisoContainer = document.getElementById("tabla-fideicomiso-container");
    const tablaFideicomiso = document.getElementById("tabla-fideicomiso");
    const calculosFinalesFideicomiso = document.getElementById("calculos-finales-fideicomiso");

    const tablaSeguroVidaContainer = document.getElementById("tabla-segurovida-container");
    const tablaSeguroVida = document.getElementById("tabla-segurovida");
    const calculosFinalesSeguroVida = document.getElementById("calculos-finales-segurovida");

    const campoEdadContratante = document.getElementById("campo-edad-contratante");
    const campoEdadMenor = document.getElementById("campo-edad-menor");

    const btnGenerar = document.getElementById("generar-calculos");

    const inversionTotalSpan = document.getElementById("inversion-total");
    const recuperacionTotalSpan = document.getElementById("recuperacion-total");

    let inversiones = [];
    let recuperacionTotalArr = [];

    // ✅ Tabla de configuración para los 11 planes RETIRO
    const planesRetiro = {
        "RETIRO_30_55": { porcentajeBase: 0.0742 },
        "RETIRO_30_60": { porcentajeBase: 0.0642 },
        "RETIRO_30_65": { porcentajeBase: 0.0600 },
        "RETIRO_30_70": { porcentajeBase: 0.0528 },
        "RETIRO_40_55": { porcentajeBase: 0.1000 },
        "RETIRO_40_60": { porcentajeBase: 0.0850 },
        "RETIRO_40_65": { porcentajeBase: 0.0900 },
        "RETIRO_40_70": { porcentajeBase: 0.0845 },
        "RETIRO_50_60": { porcentajeBase: 0.1100 },
        "RETIRO_50_65": { porcentajeBase: 0.1200 },
        "RETIRO_50_70": { porcentajeBase: 0.0845 }
    };

    selectPlan.selectedIndex = 0; // Regresa a la opción "Elige una opción"

    // Manejar la selección de plan
    selectPlan.addEventListener("change", function () {
        const selectedPlan = this.value;
        tituloHeader.textContent = selectedPlan;

        // LIMPIEZA DE CAMPOS Y RESULTADOS
        inputInversion.value = "";
        inputEdad.value = "";
        selectEdadRetiro.innerHTML = `<option value="" disabled selected>Seleccione edad de retiro</option>`;
        sumaLabel.textContent = "0";

        document.getElementById("inversion-total").textContent = "0 Pesos";
        document.getElementById("recuperacion-total").textContent = "0 Pesos";
        document.getElementById("mensaje-final").style.display = "none";
        // Nuevo: limpiar beneficios adicionales también
        document.getElementById("mensaje-beneficios").textContent = "";
        document.getElementById("mensaje-beneficios").style.display = "none";

        // LIMPIAR TABLAS
        tablaDtotal.innerHTML = "";
        tablaRetiro.innerHTML = "";
        tablaVida.innerHTML = "";
        tablaFideicomiso.innerHTML = "";
        tablaSeguroVida.innerHTML = ""; 

        // OCULTAR TODAS LAS SECCIONES DE RESULTADOS
        //resultadoDtotal.style.display = "none";
        tablaDtotalContainer.style.display = "none";
        tablaRetiroContainer.style.display = "none";
        tablaVidaContainer.style.display = "none";
        tablaFideicomisoContainer.style.display = "none";
        tablaSeguroVidaContainer.style.display = "none";

        calculosFinales.style.display = "none";
        calculosFinalesRetiro.style.display = "none";
        calculosFinalesVida.style.display = "none";
        calculosFinalesFideicomiso.style.display = "none";
        calculosFinalesSeguroVida.style.display = "none";

        // REINICIAR visibilidad de campos de captura
        campoInversion.style.display = "none";
        campoEdad.style.display = "none";
        campoEdadRetiro.style.display = "none";
        campoAniosPago.style.display = "none";
        campoEdadContratante.style.display = "none";
        campoEdadMenor.style.display = "none";
        campoBoton.style.display = "none";
        bloqueSuma.style.display = "none";

        // Mostrar campos según la opción seleccionada
        if (selectedPlan === "DOTAL 10") {
            campoInversion.style.display = "block";
            campoEdad.style.display = "block";
            //bloqueSuma.style.display = "block";
            campoBoton.style.display = "block";
        } else if (selectedPlan === "RETIRO") {
            campoInversion.style.display = "block";
            campoEdad.style.display = "block";
            campoEdadRetiro.style.display = "block"; // Solo para "RETIRO O PLENITUD"
            campoBoton.style.display = "block";
        } else if (selectedPlan === "VIDA MUJER") {
            campoInversion.style.display = "block";
            campoEdad.style.display = "block";
            campoBoton.style.display = "block";
        } else if (selectedPlan === "FIDEICOMISO EDUCATIVO") {
            campoInversion.style.display = "block";
            campoBoton.style.display = "block";
            campoEdadContratante.style.display = "block"; 
            campoEdadMenor.style.display = "block";
        } else if (selectedPlan === "SEGURO DE VIDA") {
            campoInversion.style.display = "block";
            campoEdad.style.display = "block";
            campoAniosPago.style.display = "block";
            campoBoton.style.display = "block";
        }
    });

    inputInversion.addEventListener("input", function () {
        const inversion = parseFloat(limpiarFormato(this.value)) || 0;
        const selectedPlan = selectPlan.value;
    
        // DOTAL 10
        if (selectedPlan === "DOTAL 10" && inversion >= 50000) {
            const suma = inversion * 11;
            sumaLabel.textContent = formatoMoneda(suma);
            bloqueSuma.style.display = "block";
        }
        // VIDA MUJER
        else if (selectedPlan === "VIDA MUJER" && inversion >= 36000) {
            const suma = inversion * 15;
            sumaLabel.textContent = formatoMoneda(suma);
            bloqueSuma.style.display = "block";
        }
        // FIDEICOMISO
        else if (selectedPlan === "FIDEICOMISO EDUCATIVO" && inversion >= 36000) {
            const suma = inversion * 15;
            sumaLabel.textContent = formatoMoneda(suma);
            bloqueSuma.style.display = "block";
        }
        // RETIRO
        else if (selectedPlan === "RETIRO") {
            inputEdad.value = "";
            selectEdadRetiro.innerHTML = "";
            sumaLabel.textContent = "0";
            bloqueSuma.style.display = "none";
        }
        // SEGURO
        else if (selectedPlan === "SEGURO DE VIDA" && inversion >= 30000) {
            const suma = inversion * 24;
            sumaLabel.textContent = formatoMoneda(suma);
            bloqueSuma.style.display = "block";
        }
        // Para otros casos, ocultar
        else {
            sumaLabel.textContent = "0";
            bloqueSuma.style.display = "none";
        }
    });
    
    // Función para agregar opciones al select
    function agregarOpcion(select, texto, valor, isDisabled = false) {
        let option = document.createElement("option");
        option.text = texto;
        option.value = valor;

        if (isDisabled) {
            option.disabled = true;
            option.selected = true;
        }

        select.appendChild(option);
    }
    
    // Actualizar opciones del select "Edad de Retiro" según la Edad Actual ingresada
    inputEdad.addEventListener("input", function () {
        const selectedPlan = selectPlan.value;
        if (selectedPlan !== "RETIRO") return; // Solo continuar si es RETIRO

        const edadActual = parseInt(inputEdad.value) || 0;

        // VALIDACIÓN EXTRA: sugerencia para edades de 58 a 60
        //if (edadActual >= 58 && edadActual <= 60) {
        //    alert("Le recomendamos cotizar el plan DOTAL 10");
        //}

        selectEdadRetiro.innerHTML = ""; // Limpiar opciones previas
        const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;

        let multiplicador = 0;

        // Siempre se agrega la opción por defecto
        agregarOpcion(selectEdadRetiro, "Seleccione edad", "", true);

        if (edadActual >= 20 && edadActual <= 39) {
            multiplicador = 17;
            agregarOpcion(selectEdadRetiro, "55 años", "RETIRO_30_55");
            agregarOpcion(selectEdadRetiro, "60 años", "RETIRO_30_60");
            agregarOpcion(selectEdadRetiro, "65 años", "RETIRO_30_65");
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_30_70");
        } else if (edadActual >= 40 && edadActual <= 45) {
            multiplicador = 15;
            agregarOpcion(selectEdadRetiro, "55 años", "RETIRO_40_55");
            agregarOpcion(selectEdadRetiro, "60 años", "RETIRO_40_60");
            agregarOpcion(selectEdadRetiro, "65 años", "RETIRO_40_65");
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_40_70");
        } else if (edadActual > 45 && edadActual <= 49) {
            multiplicador = 15;
            agregarOpcion(selectEdadRetiro, "60 años", "RETIRO_40_60");
            agregarOpcion(selectEdadRetiro, "65 años", "RETIRO_40_65");
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_40_70");
        } else if (edadActual === 50) {
            multiplicador = 11;
            agregarOpcion(selectEdadRetiro, "60 años", "RETIRO_50_60");
            agregarOpcion(selectEdadRetiro, "65 años", "RETIRO_50_65");
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_50_70");
        } else if (edadActual >= 51 && edadActual <= 55) {
            multiplicador = 11;
            agregarOpcion(selectEdadRetiro, "65 años", "RETIRO_50_65");
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_50_70");
        } else if (edadActual >= 56 && edadActual <= 60) {
            multiplicador = 11;
            agregarOpcion(selectEdadRetiro, "70 años", "RETIRO_50_70");
        }

        if (inversion >= 36000) {
            const suma = inversion * multiplicador;
            sumaLabel.textContent = formatoMoneda(suma);
            bloqueSuma.style.display = "block";
        } else {
            sumaLabel.textContent = "0";
            bloqueSuma.style.display = "none";
        }
    });

    // Función para DOTAL 10
    function generarTablaDotal() {
        const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;
        const edadInicial = parseInt(document.getElementById("edad").value) || 0;

        if (inversion <= 0 || edadInicial <= 0) {
            alert("Ingrese una inversión y edad válida.");
            return;
        }
        if (inversion < 50000) {
            alert("La inversión mínima es de 50,000 pesos.");
            return;
        }

         // Limpiar tabla previa SOLO si las validaciones son correctas
        tablaDtotal.innerHTML = "";

        let inversiones = [];
        let inversionActual = inversion;
        let recuperaciones = [];
        let edad = edadInicial;

        for (let i = 0; i < 10; i++) {
            inversiones.push(inversionActual);
            inversionActual = inversionActual * 1.04;
        }
      
        for (let i = 0; i < 10; i++) {
            if (i < 2) {
                recuperaciones.push(0);
            } else {
                const multiplicadores = [0.414, 0.5521, 0.6901, 0.8281, 0.9621, 1.1, 1.2381, 1.3761];
                let sumaAcumulada = inversiones.slice(0, i + 1).reduce((a, b) => a + b, 0);
                recuperaciones.push(sumaAcumulada * multiplicadores[i - 2]);
            }
        }

        for (let i = 0; i < 10; i++) {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${edad + i}</td> <!-- Edad -->
                <td>${formatoMoneda(inversiones[i])}</td>
                <td>${formatoMoneda(recuperaciones[i])}</td>
            `;
            tablaDtotal.appendChild(fila);
        }

        tablaDtotalContainer.style.display = "block";

        // Calcular y mostrar los resultados finales
        const inversionTotal = inversiones.reduce((a, b) => a + b, 0);
        const recuperacionTotal = recuperaciones[9]; // Última fila de la columna "Recuperación"

        inversionTotalSpan.textContent = formatoMoneda(inversionTotal)  + ' Pesos';
        recuperacionTotalSpan.textContent = formatoMoneda(recuperacionTotal)  + ' Pesos';

        calculosFinales.style.display = "flex";
        document.getElementById("mensaje-final").style.display = "block";

        // Mostrar beneficios dependiendo del plan
        const selectedPlan = selectPlan.value;
        const mensajeBeneficios = document.getElementById("mensaje-beneficios");

        if (selectedPlan === "VIDA MUJER") {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental, protección por cáncer femenino, protección para complicaciones del embarazo.";
        } else {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental.";
        }
        mensajeBeneficios.style.display = "block";
        mostrarAcciones();
    }

    function generarTablaRetiroGenerica(config) {
        const { edad, inversion, filas, porcentajeBase, multiplicadoresDotal } = config;
    
        // Validación de inversión mínima
        if (inversion < 36000) {
            alert("La inversión mínima para el plan RETIRO es de 36,000 pesos.");
            return;
        }

        tablaRetiro.innerHTML = "";

        let inversiones = [];
        let inversionActual = inversion;
        let tasaRecuperacion = [];
        let inversionAcumulada = [];
        let recuperacionTotal = [];
    
        // Calcular columna Inversión
        for (let i = 0; i < filas; i++) {
            inversiones.push(inversionActual);
            inversionActual = inversionActual * 1.04;
        }
    
        // Calcular columna Tasa Recuperación
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                tasaRecuperacion.push("");
            } else if (multiplicadoresDotal && multiplicadoresDotal[i - 2] !== undefined) {
                tasaRecuperacion.push(multiplicadoresDotal[i - 2]);
            } else if (i === 2) {
                tasaRecuperacion.push(porcentajeBase * 3);
            } else {
                tasaRecuperacion.push(tasaRecuperacion[i - 1] + porcentajeBase);
            }
        }
    
        // Calcular columna Inversión Acumulada
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                inversionAcumulada.push("");
            } else if (i === 2) {
                inversionAcumulada.push(inversiones[0] + inversiones[1] + inversiones[2]);
            } else {
                inversionAcumulada.push(inversionAcumulada[i - 1] + inversiones[i]);
            }
        }
    
        // Calcular columna Recuperación Total
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                recuperacionTotal.push(0);
            } else {
                recuperacionTotal.push(inversionAcumulada[i] * tasaRecuperacion[i]);
            }
        }
    
        // Mostrar en tabla
        tablaRetiro.innerHTML = "";
        for (let i = 0; i < filas; i++) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${edad + i}</td>
                <td>${formatoMoneda(inversiones[i])}</td>
                <td>${formatoMoneda(recuperacionTotal[i])}</td>
            `;
            tablaRetiro.appendChild(fila);
        }
    
        tablaRetiroContainer.style.display = "block";
    
        // Mostrar resultados finales
        const inversionTotal = inversiones.reduce((a, b) => a + b, 0);
        const recuperacionTotalFinal = recuperacionTotal[filas - 1];
    
        document.getElementById("inversion-total-retiro").textContent = formatoMoneda(inversionTotal) + " Pesos";
        document.getElementById("recuperacion-total-retiro").textContent = formatoMoneda(recuperacionTotalFinal) + " Pesos";
        document.getElementById("calculos-finales-retiro").style.display = "flex";
        document.getElementById("mensaje-final").style.display = "block";

        // Mostrar beneficios dependiendo del plan
        const selectedPlan = selectPlan.value;
        const mensajeBeneficios = document.getElementById("mensaje-beneficios");

        if (selectedPlan === "VIDA MUJER") {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental, protección por cáncer femenino, protección para complicaciones del embarazo.";
        } else {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental.";
        }
        mensajeBeneficios.style.display = "block";
        mostrarAcciones();
    }
    
    // Función para generar la tabla del plan VIDA MUJER
    function generarTablaVidaMujer() {
        const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;
        const edadInicial = parseInt(inputEdad.value) || 0;

        if (inversion < 36000) {
            alert("La inversión mínima para el plan VIDA MUJER es de 36,000 pesos.");
            return;
        }
        
        if (edadInicial < 18 || edadInicial > 50) {
            alert("La edad para el plan VIDA MUJER debe estar entre 18 y 50 años.");
            return;
        }

        tablaVida.innerHTML = "";
        
        const tasaBase = 0.0575;
        const filas = 20;
        let inversiones = [];
        let tasaRecuperacion = [];
        let inversionAcumulada = [];
        let recuperacionTotal = [];

        let inversionActual = inversion;
        let edad = edadInicial;

        // Calcular columna Inversión
        for (let i = 0; i < filas; i++) {
            inversiones.push(inversionActual);
            inversionActual = inversionActual * 1.04;
        }

        // Calcular Tasa de Recuperación
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                tasaRecuperacion.push(0);
            } else if (i === 2) {
                tasaRecuperacion.push(tasaBase * 3);
            } else {
                tasaRecuperacion.push(tasaRecuperacion[i - 1] + tasaBase);
            }
        }

        // Calcular Inversión Acumulada
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                inversionAcumulada.push(0);
            } else if (i === 2) {
                inversionAcumulada.push(inversiones[0] + inversiones[1] + inversiones[2]);
            } else {
                inversionAcumulada.push(inversionAcumulada[i - 1] + inversiones[i]);
            }
        }

        // Calcular Recuperación Total
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                recuperacionTotal.push(0);
            } else {
                recuperacionTotal.push(inversionAcumulada[i] * tasaRecuperacion[i]);
            }
        }

        // Generar tabla
        tablaVida.innerHTML = "";
        for (let i = 0; i < filas; i++) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${edad + i}</td>
                <td>${formatoMoneda(inversiones[i])}</td>
                <td>${formatoMoneda(recuperacionTotal[i])}</td>
            `;
            tablaVida.appendChild(fila);
        }

        // Mostrar tabla
        tablaVidaContainer.style.display = "block";

        // Mostrar resultados finales
        const inversionTotal = inversiones.reduce((a, b) => a + b, 0);
        const recuperacionTotalFinal = recuperacionTotal[filas - 1];

        document.getElementById("inversion-total-vida").textContent = formatoMoneda(inversionTotal) + " Pesos";
        document.getElementById("recuperacion-total-vida").textContent = formatoMoneda(recuperacionTotalFinal) + " Pesos";
        calculosFinalesVida.style.display = "flex";

        document.getElementById("mensaje-final").style.display = "block";

        // Mostrar beneficios dependiendo del plan
        const selectedPlan = selectPlan.value;
        const mensajeBeneficios = document.getElementById("mensaje-beneficios");

        if (selectedPlan === "VIDA MUJER") {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental, protección por cáncer femenino, protección para complicaciones del embarazo.";
        } else {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental.";
        }
        mensajeBeneficios.style.display = "block";
        mostrarAcciones();
    }

    function generarTablaFideicomisoEdu(config) {
        const { inversion, añosPago, edadMenor } = config;
    
        if (inversion < 36000) {
            alert("La inversión mínima es de 36,000 pesos.");
            return;
        }
    
        tablaFideicomiso.innerHTML = "";

        const filas = añosPago;
        const tasaBase = 0.08;
        let inversiones = [];
        let tasaRecuperacion = [];
        let inversionAcumulada = [];
        let recuperacionTotal = [];
        let inversionActual = inversion;
    
        // Calcular inversión
        for (let i = 0; i < filas; i++) {
            inversiones.push(inversionActual);
            inversionActual *= 1.04;
        }
    
        // Calcular tasa recuperación con lógica definida
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                tasaRecuperacion.push("");
            } else if (i === 2) {
                tasaRecuperacion.push(0.08 * 3);
            } else if (i === 3) {
                tasaRecuperacion.push(tasaRecuperacion[i - 1] + 0.08);
            } else {
                tasaRecuperacion.push(tasaRecuperacion[i - 1] + 0.10);
            }
        }
    
        // Calcular inversión acumulada
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                inversionAcumulada.push("");
            } else if (i === 2) {
                inversionAcumulada.push(inversiones[0] + inversiones[1] + inversiones[2]);
            } else {
                inversionAcumulada.push(inversionAcumulada[i - 1] + inversiones[i]);
            }
        }
    
        // Calcular recuperación total
        for (let i = 0; i < filas; i++) {
            if (i < 2) {
                recuperacionTotal.push(0);
            } else {
                recuperacionTotal.push(inversionAcumulada[i] * tasaRecuperacion[i]);
            }
        }
    
        tablaFideicomiso.innerHTML = "";
        for (let i = 0; i < filas; i++) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${edadMenor + i}</td> <!-- Edad del menor que incrementa -->
                <td>${formatoMoneda(inversiones[i])}</td>
                <td>${formatoMoneda(recuperacionTotal[i])}</td>
            `;
            tablaFideicomiso.appendChild(fila);
        }
    
        tablaFideicomisoContainer.style.display = "block";
        document.getElementById("mensaje-final").style.display = "block";
    
        // Totales
        const inversionTotal = inversiones.reduce((a, b) => a + b, 0);
        const recuperacionTotalFinal = recuperacionTotal[filas - 1];
    
        document.getElementById("inversion-total-fideicomiso").textContent = formatoMoneda(inversionTotal) + " Pesos";
        document.getElementById("recuperacion-total-fideicomiso").textContent = formatoMoneda(recuperacionTotalFinal) + " Pesos";
        document.getElementById("calculos-finales-fideicomiso").style.display = "flex";

        // Mostrar beneficios dependiendo del plan
        const selectedPlan = selectPlan.value;
        const mensajeBeneficios = document.getElementById("mensaje-beneficios");

        if (selectedPlan === "VIDA MUJER") {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental, protección por cáncer femenino, protección para complicaciones del embarazo.";
        } else {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental.";
        }
        mensajeBeneficios.style.display = "block";
        mostrarAcciones();
    }
    
    function generarTablaSeguroVida() {
        const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;
        const edad = parseInt(inputEdad.value) || 0;
        const anios = parseInt(document.getElementById("anios-pago").value) || 0;
      
        if (inversion < 30000) {
            alert("La inversión mínima para el plan SEGURO DE VIDA es de 30,000 pesos.");
            return;
        }
        
        if (edad <= 0 || edad < 20 || edad > 60) {
            alert("La edad para el plan SEGURO DE VIDA debe estar entre 20 y 60 años.");
            return;
        }
        
        if (!anios) {
            alert("Seleccione los años de pago (10 o 20 años).");
            return;
        }

        tablaVida.innerHTML = "";
        
        let inversiones = [];
        let sumaAsegurada = [];
        let inversionActual = inversion;
        let sumaActual = inversion * 24;
      
        for (let i = 0; i < anios; i++) {
          inversiones.push(inversionActual);
          sumaAsegurada.push(sumaActual);
          inversionActual = inversionActual * 1.04;
          sumaActual = sumaActual * 1.05;
        }
      
        // Mostrar tabla
        tablaSeguroVida.innerHTML = "";
        for (let i = 0; i < anios; i++) {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${edad + i}</td>
            <td>${formatoMoneda(inversiones[i])}</td>
            <td>${formatoMoneda(sumaAsegurada[i])}</td>
          `;
          tablaSeguroVida.appendChild(fila);
        }
      
        tablaSeguroVidaContainer.style.display = "block";
        document.getElementById("mensaje-final").style.display = "block";
      
        const totalInversion = inversiones.reduce((a, b) => a + b, 0);
        const totalSuma = sumaAsegurada[anios - 1];
      
        document.getElementById("inversion-total-segurovida").textContent = formatoMoneda(totalInversion) + " Pesos";
        document.getElementById("suma-total-segurovida").textContent = formatoMoneda(totalSuma) + " Pesos";
        document.getElementById("calculos-finales-segurovida").style.display = "flex";

        // Mostrar beneficios dependiendo del plan
        const selectedPlan = selectPlan.value;
        const mensajeBeneficios = document.getElementById("mensaje-beneficios");

        if (selectedPlan === "VIDA MUJER") {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental, protección por cáncer femenino, protección para complicaciones del embarazo.";
        } else {
            mensajeBeneficios.textContent = "Beneficios adicionales: Invalidez total y permanente, exención de pago de primas por invalidez, perdidas orgánicas y beneficio de muerte accidental.";
        }
        mensajeBeneficios.style.display = "block";
        mostrarAcciones();
    }
      

    // Función para generar la tabla de cálculos
    btnGenerar.addEventListener("click", function () {

        // Validar que el usuario haya ingresado nombre, correo y teléfono antes de permitir cotizar
        const nombreReq = document.getElementById('nombre')?.value?.trim() || '';
        const correoReq = document.getElementById('correo')?.value?.trim() || '';
        const telefonoReq = document.getElementById('telefono')?.value?.trim() || '';

        if (!nombreReq || !correoReq || !telefonoReq) {
            alert('Por favor complete Nombre, Correo y Teléfono antes de solicitar la cotización.');
            return;
        }

        // Validación básica de correo
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(correoReq)) {
            alert('Ingrese un correo válido.');
            return;
        }

        const selectedPlan = selectPlan.value;
        const edad = parseInt(inputEdad.value) || 0;

        // Validación global de edad
        if (selectedPlan === "VIDA MUJER") {
            if (edad < 18 || edad > 50) {
                alert("Para el plan VIDA MUJER, la edad debe estar entre 18 y 50 años.");
                return;
            }
        } else if (["DOTAL 10", "RETIRO", "SEGURO DE VIDA"].includes(selectedPlan)) {
            if (edad < 20 || edad > 60) {
                alert("La edad debe estar entre 20 y 60 años.");
                return;
            }
        }

        if (selectedPlan === "DOTAL 10") {
            generarTablaDotal();
        } else if (selectedPlan === "RETIRO") {
            const tipo = selectEdadRetiro.value;
            const config = planesRetiro[tipo];
            const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;

            if (!config) {
                alert("Selecciona una edad de retiro válida.");
                return;
            }

            const edadRetiro = parseInt(tipo.split("_")[2]); // ejemplo: "RETIRO_30_55" => 55
            const filas = edadRetiro - edad;

            if (filas <= 0) {
                alert("La edad de retiro debe ser mayor a la edad actual.");
                return;
            } 

            // ✅ Verificar si cae en los rangos especiales para usar los multiplicadores del Plan DOTAL
            const rangosEspeciales = [
                [45, 55],
                [50, 60],
                [55, 65],
                [60, 70]
            ];
            const usarMultiplicadoresDotal = rangosEspeciales.some(
                ([inicio, fin]) => edad === inicio && edadRetiro === fin
            );

            if (usarMultiplicadoresDotal) {
                generarTablaRetiroGenerica({
                    edad,
                    inversion,
                    filas,
                    multiplicadoresDotal: [0.414, 0.5521, 0.6901, 0.8281, 0.9621, 1.1, 1.2381, 1.3761]
                });
            } else {
                generarTablaRetiroGenerica({
                    edad,
                    inversion,
                    filas,
                    porcentajeBase: config.porcentajeBase
                });
            }

        } else if (selectedPlan === "VIDA MUJER") {
            generarTablaVidaMujer();
        } else if (selectedPlan === "SEGURO DE VIDA") {
            generarTablaSeguroVida();
        } else if (selectedPlan === "FIDEICOMISO EDUCATIVO") {
            const edadContratante = parseInt(document.getElementById("edad-contratante").value) || 0;
            const edadMenor = parseInt(document.getElementById("edad-menor").value) || 0;
            const inversion = parseFloat(limpiarFormato(inputInversion.value)) || 0;

            if (inversion < 36000) {
                alert("La inversión mínima para el Fideicomiso Educativo es de 36,000 pesos.");
                return;
            }

            if (edadContratante < 20 || edadContratante > 50) {
                alert("La edad del contratante debe estar entre 20 y 50 años.");
                return;
            }

            if (edadMenor < 1 || edadMenor > 7) {
                alert("La edad del menor debe estar entre 1 y 7 años.");
                return;
            }

            const añosPago = 18 - edadMenor; // Cálculo de años a pagar

            generarTablaFideicomisoEdu({
                inversion,
                añosPago,
                edadMenor
            });
        } else if (selectedPlan === "SEGURO DE VIDA") {
            generarTablaSeguroVida();
        }

    });

    // Mostrar contenedor de acciones cuando haya resultados
    function mostrarAcciones() {
        const acciones = document.getElementById('acciones-cotizacion');
        if (acciones) acciones.style.display = 'flex';
    }

    // --------------------------------------------------
    // Formspree: enviar datos del solicitante al owner
    // --------------------------------------------------
    // Configura aquí tu endpoint de Formspree (ej: https://formspree.io/f/xxxxxxxx)
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/XXXXXXXX'; // <-- reemplaza con tu ID
    // Correo del owner que debe recibir la notificación
    const OWNER_EMAIL = 'hola@desingsgdl.mx';

    // Opcional: endpoint serverless que acepte un PDF (base64) y lo envíe por email.
    // Si lo configuras, el flujo intentará enviarlo automáticamente al correo del usuario
    // y/o al owner. Dejar vacio para no usar serverless.
    const SERVERLESS_ENDPOINT = ''; // ej: 'https://mi-funcion.vercel.app/api/send-pdf'

    async function enviarDatosAlOwner() {
        // Validar que se haya configurado el endpoint
        if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('XXXXXXXX')) {
            console.warn('Formspree endpoint no configurado. Edita FORMSPREE_ENDPOINT en js/script.js');
            return;
        }

        const nombre = document.getElementById('nombre')?.value || '';
        const correo = document.getElementById('correo')?.value || '';
        const telefono = document.getElementById('telefono')?.value || '';
        const plan = document.getElementById('plan-select')?.value || '';

        const inversionTotal = document.getElementById('inversion-total')?.textContent || document.getElementById('inversion-total-retiro')?.textContent || document.getElementById('inversion-total-vida')?.textContent || '';
        const recuperacionTotal = document.getElementById('recuperacion-total')?.textContent || document.getElementById('recuperacion-total-retiro')?.textContent || document.getElementById('recuperacion-total-vida')?.textContent || '';

        // Construir asunto y mensaje descriptivo
        const subject = `Nueva cotización — Nombre: ${nombre} | Plan: ${plan}`;
        const message = `Se generó una nueva cotización.\n\nNombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\nPlan: ${plan}\nInversión Total: ${inversionTotal}\nRecuperación Total: ${recuperacionTotal}\nFecha: ${new Date().toLocaleString()}`;

        const payload = {
            subject,
            message,
            nombre,
            correo,
            telefono,
            plan,
            inversionTotal,
            recuperacionTotal,
            fecha: new Date().toLocaleString(),
            ownerEmail: OWNER_EMAIL // se incluye para referencia en la carga a Formspree
        };

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log('Datos enviados a owner via Formspree');
                // opcional: notificar al usuario de que su solicitud fue registrada
                // alert('Tu solicitud fue enviada. Te contactaremos pronto.');
            } else {
                console.error('Error Formspree:', await res.text());
            }
        } catch (err) {
            console.error('Error enviando a Formspree:', err);
        }
    }

    // Generar PDF con html2canvas + jsPDF (captura el contenedor de la tabla visible)
    async function generarPDF() {
        const { jsPDF } = window.jspdf;

        // Preparar el área de impresión (#print-area)
        const printArea = document.getElementById('print-area');
        if (!printArea) {
            alert('Área de impresión no disponible.');
            return;
        }

        // Limpiar contenido previo
        printArea.innerHTML = '';

        // Cabecera: logos y título
        const headerDiv = document.createElement('div');
        headerDiv.className = 'header-print';
        const logoLeft = document.createElement('img');
        logoLeft.src = document.querySelector('.logo-left img')?.src || '';
        logoLeft.alt = 'Logo Izquierdo';
        const logoRight = document.createElement('img');
        logoRight.src = document.querySelector('.logo-right img')?.src || '';
        logoRight.alt = 'Logo Derecho';

        const title = document.createElement('h2');
        title.className = 'title-print';
        title.textContent = document.getElementById('titulo-header')?.textContent || 'Cotización';

        headerDiv.appendChild(logoLeft);
        headerDiv.appendChild(title);
        headerDiv.appendChild(logoRight);
        printArea.appendChild(headerDiv);

        // Datos del usuario
        const datosDiv = document.createElement('div');
        datosDiv.className = 'user-row-print';
        const nombre = document.getElementById('nombre')?.value || '';
        const correo = document.getElementById('correo')?.value || '';
        const telefono = document.getElementById('telefono')?.value || '';
        datosDiv.innerHTML = `<div><strong>Nombre:</strong> ${nombre}</div><div><strong>Correo:</strong> ${correo}</div><div><strong>Teléfono:</strong> ${telefono}</div>`;
        printArea.appendChild(datosDiv);

        // Insertar la tabla visible (clonar)
        const tablas = Array.from(document.querySelectorAll('.table-container'));
        let tablaVisible = tablas.find(t => t.offsetParent !== null || window.getComputedStyle(t).display !== 'none');
        if (!tablaVisible) tablaVisible = tablas[0] || null;

        if (tablaVisible) {
            // Clonar para mantener estilos
            const clon = tablaVisible.cloneNode(true);
            // Asegurar que el clon sea visible
            clon.style.display = 'block';
            // Limpiar posibles id duplicados
            clon.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            printArea.appendChild(clon);
        }

        // Totales (si existen)
        const totalsDiv = document.createElement('div');
        totalsDiv.className = 'totals';
        const invTotal = document.getElementById('inversion-total')?.textContent || document.getElementById('inversion-total-retiro')?.textContent || document.getElementById('inversion-total-vida')?.textContent || '';
        const recTotal = document.getElementById('recuperacion-total')?.textContent || document.getElementById('recuperacion-total-retiro')?.textContent || document.getElementById('recuperacion-total-vida')?.textContent || '';
        totalsDiv.innerHTML = `<div><strong>Inversión Total</strong><div>${invTotal}</div></div><div><strong>Recuperación Total</strong><div>${recTotal}</div></div>`;
        printArea.appendChild(totalsDiv);

        // Mostrar temporalmente el printArea para capturar
        printArea.style.display = 'block';

        try {
            const canvas = await html2canvas(printArea, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth - 40;
            const ratio = canvas.width / canvas.height;
            const imgHeight = imgWidth / ratio;

            let position = 20;

            if (imgHeight <= pdfHeight - 40) {
                pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
            } else {
                let remainingHeight = canvas.height;
                const pageCanvas = document.createElement('canvas');
                const pageCtx = pageCanvas.getContext('2d');

                const pxPerPt = canvas.width / imgWidth;
                const pageHeightPx = Math.floor((pdfHeight - 40) * pxPerPt);

                pageCanvas.width = canvas.width;
                pageCanvas.height = pageHeightPx;

                let srcY = 0;
                while (remainingHeight > 0) {
                    pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
                    pageCtx.drawImage(canvas, 0, srcY, canvas.width, pageHeightPx, 0, 0, pageCanvas.width, pageCanvas.height);

                    const pageImgData = pageCanvas.toDataURL('image/png');
                    pdf.addImage(pageImgData, 'PNG', 20, position, imgWidth, (pageCanvas.height) / pxPerPt);

                    remainingHeight -= pageHeightPx;
                    srcY += pageHeightPx;

                    if (remainingHeight > 0) pdf.addPage();
                }
            }

            // Ocultar el printArea otra vez
            printArea.style.display = 'none';

            pdf.save('cotizacion_lps.pdf');
            return pdf;
        } catch (err) {
            printArea.style.display = 'none';
            console.error('Error generando PDF (print-area):', err);
            alert('Ocurrió un error al generar el PDF. Intente nuevamente.');
        }
    }

    // Enviar el PDF (blob) a un endpoint serverless que haga el envío por correo
    // Devuelve true si el servidor respondió ok
    async function enviarPdfAlServidor(pdfBlob, destinoEmail) {
        if (!SERVERLESS_ENDPOINT) return false;

        try {
            const arrayBuffer = await pdfBlob.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

            const payload = {
                to: destinoEmail,
                filename: 'cotizacion_lps.pdf',
                content_base64: base64,
                subject: 'Tu cotización LPS',
                message: 'Adjunto encontrarás tu cotización generada desde la web.'
            };

            const res = await fetch(SERVERLESS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            return res.ok;
        } catch (err) {
            console.error('Error enviando PDF al servidor:', err);
            return false;
        }
    }

    // Intentar compartir/enviar por correo el PDF generado.
    // Primero generamos el PDF (html2canvas + jsPDF), luego intentamos usar Web Share API con archivos.
    // Si no está disponible, forzamos la descarga y abrimos mailto como fallback.
    async function enviarPorCorreo() {
        const correoDestino = document.getElementById('correo')?.value || '';
        if (!correoDestino) {
            alert('Ingrese un correo electrónico en el campo de usuario.');
            return;
        }

        // Generar el PDF y obtener el blob
        const pdf = await generarPDF();
        if (!pdf) return;

        try {
            const pdfBlob = pdf.output('blob');

            // 1) Intentar enviar al servidor serverless si está configurado (envío directo al correo destino)
            if (SERVERLESS_ENDPOINT) {
                const ok = await enviarPdfAlServidor(pdfBlob, correoDestino);
                if (ok) return { shared: true, sentByServer: true };
                // si falla, no abortar: continuar con siguientes fallbacks
            }

            // 2) Si el navegador soporta Web Share con archivos, usarlo (esto puede abrir el share sheet en Windows/otros)
            const file = new File([pdfBlob], 'cotizacion_lps.pdf', { type: 'application/pdf' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'Cotización LPS', text: 'Adjunto cotización.' });
                return { shared: true };
            }

            // 3) En escritorio o si Web Share no está disponible: forzar descarga y abrir mailto pre-direccionado al correo del usuario
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cotizacion_lps.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            const nombre = document.getElementById('nombre')?.value || '';
            const inversionTotal = document.getElementById('inversion-total')?.textContent || document.getElementById('inversion-total-retiro')?.textContent || '';
            const recuperacionTotal = document.getElementById('recuperacion-total')?.textContent || document.getElementById('recuperacion-total-retiro')?.textContent || '';

            const subject = encodeURIComponent('Cotización LPS');
            const bodyLines = [];
            bodyLines.push(`Hola ${nombre},`);
            bodyLines.push('Adjunto encontrarás la cotización generada (se descargó automáticamente; por favor adjunta el PDF al correo si deseas enviarlo).');
            bodyLines.push('');
            bodyLines.push(`Inversión Total: ${inversionTotal}`);
            bodyLines.push(`Recuperación Total: ${recuperacionTotal}`);

            const body = encodeURIComponent(bodyLines.join('\n'));
            // Pre-llenar el correo del usuario
            window.location.href = `mailto:${correoDestino}?subject=${subject}&body=${body}`;

            // No mostrar confirmación aquí (descarga) — el usuario solicitó no notificar en descarga
            return { shared: false };
        } catch (err) {
            console.error('Error preparando envío:', err);
            return { shared: false, error: true };
        }
    }

    // Vincular botones
    const btnPdf = document.getElementById('btn-descargar-pdf');
    const btnMail = document.getElementById('btn-enviar-correo');
    if (btnPdf) btnPdf.addEventListener('click', generarPDF);
    if (btnMail) {
        btnMail.addEventListener('click', async function () {
            // Primero generar y/o preparar el PDF y el envío por Web Share/descarga
            const result = await enviarPorCorreo();
            // Si el usuario compartió mediante Web Share, mostrar confirmación
            if (result && result.shared) {
                mostrarConfirmacionEnvio();
            }
            // Luego notificar al owner vía Formspree con los mismos datos (sin adjunto)
            enviarDatosAlOwner();
        });
    }

    // Mostrar confirmación visual al usuario cuando el correo fue enviado al propio usuario
    function mostrarConfirmacionEnvio() {
        const el = document.getElementById('send-confirmation');
        if (!el) return;
        el.innerHTML = `Tu cotización se ha enviado a tu correo exitosamente. Si no la ves, revisa la carpeta de SPAM.`;
        el.style.display = 'block';
        // ocultar después de 8 segundos
        setTimeout(() => { el.style.display = 'none'; }, 8000);
    }



    // Función para generar cálculos finales de RETIRO 30 a 55 - 25 años
    function calcularResultadosFinalesRetiro() {
        const inversionTotalSpan = document.getElementById("inversion-total-retiro");
        const recuperacionTotalSpan = document.getElementById("recuperacion-total-retiro");  

        const inversionTotal = inversiones.reduce((a, b) => a + b, 0);
        const recuperacionTotal = recuperacionTotalArr[recuperacionTotalArr.length - 1]; // Última fila

        // Mostrar los valores formateados
        inversionTotalSpan.textContent = formatoMoneda(inversionTotal);
        recuperacionTotalSpan.textContent = formatoMoneda(recuperacionTotal);

        // Mostrar la sección de cálculos finales
        calculosFinalesRetiro.style.display = "flex";
    }

    
    // Función para formatear los valores con comas y dos decimales
    function formatoMoneda(valor) {
        return "$" + new Intl.NumberFormat("es-MX", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }

    function formatoPesos(valor) {
        // Quitar cualquier caracter que no sea número
        const limpio = valor.replace(/[^\d]/g, "");
        const numero = parseFloat(limpio);
    
        if (isNaN(numero)) return "";
    
        return "$" + numero.toLocaleString("es-MX");
    }
    
    function limpiarFormato(valorFormateado) {
        if (!valorFormateado || typeof valorFormateado !== "string") {
            return "";
        }
        return valorFormateado.replace(/[$,]/g, "");
    }
     
    inputInversion.addEventListener("input", function () {
        const valorLimpio = limpiarFormato(this.value);
        this.value = formatoPesos(valorLimpio);
    });
    
    // No se guarda ninguna información personal del usuario en localStorage ni sessionStorage.

});
