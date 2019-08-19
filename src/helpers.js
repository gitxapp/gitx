// eslint-disable-next-line
export const findTimeAgo = ({ date }) => {
  const NOW = new Date();
  const times = [
    ['second', 1],
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2592000],
    ['year', 31536000],
  ];

  let diff = Math.round((NOW - date) / 1000);

  // eslint-disable-next-line
  for (let t = 0; t < times.length; t++) {
    if (diff < times[t][1]) {
      if (t === 0) {
        return 'Just now';
      }
      diff = Math.round(diff / times[t - 1][1]);

      // eslint-disable-next-line
      return diff + ' ' + times[t - 1][0] + (diff === 1 ? ' ago' : 's ago');
    }
  }
};

export const findURLAttributes = ({ currentUrl }) => {
  const urlParams = currentUrl.split('/');
  const issueId = urlParams[urlParams.length - 1];
  const noteType = currentUrl.includes('issue') ? 'issue' : 'pull';
  const projectName = urlParams[urlParams.length - 3];
  return {
    issueId,
    noteType,
    projectName,
  };
};
