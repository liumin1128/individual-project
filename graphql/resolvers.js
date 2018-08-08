import user from './models/user/resolver';
import article from './models/article/resolver';
import timetable from './models/timetable/resolver';

import { resolverCombine } from './utils';

export default resolverCombine(user, article, timetable);
