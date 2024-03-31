import { Box } from "@mui/material";

const TableAhorro = ({ dataTable, AhorroFechaConvertida }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Box>
        <table class="inTabla" style={{ textAlign: "center" }}>
          <tr>
            <td>Fecha expiración {AhorroFechaConvertida}</td>
            <td>Tasa interés {dataTable?.TasaInteres} % </td>
          </tr>

          <tr>
            <td>Total Cuotas {dataTable?.TotalCuotas}</td>
            <td>Interés {dataTable?.Interes}</td>
          </tr>

          <tr>
            <td>Total </td>
            <td>$ {dataTable?.Total}</td>
          </tr>
        </table>
      </Box>
    </div>
  );
};

export default TableAhorro;
