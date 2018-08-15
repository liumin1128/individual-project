import { Oauth } from '../mongo/modals';
import fetch from './fetch';

export const sentOutlookEmail = async (userId, params) => {
  const url = 'https://graph.microsoft.com/v1.0/me/messages';

  const oauth = await Oauth.findOne({ user: userId });

  const token = oauth.data.token.access_token;

  const data = await fetch(url, params, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(data.id);

  const urlSend = `https://graph.microsoft.com/v1.0/me/messages/${data.id}/send`;

  const data2 = await fetch(urlSend, {}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      token,
    }),
  });

  return data2;
};
