import type { Access, FieldAccess } from "payload";

type UserWithRole = {
  role?: "admin" | "editor";
};

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user);

export const isAdmin: Access = ({ req: { user } }) =>
  (user as UserWithRole | null)?.role === "admin";

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const role = (user as UserWithRole | null)?.role;
  return role === "admin" || role === "editor";
};

export const isAdminField: FieldAccess = ({ req: { user } }) =>
  (user as UserWithRole | null)?.role === "admin";
