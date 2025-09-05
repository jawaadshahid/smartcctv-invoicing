import { StyleSheet } from "@react-pdf/renderer";

export const RPDFStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomStyle: "dotted",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    padding: 20,
  },
  rightText: {
    textAlign: "right",
  },
  logo: {
    width: 200,
  },
  customerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  customerField: {
    width: 200,
  },
  customerValue: {},
  table: {
    marginTop: 5,
    borderWidth: 1,
  },
  multipageTable: {
    marginTop: 20,
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tableCell: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1,
  },
  endRow: {
    flexDirection: "row",
  },
  endField: {
    padding: "5 10",
    width: "85%",
    textAlign: "right",
  },
  endValue: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  footer: {
    position: "absolute",
    fontSize: 10,
    lineHeight: 1,
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    borderTopStyle: "dotted",
    borderTopColor: "#000000",
    borderTopWidth: 1,
    textAlign: "center",
  },
});
