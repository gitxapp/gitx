import browser from 'webextension-polyfill';
import minAjax from './ajax';
import { URL, VERSION } from './constants';

export const getAllNotes = ({ issueId, projectName, noteType }) => {
  try {
    return new Promise(resolve => {
      browser.storage.sync.get(['githubPrivateCommentToken']).then(result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note/all`, // request URL
          type: 'POST',
          headers: [
            {
              type: 'Authorization',
              value: `Bearer ${authToken}`,
            },
          ],
          data: {
            issueId,
            projectName,
            noteType,
          },
          success(results) {
            // Retrieve all the notes based on issue id
            const formattedResults = JSON.parse(results);
            const allNotes = formattedResults.data;
            resolve(allNotes);
          },
        });
      });
    });
  } catch (error) {
    return null;
  }
};
// eslint-disable-next-line
export const createNote = ({ noteContent, noteType, issueId, nearestCommentId, projectName }) => {
  try {
    return new Promise(resolve => {
      browser.storage.sync.get(['githubPrivateCommentToken']).then(result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note`, // request URL
          type: 'POST', // Request type GET/POST
          headers: [
            {
              type: 'Authorization',
              value: `Bearer ${authToken}`,
            },
          ],
          data: {
            noteContent,
            noteType,
            issueId,
            nearestCommentId,
            projectName,
          },
          success(results) {
            const formattedResult = JSON.parse(results);

            const newlyCreatedNote = formattedResult.data;
            resolve(newlyCreatedNote);
          },
        });
      });
    });
  } catch (error) {
    return null;
  }
};

// eslint-disable-next-line
export const removeNote = ({ noteId, issueId, projectName, noteType }) => {
  try {
    return new Promise(resolve => {
      browser.storage.sync.get(['githubPrivateCommentToken']).then(result => {
        const authToken = result.githubPrivateCommentToken;
        minAjax({
          url: `${URL}${VERSION}/note/delete`, // request URL
          type: 'POST', // Request type GET/POST
          headers: [
            {
              type: 'Authorization',
              value: `Bearer ${authToken}`,
            },
          ],
          data: {
            issueId,
            projectName,
            noteType,
            noteId,
          },
          success(results) {
            const formattedResult = JSON.parse(results);
            const deletedNote = formattedResult.data;
            resolve(deletedNote);
          },
        });
      });
    });
  } catch (error) {
    return null;
  }
};
