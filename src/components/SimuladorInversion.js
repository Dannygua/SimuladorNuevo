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
import IncoopLogo from "../img/incoop";
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

  let suma = null;

  const [formulario, setFormulario] = useState({
    PagoInteres: "0",
    Monto: "",
    Plazo: "",
    Periodicidad: "30",
  });

  const calcularSuma = (TablaPagos) => {
    if (TablaPagos) {
      suma = TablaPagos.reduce(
        (accumulator, registro) => {
          accumulator.Dias += registro.Dias;
          accumulator.Valor += registro.Valor;
          accumulator.Irf += registro.Irf;
          accumulator.InteresAcumulado += registro.InteresAcumulado;
          return accumulator;
        },
        {
          Dias: 0,
          Valor: 0,
          Irf: 0,
          InteresAcumulado: 0,
        }
      );
      // Redondear los valores a 2 cifras decimales
      suma.Dias = suma.Dias;
      suma.Valor = suma.Valor;
      suma.Irf = suma.Irf;
      suma.InteresAcumulado = suma.InteresAcumulado;
    }
  };

  const generatePdf = (TablaPagos) => {
    if (!Array.isArray(TablaPagos) || TablaPagos.length === 0) {
      console.log("Cargando Tabla.....");
      return;
    }
    calcularSuma(TablaPagos);

    const docDefinition = {
      content: [
        {
          image: IncoopLogo,
          style: "ImageIncoop",
          width: 200,
          height: 100,
        },
        {
          text: "Simulador de Inversión",
          style: "Title",
        },
        {
          table: {
            headerRows: 1, // Numero de filas de encabezado
            widths: [60, 40, 80, 80, 90, 40, 80], // Ancho de las columnas
            body: [
              [
                { text: "Numero", style: "tableHeader" },
                { text: "Dias", style: "tableHeader" },
                { text: "Fecha Inicial", style: "tableHeader" },
                { text: "Fecha Final", style: "tableHeader" },
                { text: "Valor a Recibir", style: "tableHeader" },
                { text: "Irf", style: "tableHeader" },
                { text: "Interes Acumulado", style: "tableHeader" },
              ],
              ...TablaPagos?.map((registro) => [
                {
                  text: registro?.Nro,
                  style: "tableCell",
                },
                {
                  text: registro?.Dias,
                  style: "tableCell",
                },
                {
                  text: convertirFecha(registro?.FechaInicial),
                  style: "tableCell",
                },
                {
                  text: convertirFecha(registro?.FechaFinal),
                  style: "tableCell",
                },
                { text: `$${registro?.Valor?.toFixed(2)}`, style: "tableCell" },
                { text: `$${registro?.Irf?.toFixed(2)}`, style: "tableCell" },
                {
                  text: `$${registro?.InteresAcumulado?.toFixed(2)}`,
                  style: "tableCell",
                },
              ]),
              // Fila de suma
              [
                { text: `Totales`, style: "tableCell" },
                { text: `${suma?.Dias}`, style: "tableCell" },
                { colSpan: 2, text: "", style: "tableCell" },
                "",
                { text: `$${suma?.Valor.toFixed(2)}`, style: "tableCell" },
                { text: `$${suma?.Irf.toFixed(2)}`, style: "tableCell" },
                {
                  text: `$${suma?.InteresAcumulado.toFixed(2)}`,
                  style: "tableCell",
                },
              ],
            ],
          },
        },
      ],

      styles: {
        tableHeader: {
          fillColor: "#F79530",
          color: "#ffffff",
          margin: [0, 4, 0, 4],
          fontSize: 10,
          alignment: "center",
          bolditalics: true,
        },
        tableCell: {
          fillColor: "#ffffff",
          fontSize: 10,
          color: "#000000",
          alignment: "center",
        },
        Title: {
          color: "#F79530",
          margin: [0, 0, 0, 25],
          fontSize: 17,
        },
        ImageIncoop: {
          margin: [0, 0, 0, 10],
          alignment: "right",
        },
      },
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

  const handleChange = (name, value) => {
    if (/^\d*$/.test(value)) {
      setFormulario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      value = "";
    }
    return value;
  };

  const handleChangeMount = (event) => {
    let { name, value } = event.target;

    value = handleChange(name, value);
    parseInt(value) < 31 || parseInt(value) > 32547
      ? setShowMinValueMessage(true)
      : setShowMinValueMessage(false);
    value.trim() === "" ? setPlazoRequiered(true) : setPlazoRequiered(false);
  };

  const handleChangeTerm = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
    parseInt(value) < 100 || parseInt(value) > 10000000
      ? setShowMinTermMessage(true)
      : setShowMinTermMessage(false);
    value.trim() === "" ? setTermRequiered(true) : setTermRequiered(false);
  };

  const handleChangePeriod = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
    value.trim() === "" ? setPeriodRequiered(true) : setPeriodRequiered(false);
  };

  const handleChangeTipoPago = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
    value.trim() === ""
      ? setTipoPagoRequiered(true)
      : setTipoPagoRequiered(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    !plazoRequired &&
    !termRequired &&
    !showMinValueMessage &&
    !showMinTermMessage
      ? fetchData()
      : console.log("Todos los valores son requeridos");
    console.log(formulario);
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
          <Grid item xs={12} sm={12} md={12}>
            <h4 className="inForm">Simulador Inversión</h4>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
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
          <Grid item xs={12} sm={12} md={12}>
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

          <Grid item xs={12} sm={12} md={12}>
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
            <Grid item xs={12} sm={12} md={12} alignItems="center">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Periodicidad
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="Periodicidad"
                  value={formulario.Periodicidad}
                  onChange={handleChangePeriod}
                >
                  <FormControlLabel
                    xs={12}
                    sm={12}
                    md={12}
                    value="30"
                    control={<Radio />}
                    label="Mensual"
                  />
                  <FormControlLabel
                    xs={12}
                    sm={12}
                    md={12}
                    value="60"
                    control={<Radio />}
                    label="Bimensual"
                  />
                  <FormControlLabel
                    xs={12}
                    sm={12}
                    md={12}
                    value="90"
                    control={<Radio />}
                    label="Trimestral"
                  />
                  <FormControlLabel
                    xs={4}
                    sm={4}
                    md={12}
                    value="180"
                    control={<Radio />}
                    label="Semestral"
                  />
                  <FormControlLabel
                    xs={4}
                    sm={4}
                    md={12}
                    value="360"
                    control={<Radio />}
                    label="Anual"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={12}>
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
              <Grid item xs={12} sm={12} md={12}>
                <h4 className="inForm">Resultados Simulación</h4>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
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
