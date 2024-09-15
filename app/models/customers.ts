import { db } from "../utils/db";

export const getCustomers = () => {
  return db.customers.findMany({
    orderBy: [{ name: "asc" }],
  });
};

export const getCustomerById = (customer_id: number) => {
  return db.customers.findUnique({
    where: {
      customer_id,
    },
    include: {
      quote: {
        include: {
          quoted_products: true,
        },
      },
      invoice: {
        include: {
          invoiced_products: true,
        },
      },
    },
  });
};

export const getCustomersBySearch = (search_term: string) => {
  const search_terms = search_term.split(" ").join(" & ");
  return db.customers.findMany({
    where: {
      OR: [
        { name: { contains: search_terms } },
        { tel: { contains: search_terms } },
        { email: { contains: search_terms } },
        { address: { contains: search_terms } },
        { name: { search: search_terms } },
        { tel: { search: search_terms } },
        { email: { search: search_terms } },
        { address: { search: search_terms } },
      ],
    },
    orderBy: {
      _relevance: {
        fields: ["name", "tel", "email", "address"],
        search: search_terms,
        sort: "asc",
      },
    },
  });
};

export const updateCustomer = async (data: any) => {
  const { customer_id, name, tel, email, address } = data;
  return db.customers.update({
    where: {
      customer_id: parseInt(`${customer_id}`),
    },
    data: {
      name: `${name}`,
      tel: `${tel}`,
      email: `${email}`,
      address: `${address}`,
    },
  });
};

export const createCustomer = (data: any) => {
  const { name, tel, email, address } = data;
  return db.customers.create({
    data: {
      name: `${name}`,
      tel: `${tel}`,
      email: `${email}`,
      address: `${address}`,
    },
  });
};

export const deleteCustomerById = (customer_id: number) => {
  return db.customers.delete({
    where: { customer_id },
  });
};
