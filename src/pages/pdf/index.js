import React, { useRef, useCallback } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";

const Pdf = () => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });
  const componentRef = useRef(null);
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  const a = async () => {
    var element = document.getElementById("pdf");
    const a = await html2pdf().from(element).outputPdf();
    console.log(a);
  };

  return (
    <>
      <div id="pdf">
        <div>Uma</div>
      </div>
      <button onClick={a}>Click</button>
    </>
  );
};

export default Pdf;
