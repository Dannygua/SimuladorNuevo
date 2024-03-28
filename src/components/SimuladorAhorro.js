import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../App.css";
import { useState } from "react";
import { fetchJson } from "../hooks/fetchJson";
import TableAhorro from "./TableAhorro";

export const SimuladorAhorro = () => {
  const [dataTable, setDataTable] = useState();
  const [AhorroFechaConvertida, setAhorroFechaConvertida] = useState();
  const [formulario, setFormulario] = useState({
    amount: "",
    term: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log(formulario); // Aquí puedes hacer lo que quieras con los valores del formulario
    fetchData();
  };
  const fetchData = async () => {
    try {
      const requestData = {
        MontoMensual: parseInt(formulario.amount),
        Plazo: parseInt(formulario.term),
      };

      const responseData = await fetchJson(
        "https://formulario1back.onrender.com/api/Info/SimularAhorroProgramado",
        requestData
      );
      setDataTable(responseData?.SimularAhorroProgramadoResult);
      convertirFecha(
        responseData?.SimularAhorroProgramadoResult?.FechaExpiracion
      );
    } catch (error) {
      console.error(error);
      // Maneja el error de la manera que prefieras
    }
  };

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
    setAhorroFechaConvertida(`${año}-${mes}-${dia}`);
  };

  return (
    <>
      <h4 className="inForm">Simulacion Ahorro Programado</h4>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& > :not(style)": { m: 1, width: "30ch", display: "block" }, // Cambio a display: block
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          name="amount"
          label="Monto"
          variant="outlined"
          value={formulario.amount}
          onChange={handleChange}
        />
        <TextField
          name="term"
          label="Plazo (en meses)"
          variant="outlined"
          value={formulario.term}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained">
          Simular
        </Button>
      </Box>

      <h4 className="inForm">Resultado Simulacion</h4>
      <TableAhorro
        dataTable={dataTable}
        convertirFecha={convertirFecha}
        AhorroFechaConvertida={AhorroFechaConvertida}
      />
    </>
  );
};
