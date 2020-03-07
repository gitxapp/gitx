import minAjax from "./ajax";
import { URL, VERSION } from "./constants";

export const getAllNotes = ({ issueId, projectName, noteType, repoOwner }) => {
  try {
    return new Promise(resolve => {
      window.chrome.storage.sync.get(["githubPrivateCommentToken"], result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note/all`, // request URL
          type: "POST",
          headers: [
            {
              type: "Authorization",
              value: `Bearer ${authToken}`
            }
          ],
          data: {
            issueId,
            projectName,
            noteType,
            repoOwner
          },
          success(results) {
            // Retrieve all the notes based on issue id
            const formattedResults = JSON.parse(results);
            const allNotes = formattedResults.data;
            resolve(allNotes);
          }
        });
      });
    });
  } catch (error) {
    return null;
  }
};
// eslint-disable-next-line
export const createNote = ({
  noteContent,
  noteType,
  issueId,
  nearestCommentId,
  projectName,
  repoOwner,
  noteVisibility
}) => {
  try {
    return new Promise(resolve => {
      window.chrome.storage.sync.get(["githubPrivateCommentToken"], result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note`, // request URL
          type: "POST", // Request type GET/POST
          headers: [
            {
              type: "Authorization",
              value: `Bearer ${authToken}`
            }
          ],
          data: {
            noteContent,
            noteType,
            issueId,
            nearestCommentId,
            projectName,
            repoOwner,
            noteVisibility
          },
          success(results) {
            const formattedResult = JSON.parse(results);

            const newlyCreatedNote = formattedResult.data;
            resolve(newlyCreatedNote);
          }
        });
      });
    });
  } catch (error) {
    return null;
  }
};

// eslint-disable-next-line
export const removeNote = ({
  noteId,
  issueId,
  projectName,
  noteType,
  repoOwner
}) => {
  try {
    return new Promise(resolve => {
      window.chrome.storage.sync.get(["githubPrivateCommentToken"], result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note/delete`, // request URL
          type: "POST", // Request type GET/POST
          headers: [
            {
              type: "Authorization",
              value: `Bearer ${authToken}`
            }
          ],
          data: {
            issueId,
            projectName,
            noteType,
            noteId,
            repoOwner
          },
          success(results) {
            const formattedResult = JSON.parse(results);
            const deletedNote = formattedResult.data;
            resolve(deletedNote);
          }
        });
      });
    });
  } catch (error) {
    return null;
  }
};
