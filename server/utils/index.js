/* eslint-disable consistent-return */
import axios from "axios";
import { REPO_OWNER_TYPES } from "./constants";

const getRepoOwnerType = async ({ repoOwner }) => {
  if (!repoOwner) throw Error("Invalid argument");
  const apiUrl = `${process.env.GITHUB_API_URL}orgs/${repoOwner}`;

  try {
    const result = await axios.get(apiUrl);
    if (result) {
      return REPO_OWNER_TYPES.ORGANIZATION;
    }
  } catch (e) {
    const { response } = e;

    if (response) {
      return REPO_OWNER_TYPES.USER;
    }

    throw Error("Internal error");
  }
};

const getUserOrganizations = async ({ userName }) => {
  if (!userName) throw Error("Invalid argument");
  const apiUrl = `${process.env.GITHUB_API_URL}users/${userName}/orgs`;

  try {
    const result = await axios.get(apiUrl);

    const { data } = result;
    return data;
  } catch (e) {
    const { response } = e;

    if (response) {
      return REPO_OWNER_TYPES.USER;
    }

    throw Error("Internal error");
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getRepoOwnerType, getUserOrganizations };
