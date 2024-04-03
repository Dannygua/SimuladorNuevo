import TextField from "@mui/material/TextField";
import { Box, Button, Grid } from "@mui/material";
import "../App.css";
import { useState } from "react";
import { fetchJson } from "../hooks/fetchJson";
import TableAhorro from "./TableAhorro";
import MinValue from "./MinValue";

export const SimuladorAhorro = () => {
  const [showResults, setShowResults] = useState(false);
  const [mountRequired, setMountRequiered] = useState();
  const [termRequired, setTermRequiered] = useState();
  const [showMinValueMessage, setShowMinValueMessage] = useState();
  const [showMinTermMessage, setShowMinTermMessage] = useState();
  const [dataTable, setDataTable] = useState();
  const [AhorroFechaConvertida, setAhorroFechaConvertida] = useState();
  const [formulario, setFormulario] = useState({
    amount: "",
    term: "",
  });

  const handleChange = (name, value) => {
    if (/^\d*$/.test(value)) {
      setFormulario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      value = "";
    }
  };

  const handleChangeMount = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);

    parseInt(value) < 50 || parseInt(value) > 5000
      ? setShowMinValueMessage(true)
      : setShowMinValueMessage(false);
    value.trim() === "" ? setMountRequiered(true) : setMountRequiered(false);
    console.log(value);
  };

  const handleChangeTerm = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
    parseInt(value) < 6 || parseInt(value) > 60
      ? setShowMinTermMessage(true)
      : setShowMinTermMessage(false);
    value.trim() === "" ? setTermRequiered(true) : setTermRequiered(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    !mountRequired &&
    !termRequired &&
    !showMinValueMessage &&
    !showMinTermMessage
      ? fetchData()
      : console.log("Todos los datos son Requeridos");
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
      setShowResults(true);
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
    <div>
      <Box
        component="form"
        onSubmit={(event) => handleSubmit(event, formulario)}
        noValidate
        autoComplete="off"
        style={{ textAlign: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h4 className="inForm">Simulador Ahorro Programado</h4>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="amount"
              label="Monto"
              variant="outlined"
              value={formulario.amount}
              error={mountRequired}
              inputProps={{ maxLength: 4 }}
              onChange={handleChangeMount}
              helperText={mountRequired && "Campo Requerido"}
            />
            {showMinValueMessage && (
              <MinValue
                Value={formulario.amount > 5000 ? "5000,00" : "50,00"}
                Item="Monto"
                MaxoMin={formulario.amount > 5000 ? "maximo" : "minimo"}
                Simbol="$"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="term"
              label="Plazo (en meses)"
              variant="outlined"
              value={formulario.term}
              onChange={handleChangeTerm}
              error={termRequired}
              inputProps={{ maxLength: 2 }}
              helperText={termRequired && "Campo Requerido"}
            />
            {showMinTermMessage && (
              <MinValue
                Value={formulario.term > 60 ? "60" : "6"}
                Item="Plazo"
                MaxoMin={formulario.term > 60 ? "maximo" : "minimo"}
                Simbol="$"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              style={{ color: "white" }}
            >
              Simular
            </Button>
          </Grid>

          {showResults && (
            <>
              <Grid item xs={12}>
                <h4 className="inForm">Resultados Simulación</h4>
              </Grid>
              <Grid item xs={12}>
                <TableAhorro
                  dataTable={dataTable}
                  convertirFecha={convertirFecha}
                  AhorroFechaConvertida={AhorroFechaConvertida}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
};
