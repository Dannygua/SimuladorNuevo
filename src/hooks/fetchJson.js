export async function fetchJson(url, requestData, additionalOptions = {}) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...additionalOptions.headers, // Incluir encabezados personalizados si se proporcionan
      },
      body: JSON.stringify(requestData),
      ...additionalOptions, // Incluir otros parámetros de solicitud personalizados
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Error al enviar la solicitud");
    }

    const responseData = await response.json();
    console.log(responseData);

    // Validar la respuesta según el formato y los datos esperados
    // if (!responseData || (responseData.error && !responseData.data)) {
    //   throw new Error("Respuesta inválida de la API");
    // }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Relanzar el error para que pueda ser manejado externamente
  }
}
