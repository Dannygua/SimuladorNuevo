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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import IncoopLogo from "../img/incoop";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const SimuladorCredito = () => {
  const [showResults, setShowResults] = useState(false);
  const [mountRequired, setMountRequiered] = useState();
  const [anualRequired, setAnualRequiered] = useState();
  const [showMinValueMessage, setShowMinValueMessage] = useState();
  const [showMinMountMessage, setShowMinMountMessage] = useState();
  const [fechaExpiracionConvertida, setFechaExpiracionConvertida] = useState();
  const [fechaInicioConvertida, setFechaInicioConvertida] = useState();
  const [dataTable, setDataTable] = useState();

  let suma = null;

  const [formulario, setFormulario] = useState({
    TipoCredito: "02",
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

  const calcularSuma = (tablaAmortizacion) => {
    if (tablaAmortizacion) {
      suma = tablaAmortizacion.reduce(
        (accumulator, registro) => {
          accumulator.CapitalProyectado += registro.CapitalProyectado;
          accumulator.InteresProyectado += registro.InteresProyectado;
          accumulator.SeguroProyectado += registro.SeguroProyectado;
          accumulator.Valor += registro.Valor;
          return accumulator;
        },
        {
          CapitalProyectado: 0,
          InteresProyectado: 0,
          SeguroProyectado: 0,
          Valor: 0,
        }
      );
      // Redondear los valores a 2 cifras decimales
      suma.CapitalProyectado = suma.CapitalProyectado;
      suma.InteresProyectado = suma.InteresProyectado;
      suma.SeguroProyectado = suma.SeguroProyectado;
      suma.Valor = suma.Valor;
    }
  };

  const generatePdf = (TablaAmortizacion) => {
    if (!Array.isArray(TablaAmortizacion) || TablaAmortizacion.length === 0) {
      console.log("Cargando Tabla.....");
      return;
    } else {
      console.log("Tabla Cargada");
    }

    calcularSuma(TablaAmortizacion);

    const docDefinition = {
      content: [
        {
          image: IncoopLogo,
          style: "ImageIncoop",
          width: 200,
          height: 100,
        },
        {
          text: "Simulador de Credito",
          style: "Title",
        },
        {
          table: {
            headerRows: 1,
            widths: [50, 100, 80, 50, 50, 80, 50],
            body: [
              [
                { text: "Cuota", style: "tableHeader" },
                { text: "Fecha Vencimiento", style: "tableHeader" },
                { text: "Saldo Capital", style: "tableHeader" },
                { text: "Capital", style: "tableHeader" },
                { text: "Interes", style: "tableHeader" },
                { text: "Desgravamen", style: "tableHeader" },
                { text: "Valor", style: "tableHeader" },
              ],
              ...TablaAmortizacion.map((registro) => [
                {
                  text: registro.NumeroCuota,
                  style: "tableCell",
                },
                {
                  text: convertirFecha(registro.FechaVencimiento),
                  style: "tableCell",
                },
                {
                  text: `$${registro.SaldoCapital.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${registro?.CapitalProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${registro.InteresProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${registro.SeguroProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${registro.Valor.toFixed(2)}`,
                  style: "tableCell",
                },
              ]),
              // Fila de suma
              [
                {
                  text: `Cuotas ${TablaAmortizacion.length}`,
                  style: "tableCell",
                },
                { colSpan: 2, text: "", style: "tableCell" },
                { text: "", style: "tableCell" },
                {
                  text: `$${suma?.CapitalProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${suma?.InteresProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                {
                  text: `$${suma?.SeguroProyectado.toFixed(2)}`,
                  style: "tableCell",
                },
                { text: `$${suma?.Valor.toFixed(2)}`, style: "tableCell" },
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

    pdfMake.createPdf(docDefinition).download("Tabla_Simulacion_Credito.pdf");
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

  const handleChangeNotNumbre = (name, value) => {
    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeAnual = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);

    handleChange(name, value);
    parseInt(value) > 100000
      ? setShowMinValueMessage(true)
      : setShowMinValueMessage(false);
    value.trim() === "" ? setAnualRequiered(true) : setAnualRequiered(false);
  };

  const handleChangeTipoCredito = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
  };

  const handleChangePlazo = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
  };

  const handleChangeDiaPago = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
  };

  const handleChangeTipoTabla = (event) => {
    let { name, value } = event.target;
    handleChangeNotNumbre(name, value);
  };

  const handleChangeMount = (event) => {
    let { name, value } = event.target;
    value = handleChange(name, value);
    parseInt(value) < 500 || parseInt(value) > 50000
      ? setShowMinMountMessage(true)
      : setShowMinMountMessage(false);
    value.trim() === "" ? setMountRequiered(true) : setMountRequiered(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    !mountRequired &&
    !anualRequired &&
    !showMinValueMessage &&
    !showMinMountMessage
      ? fetchData()
      : console.log("Todos los datos son Requeridos");

    console.log(formulario);
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
      setShowResults(true);
      generatePdf(responseData?.SimularCreditoResult?.TablaAmortizacion);
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
            <h4 className="inForm">Simulador Credito</h4>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Tipo de crédito
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="TipoCredito"
                value={formulario.TipoCredito}
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
            <Grid item xs={12} sm={12} md={12}>
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

          <Grid item xs={12} sm={12} md={12}>
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
          <Grid item xs={2} sm={3} md={4} lg={4} xl={5}></Grid>
          <Grid item xs={8} sm={6} md={4} lg={4} xl={2}>
            <InputLabel id="select-label">Plazo (en meses)</InputLabel>
            <Slider
              name="Plazo"
              value={formulario?.Plazo}
              onChange={handleChangePlazo}
              valueLabelDisplay="auto"
              marks={marks}
              min={6} // Establecer el valor mínimo a 6
              max={60}
            />
          </Grid>
          <Grid item xs={2} sm={3} md={4} lg={4} xl={5}></Grid>
          <Grid item xs={12} sm={12} md={12}>
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
          <Grid item xs={12} sm={12} md={12}>
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
                <TableCredito
                  dataTable={dataTable}
                  fechaExpiracionConvertida={fechaExpiracionConvertida}
                  fechaInicioConvertida={fechaInicioConvertida}
                  Monto={formulario.Monto}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <h4 className="inForm">Rubros de desembolso</h4>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
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
