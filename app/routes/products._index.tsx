import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import Modal from "~/components/Modal";
import { SITE_TITLE } from "~/root";
import { db, deleteProductById } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Products` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const products = await db.products.findMany({
      include: {
        brand: true,
        type: true,
        model: true,
      },
    });
    return json({ products });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const deleteProdId = formData.get("product_id") as string;
  try {
    await deleteProductById(parseInt(deleteProdId));
    return redirect("/products");
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default function ProductsIndex() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { products } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedProductID, setDeletedProductID] = useState(0);
  const [modelOpen, setModalOpen] = useState(false);
  console.log({ products });

  return (
    <div className="-mx-4">
      {products && products.length ? (
        <table className="table static">
          <thead>
            <tr className="hidden md:table-row">
              <th>ID</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Model</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((loopedProducts: any) => {
                return (
                  <tr
                    className="flex flex-col md:table-row"
                    key={loopedProducts.product_id}
                  >
                    <td data-label="ID" className={TD_CLASSNAME}>
                      {loopedProducts.product_id}
                    </td>
                    <td data-label="Brand" className={TD_CLASSNAME}>
                      {loopedProducts.brand.brand_name}
                    </td>
                    <td data-label="Type" className={TD_CLASSNAME}>
                      {loopedProducts.type.type_name}
                    </td>
                    <td data-label="Model" className={TD_CLASSNAME}>
                      {loopedProducts.model.model_name}
                    </td>
                    <td data-label="Price" className={TD_CLASSNAME}>
                      £{loopedProducts.price}
                    </td>
                    <td data-label="Actions" className={TD_CLASSNAME}>
                      <button
                        className="btn btn-neutral"
                        onClick={() => {
                          setDeletedProductID(loopedProducts.product_id);
                          setModalOpen(true);
                        }}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No products found...</p>
      )}
      <div className="flex justify-end mt-4">
        <a href="/products/create" className="btn btn-neutral">
          Add new product +
        </a>
      </div>
      <Modal open={modelOpen}>
        <p className="py-4">
          Are you sure you want to delete this product?
          <br />
          NOTE: this doesn't delete the associated brand, model and type
        </p>
        <div className="modal-action">
          <Form
            method="post"
            onSubmit={() => {
              setModalOpen(false);
            }}
          >
            <input type="hidden" name="product_id" value={deletedProductID} />
            <button
              className="btn btn-neutral"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </Form>
          <button
            className="btn btn-neutral"
            disabled={isSubmitting}
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
