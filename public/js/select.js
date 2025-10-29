document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. LÓGICA DEL SELECT PERSONALIZADO ---

  const wrapper = document.querySelector(".neumorphic-select-wrapper");
  const trigger = document.getElementById("select-trigger");
  const triggerText = document.getElementById("select-trigger-text");
  const optionsList = document.getElementById("select-options");
  const options = document.querySelectorAll(".neumorphic-select-option");
  
  // *** CAMBIO CLAVE: Buscamos el ID "tratammientos" ***
  const hiddenSelect = document.getElementById("tratammientos");

  // Abrir/Cerrar la lista de opciones
  trigger.addEventListener("click", () => {
    optionsList.classList.toggle("open");
    trigger.classList.toggle("active");
  });

  // Manejar el clic en una opción
  options.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      
      triggerText.textContent = option.textContent; 
      triggerText.classList.add("selected"); 
      
      hiddenSelect.value = value;
      hiddenSelect.dispatchEvent(new Event('change'));

      optionsList.classList.remove("open");
      trigger.classList.remove("active");
    });
  });

  // Cerrar el dropdown si se clica fuera de él
  window.addEventListener("click", (e) => {
    if (wrapper && !wrapper.contains(e.target)) {
      optionsList.classList.remove("open");
      trigger.classList.remove("active");
    }
  });


  // --- 2. LÓGICA DE LA TARJETA ---

  const card = document.getElementById("info-card");
  const cardTratamiento = document.getElementById("card-tratamiento");
  const cardPrecio = document.getElementById("card-precio");

  // Escuchamos el evento 'change' en el select oculto "tratammientos"
  hiddenSelect.addEventListener("change", (event) => {
    
    const selectedValue = event.target.value;
    // Buscamos la opción personalizada que coincida con el valor
    const selectedOption = document.querySelector(`.neumorphic-select-option[data-value="${selectedValue}"]`);
    
    if (selectedOption) {
      // Leemos los data-attributes de esa opción
      const tratamiento = selectedOption.dataset.tratamiento;
      const precio = selectedOption.dataset.precio;

      cardTratamiento.textContent = tratamiento;
      cardPrecio.textContent = precio;
      card.classList.add("visible");
    } else {
      card.classList.remove("visible");
    }
  });

});