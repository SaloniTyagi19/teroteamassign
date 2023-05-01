import constants from "./constants";
const roles = [constants.ROLES.ADMIN, constants.ROLES.USER];
const roleRights = new Map();
roleRights.set(roles[0], ["addCategory", "getCategory", "addMenu", "getMenu"]);

roleRights.set(roles[1], ["addCategory", "getCategory", "addMenu", "getMenu"])
export {
    roles,
    roleRights
}