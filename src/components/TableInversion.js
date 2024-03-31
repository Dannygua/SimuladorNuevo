import React from "react";

const TableInversion = ({ dataTable, Monto }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table class="inTabla" style={{ textAlign: "center" }}>
        <tr>
          <td>Tasa Nominal: {dataTable?.TasaNominal}%</td>
          <td>Tasa Efectiva: {dataTable?.TasaEfectiva}%</td>
        </tr>

        <tr>
          <td>Valor Interés: ${dataTable?.Interes}</td>
          <td>Porcentaje Impuesto: {dataTable?.PorcentajeImpuesto}%</td>
        </tr>

        <tr>
          <td>Valor Impuesto: ${dataTable?.Impuesto}</td>
          <td>Interés Neto: ${dataTable?.Neto}</td>
        </tr>

        <tr>
          <td>Valor a Debitar: ${parseInt(Monto)}</td>
          <td>Valor a recibir: ${parseInt(Monto) + dataTable?.Neto}</td>
        </tr>
      </table>
    </div>
  );
};

export default TableInversion;
