import type {
  product_brands,
  product_models,
  product_types,
  products,
} from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import CreateProductForm from "~/components/CreateProductForm";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import { SITE_TITLE } from "~/root";
import { createProduct, db, deleteProductById } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { contentBodyClass, resTDClass, resTRClass } from "~/utils/styleClasses";
import { validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Products` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const [brands, types, models, products]: [
      brands: product_brands[],
      types: product_types[],
      models: product_models[],
      products: products[]
    ] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
      db.products.findMany({
        include: {
          brand: true,
          type: true,
          model: true,
        },
      }),
    ]);
    return json({ brands, types, models, products });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      const { product_id } = values;
      const deleteActionsErrors: any = {};
      try {
        await deleteProductById(parseInt(`${product_id}`));
        return { productDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting product with id: ${product_id}`;
        return { deleteActionsErrors };
      }
    case "create":
      const { brand, newbrand, type, newtype, model, newmodel, price } = values;
      const createActionErrors: any = validateProductData(values);

      if (Object.values(createActionErrors).some(Boolean))
        return { createActionErrors };

      try {
        await createProduct(
          `${brand}`,
          `${newbrand}`,
          `${type}`,
          `${newtype}`,
          `${model}`,
          `${newmodel}`,
          `${price}`
        );
        return { productCreated: true };
      } catch (err) {
        console.log(err);
        createActionErrors.info = "There was a problem creating the product...";
        return { createActionErrors };
      }
  }
}

export default function Products() {
  const {
    products,
    brands,
    types,
    models,
  }: {
    products: products[];
    brands: product_brands[];
    types: product_types[];
    models: product_models[];
  } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedProductID, setDeletedProductID] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.productCreated) setCreateModalOpen(false);
    if (data.productDeleted) setDeleteModalOpen(false);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (data.productCreated) setCreateModalOpen(false);
    if (data.productDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <div className={contentBodyClass}>
      {products && products.length ? (
        <table className="table static">
          <thead>
            <tr className="hidden md:table-row">
              <th>ID</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Model</th>
              <th>Price</th>
              <th className="md:text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((loopedProducts: any) => {
                return (
                  <tr className={resTRClass} key={loopedProducts.product_id}>
                    <td data-label="ID" className={resTDClass}>
                      {loopedProducts.product_id}
                    </td>
                    <td data-label="Brand" className={resTDClass}>
                      {loopedProducts.brand.brand_name}
                    </td>
                    <td data-label="Type" className={resTDClass}>
                      {loopedProducts.type.type_name}
                    </td>
                    <td data-label="Model" className={resTDClass}>
                      {loopedProducts.model.model_name}
                    </td>
                    <td data-label="Price" className={resTDClass}>
                      £{loopedProducts.price}
                    </td>
                    <td
                      data-label="Actions"
                      className={`${resTDClass} md:text-right`}
                    >
                      <FormBtn
                        isSubmitting={isSubmitting}
                        onClick={() => {
                          setDeletedProductID(loopedProducts.product_id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        DELETE
                      </FormBtn>
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
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          Add new product +
        </FormBtn>
      </div>
      <Modal open={createModalOpen}>
        <h3 className="mb-4">Create new product</h3>
        {createModalOpen && (
          <CreateProductForm
            actionName="create"
            selectData={{
              brands,
              types,
              models,
            }}
            navigation={navigation}
            formErrors={data?.createActionErrors}
            onCancel={() => {
              setCreateModalOpen(false);
              if (data) data.createActionErrors = {};
            }}
          />
        )}
      </Modal>
      <Modal open={deleteModelOpen}>
        <p className="py-4">
          Are you sure you want to delete this product?
          <br />
          NOTE: this doesn't delete the associated brand, model and type
        </p>
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="product_id" value={deletedProductID} />
            <FormBtn
              type="submit"
              name="_action"
              value="delete"
              isSubmitting={isSubmitting}
            >
              Confirm
            </FormBtn>
          </Form>
          <FormBtn
            isSubmitting={isSubmitting}
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </FormBtn>
        </div>
      </Modal>
    </div>
  );
}
