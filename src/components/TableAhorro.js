const TableAhorro = ({ dataTable, AhorroFechaConvertida }) => {
  return (
    <>
      <table class="inTabla">
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
    </>
  );
};

export default TableAhorro;
