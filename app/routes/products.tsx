import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  SquaresPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Prisma, type products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import FormBtn from "~/components/FormBtn";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import ProductCleanupForm from "~/components/ProductCleanupForm";
import ProductForm from "~/components/ProductForm";
import SearchInput from "~/components/SearchInput";
import {
  createProduct,
  deleteOrphanedTaxonomy,
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
import { error } from "~/utils/errors";
import { getCurrencyString } from "~/utils/formatters";
import { getUserId } from "~/utils/session";
import {
  contentBodyClass,
  createBtnContainerClass,
  respMidTDClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Products` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const { productCount } = await getProductsCount();
    return { productCount };
  } catch (error) {
    return { error };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_products":
      try {
        const { pagedProducts } = await getProducts(values);
        return { pagedProducts };
      } catch (error) {
        return { error };
      }
    case "brands_search":
      try {
        const { brands } = await getBrandsBySearch(values);
        return { brands };
      } catch (error) {
        return { error };
      }
    case "types_search":
      try {
        const { types } = await getTypesBySearch(values);
        return { types };
      } catch (error) {
        return { error };
      }
    case "models_search":
      try {
        const { models } = await getModelsBySearch(values);
        return { models };
      } catch (error) {
        return { error };
      }
    case "products_search":
      try {
        const { products } = await getProductsBySearch(values);
        return { products };
      } catch (error) {
        return { error };
      }
    case "delete":
      try {
        const deletedProductData = await deleteProductById(values);
        return { deletedProductData };
      } catch (error) {
        return { error };
      }
    case "create":
      try {
        const createdProductData = await createProduct(values);
        return { createdProductData };
      } catch (error) {
        return { error };
      }
    case "edit":
      try {
        const updatedProductData = await updateProduct(values);
        return { updatedProductData };
      } catch (error) {
        return { error };
      }
    case "cleanup":
      try {
        const deletedTaxonomyData = await deleteOrphanedTaxonomy(values);
        return { deletedTaxonomyData };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function Products() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [productCount, setProductCount] = useState(0);
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
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { productCount: retrievedProductCount } = loaderData;
    if (retrievedProductCount) setProductCount(retrievedProductCount);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const {
      deletedProductData,
      createdProductData,
      updatedProductData,
      deletedTaxonomyData,
      error,
    } = actionData;
    if (deletedProductData) {
      const { code } = deletedProductData;
      setProductCount((oldProductCount: number) => oldProductCount - 1);
      setDeleteModalOpen(false);
      // alert
      setAlertData({ code, message: `Success: product deleted` });
    }
    if (createdProductData) {
      const { code } = createdProductData;
      setProductCount((oldProductCount: number) => oldProductCount + 1);
      setCreateModalOpen(false);
      // alert
      setAlertData({ code, message: `Success: product created` });
    }
    if (updatedProductData) {
      const { code, updatedProduct } = updatedProductData;
      const { product_id: updatedProductId } = updatedProduct;
      // update UI if item is in current page list
      setProducts((oldProducts: any) =>
        oldProducts.map((oldProduct: products) => {
          const { product_id: oldProductId } = oldProduct;
          return updatedProductId === oldProductId
            ? updatedProduct
            : oldProduct;
        })
      );
      setActiveMenuItemId(0);
      setEditModalOpen(false);
      // alert
      setAlertData({ code, message: `Success: product updated` });
    }
    if (deletedTaxonomyData) {
      setCleanupModalOpen(false);
      // alert
      const { code, deletedTaxonomy } = deletedTaxonomyData;
      let areAllZero = true;
      let message = "Success:";
      for (const taxoName in deletedTaxonomy) {
        const { count } = deletedTaxonomy[taxoName];
        if (count > 0) {
          areAllZero = false;
        } else {
          continue;
        }
        message += ` ${count} ${taxoName} deleted`;
      }
      if (areAllZero) {
        setAlertData({
          code: 100,
          message: "All brands, types and models are associated with products",
        });
      } else {
        setAlertData({ code, message });
      }
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <div className={contentBodyClass}>
      <SearchInput
        _action="products_search"
        placeholder="start typing to filter products..."
        onDataLoaded={({ products: retrievedProducts, error }) => {
          if (retrievedProducts) {
            const isRetrievedProducts = retrievedProducts.length > 0;
            setIsSearched(isRetrievedProducts);
            if (isRetrievedProducts) setProducts(retrievedProducts);
          }
          if (error) setAlertData(error);
        }}
      />
      <div className="-m-4 md:mb-0 md:mx-0">
        <table className="table">
          {products && products.length ? (
            <>
              <thead>
                <tr className="hidden md:table-row">
                  <th className="w-1/5">Brand</th>
                  <th className="w-1/5">Type</th>
                  <th className="w-1/5">Model</th>
                  <th className="w-1/5">Price</th>
                  <th className="text-right w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody className="border-y border-base-content/20">
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
            </>
          ) : (
            <tbody className="border-y border-base-content/20">
              <tr className={respTRClass}>
                <td className={respTDClass}>No products found...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
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
          actionName="cleanup"
          onCancel={() => {
            setCleanupModalOpen(false);
            if (actionData) actionData.cleanupActionErrors = {};
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
            setAlertData={setAlertData}
            onCancel={() => {
              setEditModalOpen(false);
              if (actionData) actionData.editActionErrors = {};
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
            setAlertData={setAlertData}
            onCancel={() => {
              setCreateModalOpen(false);
              if (actionData) actionData.createActionErrors = {};
            }}
          />
        )}
      </Modal>
      <Modal open={deleteModelOpen}>
        <p>
          Are you sure you want to delete this product?
          <br />
          NOTE: this doesn't delete the associated brand, model and type. Use
          cleanup to delete them if they're not used elsewhere
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
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </div>
  );
}
