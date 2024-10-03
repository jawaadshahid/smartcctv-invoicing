import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { users } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import {
  approveUserById,
  deleteUserById,
  getUserById,
  getUsers,
} from "~/controllers/users";
import { SITE_TITLE, UserContext } from "~/root";
import { getUserId } from "~/utils/session";
import { respMidTDClass, respTDClass, respTRClass } from "~/utils/styleClasses";

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
      <div className="-m-4 md:m-0">
        <table className="table">
          <thead>
            <tr className="hidden md:table-row">
              <th>First Name</th>
              <th>Last Name</th>
              <th className="w-full">Email</th>
              <th>Approved</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map(
                ({ id, firstName, lastName, email, isApproved }: users) => {
                  return (
                    <tr className={respTRClass} key={id}>
                      <td data-label="First Name: " className={respMidTDClass}>
                        {firstName}
                      </td>
                      <td data-label="Last Name: " className={respMidTDClass}>
                        {lastName}
                      </td>
                      <td data-label="Email: " className={respMidTDClass}>
                        {email}
                      </td>
                      <td data-label="Approved: " className={respTDClass}>
                        {isApproved ? (
                          "Yes"
                        ) : (
                          <Form method="post">
                            <input
                              type="hidden"
                              name="approvedUserId"
                              value={id}
                            />
                            <FormBtn type="submit" isSubmitting={isSubmitting}>
                              Approve
                            </FormBtn>
                          </Form>
                        )}
                      </td>
                      <td className={respTDClass}>
                        <ListingItemMenu>
                          <FormAnchorButton
                            href={`users/${id}`}
                            isSubmitting={isSubmitting}
                          >
                            <PencilSquareIcon className="h-5 w-5 stroke-2" />
                          </FormAnchorButton>
                          <FormBtn
                            disabled={user.id === id}
                            isSubmitting={isSubmitting}
                            onClick={() => {
                              setDeletedUserId(id);
                              setModalOpen(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5 stroke-2" />
                          </FormBtn>
                        </ListingItemMenu>
                      </td>
                    </tr>
                  );
                }
              )}
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
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn isSubmitting onClick={() => setModalOpen(false)}>
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
    </>
  );
}
