function cargarHeroesPorRol(rolFiltrado, idContenedor, ataqueFiltrado = "Todos", tipoSubRolFiltrado = "Todos") {
    var xhr = new XMLHttpRequest();

    // Abre el archivo XML
    xhr.open("GET", "heroes.xml", true);

    // Revisa el estado de la petición
    xhr.onreadystatechange = function () {
        // Si todo sale bien (estado 4 y código HTTP 200)
        if (xhr.readyState === 4 && xhr.status === 200) {
            var xmlDoc = xhr.responseXML;
            var heroes = xmlDoc.getElementsByTagName("heroe");
            var contenedor = document.getElementById(idContenedor);

            var esPaginaDuelistas = (rolFiltrado === "Duelista");

            // empieza a armar la estructura de la tabla
            var tablaHtml = `
                <table class="tabla-heroes" summary="Héroes por rol.">
                    <thead>
                        <tr>
                            <th scope="col">Miniatura</th>
                            <th scope="col">Héroe</th>
                            <th scope="col">Rol</th>
                            ${esPaginaDuelistas ? '<th scope="col">Estilo Duelista</th>' : ''}                                
                            <th scope="col">Habilidad Principal</th>
                            <th scope="col">Ultimate</th>
                            <th scope="col">Afiliación</th>
                            <th scope="col">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            var hayDatos = false;

            // reocrre los héroes uno por uno
            for (var i = 0; i < heroes.length; i++) {
                var rol = heroes[i].getElementsByTagName("rol")[0].textContent;

                // Saca el tipo de personajes para filtrar
                var tipoDuelista = heroes[i].getElementsByTagName("tipoDuelista")[0].textContent;

                // LÓGICA DE FILTRADO
                var cumpleRol = (rolFiltrado === "Todos" || rol === rolFiltrado);

                var cumpleSubRol = true;
                if (esPaginaDuelistas) {
                    cumpleSubRol = (tipoSubRolFiltrado === "Todos" || tipoDuelista === tipoSubRolFiltrado);
                }

                // Si el personaje pasa los filtros, lo pone en la tabla
                if (cumpleRol && cumpleSubRol) {
                    hayDatos = true;
                    var nombre = heroes[i].getElementsByTagName("nombre")[0].textContent;
                    var habilidad = heroes[i].getElementsByTagName("habilidad")[0].textContent;
                    var ultimate = heroes[i].getElementsByTagName("ultimate")[0].textContent;
                    var afiliacion = heroes[i].getElementsByTagName("afiliacion")[0].textContent;
                    var descripcion = heroes[i].getElementsByTagName("descripcion")[0].textContent;
                    var imagen = heroes[i].getElementsByTagName("imagen")[0].textContent;

                    tablaHtml += `
                        <tr class="fila-heroe ${rol}" onclick="mostrarTarjetaGrande('${nombre}', '${imagen}', '${rol}', '${tipoDuelista}', '${habilidad}', '${ultimate}', '${afiliacion}', \`${descripcion.replace(/'/g, "\\'")}\`)" style="cursor: pointer;">
                            <td data-label="Miniatura">
                                <img src="${imagen}" alt="Retrato de ${nombre}" class="img-tabla">
                            </td>
                            <td data-label="Héroe"><strong>${nombre}</strong></td>
                            <td data-label="Rol"><span class="badge ${rol}">${rol}</span></td>
                            ${esPaginaDuelistas ? `<td data-label="Estilo"><span class="badge-estilo ${tipoDuelista}">${tipoDuelista}</span></td>` : ''}                           
                            <td data-label="Habilidad">${habilidad}</td>
                            <td data-label="Ultimate">${ultimate}</td>
                            <td data-label="Afiliación">${afiliacion}</td>
                            <td data-label="Descripción"><article>${descripcion}</article></td>
                        </tr>
                    `;
                }
            }

            tablaHtml += `</tbody></table>`;

            // mete la tabla completa en el contenedor
            contenedor.innerHTML = hayDatos ? tablaHtml : "<p class='no-datos'>No se encontraron héroes con estos filtros.</p>";
        }
    };
    // Envia la petición AJAX
    xhr.send();
}

// FUNCIÓN PARA MOSTRAR TARJETA GIGANTE
function mostrarTarjetaGrande(nombre, imagen, rol, subrol, habilidad, ultimate, afiliacion, descripcion) {
    // Si ya existe un modal abierto, lo quita para no duplicar
    var modalViejo = document.getElementById("modal-heroe");
    if (modalViejo) modalViejo.remove();

    // crea la estructura del contenedor flotante
    var modal = document.createElement("div");
    modal.id = "modal-heroe";
    modal.className = "modal-overlay";
    modal.onclick = cerrarTarjetaGrande; // Si dan clic afuera, se cierra

    // Aquí pone la tarjeta en grande
    modal.innerHTML = `
        <div class="tarjeta-grande-content ${rol}" onclick="event.stopPropagation()">
            <button class="btn-cerrar" onclick="cerrarTarjetaGrande()">×</button>
            
            <div class="tarjeta-grande-grid">
                <div class="col-render">
                    <img src="${imagen}" alt="${nombre}" class="render-grande">
                </div>
                <div class="col-info">
                    <h2>${nombre}</h2>
                    <div class="badges-container">
                        <span class="badge ${rol}">${rol}</span>
                        ${subrol !== 'N/A' ? `<span class="badge-subrol">${subrol}</span>` : ''}
                    </div>
                    <hr class="separador">
                    <p class="desc-grande">${descripcion}</p>
                    <ul class="datos-tacticos">
                        <li><strong>Habilidad Principal:</strong> ${habilidad}</li>
                        <li><strong>Ultimate:</strong> ${ultimate}</li>
                        <li><strong>Afiliación:</strong> ${afiliacion}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// cerrar tarjeta grande
function cerrarTarjetaGrande() {
    var modal = document.getElementById("modal-heroe");
    if (modal) {
        modal.remove();
    }
}