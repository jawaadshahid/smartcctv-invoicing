import { Text, View } from "@react-pdf/renderer";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFCustomerProfileProps } from "./types";

export const RPDFCustomerProfile = ({ customer }: RPDFCustomerProfileProps) => {
  const { name, address, tel, email } = customer;
  return (
    <>
      <View style={RPDFStyles.customerRow}>
        <Text style={RPDFStyles.customerField}>Name:</Text>
        <Text style={RPDFStyles.customerValue}>{name}</Text>
      </View>
      {address ? (
        <View style={RPDFStyles.customerRow}>
          <Text style={RPDFStyles.customerField}>Address:</Text>
          <Text style={RPDFStyles.customerValue}>{address}</Text>
        </View>
      ) : null}
      {tel ? (
        <View style={RPDFStyles.customerRow}>
          <Text style={RPDFStyles.customerField}>Tel:</Text>
          <Text style={RPDFStyles.customerValue}>{tel}</Text>
        </View>
      ) : null}
      {email ? (
        <View style={RPDFStyles.customerRow}>
          <Text style={RPDFStyles.customerField}>Email:</Text>
          <Text style={RPDFStyles.customerValue}>{email}</Text>
        </View>
      ) : null}
    </>
  );
};
