import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
} from "@mui/material";
import "../App.css";
import { useState } from "react";
import { fetchJson } from "../hooks/fetchJson";
import MinValue from "./MinValue";

import TableCredito from "./TableCredito";
import TableDesembolso from "./TableDesembolso";

export const SimuladorCredito = () => {
  const [showResults, setShowResults] = useState(false);
  const [mountRequired, setMountRequiered] = useState();
  const [anualRequired, setAnualRequiered] = useState();
  const [showMinValueMessage, setShowMinValueMessage] = useState();
  const [showMinMountMessage, setShowMinMountMessage] = useState();
  const [fechaExpiracionConvertida, setFechaExpiracionConvertida] = useState();
  const [fechaInicioConvertida, setFechaInicioConvertida] = useState();
  const [dataTable, setDataTable] = useState();

  const [formulario, setFormulario] = useState({
    TipoCredito: "",
    Monto: "",
    Plazo: 6,
    TipoPlazo: "M",
    IdMoneda: 1,
    TipoTabla: "F",
    VentasAnuales: "",
    DiaPago: "1",
  });

  const marks = [
    {
      value: 6,
      label: "6",
    },
    {
      value: 60,
      label: "60",
    },
  ];

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

  const handleChangeAnual = (event) => {
    const { name, value } = event.target;

    handleChange(name, value);
    parseInt(value) > 100000
      ? setShowMinValueMessage(true)
      : setShowMinValueMessage(false);
    value.trim() === "" ? setAnualRequiered(true) : setAnualRequiered(false);
  };

  const handleChangeTipoCredito = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const handleChangePlazo = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const handleChangeDiaPago = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const handleChangeTipoTabla = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const handleChangeMount = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
    parseInt(value) < 500 || parseInt(value) > 50000
      ? setShowMinMountMessage(true)
      : setShowMinMountMessage(false);
    value.trim() === "" ? setMountRequiered(true) : setMountRequiered(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formulario);

    !mountRequired &&
    !anualRequired &&
    !showMinValueMessage &&
    !showMinMountMessage
      ? fetchData()
      : console.log("No Paso");
  };
  const fetchData = async () => {
    try {
      const requestData = {
        TipoCredito: formulario.TipoCredito,
        Monto: parseInt(formulario.Monto),
        Plazo: parseInt(formulario.Plazo),
        TipoPlazo: "M",
        IdMoneda: 1,
        TipoTabla: formulario.TipoTabla,
        VentasAnuales: parseInt(formulario.VentasAnuales),
        DiaPago: parseInt(formulario.DiaPago),
      };

      const responseData = await fetchJson(
        "https://formulario1back.onrender.com/api/Info/SimularCredito",
        requestData
      );
      setDataTable(responseData?.SimularCreditoResult);
      setFechaExpiracionConvertida(
        convertirFecha(responseData?.SimularCreditoResult?.FechaVencimiento)
      );
      setFechaInicioConvertida(
        convertirFecha(responseData?.SimularCreditoResult?.FechaInicio)
      );
      console.log(responseData);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      // Maneja el error de la manera que prefieras
    }
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
            <h4 className="inForm">Simulador Credito</h4>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Tipo de crédito
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="TipoCredito"
                onChange={handleChangeTipoCredito}
              >
                <FormControlLabel
                  value="02"
                  control={<Radio />}
                  label="Credito de consumo"
                />
                <FormControlLabel
                  value="04"
                  control={<Radio />}
                  label="Microcredito"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {formulario.TipoCredito === "04" && (
            <Grid item xs={12}>
              <TextField
                name="VentasAnuales"
                label="Ventas Anuales"
                variant="outlined"
                value={formulario.VentasAnuales}
                onChange={handleChangeAnual}
                error={anualRequired}
                inputProps={{ maxLength: 6 }}
                helperText={anualRequired && "Campo Requerido"}
              />
              {showMinValueMessage && (
                <MinValue
                  Value={"100.000,00"}
                  Item="Ventas Anuales"
                  MaxoMin={"maximas"}
                  Simbol="$"
                />
              )}
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              name="Monto"
              label="Monto"
              variant="outlined"
              value={formulario.Monto}
              onChange={handleChangeMount}
              error={mountRequired}
              inputProps={{ maxLength: 5 }}
              helperText={mountRequired && "Campo Requerido"}
            />
            {showMinMountMessage && (
              <MinValue
                Value={formulario.Monto > 50000 ? "50.000,00" : "500,00"}
                Item="Monto"
                MaxoMin={formulario.Monto > 50000 ? "maximo" : "minimo"}
                Simbol="$"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="select-label">Plazo (en meses)</InputLabel>
            <Slider
              name="Plazo"
              value={formulario?.Plazo}
              onChange={handleChangePlazo}
              valueLabelDisplay="auto"
              sx={{ width: 350 }}
              marks={marks}
              min={6} // Establecer el valor mínimo a 6
              max={60}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" style={{ minWidth: 120 }}>
              <InputLabel id="select-label">Dia de Pago</InputLabel>
              <Select
                name="DiaPago"
                labelId="select-label"
                id="select"
                value={formulario.DiaPago}
                onChange={handleChangeDiaPago}
                label="Dia de Pago"
              >
                {Array.from({ length: 31 }, (_, index) => (
                  <MenuItem key={index + 1} value={(index + 1).toString()}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" style={{ minWidth: 120 }}>
              <InputLabel id="select-label">Tipo Tabla</InputLabel>
              <Select
                name="TipoTabla"
                labelId="select-label"
                id="select"
                value={formulario.TipoTabla}
                onChange={handleChangeTipoTabla}
                label="Tipo Tabla"
              >
                <MenuItem value="F">Cuota Fija</MenuItem>
                <MenuItem value="CF">Capital Fijo</MenuItem>
              </Select>
            </FormControl>
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
                <TableCredito
                  dataTable={dataTable}
                  fechaExpiracionConvertida={fechaExpiracionConvertida}
                  fechaInicioConvertida={fechaInicioConvertida}
                  Monto={formulario.Monto}
                />
              </Grid>
              <Grid item xs={12}>
                <h4 className="inForm">Rubros de desembolso</h4>
              </Grid>
              <Grid item xs={12}>
                <TableDesembolso
                  dataTable={dataTable}
                  Monto={formulario.Monto}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
};
