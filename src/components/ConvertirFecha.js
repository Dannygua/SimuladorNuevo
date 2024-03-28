const convertirFecha = (fecha) => {
  const fechaMilisegundos = parseInt(fecha?.match(/\d+/)[0]);
  const fechaObjeto = new Date(fechaMilisegundos);
  const options = { timeZone: "America/Guayaquil" };
  const año = fechaObjeto.toLocaleString("en-US", {
    year: "numeric",
    ...options,
  });
  const mes = fechaObjeto.toLocaleString("en-US", {
    month: "2-digit",
    ...options,
  });
  const dia = fechaObjeto.toLocaleString("en-US", {
    day: "2-digit",
    ...options,
  });
  return `${año}-${mes}-${dia}`;
};
