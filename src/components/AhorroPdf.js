import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos para la tabla
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  headerCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
});

// Componente de tabla
const MyDocument = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { backgroundColor: "#c0c0c0" }]}>
                <Text style={styles.headerCell}>Columna 1</Text>
              </View>
              <View style={[styles.tableCol, { backgroundColor: "#c0c0c0" }]}>
                <Text style={styles.headerCell}>Columna 2</Text>
              </View>
              <View style={[styles.tableCol, { backgroundColor: "#c0c0c0" }]}>
                <Text style={styles.headerCell}>Columna 3</Text>
              </View>
              <View style={[styles.tableCol, { backgroundColor: "#c0c0c0" }]}>
                <Text style={styles.headerCell}>Columna 4</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Celda 1</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Celda 2</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Celda 3</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Celda 4</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
