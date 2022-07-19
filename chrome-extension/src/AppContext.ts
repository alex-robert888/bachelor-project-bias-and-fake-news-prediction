import React from 'react';

export type TContext = {
  windowId: number | undefined
}

export default React.createContext<TContext>({
  windowId: undefined
});
