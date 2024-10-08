import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  SquaresPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Prisma, type products } from "@prisma/client";
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
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import ProductCleanupForm from "~/components/ProductCleanupForm";
import ProductForm from "~/components/ProductForm";
import SearchInput from "~/components/SearchInput";
import {
  createProduct,
  deleteOrphanedBrands,
  deleteOrphanedModels,
  deleteOrphanedTypes,
  deleteProductById,
  getBrandsBySearch,
  getModelsBySearch,
  getProducts,
  getProductsBySearch,
  getProductsCount,
  getTypesBySearch,
  updateProduct,
} from "~/controllers/products";
import { SITE_TITLE } from "~/root";
import { getCurrencyString } from "~/utils/formatters";
import { getUserId } from "~/utils/session";
import {
  contentBodyClass,
  createBtnContainerClass,
  respMidTDClass,
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
    const productCount = await getProductsCount();
    return json({ productCount });
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
      successInfo += `${brandsCleanedCount} brands, `;
    } catch (error) {
      console.log({ error });
      return { cleanupActionErrors };
    }
  }
  if (models) {
    try {
      const { count: modelsCleanedCount } = await deleteOrphanedModels();
      successInfo += `${modelsCleanedCount} models, `;
    } catch (error) {
      console.log({ error });
      return { cleanupActionErrors };
    }
  }
  if (types) {
    try {
      const { count: typesCleanedCount } = await deleteOrphanedTypes();
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
    const updatedProduct = await updateProduct(values);
    return { productEdited: true, updatedProduct };
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
  const { _action, search_term, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_products":
      const { skip, take } = values;
      const pagedProducts = await getProducts(
        parseInt(skip.toString()),
        parseInt(take.toString())
      );
      return { pagedProducts };
    case "brands_search":
      const brands =
        search_term.toString().length > 0
          ? await getBrandsBySearch(search_term.toString())
          : [];
      return { brands };
    case "types_search":
      const types =
        search_term.toString().length > 0
          ? await getTypesBySearch(search_term.toString())
          : [];
      return { types };
    case "models_search":
      const models =
        search_term.toString().length > 0
          ? await getModelsBySearch(search_term.toString())
          : [];
      return { models };
    case "products_search":
      const products =
        search_term.toString().length > 0
          ? await getProductsBySearch(search_term.toString())
          : [];
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
  const { productCount }: { productCount: number } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [products, setProducts] = useState<any>([]);
  const [deletedProductID, setDeletedProductID] = useState(0);
  const [productToEdit, setProductToEdit] = useState({
    product_id: 0,
    price: new Prisma.Decimal(0),
    brand_id: 0,
    model_id: 0,
    type_id: 0,
    brand_name: "",
    type_name: "",
    model_name: "",
  });
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [cleanupModalOpen, setCleanupModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);

  useEffect(() => {
    if (!data) return;
    if (data.productCreated) setCreateModalOpen(false);
    if (data.productDeleted) setDeleteModalOpen(false);
    if (data.productEdited) {
      setEditModalOpen(false);
      // replace edited product in product list
      if (data.updatedProduct)
        setProducts((oldProducts: any) =>
          oldProducts.map((oldProduct: any) =>
            oldProduct.product_id === data.updatedProduct.product_id
              ? data.updatedProduct
              : oldProduct
          )
        );
    }
  }, [data]);

  return (
    <div className={contentBodyClass}>
      <SearchInput
        _action="products_search"
        placeholder="start typing to filter products..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.products) {
            setProducts(fetchedData.products);
            setIsSearched(fetchedData.products.length > 0);
          }
        }}
      />
      {products && products.length ? (
        <div className="-m-4 md:m-0">
          <table className="table">
            <thead>
              <tr className="hidden md:table-row">
                <th className="w-1/5">Brand</th>
                <th className="w-1/5">Type</th>
                <th className="w-1/5">Model</th>
                <th className="w-1/5">Price</th>
                <th className="text-right w-1/5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((product: products) => {
                  const {
                    product_id,
                    brand_name,
                    type_name,
                    model_name,
                    price,
                  } = product;
                  return (
                    <tr className={respTRClass} key={product_id}>
                      <td data-label="Brand: " className={respMidTDClass}>
                        {brand_name}
                      </td>
                      <td data-label="Type: " className={respMidTDClass}>
                        {type_name}
                      </td>
                      <td data-label="Model: " className={respMidTDClass}>
                        {model_name}
                      </td>
                      <td data-label="Price: " className={respTDClass}>
                        {getCurrencyString(price)}
                      </td>
                      <td className={`${respTDClass} md:text-right`}>
                        <ListingItemMenu
                          isOpen={product_id === activeMenuItemId}
                          setIsOpen={(isOpen) =>
                            setActiveMenuItemId(isOpen ? product_id : 0)
                          }
                        >
                          <FormBtn
                            isSubmitting={isSubmitting}
                            onClick={() => {
                              setProductToEdit(product);
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
                        </ListingItemMenu>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No products found...</p>
      )}
      <div className={createBtnContainerClass}>
        {!isSearched && (
          <Pagination
            className="mr-4"
            totalCount={productCount}
            _action="get_paged_products"
            onDataLoaded={({ pagedProducts }) => {
              if (pagedProducts) setProducts(pagedProducts);
            }}
          />
        )}
        <FormBtn
          className="mr-4"
          isSubmitting={isSubmitting}
          onClick={() => setCleanupModalOpen(true)}
        >
          <TrashIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => setCreateModalOpen(true)}
        >
          <SquaresPlusIcon className="h-5 w-5 stroke-2" />
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
