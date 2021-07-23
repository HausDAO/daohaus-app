import { v4 as uuid } from 'uuid';

export const createPlaylist = ({
  name = 'New Playlist',
  id = uuid(),
  forms = [],
}) => ({
  name,
  id,
  forms,
});
