# file-exports

Get exports of an local folder file export .


# feature
- support for esm && commonJs export ;
- support folder child directory export ;



## Install

```bash
npm i file-exports
```

## Usage

### `getStaticExports`

Get the exports by evaluate the module in worker thread.

```ts
import { getStaticExports } from 'pkg-exports'

const exports = await getStaticExports('path');
console.log(exports) ;
```



// wip
- package not support ts format;
