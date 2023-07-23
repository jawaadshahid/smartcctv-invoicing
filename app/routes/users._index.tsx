import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useState } from "react";
import Modal from "~/components/Modal";
import { SITE_TITLE, UserContext } from "~/root";
import { db, deleteUserById, getUserById } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { resTDClass, resTRClass } from "~/utils/styleClasses";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Users` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const user = await getUserById(uid);
  if (!user?.isAdmin) return redirect(`/users/${uid}`);
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
  const approvedUserId = formData.get("approvedUserId") as string;
  if (deleteUserId) {
    try {
      await deleteUserById(parseInt(deleteUserId));
      return redirect("/users");
    } catch (err) {
      console.error(err);
      return {};
    }
  }
  if (approvedUserId) {
    try {
      await db.users.update({
        where: { id: parseInt(approvedUserId) },
        data: { isApproved: 1 },
      });
      return redirect("/users");
    } catch (err) {
      console.error(err);
      return {};
    }
  }
}

export default function UsersIndex() {
  const { users } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedUserID, setDeletedUserId] = useState(0);
  const [modelOpen, setModalOpen] = useState(false);
  const user: any = useContext(UserContext);

  return (
    <>
      <table className="table static">
        <thead>
          <tr className="hidden md:table-row">
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((loopedUser: any) => {
              return (
                <tr className={resTRClass} key={loopedUser.id}>
                  <td data-label="ID" className={resTDClass}>
                    {loopedUser.id}
                  </td>
                  <td data-label="First Name" className={resTDClass}>
                    {loopedUser.firstName}
                  </td>
                  <td data-label="Last Name" className={resTDClass}>
                    {loopedUser.lastName}
                  </td>
                  <td data-label="Email" className={resTDClass}>
                    {loopedUser.email}
                  </td>
                  <td data-label="Approved" className={resTDClass}>
                    {loopedUser.isApproved ? (
                      "Approved"
                    ) : (
                      <Form method="post">
                        <input
                          type="hidden"
                          name="approvedUserId"
                          value={loopedUser.id}
                        />
                        <button type="submit" className="btn">
                          Approve
                        </button>
                      </Form>
                    )}
                  </td>
                  <td data-label="Actions" className={resTDClass}>
                    <div className="btn-group">
                      <a
                        href={`users/${loopedUser.id}`}
                        className="btn"
                      >
                        EDIT
                      </a>
                      <button
                        className="btn"
                        disabled={user.id === loopedUser.id}
                        onClick={() => {
                          setDeletedUserId(loopedUser.id);
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
              className="btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </Form>
          <button
            className="btn"
            disabled={isSubmitting}
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
