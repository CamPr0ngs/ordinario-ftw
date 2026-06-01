// Función para cargar y filtrar los héroes desde el archivo XML
function cargarHeroesPorRol(rolFiltrado, idContenedor) {
    // 1. Crear el objeto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // 2. Configurar la petición para leer archivo XML
    xhr.open("GET", "heroes.xml", true);
    
    // 3. Controlar la respuesta
    xhr.onreadystatechange = function () {
        // Validamos que el estado sea 4 (completado) y 200 (OK)
        if (xhr.readyState === 4 && xhr.status === 200) {
            var xmlDoc = xhr.responseXML;
            // obtener todos los bloques <heroe> del XML
            var heroes = xmlDoc.getElementsByTagName("heroe");
            var contenedor = document.getElementById(idContenedor);
            
            // Limpiar el contenedor por si tiene texto viejo
            contenedor.innerHTML = "";
            
            // 4. Recorre los héroes uno por uno
            for (var i = 0; i < heroes.length; i++) {
                var rol = heroes[i].getElementsByTagName("rol")[0].textContent;
                
                // Si el rol coincide con la página o si elegimos "Todos"
                if (rolFiltrado === "Todos" || rol === rolFiltrado) {
                    
                    // Extraer la información de las etiquetas
                    var nombre = heroes[i].getElementsByTagName("nombre")[0].textContent;
                    var habilidad = heroes[i].getElementsByTagName("habilidad")[0].textContent;
                    var ultimate = heroes[i].getElementsByTagName("ultimate")[0].textContent;
                    var afiliacion = heroes[i].getElementsByTagName("afiliacion")[0].textContent;
                    var descripcion = heroes[i].getElementsByTagName("descripcion")[0].textContent;
                    var imagen = heroes[i].getElementsByTagName("imagen")[0].textContent;
                    
                    // 5. Crear la tarjeta en html con los datos del personaje
                    var tarjetaHtml = `
                        <div class="tarjeta-heroe">
                            <img src="${imagen}" alt="${nombre}">
                            <div class="info-tarjeta">
                                <span class="badge ${rol}">${rol}</span>
                                <h2>${nombre}</h2>
                                <p><strong>Habilidad:</strong> ${habilidad}</p>
                                <p><strong>Ultimate:</strong> ${ultimate}</p>
                                <p><strong>Afiliación:</strong> ${afiliacion}</p>
                                <p>${descripcion}</p>
                            </div>
                        </div>
                    `;
                    
                    // insertar la tarjeta en el contenedor de la página
                    contenedor.innerHTML += tarjetaHtml;
                }
            }
        }
    };
    
    // 4. Enviar la petición de AJAX
    xhr.send();
}