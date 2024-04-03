import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import "../App.css";
import { useState } from "react";
import { fetchJson } from "../hooks/fetchJson";
import MinValue from "./MinValue";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableInversion from "./TableInversion";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const SimuladorInversion = () => {
  const [showResults, setShowResults] = useState(false);
  const [plazoRequired, setPlazoRequiered] = useState();
  const [termRequired, setTermRequiered] = useState();
  const [periodRequired, setPeriodRequiered] = useState();
  const [tipoPagoRequired, setTipoPagoRequiered] = useState();
  const [showMinValueMessage, setShowMinValueMessage] = useState();
  const [showMinTermMessage, setShowMinTermMessage] = useState();
  const [dataTable, setDataTable] = useState();

  const [formulario, setFormulario] = useState({
    PagoInteres: "0",
    Monto: "",
    Plazo: "",
    Periodicidad: "30",
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

  const generatePdf = (TablaPagos) => {
    if (!Array.isArray(TablaPagos) || TablaPagos.length === 0) {
      console.log("Cargando Tabla.....");
      return;
    }

    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1, // Numero de filas de encabezado
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"], // Ancho de las columnas
            body: [
              [
                "Numero",
                "Dias",
                "Fecha Inicial",
                "Fecha Final",
                "Valor a Recibir",
                "Irf",
                "Interes Acumulado",
              ],
              ...TablaPagos?.map((registro) => [
                registro?.Nro,
                registro?.Dias,
                convertirFecha(registro?.FechaInicial),
                convertirFecha(registro?.FechaFinal),
                `$${registro?.Valor?.toFixed(2)}`,
                `$${registro?.Irf?.toFixed(2)}`,
                `$${registro?.InteresAcumulado?.toFixed(2)}`,
              ]),
            ],
          },
        },
      ],
    };

    pdfMake.createPdf(docDefinition).download("TablaPagos.pdf");
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
    return `${año}-${mes}-${dia}`;
  };

  const handleChangeMount = (event) => {
    const { name, value } = event.target;

    handleChange(name, value);
    parseInt(value) < 31 || parseInt(value) > 32547
      ? setShowMinValueMessage(true)
      : setShowMinValueMessage(false);
    value.trim() === "" ? setPlazoRequiered(true) : setPlazoRequiered(false);
  };

  const handleChangeTerm = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
    parseInt(value) < 100 || parseInt(value) > 10000000
      ? setShowMinTermMessage(true)
      : setShowMinTermMessage(false);
    value.trim() === "" ? setTermRequiered(true) : setTermRequiered(false);
  };

  const handleChangePeriod = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
    value.trim() === "" ? setPeriodRequiered(true) : setPeriodRequiered(false);
  };

  const handleChangeTipoPago = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
    value.trim() === ""
      ? setTipoPagoRequiered(true)
      : setTipoPagoRequiered(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formulario);

    !plazoRequired &&
    !termRequired &&
    !showMinValueMessage &&
    !showMinTermMessage
      ? fetchData()
      : console.log("No Paso");
  };
  const fetchData = async () => {
    try {
      let periodicidadValue = formulario.Periodicidad || ""; // Valor por defecto, se mantiene si ya estaba seleccionado
      if (formulario.PagoInteres === "0") {
        // Si es Poliza al vencimiento, establecer Periodicidad en "30" (mensual)
        periodicidadValue = "30";
      }

      const requestData = {
        PagoInteres: formulario.PagoInteres,
        Monto: parseInt(formulario.Monto),
        Plazo: parseInt(formulario.Plazo),
        Periodicidad: parseInt(periodicidadValue),
      };

      const responseData = await fetchJson(
        "https://formulario1back.onrender.com/api/Info/SimularInversion",
        requestData
      );
      setDataTable(responseData?.SimularInversionResult);
      console.log(responseData);

      setShowResults(true);
      generatePdf(responseData?.SimularInversionResult?.TablaPagos);
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
            <h4 className="inForm">Simulador Inversión</h4>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant="outlined" style={{ minWidth: 120 }}>
              <InputLabel id="select-label">Tipo Pago</InputLabel>
              <Select
                name="PagoInteres"
                labelId="select-label"
                id="select"
                value={formulario.PagoInteres}
                onChange={handleChangeTipoPago}
                label="Tipo Pago"
              >
                <MenuItem value="0">Poliza al vencimiento</MenuItem>
                <MenuItem value="1">Poliza Periodica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="Plazo"
              label="Plazo (en dias)"
              variant="outlined"
              value={formulario.Plazo}
              error={plazoRequired}
              inputProps={{ maxLength: 5 }}
              onChange={handleChangeMount}
              helperText={plazoRequired && "Campo Requerido"}
            />
            {showMinValueMessage && (
              <MinValue
                Value={formulario.Plazo > 32547 ? "32547" : "31"}
                Item="Plazo"
                MaxoMin={formulario.Plazo > 32547 ? "maximo" : "minimo"}
                Simbol=""
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="Monto"
              label="Capital"
              variant="outlined"
              value={formulario.Monto}
              onChange={handleChangeTerm}
              error={termRequired}
              inputProps={{ maxLength: 8 }}
              helperText={termRequired && "Campo Requerido"}
            />
            {showMinTermMessage && (
              <MinValue
                Value={formulario.Monto > 10000000 ? "10.000.000,00" : "100,00"}
                Item="Capital"
                MaxoMin={formulario.Monto > 10000000 ? "maxima" : "minima"}
                Simbol="$"
              />
            )}
          </Grid>

          {formulario.PagoInteres === "1" && (
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Periodicidad
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="Periodicidad"
                  onChange={handleChangePeriod}
                >
                  <FormControlLabel
                    value="30"
                    control={<Radio />}
                    label="Mensual"
                  />
                  <FormControlLabel
                    value="60"
                    control={<Radio />}
                    label="Bimensual"
                  />
                  <FormControlLabel
                    value="90"
                    control={<Radio />}
                    label="Trimestral"
                  />
                  <FormControlLabel
                    value="180"
                    control={<Radio />}
                    label="Semestral"
                  />
                  <FormControlLabel
                    value="360"
                    control={<Radio />}
                    label="Anual"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}

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
                <TableInversion
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
