import modal from './modalCreator';

import {
  userSchema,
  oauthSchema,
  articleSchema,
  commentSchema,
  thumbSchema,
} from '../schemas';

export const User = modal('User', userSchema);
export const Oauth = modal('Oauth', oauthSchema);
export const Article = modal('Article', articleSchema);
export const Comment = modal('Comment', commentSchema);
export const Thumb = modal('Thumb', thumbSchema);