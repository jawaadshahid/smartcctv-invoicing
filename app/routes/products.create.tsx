import type { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import cn from "classnames";
import { useState } from "react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create product` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const [brands, types, models] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
    ]);
    return json({ brands, types, models });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const brand = parseInt(formData.get("brand") as string);
  const newBrand = formData.get("newBrand") as string;
  const type = parseInt(formData.get("type") as string);
  const newType = formData.get("newType") as string;
  const model = parseInt(formData.get("model") as string);
  const newModel = formData.get("newModel") as string;
  const price = parseInt(formData.get("price") as string);
  const formErrors: {
    brand?: string;
    type?: string;
    model?: string;
    price?: string;
    info?: string;
  } = {};
  const isBrandSelected = brand && brand > 0;
  const isTypeSelected = type && type > 0;
  const isModelSelected = model && model > 0;

  // console.log({ brand });
  // console.log({ newBrand });
  // console.log({ type });
  // console.log({ newType });
  // console.log({ model });
  // console.log({ newModel });

  // select can = -1 (when items exist but a new 1 is definde) || null (when no items exist)
  if (!isBrandSelected && !newBrand) {
    formErrors.brand = "a brand must be selected or defined";
  }

  if (!isTypeSelected && !newType) {
    formErrors.type = "a type must be selected or defined";
  }

  if (!isModelSelected && !newModel) {
    formErrors.model = "a model must be selected or defined";
  }

  if (!price) {
    formErrors.price = "a price must be defined";
  }

  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  const newProduct: Prisma.productsCreateInput = {
    brand: isBrandSelected
      ? { connect: { brand_id: brand } }
      : { create: { brand_name: newBrand } },
    type: isTypeSelected
      ? { connect: { type_id: type } }
      : { create: { type_name: newType } },
    model: isModelSelected
      ? { connect: { model_id: model } }
      : { create: { model_name: newModel } },
    price,
  };

  try {
    const createProduct = await db.products.create({ data: newProduct });
    console.log({ createProduct });
    return redirect("/products");
  } catch (err) {
    console.log(err);
    formErrors.info = "There was a problem creating the new product...";
    return { formErrors };
  }
}

export default function ProductsCreate() {
  const navigation = useNavigation();
  const { brands, types, models } = useLoaderData();
  // const brands: any[] = [{ brand_id: 1, brand_name: "hikvision" }];
  const hasBrands = brands && brands.length > 0;
  const hasTypes = types && types.length > 0;
  const hasModels = models && models.length > 0;
  const data = useActionData();
  const [isNewBrand, setIsNewBrand] = useState(!hasBrands);
  const [isNewType, setIsNewType] = useState(!hasTypes);
  const [isNewModel, setIsNewModel] = useState(!hasModels);
  const selectClass = "select select-bordered w-full max-w-xs"
  const inputClass = "input input-bordered w-full max-w-xs block";
  const brandInputClass = cn({
    [inputClass]: true,
    "mt-2": isNewBrand,
    hidden: !isNewBrand,
  });
  const typeInputClass = cn({
    [inputClass]: true,
    "mt-2": isNewType,
    hidden: !isNewType,
  });
  const modelInputClass = cn({
    [inputClass]: true,
    "mt-2": hasModels,
    hidden: !isNewModel,
  });
  const priceInputClass = cn({
    [inputClass]: true,
    "mt-2": true,
  });
  return (
    <div className="grid place-items-center">
      <div className="w-full max-w-xs">
        <h2 className="mb-4 text-center">Create a new product</h2>
        <Form method="post" className="bg-base-300 px-4 py-2 rounded-lg">
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="mb-4">
              <label className="label" htmlFor="brand">
                <span className="label-text">Product brand</span>
              </label>
              {hasBrands && (
                <select
                  className={selectClass}
                  name="brand"
                  id="brand"
                  defaultValue=""
                  onChange={(e) => {
                    setIsNewBrand(e.target.value === "-1");
                  }}
                >
                  <option disabled value="">
                    Select a brand...
                  </option>
                  {brands.map(({ brand_id, brand_name }: any) => {
                    return (
                      <option key={brand_id} value={brand_id}>
                        {brand_name}
                      </option>
                    );
                  })}
                  <option value="-1">Add new brand +</option>
                </select>
              )}
              <input
                disabled={!isNewBrand}
                className={brandInputClass}
                id="newBrand"
                name="newBrand"
                type="text"
                placeholder="Defined new brand here..."
              />
              {data && data.formErrors && data.formErrors.brand && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.brand}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="type">
                <span className="label-text">Product type</span>
              </label>
              {hasTypes && (
                <select
                  className={selectClass}
                  name="type"
                  id="type"
                  defaultValue=""
                  onChange={(e) => {
                    setIsNewType(e.target.value === "-1");
                  }}
                >
                  <option disabled value="">
                    Select a type...
                  </option>
                  {types.map(({ type_id, type_name }: any) => {
                    return (
                      <option key={type_id} value={type_id}>
                        {type_name}
                      </option>
                    );
                  })}
                  <option value="-1">Add new type +</option>
                </select>
              )}
              <input
                disabled={!isNewType}
                className={typeInputClass}
                id="newType"
                name="newType"
                type="text"
                placeholder="Defined new type here..."
              />
              {data && data.formErrors && data.formErrors.type && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.type}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="model">
                <span className="label-text">Product model</span>
              </label>
              {hasModels && (
                <select
                  className={selectClass}
                  name="model"
                  id="model"
                  defaultValue=""
                  onChange={(e) => {
                    setIsNewModel(e.target.value === "-1");
                  }}
                >
                  <option disabled value="">
                    Select a model...
                  </option>
                  {models.map(({ model_id, model_name }: any) => {
                    return (
                      <option key={model_id} value={model_id}>
                        {model_name}
                      </option>
                    );
                  })}
                  <option value="-1">Add new model +</option>
                </select>
              )}
              <input
                disabled={!isNewModel}
                className={modelInputClass}
                id="newModel"
                name="newModel"
                type="text"
                placeholder="Defined new model here..."
              />
              {data && data.formErrors && data.formErrors.model && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.model}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="price">
                <span className="label-text">Product price (£)</span>
              </label>
              <input
                className={priceInputClass}
                id="price"
                name="price"
                type="number"
                placeholder="10.00"
              />
              {data && data.formErrors && data.formErrors.price && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.price}
                </p>
              )}
            </div>
            <div className="mt-2 mb-2">
              <button className="btn btn-neutral" type="submit">
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </button>
              <a href="/products" className="btn btn-neutral ml-3">
                Cancel
              </a>
              {data && data.formErrors && data.formErrors.info && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.info}
                </p>
              )}
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
