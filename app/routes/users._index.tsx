import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import {
  approveUserById,
  deleteUserById,
  getUserById,
  getUsers,
} from "~/controllers/users";
import { SITE_TITLE, UserContext } from "~/root";
import { getUserId } from "~/utils/session";
import { respTDClass, respTRClass } from "~/utils/styleClasses";

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
    users = await getUsers();
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
      await approveUserById(parseInt(approvedUserId));
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
      <div className="-mx-4 md:mx-0">
        <table className="table">
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
                  <tr className={respTRClass} key={loopedUser.id}>
                    <td data-label="ID" className={respTDClass}>
                      {loopedUser.id}
                    </td>
                    <td data-label="First Name" className={respTDClass}>
                      {loopedUser.firstName}
                    </td>
                    <td data-label="Last Name" className={respTDClass}>
                      {loopedUser.lastName}
                    </td>
                    <td data-label="Email" className={respTDClass}>
                      {loopedUser.email}
                    </td>
                    <td data-label="Approved" className={respTDClass}>
                      {loopedUser.isApproved ? (
                        "Approved"
                      ) : (
                        <Form method="post">
                          <input
                            type="hidden"
                            name="approvedUserId"
                            value={loopedUser.id}
                          />
                          <FormBtn type="submit" isSubmitting={isSubmitting}>
                            Approve
                          </FormBtn>
                        </Form>
                      )}
                    </td>
                    <td data-label="Actions" className={respTDClass}>
                      <div className="btn-group">
                        <FormAnchorButton
                          href={`users/${loopedUser.id}`}
                          isSubmitting={isSubmitting}
                        >
                          EDIT
                        </FormAnchorButton>
                        <FormBtn
                          disabled={user.id === loopedUser.id}
                          isSubmitting={isSubmitting}
                          onClick={() => {
                            setDeletedUserId(loopedUser.id);
                            setModalOpen(true);
                          }}
                        >
                          DELETE
                        </FormBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Modal open={modelOpen}>
        <p>Are you sure you want to delete this user?</p>
        <div className="modal-action">
          <Form
            method="post"
            onSubmit={() => {
              setModalOpen(false);
            }}
          >
            <input type="hidden" name="uid" value={deletedUserID} />
            <FormBtn type="submit" isSubmitting>
              Confirm
            </FormBtn>
          </Form>
          <FormBtn isSubmitting onClick={() => setModalOpen(false)}>
            Close
          </FormBtn>
        </div>
      </Modal>
    </>
  );
}
