import React from "react";

const TableDesembolso = ({ dataTable, Monto }) => {
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
      <div>
        <table className="inTabla">
          {dataTable.RubrosDesembolso &&
            dataTable.RubrosDesembolso.map((registro, index) => (
              <tbody>
                <tr key={index}>
                  <td>{registro.Descripcion}</td>
                  <td>
                    Tipo Rubro: {registro.TipoRubro}({" "}
                    {registro.Porcentaje.toFixed(1)} %)
                    <br />
                    Valor: ${registro.Valor.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            ))}
          <tbody>
            <tr>
              <td>Valor desembolso</td>
              <td>${valorDesembolso.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Rubros adicionales (Certificado Aportación)</td>
              <td>${(10).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${(valorDesembolso - 10).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDesembolso;
