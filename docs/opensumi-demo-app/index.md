## libro

<!-- <code src="./app.tsx" 配置项="值"></code> -->

```jsx
import React from 'react';
import { useEffect } from 'react';
import { startApp } from './app';

export default () => {
  useEffect(() => {
    startApp();
  }, []);
  return <div id="main"></div>;
};
```
