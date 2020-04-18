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
    console.log('getRepoOwnerType error', e);
    const { response } = e;

    if (response) {
      return REPO_OWNER_TYPES.USER;
    }

    throw Error("Internal error");
  }
};

const checkUserIsACollaborator = async ({
  repoOwner,
  projectName,
  userName,
  accessToken
}) => {
  if (!repoOwner && !projectName && !userName) {
    throw Error("Repo name, project name and user name are required");
  }

  const apiUrl = `${process.env.GITHUB_API_URL}repos/${repoOwner}/${projectName}/collaborators/${userName}`;

  try {
    await axios.get(apiUrl, {
      headers: { Authorization: `token ${accessToken}` }
    });

    return true;
  } catch (e) {
    console.log('checkUserIsACollaborator error', e);
    
    return false;
  }
};

export { getRepoOwnerType, checkUserIsACollaborator };
