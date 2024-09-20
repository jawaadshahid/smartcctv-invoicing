import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  DocumentPlusIcon,
  PencilSquareIcon, TrashIcon
} from "@heroicons/react/24/outline";
import {
  Prisma,
  type product_brands,
  type product_models,
  type product_types,
  type products,
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
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import ProductCleanupForm from "~/components/ProductCleanupForm";
import ProductForm from "~/components/ProductForm";
import SearchInput from "~/components/SearchInput";
import {
  createProduct,
  deleteOrphanedBrands,
  deleteOrphanedModels,
  deleteOrphanedTypes,
  deleteProductById,
  getBrands,
  getModels,
  getProducts,
  getProductsBySearch,
  getTypes,
  updateProduct,
} from "~/controllers/products";
import { SITE_TITLE } from "~/root";
import { getCurrencyString } from "~/utils/formatters";
import { getUserId } from "~/utils/session";
import {
  contentBodyClass,
  createBtnContainerClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import { validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Products` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    // TODO: expensive query, refactor so taxonomy is retrieved as action on user interaction
    const [brands, types, models, loadedProducts] = await Promise.all([
      getBrands(),
      getTypes(),
      getModels(),
      getProducts(),
    ]);
    return json({ brands, types, models, loadedProducts });
  } catch (err) {
    console.error(err);
    return {};
  }
};

const cleanupProdAction = async (values: any) => {
  const { brands, models, types } = values;
  const cleanupActionErrors = {
    info: "There was a problem cleaning up products. Try again later",
  };
  let successInfo = "";
  if (brands) {
    try {
      const { count: brandsCleanedCount } = await deleteOrphanedBrands();
      console.log({ brandsCleanedCount });
      successInfo += `${brandsCleanedCount} brands, `;
    } catch (error) {
      console.log({ error });
      return { cleanupActionErrors };
    }
  }
  if (models) {
    try {
      const { count: modelsCleanedCount } = await deleteOrphanedModels();
      console.log({ modelsCleanedCount });
      successInfo += `${modelsCleanedCount} models, `;
    } catch (error) {
      console.log({ error });
      return { cleanupActionErrors };
    }
  }
  if (types) {
    try {
      const { count: typesCleanedCount } = await deleteOrphanedTypes();
      console.log({ typesCleanedCount });
      successInfo += `${typesCleanedCount} types, `;
    } catch (error) {
      console.log({ error });
      return { cleanupActionErrors };
    }
  }
  successInfo += "cleaned up.";
  cleanupActionErrors.info = successInfo;
  return { cleanupActionErrors };
};

const deleteProdAction = async (values: any) => {
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
};

const createProdAction = async (values: any) => {
  const createActionErrors: any = validateProductData(values);

  if (Object.values(createActionErrors).some(Boolean))
    return { createActionErrors };

  try {
    await createProduct(values);
    return { productCreated: true };
  } catch (error: any) {
    console.log({ error });
    if (error.code) {
      createActionErrors.info = error.msg;
    } else
      createActionErrors.info = "There was a problem creating the product...";
    return { createActionErrors };
  }
};

const editProdAction = async (values: any) => {
  const editActionErrors: any = validateProductData(values);

  if (Object.values(editActionErrors).some(Boolean))
    return { editActionErrors };

  try {
    await updateProduct(values);
    return { productEdited: true };
  } catch (error: any) {
    console.log({ error });
    if (error.code) {
      editActionErrors.info = error.msg;
    } else editActionErrors.info = "There was a problem editing the product...";
    return { editActionErrors };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "products_search":
      const { search_term } = values;
      const products =
        search_term.toString().length > 0
          ? await getProductsBySearch(search_term.toString())
          : await getProducts();
      return { products };
    case "delete":
      return await deleteProdAction(values);
    case "create":
      return await createProdAction(values);
    case "edit":
      return await editProdAction(values);
    case "cleanup":
      return await cleanupProdAction(values);
  }
  return {};
}

export default function Products() {
  const {
    loadedProducts,
    brands,
    types,
    models,
  }: {
    loadedProducts: products[] | any[];
    brands: product_brands[];
    types: product_types[];
    models: product_models[];
  } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [products, setProducts] = useState(loadedProducts);
  const [deletedProductID, setDeletedProductID] = useState(0);
  const [productToEdit, setProductToEdit] = useState({
    product_id: 0,
    price: new Prisma.Decimal(0),
    brand_id: 0,
    model_id: 0,
    type_id: 0,
  });
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [cleanupModalOpen, setCleanupModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.productCreated) setCreateModalOpen(false);
    if (data.productDeleted) setDeleteModalOpen(false);
    if (data.productEdited) setEditModalOpen(false);
  }, [data]);

  return (
    <div className={contentBodyClass}>
      <SearchInput
        _action="products_search"
        placeholder="start typing to filter products..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.products) setProducts(fetchedData.products);
        }}
      />
      {products && products.length ? (
        <div className="-m-4 md:m-0">
          <table className="table">
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
                products.map(
                  ({
                    product_id,
                    brand_name,
                    type_name,
                    model_name,
                    brand_id,
                    model_id,
                    type_id,
                    price,
                  }: products) => {
                    return (
                      <tr className={respTRClass} key={product_id}>
                        <td data-label="ID: " className={respTDClass}>
                          {product_id}
                        </td>
                        <td data-label="Brand: " className={respTDClass}>
                          {brand_name}
                        </td>
                        <td data-label="Type: " className={respTDClass}>
                          {type_name}
                        </td>
                        <td data-label="Model: " className={respTDClass}>
                          {model_name}
                        </td>
                        <td data-label="Price: " className={respTDClass}>
                          {getCurrencyString(price)}
                        </td>
                        <td className={`${respTDClass} md:text-right`}>
                          <div className="absolute md:static top-0 right-3 btn-group">
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setProductToEdit({
                                  product_id,
                                  price,
                                  brand_id,
                                  model_id,
                                  type_id,
                                });
                                setEditModalOpen(true);
                              }}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedProductID(product_id);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <TrashIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No products found...</p>
      )}
      <div className={createBtnContainerClass}>
        <FormBtn
          className="mr-4"
          isSubmitting={isSubmitting}
          onClick={() => {
            setCleanupModalOpen(true);
          }}
        >
          <TrashIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          <DocumentPlusIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
      </div>
      <Modal open={cleanupModalOpen}>
        <h3 className="mb-4">Cleanup products</h3>
        <p>This will delete orphaned taxonomy items from the following:</p>
        <ProductCleanupForm
          navigation={navigation}
          formData={data?.cleanupActionErrors}
          actionName="cleanup"
          onCancel={() => {
            setCleanupModalOpen(false);
            if (data) data.cleanupActionErrors = {};
          }}
        />
      </Modal>
      <Modal open={editModalOpen}>
        <h3 className="mb-4">Edit product</h3>
        {editModalOpen && (
          <ProductForm
            actionName="edit"
            selectData={{
              brands,
              types,
              models,
            }}
            existingData={productToEdit}
            navigation={navigation}
            formErrors={data?.editActionErrors}
            onCancel={() => {
              setEditModalOpen(false);
              if (data) data.editActionErrors = {};
            }}
          />
        )}
      </Modal>
      <Modal open={createModalOpen}>
        <h3 className="mb-4">Create new product</h3>
        {createModalOpen && (
          <ProductForm
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
        <p>
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
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn
            isSubmitting={isSubmitting}
            onClick={() => setDeleteModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
    </div>
  );
}
