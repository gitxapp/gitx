import minAjax from './ajax';
import { URL, VERSION } from './constants';

export const getAllNotes = ({ userId, issueId }) => {
  try {
    return new Promise(resolve => {
      minAjax({
        url: `${URL}${VERSION}/note/${userId}/issue/${issueId}`, // request URL
        type: 'GET', // Request type GET/POST
        success(results) {
          // Retrieve all the notes based on issue id
          const formattedResults = JSON.parse(results);
          const allNotes = formattedResults.data;
          resolve(allNotes);
        },
      });
    });
  } catch (error) {
    return null;
  }
};
// eslint-disable-next-line
export const createNote = ({ userId, noteContent, noteType, issueId, nearestCommentId }) => {
  try {
    return new Promise(resolve => {
      minAjax({
        url: `${URL}${VERSION}/note`, // request URL
        type: 'POST', // Request type GET/POST
        data: {
          userId,
          noteContent,
          noteType,
          issueId,
          nearestCommentId,
        },
        success(result) {
          const formattedResult = JSON.parse(result);

          const newlyCreatedNote = formattedResult.data;
          resolve(newlyCreatedNote);
        },
      });
    });
  } catch (error) {
    return null;
  }
};
export const removeNote = ({ noteId }) => {
  try {
    return new Promise(resolve => {
      minAjax({
        url: `${URL}${VERSION}/note/delete/${noteId}`, // request URL
        type: 'POST', // Request type GET/POST
        success(result) {
          const formattedResult = JSON.parse(result);
          const deletedNote = formattedResult.data;
          resolve(deletedNote);
        },
      });
    });
  } catch (error) {
    return null;
  }
};
