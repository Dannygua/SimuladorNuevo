const TableCredito = ({
  dataTable,
  Monto,
  fechaInicioConvertida,
  fechaExpiracionConvertida,
}) => {
  const valorDesembolso =
    Monto -
    (dataTable?.RubrosDesembolso
      ? dataTable?.RubrosDesembolso.reduce(
          (total, registro) => total + registro.Valor,
          0
        )
      : 0);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table class="inTabla">
        <tr>
          <td>Valor Crédito ${dataTable?.ValorCredito?.toFixed(2)}</td>
          <td>Interés Nominal: {dataTable?.TasaInteres?.toFixed(1)}%</td>
        </tr>

        <tr>
          <td>Interés Efectiva {dataTable?.TasaEfectiva?.toFixed(2)}%</td>
          <td>Tasa Seguro Desgravamen {dataTable?.TasaSede?.toFixed(1)}%</td>
        </tr>

        <tr>
          <td>Valor Interés ${dataTable?.ValorIntereses?.toFixed(2)}</td>
          <td>
            Total Carga Financiera ${dataTable?.CargaFinanciera?.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td>
            Valor Primera Cuota ${dataTable?.ValorPrimeraCuota?.toFixed(2)}
          </td>
          <td>Suma Total Cuotas ${dataTable?.ValorTotalCuotas?.toFixed(2)}</td>
        </tr>

        <tr>
          <td>Fecha de Inicio {fechaInicioConvertida}</td>
          <td>Fecha de Vencimiento {fechaExpiracionConvertida}</td>
        </tr>
      </table>
    </div>
  );
};

export default TableCredito;
