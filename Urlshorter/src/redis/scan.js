import Redis from 'ioredis';
import _ from 'lodash';

const client = new Redis();

client.on('connect', () => console.log('connected'));

// client.set('book1:shel1', '1');
// client.set('book2:shel2', '1');
// client.set('book3:shel1', '1');
// client.set('book4:shel3', '1');
// client.set('book5:shel2', '1');
// client.set('book1:shel2', '1');

// 1 tim book trong shel1
const bookofshel =await client.scan('0', 'MATCH', '*:shel1', 'COUNT', '100');

// console.log(bookofshel);

// tim shel chua book1
const shelofbook =await client.scan(0, 'MATCH', 'book?:shel?', 'COUNT', 100);

async function scanbykey(key) {
  let result = [];
  let count = 1;
  let cursor = 1;
  while (cursor !== '0') {
    const list = await client.scan(0, 'MATCH', key, 'COUNT', count);
    cursor = list[0];
    count += 1;
    result = _.union(result, list[1]);
  }
  return result;
}
console.log(await scanbykey('book?:shel?'));
