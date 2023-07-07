import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form, useLoaderData,
  useNavigation
} from "@remix-run/react";
import { useState } from "react";
import Modal from "~/components/Modal";
import { db, deleteUserById } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/users/login");
  try {
    let users = {};
    users = await db.users.findMany();
    return json({ users });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const deleteUserId = formData.get("uid") as string;
  try {
    await deleteUserById(parseInt(deleteUserId));
    return redirect('/users')
  } catch (err) {
    console.error(err);
    return {};
  }
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "user list" }];
};

export default function Index() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { users } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedUserID, setDeletedUserId] = useState(0);
  const [modelOpen, setModalOpen] = useState(false);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full static">
        <thead>
          <tr className="hidden md:table-row">
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user: any) => {
              return (
                <tr
                  className="flex flex-col md:table-row max-[767px]:border-none"
                  key={user.id}
                >
                  <td data-label="ID" className={TD_CLASSNAME}>
                    {user.id}
                  </td>
                  <td data-label="First Name" className={TD_CLASSNAME}>
                    {user.firstName}
                  </td>
                  <td data-label="Last Name" className={TD_CLASSNAME}>
                    {user.lastName}
                  </td>
                  <td data-label="Email" className={TD_CLASSNAME}>
                    {user.email}
                  </td>
                  <td data-label="Actions" className={TD_CLASSNAME}>
                    <div className="join join-horizontal">
                      <a href={`users/${user.id}`} className="btn join-item">
                        EDIT
                      </a>
                      <button
                        className="btn join-item"
                        onClick={() => {
                          setDeletedUserId(user.id);
                          setModalOpen(true);
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Modal open={modelOpen}>
        <p className="py-4">Are you sure you want to delete this user?</p>
        <div className="modal-action">
          <Form
            method="post"
            onSubmit={() => {
              setModalOpen(false);
            }}
          >
            <input type="hidden" name="uid" value={deletedUserID} />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </Form>
          <button
            className="btn btn-primary"
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
