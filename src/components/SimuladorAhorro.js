import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../App.css";

export const SimuladorAhorro = () => {
  return (
    <>
      <h4 className="inForm">Simulacion Ahorro Programado</h4>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "30ch", display: "block" }, // Cambio a display: block
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="amount" label="Monto" variant="outlined" />
        <TextField id="term" label="Plazo (en meses)" variant="outlined" />
        <Button variant="contained">Simular</Button>
      </Box>

      <table class="inTabla">
        <tr>
          <td>Fecha expiración</td>
          <td>Tasa interés % </td>
        </tr>

        <tr>
          <td>Total Cuotas </td>
          <td>Interés </td>
        </tr>

        <tr>
          <td>Total</td>
          <td>$ </td>
        </tr>
      </table>

      <h4 className="inForm">Resultado Simulacion</h4>
    </>
  );
};
